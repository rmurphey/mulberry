# Integration tests sometimes fail (need to mock the internet better)
# so for now, don't run them in integration mode
task :all_tests do
  Rake::Task['ci'].execute
  Rake::Task['integration'].execute
end

task :ci do

  did_fail = false

  ['builder:app_dev', 'spec', 'evergreen:run', 'jshint'].each do |task|
    Rake::Task[task].invoke
	  did_fail = true unless $?.exitstatus == 0
  end

  Kernel.exit(1) if did_fail
end

task :travis do
  puts "Grabbing chromedriver..."
  mkdir_p "/tmp/bin"
  system "cd /tmp/bin && wget http://chromium.googlecode.com/files/chromedriver_linux32_18.0.995.0.zip && unzip chromedriver_linux32_18.0.995.0.zip"

  root = Mulberry::Framework::Directories.root

  # Repo comes without a local.props, so specs fail
  # installing android on Ubuntu isn't (yet) automateable
  # so just shove a dummy file there
  FileUtils.cp(
    File.join( root, 'spec', 'fixtures', 'android', 'local.properties'   ),
    File.join( Mulberry::Framework::Directories.project_templates, 'android' )
  )

  puts "Starting to run tests in #{Dir.pwd}"
  system("export PATH=/tmp/bin:$PATH && bundle exec rake ci")

  raise "`rake test` failed!" unless $?.exitstatus == 0
end

task :default => :all_tests