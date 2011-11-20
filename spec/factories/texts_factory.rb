require 'assets/text'

include Mulberry::Asset

FactoryGirl.define do
  factory :text do
    content 'foo'
    name 'foo_text'
  end
end
