task :spec do
  $: << '.'
  dirs = Dir.glob('spec/*').select { |d| !d.match('integration') }.join(' ' << Dir.pwd )
  puts "Current dir = #{Dir.pwd}"
  puts "Executing `rspec --color --format doc #{dirs}`..."
  system %{rspec --color --format doc #{dirs}}
end

task :integration do
  # separate out integration tests because each set needs to run using its own server
  Dir.glob('spec/integration/*').each do |d|
    system %{rspec --color --format doc #{d}}
  end
end