module Mulberry
  class Directories
    def self.root
      @root ||= find_root_with_flag
    end

    def self.cli
      File.join(root, 'cli')
    end

    def self.templates
      File.join(cli, 'templates')
    end

    def self.js_builds
      File.join(root, 'js_builds')
    end

    private
    # Taken from http://apidock.com/rails/Rails/Engine/find_root_with_flag
    def self.find_root_with_flag(flag = 'LICENSE.txt', default=nil)
      root_path = File.expand_path(File.dirname(__FILE__))

      # Minor change here: the tests will actually create a path that is wrong since __FILE__
      # is relative to the including file, e.g. /Users/mattrogish/src/mulberry/testapp/mulberry/mulberry.rb"
      # so we go up a dir by checking the parent, File.directory?(File.dirname(root_path)) => /Users/mattrogish/src/mulberry/testapp/
      while root_path && (File.directory?(root_path) || File.directory?(File.dirname(root_path)) ) && !File.exist?("#{root_path}/#{flag}")
        parent = File.dirname(root_path)
        root_path = parent != root_path && parent
      end

      root = File.exist?(File.join(root_path, flag)) ? root_path : default
      raise "Could not find root path for #{self}" unless root

      Mulberry::Env.host_os == :windows ? Pathname.new(root).expand_path : Pathname.new(root).realpath
    end
  end
end
