import { resolve, dirname } from 'path';

function getReplaceFunc({ replaceFunc, replaceHandlerName = 'default', resolveFrom = 'process.cwd()'} = {}) {
    const replaceContainer = require(resolve(eval(resolveFrom), replaceFunc));

    if(!replaceContainer){
        throw new Error('Cannot find replace function file: ' + replaceFunc);
    }

    const replace = replaceContainer[replaceHandlerName] || replaceContainer;

    // If the result is not a function, throw
    if(!replace || typeof replace !== 'function') {
        throw new Error('Cannot find replace handler in: ' + replaceFunc + " with name: " + replaceHandlerName);
    }

    return replace;
}

export default ({ types: t }, a, b) => {
    let cachedReplaceFunction;

    function mapModule(source, file, state) {
        const opts = state.opts;
        if(!cachedReplaceFunction) {
            cachedReplaceFunction = getReplaceFunc(opts);
        }
        const replace = cachedReplaceFunction;
        const result = replace(source, file, opts);
        if(result !== source) {
            return result;    
        } else {
            return;
        }
    }

    function transformRequireCall(nodePath, state) {
        if (
            !t.isIdentifier(nodePath.node.callee, { name: 'require' }) &&
                !(
                    t.isMemberExpression(nodePath.node.callee) &&
                    t.isIdentifier(nodePath.node.callee.object, { name: 'require' })
                )
        ) {
            return;
        }

        const moduleArg = nodePath.node.arguments[0];
        if (moduleArg && moduleArg.type === 'StringLiteral') {
            const modulePath = mapModule(moduleArg.value, state.file.opts.filename, state);
            if (modulePath) {
                nodePath.replaceWith(t.callExpression(
                    nodePath.node.callee, [t.stringLiteral(modulePath)]
                ));
            }
        }
    }

    function transformImportCall(nodePath, state) {
        const moduleArg = nodePath.node.source;
        if (moduleArg && moduleArg.type === 'StringLiteral') {
            const modulePath = mapModule(moduleArg.value, state.file.opts.filename, state);
            if (modulePath) {
                nodePath.replaceWith(t.importDeclaration(
                    nodePath.node.specifiers,
                    t.stringLiteral(modulePath)
                ));
            }
        }
    }

    return {
        visitor: {
            CallExpression: {
                exit(nodePath, state) {
                    return transformRequireCall(nodePath, state);
                }
            },
            ImportDeclaration: {
                exit(nodePath, state) {
                    return transformImportCall(nodePath, state);
                }
            }
        }
    };
};
