task :spec do
  $: << '.'
  dirs = Dir.glob('spec/**').select { |d| !d.match('integration') }.join(' ')
  # exec %{rspec --color --format doc #{dirs}}

  # separate out integration tests because each set needs to run using its own server
  Dir.glob('spec/integration/*').each do |d|
    puts "Doing #{d}"
    system %{rspec --color --format doc #{d}}
  end
end

task :default => :spec
