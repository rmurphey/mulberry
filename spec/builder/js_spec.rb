require "builder"

describe Builder::JavaScript do

  describe "#dojo_build" do
    before(:each) do
      @b = Builder::Build.new(
        :skip_js_build => false,
        :target_config => {
          'build_type' => 'fake',
          'build' => {
            'javascript' => [ 'toura' ]
          }
        }
      )

    end

    it "should return a relative path on windows" do
      # Need to override the Env class to return windows so we can check this
      check_copyright_file :windows, /^\.\..+/
    end

    it "should return absolute path on non-windows" do
      check_copyright_file :macos, /^\/.+/
    end
  end
end

def check_copyright_file(host_os, matcher)
  set_host_os(host_os) do

    js = Builder::JavaScript.new @b, 'dojo'

    js.send(:base_profile)[:layers].each do |layer|
      layer[:copyrightFile].should match matcher
    end
  end
end

def set_host_os(host_os_sym)
  Mulberry.module_eval do
    self::Env.class_eval do
      eval "class << self
        alias_method :saved_host_os, :host_os
        def host_os
          :#{host_os_sym}
        end
      end"
    end
  end

  begin
    yield
  ensure
    reset_host_os
  end
end

def reset_host_os
  Mulberry.module_eval do
    self::Env.class_eval do
      class << self
        undef :host_os
        alias_method :host_os, :saved_host_os
      end
    end
  end
end