$: << File.expand_path('..', __FILE__)
$: << File.expand_path('../..', __FILE__)

require "tmpdir"

require "app"
require "builder/icons"
require "builder/load_screens"
require "builder/assets"
require "builder/data"
require "builder/page_defs"

require "builder/js"
require "builder/css"
require "builder/html"
require "builder/config"
require "builder/project"
require "builder/target"

require "builder/bundle"

module Builder
  def self.escape_quotes_for_system_call(s)
    # These will have single quotes in em, and bash doesn't escape in a string
    # We need to convert 'This ain't fun' ==> 'This ain'\''t fun'
    safe_tour_name = s.gsub( "'", "'\\\\''" )
  end

  [ 'ConfigurationError' ].each do |error_type|
    module_eval %Q{ class #{error_type} < StandardError; end}
  end

  class Build
    attr_accessor :tmp_dir, :logger
    attr_reader   :settings, :target, :completed_steps, :build_helper, :quiet

    ROOT = File.expand_path(File.dirname(__FILE__))

    STEPS = {
      :gather => {
        :icons        => Builder::Icons,
        :load_screens => Builder::LoadScreens,
        :assets       => Builder::Assets,
        :data         => Builder::Data,
        :page_defs    => Builder::PageDefs
      },

      :build => {
        :javascript   => Builder::JavaScript,
        :css          => Builder::CSS,
        :html         => Builder::HTML,
        :config       => Builder::Config,
        :project      => Builder::Project,
      },

      :close => {
        :bundle       => Builder::Bundle,
      }
    }

    LOG_LEVELS = [
      'info',
      'warning'
    ]

    def initialize(settings)
      @logger = settings[:logger]
      @settings = settings
      @tmp_dir = settings[:tmp_dir] || Dir.mktmpdir
      @target = get_target
      @completed_steps = {}
      @log = settings[:log]
      @log_level = settings[:log_level] || 2
      @build_helper = settings[:build_helper]
      @build_helper.build = self if @build_helper
      @quiet = settings[:quiet] || false

      Dir.mkdir @tmp_dir unless File.exists? @tmp_dir

      raise "Could not find target file" unless @target
      raise "Requirements not met for target" unless is_valid_target
    end

    public
    def self.root
      ROOT
    end

    def build
      @build_helper.before_steps if @build_helper
      do_steps
    ensure
      @build_helper.after_steps if @build_helper
    end

    def log(msg, type = 'info')
      msg_level = LOG_LEVELS.index(type) || 0

      if @log.nil?
        puts "#{type.upcase}: #{msg}" if msg_level >= @log_level
      end
    end

    def zip
      raise "Can't find permastore" unless permastore = @completed_steps[:close][:bundle][:location]

      # Tar will spit out errors if you don't do an iphone build, for example, but it will
      # continue to tar up the other dirs.
      # TODO: Make the list of built projects available and use that here...
      devices = []
      ['android', 'iphone', 'ipad'].each { |device| devices << device if File.exists?("#{permastore}/#{device}") }
      `cd #{permastore}; rm -f *.tar.gz; tar -czf #{@build_helper.zip_name}.tar.gz #{devices.join(' ')}`
      log("Created zip at #{permastore}", 'info')
    end

    def mark_complete(step, task, data)
      if !@completed_steps[step]
        log("The builder doesn't know about the task #{task.to_s}", 'warning')
      end

      @completed_steps[step][task] = data
      log("#{task.to_s}: completed", 'info')

      if @settings[:verbose]
        begin
          log(JSON.pretty_generate(data), 'info')
        rescue
          log(data, 'info')
        end
      end
    end

    def cleanup
      FileUtils.rm_rf @tmp_dir
    end

    def ota_enabled?
      # should be enabled on the target and the app (which the build_helper
      # gives the answer to)
      @target['ota'] and @target['ota']['enabled'] and @build_helper.ota_enabled?
    end

    private
    def do_steps
      [ :gather, :build, :close ].each { |step|
        log("=== #{step.to_s} ===", 'info')

        @completed_steps[step] = {}
        settings = @target[step.to_s] # from YAML
        do_step(step, settings) if settings
      }
    end

    def do_step(step, settings)
      STEPS[step].each do |task_name, task_class|
        if settings[task_name.to_s]
          t = task_class.new(self, task_name)
          log("--> #{task_name.to_s}: accepted", 'info')
          mark_complete(step, task_name, t.report) if t.build
        end
      end
    end

    def get_target
      if !@settings[:target] && !@settings[:target_config]
        raise "No target specified"
      end

      build_targets_dir = File.join(TouraAPP::Directories.root, 'builder', 'build_targets')
      @settings[:target_config] || Builder::Target.new(@settings[:target], build_targets_dir, logger).config
    end

    def is_valid_target
      if !@target['build_type']
        return false
      end

      requires = @target['requires']

      if requires && requires.kind_of?(Array) && requires.length > 0
        return requires.find_all { |r|
          @target[r.to_s] = @settings[r.to_sym]
          @settings[r.to_sym]
        }.length === requires.length
      end

      true
    end

  end
end
