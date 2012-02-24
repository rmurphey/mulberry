require 'mulberry'
require 'evergreen'

namespace :evergreen  do
  desc "Run jasmine specs via evergreen"
  task :run => :generate_stuff do
    puts "running tests"

    Evergreen.root = Mulberry::Framework::Directories.root
    result         = Evergreen::Runner.new.run

    Kernel.exit(1) unless result
  end

  desc "Run jasmine specs server via evergreen"
  task :serve => :generate_stuff do
    Evergreen::Server.new.serve
  end

  task :generate_stuff do
    # generate a tour.js from kitchensink
    app = Mulberry::App.new(File.join(Mulberry::Framework::Directories.root, "demos", "kitchensink"))

    puts "generating tour fixture"
    fixtures_dir = File.join(Mulberry::Framework::Directories.root, "app", "fixtures")
    FileUtils.mkdir_p fixtures_dir

    File.open(File.join(fixtures_dir, "tour.js"), "w") do |f|
      f.write Mulberry::Framework::Generators.data(Mulberry::Data.new(app).generate)
    end

    puts "checking for dojo"
    if !File.exists?(Mulberry::Framework::Directories.dojo)
      Rake::Task['builder:app_dev'].execute
      raise "Dojo downloaded and built; you'll need to re-run the rake task for it to work. Sorry."
    end

    puts "creating app config"
    File.open(File.join(Mulberry::Framework::Directories.javascript, 'toura', 'AppConfig.js'), 'w') do |f|
      f.write Mulberry::Framework::Generators.config('ios', 'phone')
    end
  end

end
