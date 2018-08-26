// This file modified from @reach/router build script:
// https://github.com/reach/router/blob/master/build/babel-preset.js
// Copyright (c) 2018-present, Ryan Florence

const BABEL_ENV = process.env.BABEL_ENV;
const building = BABEL_ENV !== undefined && BABEL_ENV !== "cjs";

const plugins = [
  "transform-object-rest-spread",
  "transform-class-properties",
  "dev-expression",
  [
    "transform-react-remove-prop-types",
    {
      mode: "unsafe-wrap"
    }
  ],
  [
    "transform-inline-environment-variables",
    {
      include: ["COMPAT"]
    }
  ]
];

if (BABEL_ENV === "umd") {
  plugins.push("external-helpers");
}

module.exports = {
  presets: [
    [
      "env",
      {
        loose: true,
        modules: building ? false : "commonjs"
      }
    ],
    "react"
  ],
  plugins: plugins
};
