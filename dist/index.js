/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 806:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 517:
/***/ ((module) => {

module.exports = eval("require")("ssh2-sftp-client");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(806);
const fs = __nccwpck_require__(147);
const path = __nccwpck_require__(17);

let Client = __nccwpck_require__(517);
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
const additionalPaths = core.getInput('additionalPaths')

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
    await processPath(localPath, remotePath) //TODO: Instead of localPath, remotePath use key/value to uplaod multiple files at once.

    const parsedAdditionalPaths = (() => {
        try {
            const parsedAdditionalPaths = JSON.parse(additionalPaths)
            return Object.entries(parsedAdditionalPaths)
        }
        catch (e) {
            throw "Error parsing addtionalPaths. Make sure it is a valid JSON object (key/ value pairs)."
        }
    })()

    parsedAdditionalPaths.forEach(async ([local, remote]) => {
        await processPath(local, remote)
    })

}).then(() => {
    console.log("Upload finished.");
    return sftp.end();
}).catch(err => {
    core.setFailed(`Action failed with error ${err}`);
    process.exit(1);
});

async function processPath(local, remote) {
    console.log("Uploading: " + local + " to " + remote)
    if (fs.lstatSync(local).isDirectory()) {
        return sftp.uploadDir(local, remote);
    } else {

        var directory = await sftp.realPath(path.dirname(remote));
        if (!(await sftp.exists(directory))) {
            await sftp.mkdir(directory, true);
            console.log("Created directories.");
        }

        var modifiedPath = remote;
        if (await sftp.exists(remote)) {
            if ((await sftp.stat(remote)).isDirectory) {
                var modifiedPath = modifiedPath + path.basename(local);
            }
        }

        return sftp.put(fs.createReadStream(local), modifiedPath);
    }
}
})();

module.exports = __webpack_exports__;
/******/ })()
;