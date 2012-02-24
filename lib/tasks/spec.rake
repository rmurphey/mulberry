task :spec do
  $: << '.'
  dirs = Dir[File.join(Mulberry::Framework::Directories.root, 'spec/*')].select{ |d| !d.match('integration') }.sort.join(' ')
  puts "Current dir = #{Mulberry::Framework::Directories.root}"
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
