require "toura_app/application"
require "builder/task_base.rb"

module Builder
  class JavaScript < Builder::TaskBase
    COPYRIGHT_FILE = File.join(
      TouraAPP.root,
      "profiles",
      "copyright.txt"
    )

    PROFILE_FILE = "toura.profile.js"

    WEBKIT = {
      :dev =>             false,
      :MAP =>             false,
      :mulberry =>        true,
      :device =>          true
    }

    LAYERS = {
      :dojo => {
        :name =>            "dojo.js",
        :dependencies =>    [
          "dijit._Widget",
          "dijit._Templated",
          "dojo.i18n",
          "dojo.string",
          "dojo.data.ItemFileReadStore",
          "vendor.mustache._base",
          "toura.views._Nls"
        ]
      },

      :toura => {
        :copyrightFile  => COPYRIGHT_FILE,
        :name           => "../toura/base.js",
        :resourceName   => "toura.base",
        :dependencies   => [ "toura.base" ]
      },

      :client => {
        :copyrightFile  => COPYRIGHT_FILE,
        :name           => "../client/base.js",
        :resourceName   => "client.base",
        :dependencies   => [ "client.base" ]
      }
    }

    def initialize(build, task_name)
      super

      @required_layers = @target['build']['javascript']

      @buildscripts_dir = File.join(
        TouraAPP.root,
        "javascript",
        "dojo-release-#{TouraAPP::App.dojo_version}-src",
        "util",
        "buildscripts"
      )

      @location = File.join(TouraAPP.root, 'javascript')

      get_dojo
    end

    public
    def build
      if !build_required
        return true
      end

      if @build.settings[:skip_js_build]
        return true
      end

      pwd = Dir.pwd
      begin
        Dir.chdir @buildscripts_dir

        File.open(PROFILE_FILE, 'w') do |f|
          f.write "dependencies = #{JSON.pretty_generate(base_profile)};"
        end

        dojo_build
        unminify_haml

        File.delete PROFILE_FILE
      ensure
        Dir.chdir pwd
      end

      true
    end

    def report
      {
        :build_contents   => File.join(@location, @build_type.to_s, 'dojo', 'build.txt'),
        :profile          => base_profile,
        :location         => File.join(@location, @build_type)
      }
    end

    private
    def get_dojo
      ver = TouraAPP::App.dojo_version
      dojo = "http://download.dojotoolkit.org/release-#{ver}/dojo-release-#{ver}-src.tar.gz"
      dest = File.join(TouraAPP.root, "javascript", "dojo-release-#{ver}-src")

      unless File.exists?(dest)
        Dir.chdir(File.join(TouraAPP.root, 'javascript'))

        # Remove any older version of Dojo
        FileUtils.rm_rf(File.join(TouraAPP::Build.javascript, 'dojo-release-*'))

        # Download specified Dojo version and extract it to the js dir
        @build.log("Downloading and extracting Dojo. JavaScript goodness is a few minutes away.", 'info')
        dojoInstalled = system %{curl --insecure -o - #{dojo} | tar -C #{File.join(TouraAPP.root, "javascript")} -xzf -}
        raise "Fatal error: Failed to install Dojo." unless dojoInstalled
      end

      @build.log("Dojo is installed. It's all good.", 'info')
    end

    def unminify_haml
      # we can't let haml get minified, so we have to delete the minified
      # version and replace it with the unminified version after the dojo
      # build is complete
      bad_haml    = File.join(@location, @target['build_type'], 'vendor', 'haml.js')
      good_haml   = File.join(@location, 'vendor', 'haml.js')

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

      if (@build.build_helper.respond_to? 'source_dir') && (@required_layers.include? 'client')
        profile[:prefixes] << [ 'client', File.join(@build.build_helper.source_dir, 'javascript') ]
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
      if @build.settings[:force_js_build]
        true
      else
        !File.exists? File.join(@location, @build_type, 'dojo', 'dojo.js')
      end
    end

    def dojo_build
      puts "Building the JavaScript -- this can take a while, be patient!"
      system %{./build.sh profileFile=#{PROFILE_FILE} releaseDir=#{@location} #{'> /dev/null' if !@build.settings[:verbose]}}
    end
  end
end
