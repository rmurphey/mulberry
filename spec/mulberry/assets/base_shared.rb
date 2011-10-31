shared_examples_for "all assets" do
  describe '#reference' do
    it "should have id" do
      @asset.reference[@asset.asset_type.underscore.camelcase(:lower).to_sym]['_reference']['id']
    end
  end

  describe '#load_data' do
    it 'should load data from yaml file' do

      yaml_file = File.join(@asset.dir, "#{@asset.asset_name}.yml")
      if File.exists? yaml_file
        @asset.load_data.should == YAML::load( File.open( yaml_file ) )
      end
    end
  end
end
