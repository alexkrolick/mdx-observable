// This file modified from @reach/router build script:
// https://github.com/reach/router/blob/master/build/build.js
// Copyright (c) 2018-present, Ryan Florence

const fs = require("fs");
const execSync = require("child_process").execSync;
const prettyBytes = require("pretty-bytes");
const gzipSize = require("gzip-size");

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: "inherit",
    env: Object.assign({}, process.env, extraEnv)
  });

console.log("\nBuilding ES modules ...");
exec("babel src -d es --ignore *.test.js", {
  BABEL_ENV: "es"
});

console.log("Building CommonJS modules ...");
exec("babel src -d . --ignore *.test.js", {
  BABEL_ENV: "cjs"
});

console.log("\nBuilding UMD ...");
exec("rollup -c -f umd -o umd/mdx-observable.js", {
  BABEL_ENV: "umd",
  NODE_ENV: "development"
});

console.log("\nBuilding UMD min.js ...");
exec("rollup -c -f umd -o umd/mdx-observable.min.js", {
  BABEL_ENV: "umd",
  NODE_ENV: "production"
});

const size = gzipSize.sync(fs.readFileSync("umd/mdx-observable.min.js"));
console.log("\ngzipped, the UMD build is %s", prettyBytes(size));
