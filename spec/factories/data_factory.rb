require 'tmpdir'

FactoryGirl.define do
  factory :data, :class => Mulberry::Asset::Data do
    asset 'foo.yml'
    parent_assets_dir do
      parent_dir = nil
      parent_dir = Dir.mktmpdir
      data_dir = File.join(parent_dir, 'data')
      FileUtils.mkdir data_dir
      File.open File.join(data_dir, 'foo.yml'), 'w' do |f|
        f.write({
          'type' => 'fake',
          'items' => [ 1, 2, 3 ]
        }.to_yaml)
      end
      parent_dir
    end
  end

end
