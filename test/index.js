/* eslint-env mocha */
import path from 'path';
import assert from 'assert';
import { transform } from 'babel-core';
import plugin, { mapToRelative } from '../src';

describe('Babel plugin module alias', () => {
    const transformerOpts = {
        plugins: [
            [plugin, {
                replaceFunc: './test/replace/replaceFunc.js',
                replaceHandlerName: 'replaceImport'
            }]
        ]
    };

    describe('should alias a known path', () => {
        describe('using a simple exposed name', () => {
            describe('when requiring the exact name', () => {
                it('with a require statement', () => {
                    const code = 'var utils = require("utils");';
                    const result = transform(code, transformerOpts);

                    assert.strictEqual(result.code, 'var utils = require("$ls");');
                });

                it('with an import statement', () => {
                    const code = 'import utils from "utils";';
                    const result = transform(code, transformerOpts);

                    assert.strictEqual(result.code, 'import utils from "$ls";');
                });
            });
        });
    });
});
