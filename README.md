# babel-plugin-module-rewrite
[![Version](https://img.shields.io/npm/v/babel-plugin-module-rewrite.svg)](https://www.npmjs.org/package/babel-plugin-module-rewrite)
[![Build Status](https://travis-ci.org/liady/babel-plugin-module-rewrite.svg?branch=master)](https://travis-ci.org/liady/babel-plugin-module-rewrite)

A [babel](http://babeljs.io) plugin to rewrite module imports (and `require`) using a custom function

## Description

You can supply a replace function to dynamically replace module paths when Babel traverses them.

## Usage

Install the plugin

```
$ npm install --save-dev babel babel-plugin-module-rewrite
```

Specify the plugin in your `.babelrc` with the file that exports the replace function.
```json
{
  "plugins": [
    ["module-rewrite", { "replaceFunc": "./utils/replace-module-paths.js" }]
  ]
}
```

Let's say you want `~/moduleFile` to be replaced to `utils/moduleFile` if the calling file is in `utils`, and `common/moduleFile` otherwise.
So in your `replace-module-paths.js`, just export:
```js
export default function replaceImport(originalPath, callingFileName, options) {
    if(callingFileName.indexOf('/utils/') !== -1) {
        return originalPath.replace('~', 'utils');
    } else {
        return originalPath. replace('~', 'common');
    }
}
```

## License

MIT
