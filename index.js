const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

let Client = require('ssh2-sftp-client');
let sftp = new Client();

const host = core.getInput('host');
const port = parseInt(core.getInput('port'));
const username = core.getInput('username');
const password = core.getInput('password');
const agent = core.getInput('agent');
var privateKey = core.getInput('privateKey');
const privateKeyIsFile = core.getInput('privateKeyIsFile');
const passphrase = core.getInput('passphrase');

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
}).then(() => {
    return sftp.put(localPath, remotePath);
}).then(() => {
    return sftp.end();
}).catch(err => {
    core.setFailed(`Action failed with error ${err}`);
});
