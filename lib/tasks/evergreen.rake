require 'mulberry'
require 'evergreen'

namespace :evergreen  do
  desc "Run jasmine specs via evergreen"
  task :run => :generate_stuff do
    Kernel.exit(1) unless Evergreen::Cli.execute(["run"])
  end

  desc "Run jasmine specs server via evergreen"
  task :serve => :generate_stuff do
    Evergreen::Cli.execute(["serve"])
  end

  task :generate_stuff do
    # generate a tour.js from kitchensink
    app = Mulberry::App.new(File.join(TouraAPP::Directories.root, "demos", "kitchensink"))
    
    File.open(File.join(TouraAPP::Directories.root, "app", "fixtures", "tour.js"), "w") do |f|
      f.write TouraAPP::Generators.data(Mulberry::Data.new(app).generate)
    end
    
    if !File.exists?(TouraAPP::Directories.dojo)
      Rake::Task['builder:app_dev'].execute
      raise "Dojo downloaded and built; you'll need to re-run the rake task for it to work. Sorry."
    end

    File.open(File.join(TouraAPP::Directories.javascript, 'toura', 'app', 'TouraConfig.js'), 'w') do |f|
      f.write TouraAPP::Generators.config('ios', 'phone')
    end
  end

end
