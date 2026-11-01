import { Schema, model } from 'mongoose';

const FrontendSchema = new Schema({
  logo: {
    type: String,
    required: true,
    default: 'EDUVANTA',
  },

  landingPage: {
    HeroSection: {
      homeBackgroundImage: {
        type: String,
        required: true,
      },

      homeTitle: {
        type: String,
        required: true,
      },

      homeParagraph: {
        type: String,
        required: true,
      },
    },
    AboutSection: {
      Heading_First: {
        type: String,
        required: true,
      },
      Heading_Second: {
        type: String,
        required: true,
      },

      paragraph_First: {
        type: String,
        required: true,
      },

      paragraph_Second: {
        type: String,
        required: true,
      },

      image_First: {
        type: String,
        required: true,
      },

      image_Second: {
        type: String,
        required: true,
      },

      image_Third: {
        type: String,
        required: true,
      },
    },

    Mission_and_Goals: [
      {
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },

  aboutPage: {
    AboutHero: {
      image: {
        type: String,
        require: true,
      },
      Heading: {
        type: String,
        require: true,
      },
      paragraph: {
        type: String,
        require: true,
      },
    },

    History: {
      title: {
        type: String,
        require: true,
      },

      paragraph_First: {
        type: String,
        required: true,
      },

      paragraph_Second: {
        type: String,
        required: true,
      },

      paragraph_Third: {
        type: String,
        required: true,
      },

      paragraph_Four: {
        type: String,
        required: true,
      },
    },

    Vision_and_Mission: {
      title: {
        type: String,
        require: true,
      },

      paragraph_First: {
        type: String,
        required: true,
      },

      paragraph_Second: {
        type: String,
        required: true,
      },

      paragraph_Third: {
        type: String,
        required: true,
      },

      paragraph_Four: {
        type: String,
        required: true,
      },
    },

    Description: {
      image: {
        type: String,
        required: true,
      },

      paragraph: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      room: {
        type: String,
        required: true,
      },
    },

    Facilities: [
      {
        title: {
          type: String,
          required: true,
        },

        Heading: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        Number: {
          type: String,
        },

        Price: {
          type: Number,
        },
      },
    ],
  },

  contactPage: {
    title: {
      type: String,
      required: true,
    },
    abort: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    Principal: {
      type: String,
      required: true,
    },
  },

  Login: {
    title: {
      type: String,
      required: true,
    },
    paragraph: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
  },

  Sign_Up: {
    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
  },
});

const Frontend = model('Frontend', FrontendSchema);
export default Frontend;
