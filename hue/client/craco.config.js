// const CracoLessPlugin = require('craco-less');
const path = require("path");
module.exports = {
  mode: process.env.REACT_APP_ENVIRONMENT,
  plugins: [
    // {
    //   plugin: CracoLessPlugin,
    //   options: {
    //     lessLoaderOptions: {
    //       lessOptions: {
    //         modifyVars: {},
    //         javascriptEnabled: true,
    //       },
    //     },
    //   },
    // },
  ],
  babel: {
    presets: [
      ["@babel/preset-react", { "runtime": "automatic" }]
    ],
    plugins: [],
  },
  output: {
    path: __dirname
  },
  webpack: {
    configure: {},
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  style: {
    postcss: {
      plugins: [],
    },
  },
}
