import babel from "rollup-plugin-babel";
import istanbul from "rollup-plugin-istanbul";

let pkg = require("./package.json");

let plugins = [
  babel({
    exclude: "node_modules/**",
    plugins: ["external-helpers"]
  })
];

if (process.env.BUILD !== "production") {
  plugins.push(
    istanbul({
      exclude: ["test/**/*", "node_modules/**/*", "lib/**/*"]
    })
  );
}

export default {
  input: "lib/index.js",
  plugins: plugins,
  external: ["isomorphic-fetch", "regenerator-runtime/runtime"],
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "printers-qt",
      globals: {
        "node-fetch": "fetch"
      },
      sourceMap: true
    },
    {
      file: pkg.module,
      format: "es",
      globals: {
        "node-fetch": "fetch"
      },
      sourceMap: true
    }
  ]
};
