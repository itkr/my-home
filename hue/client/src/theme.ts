import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        // borderRadius: "8px",
      },
      sizes: {
        lg: {
          // fontSize: "lg",
          // height: "56px",
          // fontWeight: "bold",
          // lineHeight: "1.2",
        },
        md: {},
        sm: {},
      },
      variants: {
        outline: {
          // bg: "none",
          // color: "blue.500",
          // _hover: {
          //   color: "blue.500",
          // },
          // _active: {
          //   color: "blue.500",
          // },
          // _disabled: {
          //   color: "blue.500",
          // },
        },
        solid: {},
      },
      defaultProps: {
        colorScheme: "blue",
      },
    },
    Text: {
      variants: {
        header: {
          // fontStyle: "normal",
          // fontWeight: "500",
          // fontSize: "14px",
          // lineHeight: "32px",
          // color: "#FFFFFF",
        },
      },
    },
  },
  fonts: {
    // heading: `'Noto Sans', 'Noto Sans JP', 'Noto Serif'`,
    // body: `'Noto Sans', 'Noto Sans JP', 'Noto Serif'`,
  },
  styles: {
    global: {
      body: {
        bg: "blue.50",
      },
      h1: {
        // lineHeight: "1.3",
        // fontWeight: "bold",
        // fontSize: "26px",
        // textAlign: "center",
      },
      h2: {},
      h3: {},
      h4: {},
    },
  },
  colors: {},
});

export default theme;
