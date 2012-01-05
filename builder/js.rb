require "builder/task_base.rb"
require "cli/directories"
require "cli/env"
require "json"
require "pathname"

module Builder
  class JavaScript < Builder::TaskBase

    PROFILE_FILE = "toura.profile.js"

    BUILDSCRIPTS_DIR = File.join(
      TouraAPP::Directories.dojo,
      "util",
      "buildscripts"
    )

    COPYRIGHT_FILE = File.join(
      TouraAPP::Directories.profiles,
      "copyright.txt"
    )

    # Hacktastic because dojo build on CYGWIN calls Windows' Java
    # and an absolute path will be relative to C:\, not C:\CYGWINDRIVE, thus
    # looking for the copyright_file in a location not accessible
    # to cygwin. Thus, we have to make this a silly relative path
    COPYRIGHT_FILE_REL_PATH = Pathname.new(COPYRIGHT_FILE).relative_path_from(Pathname.new(BUILDSCRIPTS_DIR)).to_s

    WEBKIT = {
      :dev =>             false,
      :MAP =>             false,
      :mulberry =>        true,
      :device =>          true,
      :browser =>         false
    }

    LAYERS = {
      :dojo => {
        :name => "dojo.js",
        :dependencies =>    [
          "dijit._Widget",
          "dijit._Templated",
          "dojo.i18n",
          "dojo.string",
          "dojo.data.ItemFileReadStore",
          "toura._Nls"
        ]
      },

      :toura => {
        :copyrightFile  => COPYRIGHT_FILE_REL_PATH,
        :name           => "../toura/base.js",
        :resourceName   => "toura.base",
        :dependencies   => [ "toura.base" ]
      },

      :client => {
        :copyrightFile  => COPYRIGHT_FILE_REL_PATH,
        :name           => "../client/base.js",
        :resourceName   => "client.base",
        :dependencies   => [ "client.base" ]
      }
    }

    def initialize(build, task_name)
      super

      @required_layers = @target['build']['javascript']

      @location = Mulberry::Directories.js_builds
      @client_dir = nil

      get_dojo
    end

    public
    def build
      if !build_required && !@build.settings[:force_js_build]
        return true
      end

      if @build.settings[:skip_js_build]
        @build.log "Skipping JavaScript build."
        return true
      end

      dojo_build
      unminify_haml

      if @client_dir
        FileUtils.rm_rf @client_dir
      end

      true
    end

    def report
      {
        :build_contents   => File.join(@location, @build_type.to_s, 'dojo', 'build.txt'),
        :location         => File.join(@location, @build_type)
      }
    end

    private
    def get_dojo
      dojo = "http://download.dojotoolkit.org/release-#{TouraAPP.dojo_version}/dojo-release-#{TouraAPP.dojo_version}-src.tar.gz"
      dest = TouraAPP::Directories.dojo

      unless File.exists?(dest)
        Dir.chdir TouraAPP::Directories.javascript

        # Download specified Dojo version and extract it to the js dir
        @build.log("Downloading and extracting Dojo. JavaScript goodness is a few minutes away.", 'info')
        dojo_installed = system %{curl --insecure -o - #{dojo} | tar -C #{TouraAPP::Directories.javascript} -xzf -}
        raise "Fatal error: Failed to install Dojo." unless dojo_installed
      end

      @build.log("Dojo is installed. It's all good.", 'info')
    end

    def unminify_haml
      # we can't let haml get minified, so we have to delete the minified
      # version and replace it with the unminified version after the dojo
      # build is complete
      bad_haml    = File.join(@location, @target['build_type'], 'vendor', 'haml.js')
      good_haml   = File.join(TouraAPP::Directories.javascript, 'vendor', 'haml.js')

      FileUtils.rm_rf bad_haml
      FileUtils.cp(good_haml, bad_haml)
    end

    def base_profile
      profile_layers = @required_layers.map { |layer|
        LAYERS[layer.to_sym]
      }.delete_if { |layer| !layer }

      profile = {
        :version =>         build_version,
        :releaseName =>     nil,
        :excludeDebug =>    true,
        :webkitMobile =>    WEBKIT[@build_type.to_sym],

        :action =>          "clean,release",
        :optimize =>        "shrinksafe",
        :localeList =>      "en-us",

        :prefixes => [
          [ "dijit",        "../dijit" ],
          [ "toura",        "../../toura" ],
          [ "vendor",       "../../vendor" ],
        ],

        :layers =>          profile_layers,
        :releaseName =>     @build_type.to_s
      }

      if @build.build_helper.respond_to? 'custom_js_source'
        custom_js_source = @build.build_helper.custom_js_source

        if custom_js_source
          @client_dir = File.join(TouraAPP::Directories.javascript, 'client_tmp')
          FileUtils.rm_rf @client_dir if File.exists? @client_dir
          FileUtils.cp_r(custom_js_source, @client_dir)
          profile[:prefixes] << [ 'client', '../../client_tmp' ]
          profile[:layers] << LAYERS[:client]
        end
      end

      profile
    end

    def build_version
      "toura-#{@build_type}-#{TouraAPP.version}"
    end

    def prep_dir
      if build_required
        super
      end
    end

    def build_required
      if (@target['development'])
        !File.exists?(File.join(@location, @build_type, 'dojo', 'dojo.js'))
      else
        true
      end
    end

    def dojo_build
      pwd = Dir.pwd
      profile_file = File.join(BUILDSCRIPTS_DIR, PROFILE_FILE)

      begin
        File.open(profile_file, 'w') do |f|
          f.write "dependencies = #{JSON.pretty_generate(base_profile)};"
        end

        Dir.chdir BUILDSCRIPTS_DIR
        puts "Building the JavaScript -- this can take a while, be patient!"

        if Mulberry::Env.host_os == :windows
          build_script = 'build.bat'
          location     = Pathname.new(@location).relative_path_from(Pathname.new(Dir.pwd)).to_s
        else
          build_script = 'build.sh'
          location     = @location
        end

        system %{./#{build_script} profileFile=#{PROFILE_FILE} releaseDir=#{location} #{'> /dev/null' if !@build.settings[:verbose]}}

      ensure
        FileUtils.rm_rf profile_file
        Dir.chdir pwd
      end
    end
  end
end
