toura.templates = {
  "home-phone": {
    "type": "node",
    "screens": [
      {
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
        ],
        "name": "index",
        "backgroundImage": true
      }
    ]
  },
  "audio-with-images-phone": {
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
        ],
        "name": "index",
        "backgroundImage": true
      },
      {
        "regions": [
          {
            "size": "fixed",
            "layout": "overlay",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ],
        "name": "detail"
      }
    ]
  },
  "location-list": {
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
              "NodeTitleBanner",
              "ImageGallery",
              "BodyText",
              "LocationList"
            ],
            "scrollable": true
          }
        ],
        "name": "index"
      },
      {
        "regions": [
          {
            "size": "fixed",
            "layout": "overlay",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ],
        "name": "detail"
      }
    ]
  },
  "home-with-header-tablet": {
    "type": "node",
    "screens": [
      {
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageHeaderImage"
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
          },
          {
            "size": "fixed",
            "components": [
              "AppNav"
            ]
          }
        ],
        "name": "index",
        "backgroundImage": true
      }
    ]
  },
  "audio-with-images-tablet": {
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
            ],
            "containerType": "column"
          }
        ],
        "name": "index",
        "backgroundImage": true
      },
      {
        "regions": [
          {
            "size": "fixed",
            "layout": "overlay",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ],
        "name": "detail"
      }
    ]
  },
  "grid-view": {
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
            "size": "fixed",
            "components": [
              "HeaderImage"
            ]
          },
          {
            "components": [
              "BodyText",
              "ChildNodeGrid"
            ],
            "scrollable": true
          }
        ],
        "name": "index",
        "backgroundImage": true
      }
    ]
  },
  "default": {
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
              "PageHeaderImage",
              "BodyText",
              "ChildNodes"
            ],
            "scrollable": true
          }
        ],
        "name": "index",
        "backgroundImage": true
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
              "ImageGallery"
            ]
          },
          {
            "components": [
              "ChildNodes",
              "ImageCaption",
              "BodyText"
            ],
            "scrollable": true
          }
        ],
        "name": "index",
        "backgroundImage": true
      },
      {
        "regions": [
          {
            "size": "fixed",
            "layout": "overlay",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ],
        "name": "detail"
      }
    ]
  },
  "feed-list-phone": {
    "capabilities": [
      {
        "name": "FeedItemList_FeedItemPage",
        "components": [
          "index:FeedItemList"
        ]
      }
    ],
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
              "PageHeaderImage",
              "FeedItemList"
            ],
            "scrollable": true
          }
        ],
        "name": "index",
        "backgroundImage": true
      }
    ]
  },
  "feed-item": {
    "capabilities": [
      {
        "name": "PageNav_FeedTitle",
        "components": [
          "index:PageNav",
          "index:FeedItemDetail"
        ]
      }
    ],
    "type": "detail",
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
              "FeedItemDetail"
            ],
            "scrollable": true
          }
        ],
        "name": "index",
        "backgroundImage": true
      }
    ]
  },
  "AudioListPage": {
    "screens": [
      {
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ],
            "scrollable": false
          },
          {
            "size": "flex",
            "components": [
              "AudioList"
            ],
            "scrollable": true
          },
          {
            "size": "flex",
            "components": [
              "BodyText"
            ],
            "scrollable": true
          }
        ],
        "name": "index"
      }
    ]
  },
  "images-and-text-tablet": {
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
              "ImageGallery"
            ]
          },
          {
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
            ],
            "containerType": "column"
          }
        ],
        "name": "index",
        "backgroundImage": true
      },
      {
        "regions": [
          {
            "size": "fixed",
            "layout": "overlay",
            "components": [
              "DetailTitle"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ],
        "name": "detail"
      }
    ]
  },
  "full-screen-images": {
    "capabilities": [
      {
        "name": "Page_FullScreenImages",
        "components": [
          "index:ZoomableImageGallery",
          "index:PageNav"
        ]
      }
    ],
    "type": "node",
    "screens": [
      {
        "regions": [
          {
            "size": "fixed",
            "layout": "overlay",
            "components": [
              "PageNav"
            ]
          },
          {
            "components": [
              "ZoomableImageGallery"
            ]
          }
        ],
        "name": "index"
      }
    ]
  },
  "ImageGalleryPage": {
    "screens": [
      {
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageNav"
            ],
            "scrollable": false
          },
          {
            "size": "flex",
            "components": [
              "ImageGallery"
            ],
            "scrollable": false
          },
          {
            "size": "flex",
            "components": [
              "BodyText"
            ],
            "scrollable": true
          }
        ],
        "name": "index"
      }
    ]
  },
  "node-gallery": {
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
        ],
        "name": "index"
      }
    ]
  },
  "home-with-header-phone": {
    "type": "node",
    "screens": [
      {
        "regions": [
          {
            "size": "fixed",
            "components": [
              "PageHeaderImage"
            ]
          },
          {
            "components": [
              "BodyText",
              "ChildNodes"
            ],
            "scrollable": true
          },
          {
            "size": "fixed",
            "components": [
              "AppNav"
            ]
          }
        ],
        "name": "index",
        "backgroundImage": true
      }
    ]
  },
  "home-tablet": {
    "type": "node",
    "screens": [
      {
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
        ],
        "name": "index",
        "backgroundImage": true
      }
    ]
  },
  "feed-list-tablet": {
    "capabilities": [
      {
        "name": "FeedItemList_FeedItemDetail",
        "components": [
          "index:FeedItemList",
          "index:FeedItemDetail"
        ]
      }
    ],
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
            "regions": [
              {
                "size": "fixed",
                "components": [
                  "ColumnHeaderImage",
                  "FeedItemList"
                ],
                "backgroundImage": true,
                "scrollable": true
              },
              {
                "components": [
                  "FeedItemDetail"
                ],
                "scrollable": true
              }
            ],
            "containerType": "column"
          }
        ],
        "name": "index",
        "backgroundImage": false
      }
    ]
  }
};