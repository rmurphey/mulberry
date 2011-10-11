desc "Run a development server"
task :serve, [:port] do |t, args|
  Rake::Task['sinatra'].invoke(args)
end

task :sinatra do |t, args|
  require 'lib/toura_app_server'
  args.with_defaults(:port => '4000')
  TouraAPPServer.run! :host => 'localhost', :port => args.port
end

