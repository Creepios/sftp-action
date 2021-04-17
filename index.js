const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

let Client = require('ssh2-sftp-client');
let sftp = new Client();

const host = core.getInput('host');
const port = parseInt(core.getInput('port'));
const username = core.getInput('username');
const password = core.getInput('password');
const agent = core.getInput('agent');
const privateKeyIsFile = core.getInput('privateKeyIsFile');
const passphrase = core.getInput('passphrase');

var privateKey = core.getInput('privateKey');

core.setSecret(password);
if (passphrase != undefined) {
    core.setSecret(passphrase);
}

if (privateKeyIsFile == "true") {
    var privateKey = fs.readFileSync(privateKey);
    core.setSecret(privateKey);
}

const localPath = core.getInput('localPath');
const remotePath = core.getInput('remotePath');

sftp.connect({
    host: host,
    port: port,
    username: username,
    password: password,
    agent: agent,
    privateKey: privateKey,
    passphrase: passphrase
}).then(async () => {
    console.log("Connection established.");
    console.log("Current working directory: " + await sftp.cwd())

    if (fs.lstatSync(localPath).isDirectory()) {
        return sftp.uploadDir(localPath, remotePath);
    } else {

        var directory = await sftp.realPath(path.dirname(remotePath));
        if (!(await sftp.exists(directory))) {
            await sftp.mkdir(directory, true);
            console.log("Created directories.");
        }
        
        var modifiedPath = remotePath;
        if (await sftp.exists(remotePath)) {
            if ((await sftp.stat(remotePath)).isDirectory) {
                var modifiedPath = modifiedPath + path.basename(localPath);
            }
        }

        return sftp.put(fs.createReadStream(localPath), modifiedPath);
    }

}).then(() => {
    console.log("Upload finished.");
    return sftp.end();
}).catch(err => {
    core.setFailed(`Action failed with error ${err}`);
    process.exit(1);
});
