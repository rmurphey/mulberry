require 'cli/assets/image'

module Mulberry
  module Asset
    class HeaderImage < Mulberry::Asset::Image
      public
      def reference
        { '_reference' => id }
      end
    end
  end
end
