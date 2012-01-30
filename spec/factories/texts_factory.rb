FactoryGirl.define do
  factory :text, :class => Mulberry::Asset::Text do
    content 'foo'
    name 'foo_text'
  end
end
