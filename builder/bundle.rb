require "builder/task_base"

module Builder
  class Bundle < Builder::TaskBase
    public
    def build
      reports = @build.completed_steps

      [ :icons, :load_screens, :assets, :data, :page_defs, :www_icons ].each do |attrib|
        self.instance_variable_set( "@#{attrib.to_s}", reports[:gather][attrib])
      end

      [ :javascript, :html, :css, :config, :project ].each do |attrib|
        self.instance_variable_set( "@#{attrib.to_s}", reports[:build][attrib])
      end

      raise "We need a project to bundle" unless @project

      @project_dir   = File.join(@project[:location], @project[:dir])

      if @target['build_type'] == 'browser'
        @www = File.join(@project_dir, 'www')
      else
        @www = @target['device_os'] == 'android' ?
          File.join(@project_dir, 'assets', 'www') :
          File.join(@project_dir, 'www')
      end

      FileUtils.mkdir_p @www unless File.exists? @www

      position_html unless !@html
      position_css unless !@css
      position_js unless !@javascript
      position_config unless !@config
      position_data unless !@data
      position_assets unless !@assets
      position_page_defs unless !@page_defs
      position_www_icons unless !@www_icons

      # TODO: separate these. this is dumb, but i copied it
      # directly from build rake for now
      if @load_screens and @icons
        icons_and_screens
      end

      position_build

      tour_json_location = reports[:gather][:data][:tour_json_location]
      if tour_json_location
        FileUtils.cp tour_json_location,
                     @build.build_helper.project_settings[:bundle]
      end
      true
    end

    def report
      {
        :location => @location
      }
    end

    private
    def position_www_icons
      icons_dir = File.join(@www, 'icons')
      Dir.mkdir(icons_dir) unless File.exists?(icons_dir)

      @www_icons[:files].each do |icons|
        FileUtils.cp_r(File.join(@www_icons[:location], icons), icons_dir)
      end
    end

    def position_page_defs
      data_dir = File.join(@www, 'data')

      FileUtils.mkdir_p(data_dir) unless File.exists?(data_dir)

      @page_defs[:files].each do |page_def_file|
        FileUtils.cp(
          File.join(@page_defs[:location], page_def_file),
          File.join(data_dir, "#{page_def_file}")
        )
      end
    end

    def position_assets
      raise "No directory for assets" unless @assets[:dir]

      assets_dir = File.join(@www, 'media')
      FileUtils.mkdir_p(assets_dir) unless File.exists?(assets_dir)

      FileUtils.cp_r(
        File.join(@assets[:location], @assets[:dir], '.'),
        assets_dir
      )

      Builder::Bundle::Manifest.new(assets_dir).build
    end

    def icons_and_screens
      is_phone = @target['device_type'] == 'phone'

      media_load_screens_dir = File.join(@www, 'media', 'load-screens')
      FileUtils.mkdir_p(media_load_screens_dir) unless File.exists?(media_load_screens_dir)

      FileUtils.cp_r(
        File.join(
          @load_screens[:location],
          is_phone ? 'phone_portrait.png' : 'tablet_portrait.png'
        ),
        File.join(media_load_screens_dir, 'portrait.png')
      )

      unless is_phone
        FileUtils.cp_r(
          File.join(@load_screens[:location], 'tablet_landscape.png'),
          File.join(media_load_screens_dir, 'landscape.png')
        )
      end

      case @target['device_os']
      when 'ios'
        project_resources_dir = File.join(@project_dir, 'Toura', 'Resources')

        project_icons_dir = File.join(project_resources_dir, 'icons')

        # sample the icons to the appropriate sizes
        # iPad needs the 2x icon, too, otherwise Apple complains.
        system %{convert #{File.join(@icons[:location], 'app_icon_phone.png')} -sample 57x57! \
          #{File.join(project_icons_dir, 'icon.png')}
        }

        icon_2x_path = File.join(project_icons_dir, 'icon@2x.png')
        if is_phone
          system %{convert #{File.join(@icons[:location], 'app_icon_phone.png')} -sample 114x114! \
            #{icon_2x_path}
          }
        else
          FileUtils.remove_file icon_2x_path
        end


        icon_72_path = File.join(project_icons_dir, 'icon-72.png')
        if is_phone
          FileUtils.remove_file icon_72_path
        else
          system %{convert #{File.join(@icons[:location], 'app_icon_tablet.png')} -sample 72x72! \
            #{icon_72_path}
          }
        end

        project_splash_dir = File.join(project_resources_dir, 'splash')

        portrait_image = File.join(
          @load_screens[:location],
          is_phone ? 'phone_portrait.png' : 'tablet_portrait.png'
        )

        default_2x_path = File.join(project_splash_dir, 'Default@2x.png')
        if File.exists? portrait_image
          if is_phone
            # Force a downsample
            system %{convert #{portrait_image} -sample 320x480! \
              #{File.join(project_splash_dir, 'Default.png')}
            }

            # The file from MAP should be high-res
            FileUtils.cp(portrait_image, default_2x_path)
          else
            ['Default.png', 'Default-Portrait.png'].each do |screen_type|
              FileUtils.cp(
                portrait_image,
                File.join(project_splash_dir, screen_type)
              )
            end
            FileUtils.remove_file default_2x_path
          end
        end

        # Phone does not get landscape.
        unless is_phone
          landscape_image = File.join(@load_screens[:location], 'tablet_landscape.png')
          FileUtils.cp(
            landscape_image,
            File.join(project_splash_dir, 'Default-Landscape.png')
          ) if File.exists? landscape_image
        end

      when 'android'
        # TODO this assumes phone for android right now

        # http://developer.android.com/guide/practices/ui_guidelines/icon_design.html
        # Launcher	 36 x 36 px	 48 x 48 px	 72 x 72 px
        icon_size = lambda do |res|
          case res
            when "hdpi"
              "72x72"
            when "mdpi"
              "48x48"
            else
              "36x36"
          end
        end

        # http://developer.android.com/guide/practices/screens_support.html
        # WQVGA400 (240x400) WQVGA432 (240x432)	HVGA (320x480)	(480x800)/(480x854)
        screen_size = lambda do |res|
          case res
            when "hdpi"
              "320x480"
            when "mdpi"
              "320x480"
            else
              "240x400"
          end
        end

        %w(hdpi ldpi mdpi).each do |resolution|
          system %{convert #{File.join(@icons[:location], 'app_icon_phone.png')} -sample #{icon_size.call resolution}! \
            #{File.join(@project_dir, 'res', "drawable-#{resolution}", 'icon.png')}
          }

          system %{convert #{ File.join(@load_screens[:location], 'phone_portrait.png') } -sample #{screen_size.call resolution}! \
            #{File.join(@project_dir, 'res', "drawable-#{resolution}", 'splash.png')}
          }
        end
      end
    end

    def position_build
      is_dev = @target['development']

      if is_dev
        permastore = @build.build_helper.project_settings[:bundle]
        @location = File.join(permastore, @project[:dir])

        FileUtils.rm_rf @location
        FileUtils.mkdir_p @location
        FileUtils.cp_r(File.join(@project_dir, '.'), @location)

        @build.log("#{@target['device_os']}/#{@target['device_type']} built at #{@location}", 'info')

        case @target['device_os']
        when 'android'
          FileUtils.cd @location
          system %{ant debug}

          @build.log("You can install to your device as follows:\n\nadb install -r #{@location}/bin/*debug.apk\n", 'info')
        when 'ios'
          xcodeproj = File.join(
            @location,
            (@target['device_type'] == 'phone' ? 'Toura.xcodeproj' : 'Toura-iPad.xcodeproj')
          ).gsub(/[']/, '\\\\\'').gsub(/\s/,'\ ') # escape single quotes & spaces before sending to `open`

          system %{open #{xcodeproj}} unless @build.quiet
        end
      else
        permastore = @build.build_helper.project_settings[:bundle]
        target = File.join(permastore, @project[:dir])
        FileUtils.rm_r(target) if File.exists?(target)
        FileUtils.mkdir_p(permastore)
        FileUtils.cp_r(@project_dir, permastore)

        if @target['build_type'] == 'mulberry' && @target['device_os'] == 'android'
          @location = File.join(permastore, 'android')
          FileUtils.cd @location

          if File.exists? File.join(@location, 'keystore')
            system %{ant release}
            @build.log("You can install to your device as follows:\n\nadb install -r #{@location}/bin/*release.apk\n", 'info')
          else
            system %{ant debug}
            @build.log("You can install to your device as follows:\n\nadb install -r #{@location}/bin/*debug.apk\n\n", 'info')
            @build.log("To create a releasable APK, make sure your project includes a keystore file\n\n", 'info')
          end
        else
          @location = permastore
        end
      end
    end

    def position_html
      @html[:files].each do |html_file|
        FileUtils.cp_r(File.join(@html[:location], html_file), @www)
      end
    end

    def position_css
      css_dir = File.join(@www, 'css')
      Dir.mkdir(css_dir) unless File.exists?(css_dir)
      @css[:files].each do |css_file|
        FileUtils.cp_r(File.join(@css[:location], css_file), css_dir)
      end
    end

    def position_js
      built = @javascript[:location]

      if (!File.exists?(built))
        @build.log("Didn't find any built JavaScript", 'warning')
        return
      end

      js_dir = File.join(@www, 'javascript')
      toura_dir = File.join(js_dir, 'toura')
      dojo_dir = File.join(js_dir, 'dojo')
      vendor_dir = File.join(js_dir, 'vendor')
      nls_dir = File.join(js_dir, 'toura', 'nls')

      client_dir = File.join(js_dir, 'client')
      client_base = File.join(built, 'client', 'base.js')

      [ js_dir, toura_dir, dojo_dir, vendor_dir, nls_dir, client_dir ].each do |d|
        FileUtils.mkdir_p(d) unless File.exists? d
      end

      FileUtils.cp_r(
        File.join(built, 'dojo', 'dojo.js'),
        dojo_dir
      )

      FileUtils.cp_r(
        File.join(built, 'toura', 'base.js'),
        toura_dir
      )

      if @target['development']
        FileUtils.cp_r(
          File.join(built, 'toura', 'base.js.uncompressed.js'),
          toura_dir
        )
      end

      FileUtils.cp_r(
        File.join(built, 'vendor', 'haml.js'),
        vendor_dir
      )

      if @build.build_helper.project_settings[:jquery]
        FileUtils.cp_r(
          File.join(built, 'vendor', 'jquery.js'),
          vendor_dir
        )
      end

      FileUtils.cp_r(
        File.join(built, 'toura', 'nls', '.'),
        nls_dir
      )

      if File.exists? client_base
        FileUtils.cp_r(client_base, client_dir)

        if @target['development']
          FileUtils.cp_r("#{client_base}.uncompressed.js", client_dir)
        end
      end
    end

    def position_config
      config_dir = File.join(@www, 'javascript', 'toura', 'app')

      FileUtils.mkdir_p(config_dir) unless File.exists?(config_dir)

      @config[:files].each do |config_file|
        FileUtils.cp_r(
          File.join(@config[:location], config_file),
          config_dir
        )
      end
    end

    def position_data
      data_dir = File.join(@www, 'data')
      is_browser = %w{browser MAP}.include? @target['build_type']

      FileUtils.mkdir_p(data_dir) unless File.exists?(data_dir)

      @data[:files].each do |data_file|
        FileUtils.cp(
          File.join(@data[:location], data_file),
          File.join(data_dir, "#{data_file}#{is_browser ? '' : '.jet'}")
        )
      end
    end

    class Manifest
      def initialize(dir)
        @dir = dir
      end

      public
      def build
        File.open(File.join(@dir, 'manifest.js'), 'w') do |f|
          f.write manifest
        end
      end

      private
      def manifest
        "toura.app.manifest = #{JSON.pretty_generate(create_dir_manifest(@dir))};"
      end

      def create_dir_manifest(d)
        manifest = {
          'files' => [],
          'dirs' => {}
        }

        Dir.glob(File.join(d, '*')).each do |f|
          if File.directory? f
            manifest['dirs'][File.basename(f)] = create_dir_manifest(f)
          else
            manifest['files'] << File.basename(f)
          end
        end

        manifest
      end

    end
  end
end
