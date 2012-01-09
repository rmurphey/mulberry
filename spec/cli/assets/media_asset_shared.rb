shared_examples_for "all media assets" do
  describe '#item', :fakefs => true  do
    it "should handle output remote items properly" do
      #FakeFS::FileSystem.clone @remote_asset.asset_file if @remote_asset.is_a? Mulberry::Asset::Image

      item = @remote_asset.item

      item[:url].should match /^http/
      item[:url].should match /#{@remote_asset.asset_name}/
      item[:streamed].should be_true
    end
  end
end
