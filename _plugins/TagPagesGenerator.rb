module Jekyll
    class TagPageGenerator < Generator
      safe true

      def generate(site)
        if site.layouts.key? 'tag'
          dir = site.config['tag_dir'] || 'tags'
          site.tags.each_key do |tag|
            site.pages << TagPage.new(site, site.source, File.join(dir, tag), tag)
          end
        end
      end
    end

    # A Page subclass used in the `TagPageGenerator`
    class TagPage < Page
      def initialize(site, base, dir, tag)
        @site = site
        @base = base
        @dir  = dir
        @name = 'index.html'

        self.process(@name)
        self.read_yaml(File.join(base, '_layouts'), 'tag.html')
        self.data['tag'] = tag

        tag_title_prefix = site.config['tag_title_prefix'] || 'Tag: '
        self.data['title'] = "#{tag_title_prefix}#{tag}"
      end
    end
  end
