require 'rubygems'
require 'kramdown'

module Mulberry
  module Asset
    class Text
      ASSET_TYPE    = 'text-asset'

      def initialize(content, name)
        parsed_content = parse content

        @name = parsed_content[:name] || name
        @content = Kramdown::Document.new(
          parsed_content[:content].strip
        ).to_html.chomp
      end

      public
      def reference
        { '_reference' => id }
      end

      def item
        {
          :id         =>  id,
          :type       =>  ASSET_TYPE,
          :name       =>  @name,
          :body       =>  @content,
          :contexts   =>  []
        }
      end

      def id
        "#{ASSET_TYPE}-#{@name}"
      end

      private
      def parse(content)
        first_line = content.split("\n").first

        if first_line && first_line.match('---')
          pieces = content.split('---').delete_if { |piece| piece.empty? }
          frontmatter = pieces.first
          content = pieces.last

          data = YAML.load(frontmatter)

          {
            :content => content,
            :name => data['name']
          }
        else
          { :content => content }
        end
      end
    end
  end
end
