require 'kramdown'

module Mulberry
  module Asset
    class Text
      ASSET_TYPE    = 'text-asset'

      def initialize(content = nil, name = nil)
        parsed_content = parse content

        self.content = parsed_content[:content].strip
        self.name = parsed_content[:name] || name
      end

      def content=(content)
        return unless content
        @content = Kramdown::Document.new(content).to_html.chomp
      end

      def name=(name)
        return unless name
        @name = name
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
        if content.nil?
          return {
            :content => '',
            :name => nil
          }
        end

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
