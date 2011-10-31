shared_examples_for "all assets" do
  describe '#reference' do
    it "should have id" do
      @asset.reference[@asset.asset_type.to_sym]['_reference']['id']
    end
  end
end
