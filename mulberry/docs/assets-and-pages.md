# Creating Pages

The first step in creating a page is creating an entry for it in your
application's sitemap, located at `sitemap.yml`. This file lets you specify
the hierarchy of your application.

    - home
      - schedule
      - speakers
      - points-of-interest
    - about

Once you have created an entry in the sitemap, you need to create the page.
From inside your app directory, you can run the following command:

    mulberry create_page speakers

This creates a file for you at `pages/speakers.md`. If you open the file, you
can see that pages consist of a YAML header that provides metadata about the page, and
a body that provides the page's text content. Here is what the page file might
look like when you're done:

    ---
    title: Speakers
    template: Images
    images:
      - pamela-fox.png
      - alex-sexton.png
      - brendan-eich.png
      - alex-russell.png
      - nicholas-zakas.png
      - jed-schmidt.png
      - mike-taylor.png
      - douglas-crockford.png
      - rebecca-murphey.png
      - joe-mccann.png
      - ben-combee.png
      - mikeal-rogers.png
    ---

    CapitolJS is bringing together 12 of the top minds in the JS community to
    provide you with the most exciting presentations and discussions. Presentations
    will be geared toward every day application and use so you will leave CapitolJS
    ready to write amazing JS. They have been out in the field and seen the action
    and now they have come back to prepare you, agent, for the world of JS.

The only information that must be provided in the YAML header is the title for
the page. Pages will use a default template if one is not specified, and assets
are optional. The page body text is also optional, and not all page templates
will display it.

# Creating Assets

Each page in a Mulberry application can have assets attached to it. _Assets_ is a
broad term covering any kind of information that might be associated with a
page; when a page is displayed, the components used to display the page will
have access to all of the assets associated with the page.

Asset types fall into two categories, media assets and data assets:

### Media Asset Types
- Audio
- Image
- Video

### Data Asset Types
- Data
- Feed
- Location

## Adding Media Assets to a Page

When you scaffold a new app, a directory for each asset type is created in your
project's `assets` directory. To add a media asset to a page, first you must
create the asset in the proper directory. So, if you wanted to use a picture of
Alex Sexton on a page, you'd add the image file at
`assets/images/alex-sexton.png`.

Media assets should also have captions; these are stored in the `captions`
directory inside the directory for the asset type. So, to add a caption for the
file you just created, you would store a Markdown file at
`assets/images/captions/alex-sexton.md`. _Note that the caption filename
matches the image filename._

Once you have created a file and a caption for the asset, you can associate it
with any page in Mulberry. You do this by adding the information about the asset to
the page's YAML header:

    ---
    title: Speakers
    template: Images1
    images:
      - pamela-fox.png
      - alex-sexton.png
      - brendan-eich.png
      - alex-russell.png
      - nicholas-zakas.png
      - jed-schmidt.png
      - mike-taylor.png
      - douglas-crockford.png
      - rebecca-murphey.png
      - joe-mccann.png
      - ben-combee.png
      - mikeal-rogers.png
    ---

    CapitolJS is bringing together 12 of the top minds in the JS community to
    provide you with the most exciting presentations and discussions. Presentations
    will be geared toward every day application and use so you will leave CapitolJS
    ready to write amazing JS. They have been out in the field and seen the action
    and now they have come back to prepare you, agent, for the world of JS.

By default, the display name for media asset will be its filename, minus the
extension. This is probably not what you want. You can specify a display name
for a media asset by adding a YAML header to the caption file:

    ---
    name: Alex Sexton
    ---

    ## [Alex Sexton](http://alexsexton.com/)

    Alex Sexton is a Labs Engineer at Bazaarvoice in Austin, TX. He is the creator
    of yepnope.js and is a developer on the Modernizr core team. He is the current
    organizer of TXJS, a co-host on the yayQuery podcast as well as a volunteer
    bug-triager for the jQuery project. He has a passion for third party
    applications and application structure, so naturally he likes working on large
    third-party apps. He tweets at @slexaxton and blogs at http://alexsexton.com/

## Adding Data Assets to a Page

You can add data, feeds, and locations to a page much like you add media assets
to a page: simply specify the asset filename in the proper section of a page's
YAML header:

    ---
    title: News
    template: FeedList
    feeds:
      - cnn.yml
    ---

Mulberry provides helpers to create data assets. From your app directory, you can
run:

    mulberry create_data my-data           # creates assets/data/my-data.yml
    mulberry create_feed my-feed           # creates assets/feeds/my-feed.yml
    mulberry create_location my-location   # creates assets/locations/my-location.yml

These commands will create a stub file at the proper location, using the name
you specify. The contents of the stub files indicate the proper contents for
each type of data asset.
