task :ci do

  Rake::Task['spec'].execute

  Rake::Task['integration'].execute

  Rake::Task['evergreen:run'].execute

  Rake::Task['jshint'].execute

end

task :default => :ci
