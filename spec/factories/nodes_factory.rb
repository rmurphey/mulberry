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

      :bodyText           =>  nil,
      :images             =>  [],
      :audios             =>  [],
      :videos             =>  [],
      :data               =>  [],
      :locations          =>  [],
      :feeds              =>  [],

      :phoneHeaderImage   =>  nil,
      :tabletHeaderImage  =>  nil,
      :featuredImage      =>  nil,

      :children           =>  nil
    }

    asset page
  end
end
