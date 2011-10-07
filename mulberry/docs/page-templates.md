# Page Templates

Each page in a Mulberry application is displayed using a page template. You can use
built-in templates, or create your own. To specify a template for a page, add a
template property to the page's YAML header:

    ---
    title: My Home Page
    template: Home
    ---

    My page's content is amazing.

You may want to consider creating different page templates for different device
types. You can indicate that a page should use different templates for
different device types by specifying a template object in a page's YAML header,
rather than a template string:

    ---
    title: My Page
    template:
      phone: ImageGalleryPhone
      tablet: ImageGalleryTablet
    ---

    My page's content is amazing.

If you specify a template that does not exist, the page will not be
displayed in your app. If you do not specify a template, then the built-in
`Default` template will be used.

## Built-In Page Templates

Mulberry comes with several built-in page templates. Any of these templates can be
specified as the template for a page in the page file's YAML header.

### Audios

Displays audios associated with a page; selecting an audio plays
the audio in an audio player. If an audio has an associated caption, it will
be displayed when the audio is selected. Also displays the page text and
links to subpages, if any.

### Default

Displays the page text, a page header image (if specified), and
links to subpages, if any.

### GridView

Displays the page text and a grid of links to subpages; a featured image
should specified in order to be displayed in the grid.

### Home

Displays the page text and links to subpages. Also includes an
application-level navigation component, which links to the Search, About, and
Favorites pages.

### Images

Displays the images associated with a page in a swipeable image gallery;
selecting an image in the image gallery opens a larger view of the image,
which can be panned and zoomed. If an image has a caption, it will be
displayed when the associated image is displayed. This template also displays
the page text and links to subpages, if any.

### FullScreenImages

Displays the images associated with a page in a full-screen view. If an image
has a caption, it will be displayed when the associated image is displayed.

### LocationsMap

Displays the locations associated with a page on a map.

### LocationsList

Displays the locations associated with a page in a list. If
the page also has images associated with it, they will be displayed in a
gallery above the list of locations; selecting an image in the gallery will
display the image in a full-screen view.

### Videos

Displays videos associated with a page; selecting a video from the
list of videos plays the video in a video player. If a video has an
associated caption, the caption will be displayed when the audio is selected.
Also displays the page text and links to subpages, if any.

## Creating Your Own Page Templates

You can specify your own page templates using a simple YAML structure. Your
templates can use Mulberry's built-in components and capabilities, or you can create
your own custom components and capabilities.

Mulberry can create the YAML skeleton for a new template for you:

    mulberry create_template ImageGallery

This will create a file `ImageGallery.yml` in your project's templates
directory.

A template consists of one or more screens; each screen contains one or more
regions; and each region contains one or more components. Regions can also
contain other regions, allowing for complex layouts. Templates can also specify
interactions between components via "capabilities."

Here's an example of a simple template that uses built-in components:

    BasicPageTemplate:
      screens:
        - name: index
          regions:
            -
              size: fixed
              scrollable: false
              components:
                - PageNav
            -
              size: flex
              scrollable: true
              components:
                - PageHeaderImage
                - BodyText

TODOC: subregions

TODOC: capabilities

TODOC: multiple screens

TODOC: region properties (scrollable, size, etc.)
