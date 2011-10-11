# Tasks for the test environment
require 'evergreen'

task :spec do
  Rake::Task['evergreen:run'].invoke
  Rake::Task['jslint'].invoke
end

namespace :evergreen  do
  desc "Run jasmine specs via evergreen"
  task :run => :generate_stuff do
    if not File.exists?(File.join(TouraAPP::root, 'javascript', 'dev'))
      puts "Building app dev files"
      `rake builder:app_dev`
    end

    Kernel.exit(1) unless Evergreen::Cli.execute(["run"])
  end

  desc "Run jasmine specs server via evergreen"
  task :serve => :generate_stuff do
    if not File.exists?(File.join(TouraAPP::root, 'javascript', 'dev'))
      puts "Building app dev files"
      `cd ..; rake builder:app_dev`
    end

    Evergreen::Cli.execute(["serve"])
  end

  task :generate_stuff do
    File.open(File.join(TouraAPP.root, 'javascript', 'toura', 'app', 'TouraConfig.js'), 'w') do |f|
      f.write TouraAPP::App.create_config('ios', 'phone')
    end
  end

end

desc "By default, run evergreen JS tests"
task :default => "evergreen:run"
