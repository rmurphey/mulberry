FactoryGirl.define do
  factory :node, :class => Mulberry::Asset::Node do
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
