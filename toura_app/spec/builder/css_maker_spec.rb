require 'lib/builder'

describe Builder::CSSMaker do
  before :each do
    @settings = {
      :vars_path          => 'spec/fixtures/css/vars.scss',
      :toura_base_path    => 'spec/fixtures/css/toura.scss',
      :custom_base_path   => 'spec/fixtures/css/custom.scss',
      :load_paths         => [ 'spec/fixtures/css/load_path' ]
    }
  end

  it "should raise an error if no vars path or vars are provided" do
    @settings[:vars_path] = nil
    lambda {
      Builder::CSSMaker.new(@settings)
    }.should raise_error
  end

  it "should not raise an error if no vars path is provided but vars are provided" do
    @settings[:vars_path] = nil
    @settings[:vars] = {}
    lambda {
      Builder::CSSMaker.new(@settings)
    }.should_not raise_error
  end

  it "should raise an error if no toura base path is provided" do
    @settings.delete(:toura_base_path)
    lambda {
      Builder::CSSMaker.new(@settings)
    }.should raise_error
  end

  it "should not raise an error if no custom base path is provided" do
    @settings.delete(:custom_base_path)
    lambda {
      Builder::CSSMaker.new(@settings)
    }.should_not raise_error
  end

  it "should not throw an error if there is no file at the provided custom base path" do
    @settings[:custom_base_path] = 'fake'

    lambda {
      Builder::CSSMaker.new(@settings)
    }.should_not raise_error
  end

  it "should properly render the css" do
    css = Builder::CSSMaker.new(@settings).render

    # test that the toura css was loaded
    css.should match '#toura'

    # test that the vars css was loaded
    css.should match '#vars'

    # test that the custom css was loaded
    css.should match '#custom'

    # test that the custom file "wins"
    css.should match '#000003'

    #test that we loaded files from the provided load paths
    css.should match '#imported'
  end
end
