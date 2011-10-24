# Running the demo

Make sure you have the `sinatra-cross_origin` gem installed:

    gem install sinatra-cross_origin

Then, start the data server:

    ruby lib/server.rb

Finally, serve the app:

    mulberry serve

You should be able to visit the app now at http://localhost:3001.

Note that this app expects the data server to be running at
http://localhost:3002. If it is running elsewhere, or you are trying to access
it from a device, you will need to edit the file at javascript/data/Animals.js
to point at the proper location.
