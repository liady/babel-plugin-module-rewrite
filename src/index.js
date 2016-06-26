import { resolve } from 'path';

function getReplaceFunc(replaceFuncPath) {
    return require(resolve(process.cwd(), replaceFuncPath));;
}

export function mapModule(source, file, state) {
    const opts = state.opts;
    const replaceContainer = getReplaceFunc(opts.replaceFunc);

    if(!replaceContainer){
        throw new Error('Cannot find replace function file: ' + opts.replaceFunc);
    }

    const replaceHandlerName = opts.replaceHandlerName || 'default';
    const replace = replaceContainer[replaceHandlerName] || replaceContainer;

    // If the result is not a function, throw
    if(!replace || typeof replace !== 'function') {
        throw new Error('Cannot find replace handler in: ' + opts.replaceFunc + " with name: " + replaceHandlerName);
    }

    const result = replace(source, file, opts);
    if(result !== source) {
        return result;    
    } else {
        return;
    }
    
}

export default ({ types: t }) => {
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
