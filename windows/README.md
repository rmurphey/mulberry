## Installation notes on Windows (64-bit Windows 7)

### On the command line:
    cd git
	md MulberryAlpha
	cd MulberryAlpha
	git init
	git clone git@github.com:Toura/mulberry.git
	cd mulberry\mulberry

### Issue: Ruby is not part of Windows 7 by default
**Solution**:
	[http://rubyinstaller.org/](http://rubyinstaller.org/)   
	Downloaded [http://rubyforge.org/frs/download.php/75127/rubyinstaller-1.9.2-p290.exe](http://rubyforge.org/frs/download.php/75127/rubyinstaller-1.9.2-p290.exe)   
	Installation options: Add Ruby executables to your PATH, and Associate .rb and .rbw files with this Ruby installation.   
	Required disk space: ~32.5MB

Continue with the installation:

    set path=%path%;C:\full\path\to\mulberry\mulberry\bin
    gem install bundler  

outputs:

    Fetching: bundler-1.0.21.gem (100%)
    Successfully installed bundler-1.0.21
    1 gem installed
    Installing ri documentation for bundler-1.0.21...
    Installing RDoc documentation for bundler-1.0.21...

Now install the bundle:

	bundle install

outputs:

	Fetching source index for http://rubygems.org/
	Installing rake (0.9.2)
	Installing activesupport (3.0.0)
	Installing active_support (3.0.0)
	Installing addressable (2.2.6)
	Installing mime-types (1.16)
	Installing nokogiri (1.5.0)
	Installing rack (1.3.4)
	Installing rack-test (0.6.1)
	Installing ffi (1.0.9)
	Installing childprocess (0.2.2)
	Installing json_pure (1.6.1)
	Installing rubyzip (0.9.4)
	Installing selenium-webdriver (2.8.0)
	Installing xpath (0.1.4)
	Installing capybara (1.1.1)
	Installing coffee-script-source (1.1.2)
	Installing multi_json (1.0.3)
	Installing execjs (1.2.9)
	Installing coffee-script (2.2.0)
	Installing diff-lcs (1.1.3)
	Installing launchy (2.0.5)
	Installing tilt (1.3.3)
	Installing sinatra (1.2.6)
	Installing evergreen (0.4.1)
	Installing haml (3.1.2)
	Installing kramdown (0.13.3)
	Installing mustache (0.99.4)
	Installing rspec-core (2.6.4)
	Installing rspec-expectations (2.6.0)
	Installing rspec-mocks (2.6.0)
	Installing rspec (2.6.0)
	Installing sass (3.1.4)
	Using bundler (1.0.21)
	Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.

Installation complete!

## Creating your first app
### On the command line in `C:\full\path\to\Git`:
    mulberry scaffold Morus

### Issue: 'mulberry' is not recognized as an internal or external command, operable program or batch file.
**Solution**: Explicitly execute ruby with the fully qualified mulberry filename

    ruby C:\full\path\to\mulberry\mulberry\bin\mulberry scaffold Morus

Outputs:

	Copyright (c)  2011 Toura, LLC. All Rights Reserved.  website: http://toura.com

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is furnished to do
	so, subject to the following conditions:

	1.      The above  copyright notice and this permission notice shall be included in
		all copies or substantial portions of the Software and any sublicense shall
		be subject to and include all of the terms of this license.

	2.      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,  EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF ANY INTELLECTUAL
		PROPERTY. IN NO EVENT SHALL TOURA, THE AUTHORS OR COPYRIGHT HOLDERS OR
		THEIR RESPECTIVE SUCCESSORS OR ASSIGNS,  BE LIABLE FOR ANY CLAIM, DAMAGES
		OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
		ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE INCLUDING, WITHOUT
		LIMITATION ANY MODIFICATION, COPYING, DISTRIBUTION, SALE OTHER USE OF OR
		DEALINGS IN THE SOFTWARE. THERE ARE NO IMPLIED RIGHTS GRANTED HEREBY AND
		ANY RIGHTS NOT EXPRESSLY GRANTED ARE HEREBY RESERVED BY TOURA, LLC.

	Scaffolded an app at c:/Git/Morus

## Building the binary

    ruby C:\Git\Mulberry\mulberry\bin\mulberry deploy

Outputs:

	INFO: === gather ===
	INFO: --> www_icons: accepted
	INFO: www_icons: completed
	INFO: --> assets: accepted
	INFO: assets: completed
	INFO: --> data: accepted
	INFO: data: completed
	INFO: --> templates: accepted
	INFO: templates: completed
	INFO: === build ===
	INFO: Downloading and extracting Dojo. JavaScript goodness is a few minutes away.
	'curl' is not recognized as an internal or external command,
	operable program or batch file.
	INFO: Dojo is installed. It's all good.
	INFO: --> javascript: accepted
	C:/Git/Mulberry/toura_app/lib/builder/js.rb:80:in `chdir': No such file or directory - C:/Git/Mulberry/toura_app/javascript/dojo-release-1.6.0-src/util/buildscripts (Errno::ENOENT)
			from C:/Git/Mulberry/toura_app/lib/builder/js.rb:80:in `build'
			from C:/Git/Mulberry/toura_app/lib/builder.rb:141:in `block in do_step'
			from C:/Git/Mulberry/toura_app/lib/builder.rb:137:in `each'
			from C:/Git/Mulberry/toura_app/lib/builder.rb:137:in `do_step'
			from C:/Git/Mulberry/toura_app/lib/builder.rb:132:in `block in do_steps'
			from C:/Git/Mulberry/toura_app/lib/builder.rb:127:in `each'
			from C:/Git/Mulberry/toura_app/lib/builder.rb:127:in `do_steps'
			from C:/Git/Mulberry/toura_app/lib/builder.rb:79:in `build'
			from C:/Git/Mulberry/mulberry/mulberry.rb:167:in `block (2 levels) in generate'
			from C:/Git/Mulberry/mulberry/mulberry.rb:160:in `each'
			from C:/Git/Mulberry/mulberry/mulberry.rb:160:in `block in generate'
			from C:/Git/Mulberry/mulberry/mulberry.rb:159:in `each'
			from C:/Git/Mulberry/mulberry/mulberry.rb:159:in `generate'
			from C:/Git/Mulberry/mulberry/bin/mulberry:114:in `deploy'
			from C:/Git/Mulberry/mulberry/bin/mulberry:30:in `run'
			from C:/Git/Mulberry/mulberry/bin/mulberry:130:in `<main>'

### Issue: 

# NB. The steps hereafter might only be necessary if you goofed the installation like I did the first time around.
## TODO: set up again from scratch to verify.

### Issue: C:/Ruby192/lib/ruby/site_ruby/1.9.1/rubygems/custom_require.rb:36:in `require': no such file to load -- kramdown (LoadError)
**Cause**: Once I drilled into the requires, I found the stack dump actually explains the issue if you read between the custom_require lines.   
text.rb requires 'kramdown'. Found [http://kramdown.rubyforge.org/](http://kramdown.rubyforge.org/) and read the installation command on the installation page. Aside: text.rb also requires rubygems, which this says should not be done: [https://gist.github.com/54177](https://gist.github.com/54177).   
**Solution**:

    gem install kramdown

### Issue: C:/Ruby192/lib/ruby/site_ruby/1.9.1/rubygems/custom_require.rb:36:in `require': no such file to load -- active_support/inflector (LoadError)
**Cause**: Active support is not installed by default.   
**Solution**:

    gem install activesupport

### Issue: You don't have i18n installed in your application. Please add it to your Gemfile and run bundle install
**Solution**: Running `gem list` showed that i18n was indeed not installed.

    gem install i18n