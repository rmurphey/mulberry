require 'assets/node'

include Mulberry::Asset

FactoryGirl.define do
  factory :node do
    page = {
      :page_name          =>  'fixture_node',
      :name               =>  'fixture node',

      :pageController     =>  {
        'phone'   =>  'default',
        'tablet'  =>  'default'
      },

      :children           =>  nil
    }

    asset page
  end
end
