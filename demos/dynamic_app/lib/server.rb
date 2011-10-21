require 'rubygems'
require 'sinatra/base'
require 'sinatra/cross_origin'
require 'json'

module Demo
  class Server < Sinatra::Base
    register Sinatra::CrossOrigin

    def initialize
      super

      @animals = [
        {
          :name => 'Dog',
          :votes => []
        },

        {
          :name => 'Cat',
          :votes => []
        },

        {
          :name => 'Honey Badger',
          :votes => []
        }
      ]
    end

    #####################
    # Settings
    #####################

    enable :logging
    enable :cross_origin

    set :raise_errors => true
    set :host, 'localhost'
    set :port, '3002'

    set :allow_origin, :any
    set :allow_methods, [ :get, :post, :options ]
    set :allow_credentials, true

    options '*' do
    end

    post '/animals/:animal_name/vote' do
      cross_origin

      selected_animals = @animals.select { |a| a[:name] == params[:animal_name] }

      if selected_animals.length
        @animals.each { |a| a[:votes].delete params[:username] }
        animal = selected_animals[0]
        animal[:votes] << params[:username]
      end

      content_type 'text/javascript'
      JSON.pretty_generate @animals
    end

    get '/animals' do
      cross_origin

      content_type 'text/javascript'
      JSON.pretty_generate @animals
    end

    get '/animals/:animal_name' do
      cross_origin

      content_type 'text/javascript'
      JSON.pretty_generate (@animals.select { |a| a[:name] == params[:animal_name] }.first)
    end
  end
end

Demo::Server.run!
