require 'jshintrb'

desc "Run JSHint on app code"
task :jshint do
  jsl = JSLint.new(:undef => false,
                   :strict => false,
                   :nomen => false,
                   :onevar => false,
                   :newcap => false,
                   :regexp => false,
                   :plusplus => false,
                   :linter => 'jshint')

  found_errors = false

  files = (
    Dir[File.join(TouraAPP::Directories.javascript, 'toura', '**', '*.js')] +
    Dir[File.join(TouraAPP::Directories.root, 'spec', 'app', '**', '*.js')]
  ).flatten

  files.each do |f|
    unless File.basename(f) == 'xhr.js'
      errors = jsl.check(File.read(f))
      if errors
        $stderr.write "\nIn [#{f}]:\n"
        $stderr.write errors + "\n"
        found_errors = true
      end
    end
  end

  if found_errors
    raise "JSHint Errors Found"
  else
    puts "JSHinty-fresh!"
  end
end
