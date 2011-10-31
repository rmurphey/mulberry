task :spec do
  $: << '.'
  exec %{rspec --color --format doc spec}
end

task :default => :spec
