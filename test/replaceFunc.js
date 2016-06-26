export default function replaceImport(original, fileName) {
        var key = '.';
        var result = original;
        Object.keys(appsMap).forEach(function(appKey){
            if(fileName.replace(/\\/g, '/').indexOf(appsMap[appKey]) !== -1){
                key = appKey;
            }
        })
        // replace ~ to 'app/components'
        result = result.replace(/^\~\//, 'app/components/');
        result = result.replace(/app\//, key + '/');

        return result;
}

// TODO Build it dynamically
 var appsMap = {
    'designEditor': 'designEditor/src',
    'contentEditor': 'contentEditor/src',
    'shell': 'shell/src'
}
