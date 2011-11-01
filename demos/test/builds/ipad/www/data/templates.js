toura.templates = {
  "audio-with-images-phone": {
    "type": "node",
    "capabilities": [
      {
        "name": "ImageGallery_ImageCaption",
        "components": [
          "index:ImageGallery",
          "index:ImageCaption"
        ]
      },
      {
        "name": "ImageGalleryDetail",
        "components": [
          "index:ImageGallery",
          "detail:ZoomableImageGallery",
          "detail:DetailTitle"
        ]
      },
      {
        "name": "Page_Images",
        "components": [
          "index:ImageGallery",
          "index:ImageCaption"
        ]
      },
      {
        "name": "Page_Audios",
        "components": [
          "index:AudioList"
        ]
      },
      {
        "name": "AudioList_AudioPlayer",
        "components": [
          "index:AudioPlayer",
          "index:AudioList"
        ]
      },
      {
        "name": "AudioList_AudioCaption",
        "components": [
          "index:AudioList",
          "index:AudioCaption"
        ]
      }
    ],
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "components": [
              "ImageGallery"
            ]
          },
          {
            "size": "fixed",
            "components": [
              "AudioPlayer"
            ]
          },
          {
            "regions": [
              {
                "components": [
                  "AudioList",
                  "ChildNodes",
                  "AudioCaption",
                  "BodyText"
                ],
                "scrollable": true
              }
            ]
          }
        ]
      },
      {
        "name": "detail",
        "regions": [
          {
            "layout": "overlay",
            "size": "fixed",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ]
      }
    ]
  },
  "audio-with-images-tablet": {
    "type": "node",
    "capabilities": [
      {
        "name": "ImageGallery_ImageCaption",
        "components": [
          "index:ImageGallery",
          "index:ImageCaption"
        ]
      },
      {
        "name": "ImageGalleryDetail",
        "components": [
          "index:ImageGallery",
          "detail:ZoomableImageGallery",
          "detail:DetailTitle"
        ]
      },
      {
        "name": "Page_Images",
        "components": [
          "index:ImageGallery",
          "index:ImageCaption"
        ]
      },
      {
        "name": "Page_Audios",
        "components": [
          "index:AudioList"
        ]
      },
      {
        "name": "AudioList_AudioPlayer",
        "components": [
          "index:AudioPlayer",
          "index:AudioList"
        ]
      },
      {
        "name": "AudioList_AudioCaption",
        "components": [
          "index:AudioList",
          "index:AudioCaption"
        ]
      }
    ],
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "components": [
              "ImageGallery"
            ]
          },
          {
            "size": "fixed",
            "components": [
              "AudioPlayer"
            ]
          },
          {
            "containerType": "column",
            "regions": [
              {
                "components": [
                  "ChildNodes",
                  "AudioCaption",
                  "BodyText"
                ],
                "scrollable": true
              },
              {
                "components": [
                  "ImageCaption",
                  "AudioList"
                ],
                "scrollable": true
              }
            ]
          }
        ]
      },
      {
        "name": "detail",
        "regions": [
          {
            "layout": "overlay",
            "size": "fixed",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ]
      }
    ]
  },
  "default": {
    "type": "node",
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "scrollable": true,
            "components": [
              "PageHeaderImage",
              "BodyText",
              "ChildNodes"
            ]
          }
        ]
      }
    ]
  },
  "feed-item": {
    "type": "detail",
    "capabilities": [
      {
        "name": "PageNav_FeedTitle",
        "components": [
          "index:PageNav",
          "index:FeedItemDetail"
        ]
      }
    ],
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "components": [
              "FeedItemDetail"
            ],
            "scrollable": true
          }
        ]
      }
    ]
  },
  "feed-list-phone": {
    "type": "node",
    "capabilities": [
      {
        "name": "FeedItemList_FeedItemPage",
        "components": [
          "index:FeedItemList"
        ]
      }
    ],
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "scrollable": true,
            "components": [
              "PageHeaderImage",
              "FeedItemList"
            ]
          }
        ]
      }
    ]
  },
  "feed-list-tablet": {
    "type": "node",
    "capabilities": [
      {
        "name": "FeedItemList_FeedItemDetail",
        "components": [
          "index:FeedItemList",
          "index:FeedItemDetail"
        ]
      }
    ],
    "screens": [
      {
        "name": "index",
        "backgroundImage": false,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "regions": [
              {
                "size": "fixed",
                "backgroundImage": true,
                "scrollable": true,
                "components": [
                  "ColumnHeaderImage",
                  "FeedItemList"
                ]
              },
              {
                "scrollable": true,
                "components": [
                  "FeedItemDetail"
                ]
              }
            ],
            "containerType": "column"
          }
        ]
      }
    ]
  },
  "full-screen-images": {
    "type": "node",
    "capabilities": [
      {
        "name": "Page_FullScreenImages",
        "components": [
          "index:ZoomableImageGallery",
          "index:PageNav"
        ]
      }
    ],
    "screens": [
      {
        "name": "index",
        "regions": [
          {
            "layout": "overlay",
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ]
      }
    ]
  },
  "grid-view": {
    "type": "node",
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "size": "fixed",
            "components": [
              "PageHeaderImage"
            ]
          },
          {
            "scrollable": true,
            "components": [
              "BodyText",
              "ChildNodeGrid"
            ]
          }
        ]
      }
    ]
  },
  "home-phone": {
    "type": "node",
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "regions": [
              {
                "components": [

                ]
              },
              {
                "components": [
                  "BodyText",
                  "ChildNodes"
                ],
                "scrollable": true
              }
            ]
          },
          {
            "size": "fixed",
            "components": [
              "AppNav"
            ]
          }
        ]
      }
    ]
  },
  "home-tablet": {
    "type": "node",
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "regions": [
              {
                "components": [

                ]
              },
              {
                "regions": [
                  {
                    "components": [
                      "BodyText"
                    ],
                    "scrollable": true
                  },
                  {
                    "components": [
                      "ChildNodes"
                    ],
                    "scrollable": true
                  }
                ],
                "containerType": "column"
              }
            ]
          },
          {
            "size": "fixed",
            "components": [
              "AppNav"
            ]
          }
        ]
      }
    ]
  },
  "home-with-header-phone": {
    "type": "node",
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageHeaderImage"
            ]
          },
          {
            "scrollable": true,
            "components": [
              "BodyText",
              "ChildNodes"
            ]
          },
          {
            "size": "fixed",
            "components": [
              "AppNav"
            ]
          }
        ]
      }
    ]
  },
  "home-with-header-tablet": {
    "type": "node",
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageHeaderImage"
            ]
          },
          {
            "containerType": "column",
            "regions": [
              {
                "scrollable": true,
                "components": [
                  "BodyText"
                ]
              },
              {
                "scrollable": true,
                "components": [
                  "ChildNodes"
                ]
              }
            ]
          },
          {
            "size": "fixed",
            "components": [
              "AppNav"
            ]
          }
        ]
      }
    ]
  },
  "hotspots": {
    "type": "node",
    "screens": [
      {
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "components": [
              "Hotspots"
            ]
          }
        ]
      }
    ]
  },
  "images-and-text-phone": {
    "type": "node",
    "capabilities": [
      {
        "name": "ImageGallery_ImageCaption",
        "components": [
          "index:ImageGallery",
          "index:ImageCaption"
        ]
      },
      {
        "name": "ImageGalleryDetail",
        "components": [
          "index:ImageGallery",
          "detail:ZoomableImageGallery",
          "detail:DetailTitle"
        ]
      },
      {
        "name": "Page_Images",
        "components": [
          "index:ImageGallery",
          "index:ImageCaption"
        ]
      }
    ],
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "components": [
              "ImageGallery"
            ]
          },
          {
            "scrollable": true,
            "components": [
              "ChildNodes",
              "ImageCaption",
              "BodyText"
            ]
          }
        ]
      },
      {
        "name": "detail",
        "regions": [
          {
            "layout": "overlay",
            "size": "fixed",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ]
      }
    ]
  },
  "images-and-text-tablet": {
    "type": "node",
    "capabilities": [
      {
        "name": "ImageGallery_ImageCaption",
        "components": [
          "index:ImageGallery",
          "index:ImageCaption"
        ]
      },
      {
        "name": "ImageGalleryDetail",
        "components": [
          "index:ImageGallery",
          "detail:ZoomableImageGallery",
          "detail:DetailTitle"
        ]
      },
      {
        "name": "Page_Images",
        "components": [
          "index:ImageGallery",
          "index:ImageCaption"
        ]
      }
    ],
    "screens": [
      {
        "name": "index",
        "backgroundImage": true,
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "components": [
              "ImageGallery"
            ]
          },
          {
            "containerType": "column",
            "regions": [
              {
                "components": [
                  "ChildNodes",
                  "BodyText"
                ],
                "scrollable": true
              },
              {
                "components": [
                  "ImageCaption"
                ],
                "scrollable": true
              }
            ]
          }
        ]
      },
      {
        "name": "detail",
        "regions": [
          {
            "layout": "overlay",
            "size": "fixed",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ]
      }
    ]
  },
  "location-list": {
    "type": "node",
    "capabilities": [
      {
        "name": "ImageGalleryDetail",
        "components": [
          "index:ImageGallery",
          "detail:ZoomableImageGallery",
          "detail:DetailTitle"
        ]
      }
    ],
    "screens": [
      {
        "name": "index",
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "scrollable": true,
            "components": [
              "NodeTitleBanner",
              "ImageGallery",
              "BodyText",
              "LocationList"
            ]
          }
        ]
      },
      {
        "name": "detail",
        "regions": [
          {
            "layout": "overlay",
            "size": "fixed",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ]
      }
    ]
  },
  "node-gallery": {
    "type": "node",
    "screens": [
      {
        "name": "index",
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ]
          },
          {
            "size": "fixed",
            "components": [
              "DropDownText"
            ]
          },
          {
            "components": [
              "NodeGallery"
            ]
          }
        ]
      }
    ]
  }
};