require 'builder'
require 'lib/legacy/filesystem_build_helper'

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

  # WARNING: These tasks are for internal Toura use and will be deleted.
  desc "Generates the build required for APP device development"
  task :device_dev, [ :type, :os ] do |t, args|
    puts "THIS TASK IS DEPRECATED. Use mulberry test instead unless you REALLY need this task."
    type = args && args[:type] || ENV['TYPE'] || 'phone'
    os = args && args[:os] || ENV['OS'] || 'ios'
    tour_id = ENV['TOUR_ID']

    raise "No type for device dev build" unless type
    raise "No os for device dev build" unless os

    begin
      build_helper = Builder::TourBuildHelper.new(Tour.find(tour_id))
    rescue
      build_helper = Builder::FilesystemBuildHelper.new(:tour_id => tour_id)
    end

    b = Builder::Build.new({
      :force_js_build => true,
      :target => 'device_development',
      :device_type => type,
      :device_os => os,
      :build_helper => build_helper,
      :log_level => -1
    })

    b.build
    b.cleanup

    puts "Device dev build is complete"
  end

  namespace :dev do
    desc "Build android for device development"
    task :android do
      Rake::Task['builder:device_dev'].invoke('phone', 'android')
    end

    desc "Build iPhone for device development"
    task :iphone do
      Rake::Task['builder:device_dev'].invoke('phone', 'ios')
    end

    desc "Build android for device development"
    task :ipad do
      Rake::Task['builder:device_dev'].invoke('tablet', 'ios')
    end
  end
end
