task :spec do
  $: << '.'
  dirs = Dir[File.join(Dir.pwd, 'spec/*')].select { |d| !d.match('integration') }.join(' ')
  puts "Current dir = #{Dir.pwd}"
  puts "Executing `rspec --color --format doc #{dirs}`..."
  system %{rspec --color --format doc #{dirs}}
end

task :integration do
  # separate out integration tests because each set needs to run using its own server
  Dir.glob('spec/integration/*').each do |d|
    puts "Executing `rspec --color --format doc #{d}`..."
    system %{rspec --color --format doc #{d}}
  end
end