task :ci do

  Rake::Task['spec'].execute

  Rake::Task['integration'].execute

  Rake::Task['evergreen:run'].execute

  Rake::Task['jshint'].execute

end

task :travis do
  puts "Grabbing chromedriver..."
  mkdir_p "/tmp/bin"
  system "cd /tmp/bin && wget http://chromium.googlecode.com/files/chromedriver_linux32_18.0.995.0.zip && unzip chromedriver_linux32_18.0.995.0.zip"

  puts "Starting to run tests in #{Dir.pwd}"
  system("export PATH=/tmp/bin:$PATH && export DISPLAY=:99.0 && bundle exec rake")

  raise "`rake test` failed!" unless $?.exitstatus == 0
end

task :default => :ci
