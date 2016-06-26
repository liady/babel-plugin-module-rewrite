# babel-plugin-module-alias [![Version](https://img.shields.io/npm/v/babel-plugin-module-alias.svg)](https://www.npmjs.org/package/babel-plugin-module-alias)

A [babel](http://babeljs.io) plugin to rewrite module imports (and `require`) using a custom function

## Description

You can supply a replace function to dynamically replace module paths when Babel traverses them.

## Usage

Install the plugin

```
$ npm install --save babel babel-plugin-module-rewrite
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

MIT, see [LICENSE.md](/LICENSE.md) for details.


[ci-image]: https://circleci.com/gh/tleunen/babel-plugin-module-alias.svg?style=shield
[ci-url]: https://circleci.com/gh/tleunen/babel-plugin-module-alias
[coverage-image]: https://codecov.io/gh/tleunen/babel-plugin-module-alias/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/tleunen/babel-plugin-module-alias
[resolver-module-alias]: https://github.com/tleunen/eslint-import-resolver-babel-module-alias
[eslint-plugin-import]: https://github.com/benmosher/eslint-plugin-import
