require 'builder'

namespace :builder do
  desc "Generates the build required for APP browser development"
  task :app_dev do
    b = Builder::Build.new({
      :target => 'app_development',
      :log_level => -1
    })

    b.build
    b.cleanup

    puts "App dev build is complete"
  end
end
