const { spawn } = require('child_process');
const xml2js = require('xml2js');
const parser = require('xml2json');
const sp = spawn('system_profiler', ['-xml', 'SPApplicationsDataType']);
const jp = require('jsonpath');

let apps = "";
sp.stdout.setEncoding('utf-8');
sp.stdout.on('data', (data) => {
    console.log("DATA------------");
    apps += data;
    console.log("DATA------------");
});

sp.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});

sp.on('close', (code) => {
    let result = parser.toJson(apps, { object: true });
    jp
        .query(result, 'plist.array.dict.array[1].dict')
        .map((res) => {
            res.forEach((r) => {
                let name = r.string[0];
                let path = r.string[3];
                console.log(r.string);
            })
        })
});