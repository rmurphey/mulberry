require 'jshintrb'

desc "Run JSLint on app code"
task :jslint do
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
    Dir[File.join(TouraAPP.root, 'javascript/toura/**/*.js')] +
    Dir[File.join(TouraAPP.root, 'www/data/tour.json')] +
    Dir[File.join(TouraAPP.root, 'features/fixtures/**/*.json')] +
    Dir[File.join(TouraAPP.root, 'spec/javascripts/**/*.js')]
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
    raise "JSLint Errors Found"
  else
    puts "JSLinty-fresh!"
  end

end
