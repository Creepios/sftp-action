/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9925);
const auth_1 = __nccwpck_require__(3702);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3702:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 9348:
/***/ ((module) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


module.exports = {

  newInvalidAsn1Error: function (msg) {
    var e = new Error();
    e.name = 'InvalidAsn1Error';
    e.message = msg || '';
    return e;
  }

};


/***/ }),

/***/ 194:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var errors = __nccwpck_require__(9348);
var types = __nccwpck_require__(2473);

var Reader = __nccwpck_require__(290);
var Writer = __nccwpck_require__(3200);


// --- Exports

module.exports = {

  Reader: Reader,

  Writer: Writer

};

for (var t in types) {
  if (types.hasOwnProperty(t))
    module.exports[t] = types[t];
}
for (var e in errors) {
  if (errors.hasOwnProperty(e))
    module.exports[e] = errors[e];
}


/***/ }),

/***/ 290:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var assert = __nccwpck_require__(2357);
var Buffer = __nccwpck_require__(5118).Buffer;

var ASN1 = __nccwpck_require__(2473);
var errors = __nccwpck_require__(9348);


// --- Globals

var newInvalidAsn1Error = errors.newInvalidAsn1Error;



// --- API

function Reader(data) {
  if (!data || !Buffer.isBuffer(data))
    throw new TypeError('data must be a node Buffer');

  this._buf = data;
  this._size = data.length;

  // These hold the "current" state
  this._len = 0;
  this._offset = 0;
}

Object.defineProperty(Reader.prototype, 'length', {
  enumerable: true,
  get: function () { return (this._len); }
});

Object.defineProperty(Reader.prototype, 'offset', {
  enumerable: true,
  get: function () { return (this._offset); }
});

Object.defineProperty(Reader.prototype, 'remain', {
  get: function () { return (this._size - this._offset); }
});

Object.defineProperty(Reader.prototype, 'buffer', {
  get: function () { return (this._buf.slice(this._offset)); }
});


/**
 * Reads a single byte and advances offset; you can pass in `true` to make this
 * a "peek" operation (i.e., get the byte, but don't advance the offset).
 *
 * @param {Boolean} peek true means don't move offset.
 * @return {Number} the next byte, null if not enough data.
 */
Reader.prototype.readByte = function (peek) {
  if (this._size - this._offset < 1)
    return null;

  var b = this._buf[this._offset] & 0xff;

  if (!peek)
    this._offset += 1;

  return b;
};


Reader.prototype.peek = function () {
  return this.readByte(true);
};


/**
 * Reads a (potentially) variable length off the BER buffer.  This call is
 * not really meant to be called directly, as callers have to manipulate
 * the internal buffer afterwards.
 *
 * As a result of this call, you can call `Reader.length`, until the
 * next thing called that does a readLength.
 *
 * @return {Number} the amount of offset to advance the buffer.
 * @throws {InvalidAsn1Error} on bad ASN.1
 */
Reader.prototype.readLength = function (offset) {
  if (offset === undefined)
    offset = this._offset;

  if (offset >= this._size)
    return null;

  var lenB = this._buf[offset++] & 0xff;
  if (lenB === null)
    return null;

  if ((lenB & 0x80) === 0x80) {
    lenB &= 0x7f;

    if (lenB === 0)
      throw newInvalidAsn1Error('Indefinite length not supported');

    if (lenB > 4)
      throw newInvalidAsn1Error('encoding too long');

    if (this._size - offset < lenB)
      return null;

    this._len = 0;
    for (var i = 0; i < lenB; i++)
      this._len = (this._len << 8) + (this._buf[offset++] & 0xff);

  } else {
    // Wasn't a variable length
    this._len = lenB;
  }

  return offset;
};


/**
 * Parses the next sequence in this BER buffer.
 *
 * To get the length of the sequence, call `Reader.length`.
 *
 * @return {Number} the sequence's tag.
 */
Reader.prototype.readSequence = function (tag) {
  var seq = this.peek();
  if (seq === null)
    return null;
  if (tag !== undefined && tag !== seq)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + seq.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`
  if (o === null)
    return null;

  this._offset = o;
  return seq;
};


Reader.prototype.readInt = function () {
  return this._readTag(ASN1.Integer);
};


Reader.prototype.readBoolean = function () {
  return (this._readTag(ASN1.Boolean) === 0 ? false : true);
};


Reader.prototype.readEnumeration = function () {
  return this._readTag(ASN1.Enumeration);
};


Reader.prototype.readString = function (tag, retbuf) {
  if (!tag)
    tag = ASN1.OctetString;

  var b = this.peek();
  if (b === null)
    return null;

  if (b !== tag)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + b.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`

  if (o === null)
    return null;

  if (this.length > this._size - o)
    return null;

  this._offset = o;

  if (this.length === 0)
    return retbuf ? Buffer.alloc(0) : '';

  var str = this._buf.slice(this._offset, this._offset + this.length);
  this._offset += this.length;

  return retbuf ? str : str.toString('utf8');
};

Reader.prototype.readOID = function (tag) {
  if (!tag)
    tag = ASN1.OID;

  var b = this.readString(tag, true);
  if (b === null)
    return null;

  var values = [];
  var value = 0;

  for (var i = 0; i < b.length; i++) {
    var byte = b[i] & 0xff;

    value <<= 7;
    value += byte & 0x7f;
    if ((byte & 0x80) === 0) {
      values.push(value);
      value = 0;
    }
  }

  value = values.shift();
  values.unshift(value % 40);
  values.unshift((value / 40) >> 0);

  return values.join('.');
};


Reader.prototype._readTag = function (tag) {
  assert.ok(tag !== undefined);

  var b = this.peek();

  if (b === null)
    return null;

  if (b !== tag)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + b.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`
  if (o === null)
    return null;

  if (this.length > 4)
    throw newInvalidAsn1Error('Integer too long: ' + this.length);

  if (this.length > this._size - o)
    return null;
  this._offset = o;

  var fb = this._buf[this._offset];
  var value = 0;

  for (var i = 0; i < this.length; i++) {
    value <<= 8;
    value |= (this._buf[this._offset++] & 0xff);
  }

  if ((fb & 0x80) === 0x80 && i !== 4)
    value -= (1 << (i * 8));

  return value >> 0;
};



// --- Exported API

module.exports = Reader;


/***/ }),

/***/ 2473:
/***/ ((module) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


module.exports = {
  EOC: 0,
  Boolean: 1,
  Integer: 2,
  BitString: 3,
  OctetString: 4,
  Null: 5,
  OID: 6,
  ObjectDescriptor: 7,
  External: 8,
  Real: 9, // float
  Enumeration: 10,
  PDV: 11,
  Utf8String: 12,
  RelativeOID: 13,
  Sequence: 16,
  Set: 17,
  NumericString: 18,
  PrintableString: 19,
  T61String: 20,
  VideotexString: 21,
  IA5String: 22,
  UTCTime: 23,
  GeneralizedTime: 24,
  GraphicString: 25,
  VisibleString: 26,
  GeneralString: 28,
  UniversalString: 29,
  CharacterString: 30,
  BMPString: 31,
  Constructor: 32,
  Context: 128
};


/***/ }),

/***/ 3200:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var assert = __nccwpck_require__(2357);
var Buffer = __nccwpck_require__(5118).Buffer;
var ASN1 = __nccwpck_require__(2473);
var errors = __nccwpck_require__(9348);


// --- Globals

var newInvalidAsn1Error = errors.newInvalidAsn1Error;

var DEFAULT_OPTS = {
  size: 1024,
  growthFactor: 8
};


// --- Helpers

function merge(from, to) {
  assert.ok(from);
  assert.equal(typeof (from), 'object');
  assert.ok(to);
  assert.equal(typeof (to), 'object');

  var keys = Object.getOwnPropertyNames(from);
  keys.forEach(function (key) {
    if (to[key])
      return;

    var value = Object.getOwnPropertyDescriptor(from, key);
    Object.defineProperty(to, key, value);
  });

  return to;
}



// --- API

function Writer(options) {
  options = merge(DEFAULT_OPTS, options || {});

  this._buf = Buffer.alloc(options.size || 1024);
  this._size = this._buf.length;
  this._offset = 0;
  this._options = options;

  // A list of offsets in the buffer where we need to insert
  // sequence tag/len pairs.
  this._seq = [];
}

Object.defineProperty(Writer.prototype, 'buffer', {
  get: function () {
    if (this._seq.length)
      throw newInvalidAsn1Error(this._seq.length + ' unended sequence(s)');

    return (this._buf.slice(0, this._offset));
  }
});

Writer.prototype.writeByte = function (b) {
  if (typeof (b) !== 'number')
    throw new TypeError('argument must be a Number');

  this._ensure(1);
  this._buf[this._offset++] = b;
};


Writer.prototype.writeInt = function (i, tag) {
  if (typeof (i) !== 'number')
    throw new TypeError('argument must be a Number');
  if (typeof (tag) !== 'number')
    tag = ASN1.Integer;

  var sz = 4;

  while ((((i & 0xff800000) === 0) || ((i & 0xff800000) === 0xff800000 >> 0)) &&
        (sz > 1)) {
    sz--;
    i <<= 8;
  }

  if (sz > 4)
    throw newInvalidAsn1Error('BER ints cannot be > 0xffffffff');

  this._ensure(2 + sz);
  this._buf[this._offset++] = tag;
  this._buf[this._offset++] = sz;

  while (sz-- > 0) {
    this._buf[this._offset++] = ((i & 0xff000000) >>> 24);
    i <<= 8;
  }

};


Writer.prototype.writeNull = function () {
  this.writeByte(ASN1.Null);
  this.writeByte(0x00);
};


Writer.prototype.writeEnumeration = function (i, tag) {
  if (typeof (i) !== 'number')
    throw new TypeError('argument must be a Number');
  if (typeof (tag) !== 'number')
    tag = ASN1.Enumeration;

  return this.writeInt(i, tag);
};


Writer.prototype.writeBoolean = function (b, tag) {
  if (typeof (b) !== 'boolean')
    throw new TypeError('argument must be a Boolean');
  if (typeof (tag) !== 'number')
    tag = ASN1.Boolean;

  this._ensure(3);
  this._buf[this._offset++] = tag;
  this._buf[this._offset++] = 0x01;
  this._buf[this._offset++] = b ? 0xff : 0x00;
};


Writer.prototype.writeString = function (s, tag) {
  if (typeof (s) !== 'string')
    throw new TypeError('argument must be a string (was: ' + typeof (s) + ')');
  if (typeof (tag) !== 'number')
    tag = ASN1.OctetString;

  var len = Buffer.byteLength(s);
  this.writeByte(tag);
  this.writeLength(len);
  if (len) {
    this._ensure(len);
    this._buf.write(s, this._offset);
    this._offset += len;
  }
};


Writer.prototype.writeBuffer = function (buf, tag) {
  if (typeof (tag) !== 'number')
    throw new TypeError('tag must be a number');
  if (!Buffer.isBuffer(buf))
    throw new TypeError('argument must be a buffer');

  this.writeByte(tag);
  this.writeLength(buf.length);
  this._ensure(buf.length);
  buf.copy(this._buf, this._offset, 0, buf.length);
  this._offset += buf.length;
};


Writer.prototype.writeStringArray = function (strings) {
  if ((!strings instanceof Array))
    throw new TypeError('argument must be an Array[String]');

  var self = this;
  strings.forEach(function (s) {
    self.writeString(s);
  });
};

// This is really to solve DER cases, but whatever for now
Writer.prototype.writeOID = function (s, tag) {
  if (typeof (s) !== 'string')
    throw new TypeError('argument must be a string');
  if (typeof (tag) !== 'number')
    tag = ASN1.OID;

  if (!/^([0-9]+\.){3,}[0-9]+$/.test(s))
    throw new Error('argument is not a valid OID string');

  function encodeOctet(bytes, octet) {
    if (octet < 128) {
        bytes.push(octet);
    } else if (octet < 16384) {
        bytes.push((octet >>> 7) | 0x80);
        bytes.push(octet & 0x7F);
    } else if (octet < 2097152) {
      bytes.push((octet >>> 14) | 0x80);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    } else if (octet < 268435456) {
      bytes.push((octet >>> 21) | 0x80);
      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    } else {
      bytes.push(((octet >>> 28) | 0x80) & 0xFF);
      bytes.push(((octet >>> 21) | 0x80) & 0xFF);
      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    }
  }

  var tmp = s.split('.');
  var bytes = [];
  bytes.push(parseInt(tmp[0], 10) * 40 + parseInt(tmp[1], 10));
  tmp.slice(2).forEach(function (b) {
    encodeOctet(bytes, parseInt(b, 10));
  });

  var self = this;
  this._ensure(2 + bytes.length);
  this.writeByte(tag);
  this.writeLength(bytes.length);
  bytes.forEach(function (b) {
    self.writeByte(b);
  });
};


Writer.prototype.writeLength = function (len) {
  if (typeof (len) !== 'number')
    throw new TypeError('argument must be a Number');

  this._ensure(4);

  if (len <= 0x7f) {
    this._buf[this._offset++] = len;
  } else if (len <= 0xff) {
    this._buf[this._offset++] = 0x81;
    this._buf[this._offset++] = len;
  } else if (len <= 0xffff) {
    this._buf[this._offset++] = 0x82;
    this._buf[this._offset++] = len >> 8;
    this._buf[this._offset++] = len;
  } else if (len <= 0xffffff) {
    this._buf[this._offset++] = 0x83;
    this._buf[this._offset++] = len >> 16;
    this._buf[this._offset++] = len >> 8;
    this._buf[this._offset++] = len;
  } else {
    throw newInvalidAsn1Error('Length too long (> 4 bytes)');
  }
};

Writer.prototype.startSequence = function (tag) {
  if (typeof (tag) !== 'number')
    tag = ASN1.Sequence | ASN1.Constructor;

  this.writeByte(tag);
  this._seq.push(this._offset);
  this._ensure(3);
  this._offset += 3;
};


Writer.prototype.endSequence = function () {
  var seq = this._seq.pop();
  var start = seq + 3;
  var len = this._offset - start;

  if (len <= 0x7f) {
    this._shift(start, len, -2);
    this._buf[seq] = len;
  } else if (len <= 0xff) {
    this._shift(start, len, -1);
    this._buf[seq] = 0x81;
    this._buf[seq + 1] = len;
  } else if (len <= 0xffff) {
    this._buf[seq] = 0x82;
    this._buf[seq + 1] = len >> 8;
    this._buf[seq + 2] = len;
  } else if (len <= 0xffffff) {
    this._shift(start, len, 1);
    this._buf[seq] = 0x83;
    this._buf[seq + 1] = len >> 16;
    this._buf[seq + 2] = len >> 8;
    this._buf[seq + 3] = len;
  } else {
    throw newInvalidAsn1Error('Sequence too long');
  }
};


Writer.prototype._shift = function (start, len, shift) {
  assert.ok(start !== undefined);
  assert.ok(len !== undefined);
  assert.ok(shift);

  this._buf.copy(this._buf, start + shift, start, start + len);
  this._offset += shift;
};

Writer.prototype._ensure = function (len) {
  assert.ok(len);

  if (this._size - this._offset < len) {
    var sz = this._size * this._options.growthFactor;
    if (sz - this._offset < len)
      sz += len;

    var buf = Buffer.alloc(sz);

    this._buf.copy(buf, 0, 0, this._offset);
    this._buf = buf;
    this._size = sz;
  }
};



// --- Exported API

module.exports = Writer;


/***/ }),

/***/ 970:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

// If you have no idea what ASN.1 or BER is, see this:
// ftp://ftp.rsa.com/pub/pkcs/ascii/layman.asc

var Ber = __nccwpck_require__(194);



// --- Exported API

module.exports = {

  Ber: Ber,

  BerReader: Ber.Reader,

  BerWriter: Ber.Writer

};


/***/ }),

/***/ 5447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var crypto_hash_sha512 = __nccwpck_require__(8729).lowlevel.crypto_hash;

/*
 * This file is a 1:1 port from the OpenBSD blowfish.c and bcrypt_pbkdf.c. As a
 * result, it retains the original copyright and license. The two files are
 * under slightly different (but compatible) licenses, and are here combined in
 * one file.
 *
 * Credit for the actual porting work goes to:
 *  Devi Mandiri <me@devi.web.id>
 */

/*
 * The Blowfish portions are under the following license:
 *
 * Blowfish block cipher for OpenBSD
 * Copyright 1997 Niels Provos <provos@physnet.uni-hamburg.de>
 * All rights reserved.
 *
 * Implementation advice by David Mazieres <dm@lcs.mit.edu>.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * The bcrypt_pbkdf portions are under the following license:
 *
 * Copyright (c) 2013 Ted Unangst <tedu@openbsd.org>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

/*
 * Performance improvements (Javascript-specific):
 *
 * Copyright 2016, Joyent Inc
 * Author: Alex Wilson <alex.wilson@joyent.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

// Ported from OpenBSD bcrypt_pbkdf.c v1.9

var BLF_J = 0;

var Blowfish = function() {
  this.S = [
    new Uint32Array([
      0xd1310ba6, 0x98dfb5ac, 0x2ffd72db, 0xd01adfb7,
      0xb8e1afed, 0x6a267e96, 0xba7c9045, 0xf12c7f99,
      0x24a19947, 0xb3916cf7, 0x0801f2e2, 0x858efc16,
      0x636920d8, 0x71574e69, 0xa458fea3, 0xf4933d7e,
      0x0d95748f, 0x728eb658, 0x718bcd58, 0x82154aee,
      0x7b54a41d, 0xc25a59b5, 0x9c30d539, 0x2af26013,
      0xc5d1b023, 0x286085f0, 0xca417918, 0xb8db38ef,
      0x8e79dcb0, 0x603a180e, 0x6c9e0e8b, 0xb01e8a3e,
      0xd71577c1, 0xbd314b27, 0x78af2fda, 0x55605c60,
      0xe65525f3, 0xaa55ab94, 0x57489862, 0x63e81440,
      0x55ca396a, 0x2aab10b6, 0xb4cc5c34, 0x1141e8ce,
      0xa15486af, 0x7c72e993, 0xb3ee1411, 0x636fbc2a,
      0x2ba9c55d, 0x741831f6, 0xce5c3e16, 0x9b87931e,
      0xafd6ba33, 0x6c24cf5c, 0x7a325381, 0x28958677,
      0x3b8f4898, 0x6b4bb9af, 0xc4bfe81b, 0x66282193,
      0x61d809cc, 0xfb21a991, 0x487cac60, 0x5dec8032,
      0xef845d5d, 0xe98575b1, 0xdc262302, 0xeb651b88,
      0x23893e81, 0xd396acc5, 0x0f6d6ff3, 0x83f44239,
      0x2e0b4482, 0xa4842004, 0x69c8f04a, 0x9e1f9b5e,
      0x21c66842, 0xf6e96c9a, 0x670c9c61, 0xabd388f0,
      0x6a51a0d2, 0xd8542f68, 0x960fa728, 0xab5133a3,
      0x6eef0b6c, 0x137a3be4, 0xba3bf050, 0x7efb2a98,
      0xa1f1651d, 0x39af0176, 0x66ca593e, 0x82430e88,
      0x8cee8619, 0x456f9fb4, 0x7d84a5c3, 0x3b8b5ebe,
      0xe06f75d8, 0x85c12073, 0x401a449f, 0x56c16aa6,
      0x4ed3aa62, 0x363f7706, 0x1bfedf72, 0x429b023d,
      0x37d0d724, 0xd00a1248, 0xdb0fead3, 0x49f1c09b,
      0x075372c9, 0x80991b7b, 0x25d479d8, 0xf6e8def7,
      0xe3fe501a, 0xb6794c3b, 0x976ce0bd, 0x04c006ba,
      0xc1a94fb6, 0x409f60c4, 0x5e5c9ec2, 0x196a2463,
      0x68fb6faf, 0x3e6c53b5, 0x1339b2eb, 0x3b52ec6f,
      0x6dfc511f, 0x9b30952c, 0xcc814544, 0xaf5ebd09,
      0xbee3d004, 0xde334afd, 0x660f2807, 0x192e4bb3,
      0xc0cba857, 0x45c8740f, 0xd20b5f39, 0xb9d3fbdb,
      0x5579c0bd, 0x1a60320a, 0xd6a100c6, 0x402c7279,
      0x679f25fe, 0xfb1fa3cc, 0x8ea5e9f8, 0xdb3222f8,
      0x3c7516df, 0xfd616b15, 0x2f501ec8, 0xad0552ab,
      0x323db5fa, 0xfd238760, 0x53317b48, 0x3e00df82,
      0x9e5c57bb, 0xca6f8ca0, 0x1a87562e, 0xdf1769db,
      0xd542a8f6, 0x287effc3, 0xac6732c6, 0x8c4f5573,
      0x695b27b0, 0xbbca58c8, 0xe1ffa35d, 0xb8f011a0,
      0x10fa3d98, 0xfd2183b8, 0x4afcb56c, 0x2dd1d35b,
      0x9a53e479, 0xb6f84565, 0xd28e49bc, 0x4bfb9790,
      0xe1ddf2da, 0xa4cb7e33, 0x62fb1341, 0xcee4c6e8,
      0xef20cada, 0x36774c01, 0xd07e9efe, 0x2bf11fb4,
      0x95dbda4d, 0xae909198, 0xeaad8e71, 0x6b93d5a0,
      0xd08ed1d0, 0xafc725e0, 0x8e3c5b2f, 0x8e7594b7,
      0x8ff6e2fb, 0xf2122b64, 0x8888b812, 0x900df01c,
      0x4fad5ea0, 0x688fc31c, 0xd1cff191, 0xb3a8c1ad,
      0x2f2f2218, 0xbe0e1777, 0xea752dfe, 0x8b021fa1,
      0xe5a0cc0f, 0xb56f74e8, 0x18acf3d6, 0xce89e299,
      0xb4a84fe0, 0xfd13e0b7, 0x7cc43b81, 0xd2ada8d9,
      0x165fa266, 0x80957705, 0x93cc7314, 0x211a1477,
      0xe6ad2065, 0x77b5fa86, 0xc75442f5, 0xfb9d35cf,
      0xebcdaf0c, 0x7b3e89a0, 0xd6411bd3, 0xae1e7e49,
      0x00250e2d, 0x2071b35e, 0x226800bb, 0x57b8e0af,
      0x2464369b, 0xf009b91e, 0x5563911d, 0x59dfa6aa,
      0x78c14389, 0xd95a537f, 0x207d5ba2, 0x02e5b9c5,
      0x83260376, 0x6295cfa9, 0x11c81968, 0x4e734a41,
      0xb3472dca, 0x7b14a94a, 0x1b510052, 0x9a532915,
      0xd60f573f, 0xbc9bc6e4, 0x2b60a476, 0x81e67400,
      0x08ba6fb5, 0x571be91f, 0xf296ec6b, 0x2a0dd915,
      0xb6636521, 0xe7b9f9b6, 0xff34052e, 0xc5855664,
      0x53b02d5d, 0xa99f8fa1, 0x08ba4799, 0x6e85076a]),
    new Uint32Array([
      0x4b7a70e9, 0xb5b32944, 0xdb75092e, 0xc4192623,
      0xad6ea6b0, 0x49a7df7d, 0x9cee60b8, 0x8fedb266,
      0xecaa8c71, 0x699a17ff, 0x5664526c, 0xc2b19ee1,
      0x193602a5, 0x75094c29, 0xa0591340, 0xe4183a3e,
      0x3f54989a, 0x5b429d65, 0x6b8fe4d6, 0x99f73fd6,
      0xa1d29c07, 0xefe830f5, 0x4d2d38e6, 0xf0255dc1,
      0x4cdd2086, 0x8470eb26, 0x6382e9c6, 0x021ecc5e,
      0x09686b3f, 0x3ebaefc9, 0x3c971814, 0x6b6a70a1,
      0x687f3584, 0x52a0e286, 0xb79c5305, 0xaa500737,
      0x3e07841c, 0x7fdeae5c, 0x8e7d44ec, 0x5716f2b8,
      0xb03ada37, 0xf0500c0d, 0xf01c1f04, 0x0200b3ff,
      0xae0cf51a, 0x3cb574b2, 0x25837a58, 0xdc0921bd,
      0xd19113f9, 0x7ca92ff6, 0x94324773, 0x22f54701,
      0x3ae5e581, 0x37c2dadc, 0xc8b57634, 0x9af3dda7,
      0xa9446146, 0x0fd0030e, 0xecc8c73e, 0xa4751e41,
      0xe238cd99, 0x3bea0e2f, 0x3280bba1, 0x183eb331,
      0x4e548b38, 0x4f6db908, 0x6f420d03, 0xf60a04bf,
      0x2cb81290, 0x24977c79, 0x5679b072, 0xbcaf89af,
      0xde9a771f, 0xd9930810, 0xb38bae12, 0xdccf3f2e,
      0x5512721f, 0x2e6b7124, 0x501adde6, 0x9f84cd87,
      0x7a584718, 0x7408da17, 0xbc9f9abc, 0xe94b7d8c,
      0xec7aec3a, 0xdb851dfa, 0x63094366, 0xc464c3d2,
      0xef1c1847, 0x3215d908, 0xdd433b37, 0x24c2ba16,
      0x12a14d43, 0x2a65c451, 0x50940002, 0x133ae4dd,
      0x71dff89e, 0x10314e55, 0x81ac77d6, 0x5f11199b,
      0x043556f1, 0xd7a3c76b, 0x3c11183b, 0x5924a509,
      0xf28fe6ed, 0x97f1fbfa, 0x9ebabf2c, 0x1e153c6e,
      0x86e34570, 0xeae96fb1, 0x860e5e0a, 0x5a3e2ab3,
      0x771fe71c, 0x4e3d06fa, 0x2965dcb9, 0x99e71d0f,
      0x803e89d6, 0x5266c825, 0x2e4cc978, 0x9c10b36a,
      0xc6150eba, 0x94e2ea78, 0xa5fc3c53, 0x1e0a2df4,
      0xf2f74ea7, 0x361d2b3d, 0x1939260f, 0x19c27960,
      0x5223a708, 0xf71312b6, 0xebadfe6e, 0xeac31f66,
      0xe3bc4595, 0xa67bc883, 0xb17f37d1, 0x018cff28,
      0xc332ddef, 0xbe6c5aa5, 0x65582185, 0x68ab9802,
      0xeecea50f, 0xdb2f953b, 0x2aef7dad, 0x5b6e2f84,
      0x1521b628, 0x29076170, 0xecdd4775, 0x619f1510,
      0x13cca830, 0xeb61bd96, 0x0334fe1e, 0xaa0363cf,
      0xb5735c90, 0x4c70a239, 0xd59e9e0b, 0xcbaade14,
      0xeecc86bc, 0x60622ca7, 0x9cab5cab, 0xb2f3846e,
      0x648b1eaf, 0x19bdf0ca, 0xa02369b9, 0x655abb50,
      0x40685a32, 0x3c2ab4b3, 0x319ee9d5, 0xc021b8f7,
      0x9b540b19, 0x875fa099, 0x95f7997e, 0x623d7da8,
      0xf837889a, 0x97e32d77, 0x11ed935f, 0x16681281,
      0x0e358829, 0xc7e61fd6, 0x96dedfa1, 0x7858ba99,
      0x57f584a5, 0x1b227263, 0x9b83c3ff, 0x1ac24696,
      0xcdb30aeb, 0x532e3054, 0x8fd948e4, 0x6dbc3128,
      0x58ebf2ef, 0x34c6ffea, 0xfe28ed61, 0xee7c3c73,
      0x5d4a14d9, 0xe864b7e3, 0x42105d14, 0x203e13e0,
      0x45eee2b6, 0xa3aaabea, 0xdb6c4f15, 0xfacb4fd0,
      0xc742f442, 0xef6abbb5, 0x654f3b1d, 0x41cd2105,
      0xd81e799e, 0x86854dc7, 0xe44b476a, 0x3d816250,
      0xcf62a1f2, 0x5b8d2646, 0xfc8883a0, 0xc1c7b6a3,
      0x7f1524c3, 0x69cb7492, 0x47848a0b, 0x5692b285,
      0x095bbf00, 0xad19489d, 0x1462b174, 0x23820e00,
      0x58428d2a, 0x0c55f5ea, 0x1dadf43e, 0x233f7061,
      0x3372f092, 0x8d937e41, 0xd65fecf1, 0x6c223bdb,
      0x7cde3759, 0xcbee7460, 0x4085f2a7, 0xce77326e,
      0xa6078084, 0x19f8509e, 0xe8efd855, 0x61d99735,
      0xa969a7aa, 0xc50c06c2, 0x5a04abfc, 0x800bcadc,
      0x9e447a2e, 0xc3453484, 0xfdd56705, 0x0e1e9ec9,
      0xdb73dbd3, 0x105588cd, 0x675fda79, 0xe3674340,
      0xc5c43465, 0x713e38d8, 0x3d28f89e, 0xf16dff20,
      0x153e21e7, 0x8fb03d4a, 0xe6e39f2b, 0xdb83adf7]),
    new Uint32Array([
      0xe93d5a68, 0x948140f7, 0xf64c261c, 0x94692934,
      0x411520f7, 0x7602d4f7, 0xbcf46b2e, 0xd4a20068,
      0xd4082471, 0x3320f46a, 0x43b7d4b7, 0x500061af,
      0x1e39f62e, 0x97244546, 0x14214f74, 0xbf8b8840,
      0x4d95fc1d, 0x96b591af, 0x70f4ddd3, 0x66a02f45,
      0xbfbc09ec, 0x03bd9785, 0x7fac6dd0, 0x31cb8504,
      0x96eb27b3, 0x55fd3941, 0xda2547e6, 0xabca0a9a,
      0x28507825, 0x530429f4, 0x0a2c86da, 0xe9b66dfb,
      0x68dc1462, 0xd7486900, 0x680ec0a4, 0x27a18dee,
      0x4f3ffea2, 0xe887ad8c, 0xb58ce006, 0x7af4d6b6,
      0xaace1e7c, 0xd3375fec, 0xce78a399, 0x406b2a42,
      0x20fe9e35, 0xd9f385b9, 0xee39d7ab, 0x3b124e8b,
      0x1dc9faf7, 0x4b6d1856, 0x26a36631, 0xeae397b2,
      0x3a6efa74, 0xdd5b4332, 0x6841e7f7, 0xca7820fb,
      0xfb0af54e, 0xd8feb397, 0x454056ac, 0xba489527,
      0x55533a3a, 0x20838d87, 0xfe6ba9b7, 0xd096954b,
      0x55a867bc, 0xa1159a58, 0xcca92963, 0x99e1db33,
      0xa62a4a56, 0x3f3125f9, 0x5ef47e1c, 0x9029317c,
      0xfdf8e802, 0x04272f70, 0x80bb155c, 0x05282ce3,
      0x95c11548, 0xe4c66d22, 0x48c1133f, 0xc70f86dc,
      0x07f9c9ee, 0x41041f0f, 0x404779a4, 0x5d886e17,
      0x325f51eb, 0xd59bc0d1, 0xf2bcc18f, 0x41113564,
      0x257b7834, 0x602a9c60, 0xdff8e8a3, 0x1f636c1b,
      0x0e12b4c2, 0x02e1329e, 0xaf664fd1, 0xcad18115,
      0x6b2395e0, 0x333e92e1, 0x3b240b62, 0xeebeb922,
      0x85b2a20e, 0xe6ba0d99, 0xde720c8c, 0x2da2f728,
      0xd0127845, 0x95b794fd, 0x647d0862, 0xe7ccf5f0,
      0x5449a36f, 0x877d48fa, 0xc39dfd27, 0xf33e8d1e,
      0x0a476341, 0x992eff74, 0x3a6f6eab, 0xf4f8fd37,
      0xa812dc60, 0xa1ebddf8, 0x991be14c, 0xdb6e6b0d,
      0xc67b5510, 0x6d672c37, 0x2765d43b, 0xdcd0e804,
      0xf1290dc7, 0xcc00ffa3, 0xb5390f92, 0x690fed0b,
      0x667b9ffb, 0xcedb7d9c, 0xa091cf0b, 0xd9155ea3,
      0xbb132f88, 0x515bad24, 0x7b9479bf, 0x763bd6eb,
      0x37392eb3, 0xcc115979, 0x8026e297, 0xf42e312d,
      0x6842ada7, 0xc66a2b3b, 0x12754ccc, 0x782ef11c,
      0x6a124237, 0xb79251e7, 0x06a1bbe6, 0x4bfb6350,
      0x1a6b1018, 0x11caedfa, 0x3d25bdd8, 0xe2e1c3c9,
      0x44421659, 0x0a121386, 0xd90cec6e, 0xd5abea2a,
      0x64af674e, 0xda86a85f, 0xbebfe988, 0x64e4c3fe,
      0x9dbc8057, 0xf0f7c086, 0x60787bf8, 0x6003604d,
      0xd1fd8346, 0xf6381fb0, 0x7745ae04, 0xd736fccc,
      0x83426b33, 0xf01eab71, 0xb0804187, 0x3c005e5f,
      0x77a057be, 0xbde8ae24, 0x55464299, 0xbf582e61,
      0x4e58f48f, 0xf2ddfda2, 0xf474ef38, 0x8789bdc2,
      0x5366f9c3, 0xc8b38e74, 0xb475f255, 0x46fcd9b9,
      0x7aeb2661, 0x8b1ddf84, 0x846a0e79, 0x915f95e2,
      0x466e598e, 0x20b45770, 0x8cd55591, 0xc902de4c,
      0xb90bace1, 0xbb8205d0, 0x11a86248, 0x7574a99e,
      0xb77f19b6, 0xe0a9dc09, 0x662d09a1, 0xc4324633,
      0xe85a1f02, 0x09f0be8c, 0x4a99a025, 0x1d6efe10,
      0x1ab93d1d, 0x0ba5a4df, 0xa186f20f, 0x2868f169,
      0xdcb7da83, 0x573906fe, 0xa1e2ce9b, 0x4fcd7f52,
      0x50115e01, 0xa70683fa, 0xa002b5c4, 0x0de6d027,
      0x9af88c27, 0x773f8641, 0xc3604c06, 0x61a806b5,
      0xf0177a28, 0xc0f586e0, 0x006058aa, 0x30dc7d62,
      0x11e69ed7, 0x2338ea63, 0x53c2dd94, 0xc2c21634,
      0xbbcbee56, 0x90bcb6de, 0xebfc7da1, 0xce591d76,
      0x6f05e409, 0x4b7c0188, 0x39720a3d, 0x7c927c24,
      0x86e3725f, 0x724d9db9, 0x1ac15bb4, 0xd39eb8fc,
      0xed545578, 0x08fca5b5, 0xd83d7cd3, 0x4dad0fc4,
      0x1e50ef5e, 0xb161e6f8, 0xa28514d9, 0x6c51133c,
      0x6fd5c7e7, 0x56e14ec4, 0x362abfce, 0xddc6c837,
      0xd79a3234, 0x92638212, 0x670efa8e, 0x406000e0]),
    new Uint32Array([
      0x3a39ce37, 0xd3faf5cf, 0xabc27737, 0x5ac52d1b,
      0x5cb0679e, 0x4fa33742, 0xd3822740, 0x99bc9bbe,
      0xd5118e9d, 0xbf0f7315, 0xd62d1c7e, 0xc700c47b,
      0xb78c1b6b, 0x21a19045, 0xb26eb1be, 0x6a366eb4,
      0x5748ab2f, 0xbc946e79, 0xc6a376d2, 0x6549c2c8,
      0x530ff8ee, 0x468dde7d, 0xd5730a1d, 0x4cd04dc6,
      0x2939bbdb, 0xa9ba4650, 0xac9526e8, 0xbe5ee304,
      0xa1fad5f0, 0x6a2d519a, 0x63ef8ce2, 0x9a86ee22,
      0xc089c2b8, 0x43242ef6, 0xa51e03aa, 0x9cf2d0a4,
      0x83c061ba, 0x9be96a4d, 0x8fe51550, 0xba645bd6,
      0x2826a2f9, 0xa73a3ae1, 0x4ba99586, 0xef5562e9,
      0xc72fefd3, 0xf752f7da, 0x3f046f69, 0x77fa0a59,
      0x80e4a915, 0x87b08601, 0x9b09e6ad, 0x3b3ee593,
      0xe990fd5a, 0x9e34d797, 0x2cf0b7d9, 0x022b8b51,
      0x96d5ac3a, 0x017da67d, 0xd1cf3ed6, 0x7c7d2d28,
      0x1f9f25cf, 0xadf2b89b, 0x5ad6b472, 0x5a88f54c,
      0xe029ac71, 0xe019a5e6, 0x47b0acfd, 0xed93fa9b,
      0xe8d3c48d, 0x283b57cc, 0xf8d56629, 0x79132e28,
      0x785f0191, 0xed756055, 0xf7960e44, 0xe3d35e8c,
      0x15056dd4, 0x88f46dba, 0x03a16125, 0x0564f0bd,
      0xc3eb9e15, 0x3c9057a2, 0x97271aec, 0xa93a072a,
      0x1b3f6d9b, 0x1e6321f5, 0xf59c66fb, 0x26dcf319,
      0x7533d928, 0xb155fdf5, 0x03563482, 0x8aba3cbb,
      0x28517711, 0xc20ad9f8, 0xabcc5167, 0xccad925f,
      0x4de81751, 0x3830dc8e, 0x379d5862, 0x9320f991,
      0xea7a90c2, 0xfb3e7bce, 0x5121ce64, 0x774fbe32,
      0xa8b6e37e, 0xc3293d46, 0x48de5369, 0x6413e680,
      0xa2ae0810, 0xdd6db224, 0x69852dfd, 0x09072166,
      0xb39a460a, 0x6445c0dd, 0x586cdecf, 0x1c20c8ae,
      0x5bbef7dd, 0x1b588d40, 0xccd2017f, 0x6bb4e3bb,
      0xdda26a7e, 0x3a59ff45, 0x3e350a44, 0xbcb4cdd5,
      0x72eacea8, 0xfa6484bb, 0x8d6612ae, 0xbf3c6f47,
      0xd29be463, 0x542f5d9e, 0xaec2771b, 0xf64e6370,
      0x740e0d8d, 0xe75b1357, 0xf8721671, 0xaf537d5d,
      0x4040cb08, 0x4eb4e2cc, 0x34d2466a, 0x0115af84,
      0xe1b00428, 0x95983a1d, 0x06b89fb4, 0xce6ea048,
      0x6f3f3b82, 0x3520ab82, 0x011a1d4b, 0x277227f8,
      0x611560b1, 0xe7933fdc, 0xbb3a792b, 0x344525bd,
      0xa08839e1, 0x51ce794b, 0x2f32c9b7, 0xa01fbac9,
      0xe01cc87e, 0xbcc7d1f6, 0xcf0111c3, 0xa1e8aac7,
      0x1a908749, 0xd44fbd9a, 0xd0dadecb, 0xd50ada38,
      0x0339c32a, 0xc6913667, 0x8df9317c, 0xe0b12b4f,
      0xf79e59b7, 0x43f5bb3a, 0xf2d519ff, 0x27d9459c,
      0xbf97222c, 0x15e6fc2a, 0x0f91fc71, 0x9b941525,
      0xfae59361, 0xceb69ceb, 0xc2a86459, 0x12baa8d1,
      0xb6c1075e, 0xe3056a0c, 0x10d25065, 0xcb03a442,
      0xe0ec6e0e, 0x1698db3b, 0x4c98a0be, 0x3278e964,
      0x9f1f9532, 0xe0d392df, 0xd3a0342b, 0x8971f21e,
      0x1b0a7441, 0x4ba3348c, 0xc5be7120, 0xc37632d8,
      0xdf359f8d, 0x9b992f2e, 0xe60b6f47, 0x0fe3f11d,
      0xe54cda54, 0x1edad891, 0xce6279cf, 0xcd3e7e6f,
      0x1618b166, 0xfd2c1d05, 0x848fd2c5, 0xf6fb2299,
      0xf523f357, 0xa6327623, 0x93a83531, 0x56cccd02,
      0xacf08162, 0x5a75ebb5, 0x6e163697, 0x88d273cc,
      0xde966292, 0x81b949d0, 0x4c50901b, 0x71c65614,
      0xe6c6c7bd, 0x327a140a, 0x45e1d006, 0xc3f27b9a,
      0xc9aa53fd, 0x62a80f00, 0xbb25bfe2, 0x35bdd2f6,
      0x71126905, 0xb2040222, 0xb6cbcf7c, 0xcd769c2b,
      0x53113ec0, 0x1640e3d3, 0x38abbd60, 0x2547adf0,
      0xba38209c, 0xf746ce76, 0x77afa1c5, 0x20756060,
      0x85cbfe4e, 0x8ae88dd8, 0x7aaaf9b0, 0x4cf9aa7e,
      0x1948c25c, 0x02fb8a8c, 0x01c36ae4, 0xd6ebe1f9,
      0x90d4f869, 0xa65cdea0, 0x3f09252d, 0xc208e69f,
      0xb74e6132, 0xce77e25b, 0x578fdfe3, 0x3ac372e6])
    ];
  this.P = new Uint32Array([
    0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344,
    0xa4093822, 0x299f31d0, 0x082efa98, 0xec4e6c89,
    0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c,
    0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917,
    0x9216d5d9, 0x8979fb1b]);
};

function F(S, x8, i) {
  return (((S[0][x8[i+3]] +
            S[1][x8[i+2]]) ^
            S[2][x8[i+1]]) +
            S[3][x8[i]]);
};

Blowfish.prototype.encipher = function(x, x8) {
  if (x8 === undefined) {
    x8 = new Uint8Array(x.buffer);
    if (x.byteOffset !== 0)
      x8 = x8.subarray(x.byteOffset);
  }
  x[0] ^= this.P[0];
  for (var i = 1; i < 16; i += 2) {
    x[1] ^= F(this.S, x8, 0) ^ this.P[i];
    x[0] ^= F(this.S, x8, 4) ^ this.P[i+1];
  }
  var t = x[0];
  x[0] = x[1] ^ this.P[17];
  x[1] = t;
};

Blowfish.prototype.decipher = function(x) {
  var x8 = new Uint8Array(x.buffer);
  if (x.byteOffset !== 0)
    x8 = x8.subarray(x.byteOffset);
  x[0] ^= this.P[17];
  for (var i = 16; i > 0; i -= 2) {
    x[1] ^= F(this.S, x8, 0) ^ this.P[i];
    x[0] ^= F(this.S, x8, 4) ^ this.P[i-1];
  }
  var t = x[0];
  x[0] = x[1] ^ this.P[0];
  x[1] = t;
};

function stream2word(data, databytes){
  var i, temp = 0;
  for (i = 0; i < 4; i++, BLF_J++) {
    if (BLF_J >= databytes) BLF_J = 0;
    temp = (temp << 8) | data[BLF_J];
  }
  return temp;
};

Blowfish.prototype.expand0state = function(key, keybytes) {
  var d = new Uint32Array(2), i, k;
  var d8 = new Uint8Array(d.buffer);

  for (i = 0, BLF_J = 0; i < 18; i++) {
    this.P[i] ^= stream2word(key, keybytes);
  }
  BLF_J = 0;

  for (i = 0; i < 18; i += 2) {
    this.encipher(d, d8);
    this.P[i]   = d[0];
    this.P[i+1] = d[1];
  }

  for (i = 0; i < 4; i++) {
    for (k = 0; k < 256; k += 2) {
      this.encipher(d, d8);
      this.S[i][k]   = d[0];
      this.S[i][k+1] = d[1];
    }
  }
};

Blowfish.prototype.expandstate = function(data, databytes, key, keybytes) {
  var d = new Uint32Array(2), i, k;

  for (i = 0, BLF_J = 0; i < 18; i++) {
    this.P[i] ^= stream2word(key, keybytes);
  }

  for (i = 0, BLF_J = 0; i < 18; i += 2) {
    d[0] ^= stream2word(data, databytes);
    d[1] ^= stream2word(data, databytes);
    this.encipher(d);
    this.P[i]   = d[0];
    this.P[i+1] = d[1];
  }

  for (i = 0; i < 4; i++) {
    for (k = 0; k < 256; k += 2) {
      d[0] ^= stream2word(data, databytes);
      d[1] ^= stream2word(data, databytes);
      this.encipher(d);
      this.S[i][k]   = d[0];
      this.S[i][k+1] = d[1];
    }
  }
  BLF_J = 0;
};

Blowfish.prototype.enc = function(data, blocks) {
  for (var i = 0; i < blocks; i++) {
    this.encipher(data.subarray(i*2));
  }
};

Blowfish.prototype.dec = function(data, blocks) {
  for (var i = 0; i < blocks; i++) {
    this.decipher(data.subarray(i*2));
  }
};

var BCRYPT_BLOCKS = 8,
    BCRYPT_HASHSIZE = 32;

function bcrypt_hash(sha2pass, sha2salt, out) {
  var state = new Blowfish(),
      cdata = new Uint32Array(BCRYPT_BLOCKS), i,
      ciphertext = new Uint8Array([79,120,121,99,104,114,111,109,97,116,105,
            99,66,108,111,119,102,105,115,104,83,119,97,116,68,121,110,97,109,
            105,116,101]); //"OxychromaticBlowfishSwatDynamite"

  state.expandstate(sha2salt, 64, sha2pass, 64);
  for (i = 0; i < 64; i++) {
    state.expand0state(sha2salt, 64);
    state.expand0state(sha2pass, 64);
  }

  for (i = 0; i < BCRYPT_BLOCKS; i++)
    cdata[i] = stream2word(ciphertext, ciphertext.byteLength);
  for (i = 0; i < 64; i++)
    state.enc(cdata, cdata.byteLength / 8);

  for (i = 0; i < BCRYPT_BLOCKS; i++) {
    out[4*i+3] = cdata[i] >>> 24;
    out[4*i+2] = cdata[i] >>> 16;
    out[4*i+1] = cdata[i] >>> 8;
    out[4*i+0] = cdata[i];
  }
};

function bcrypt_pbkdf(pass, passlen, salt, saltlen, key, keylen, rounds) {
  var sha2pass = new Uint8Array(64),
      sha2salt = new Uint8Array(64),
      out = new Uint8Array(BCRYPT_HASHSIZE),
      tmpout = new Uint8Array(BCRYPT_HASHSIZE),
      countsalt = new Uint8Array(saltlen+4),
      i, j, amt, stride, dest, count,
      origkeylen = keylen;

  if (rounds < 1)
    return -1;
  if (passlen === 0 || saltlen === 0 || keylen === 0 ||
      keylen > (out.byteLength * out.byteLength) || saltlen > (1<<20))
    return -1;

  stride = Math.floor((keylen + out.byteLength - 1) / out.byteLength);
  amt = Math.floor((keylen + stride - 1) / stride);

  for (i = 0; i < saltlen; i++)
    countsalt[i] = salt[i];

  crypto_hash_sha512(sha2pass, pass, passlen);

  for (count = 1; keylen > 0; count++) {
    countsalt[saltlen+0] = count >>> 24;
    countsalt[saltlen+1] = count >>> 16;
    countsalt[saltlen+2] = count >>>  8;
    countsalt[saltlen+3] = count;

    crypto_hash_sha512(sha2salt, countsalt, saltlen + 4);
    bcrypt_hash(sha2pass, sha2salt, tmpout);
    for (i = out.byteLength; i--;)
      out[i] = tmpout[i];

    for (i = 1; i < rounds; i++) {
      crypto_hash_sha512(sha2salt, tmpout, tmpout.byteLength);
      bcrypt_hash(sha2pass, sha2salt, tmpout);
      for (j = 0; j < out.byteLength; j++)
        out[j] ^= tmpout[j];
    }

    amt = Math.min(amt, keylen);
    for (i = 0; i < amt; i++) {
      dest = i * stride + (count - 1);
      if (dest >= origkeylen)
        break;
      key[dest] = out[i];
    }
    keylen -= i;
  }

  return 0;
};

module.exports = {
      BLOCKS: BCRYPT_BLOCKS,
      HASHSIZE: BCRYPT_HASHSIZE,
      hash: bcrypt_hash,
      pbkdf: bcrypt_pbkdf
};


/***/ }),

/***/ 3018:
/***/ ((module) => {

/* eslint-disable node/no-deprecated-api */

var toString = Object.prototype.toString

var isModern = (
  typeof Buffer !== 'undefined' &&
  typeof Buffer.alloc === 'function' &&
  typeof Buffer.allocUnsafe === 'function' &&
  typeof Buffer.from === 'function'
)

function isArrayBuffer (input) {
  return toString.call(input).slice(8, -1) === 'ArrayBuffer'
}

function fromArrayBuffer (obj, byteOffset, length) {
  byteOffset >>>= 0

  var maxLength = obj.byteLength - byteOffset

  if (maxLength < 0) {
    throw new RangeError("'offset' is out of bounds")
  }

  if (length === undefined) {
    length = maxLength
  } else {
    length >>>= 0

    if (length > maxLength) {
      throw new RangeError("'length' is out of bounds")
    }
  }

  return isModern
    ? Buffer.from(obj.slice(byteOffset, byteOffset + length))
    : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)))
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  return isModern
    ? Buffer.from(string, encoding)
    : new Buffer(string, encoding)
}

function bufferFrom (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return isModern
    ? Buffer.from(value)
    : new Buffer(value)
}

module.exports = bufferFrom


/***/ }),

/***/ 5107:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Writable = __nccwpck_require__(1642).Writable
var inherits = __nccwpck_require__(4124)
var bufferFrom = __nccwpck_require__(3018)

if (typeof Uint8Array === 'undefined') {
  var U8 = __nccwpck_require__(5027)/* .Uint8Array */ .U2
} else {
  var U8 = Uint8Array
}

function ConcatStream(opts, cb) {
  if (!(this instanceof ConcatStream)) return new ConcatStream(opts, cb)

  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  if (!opts) opts = {}

  var encoding = opts.encoding
  var shouldInferEncoding = false

  if (!encoding) {
    shouldInferEncoding = true
  } else {
    encoding =  String(encoding).toLowerCase()
    if (encoding === 'u8' || encoding === 'uint8') {
      encoding = 'uint8array'
    }
  }

  Writable.call(this, { objectMode: true })

  this.encoding = encoding
  this.shouldInferEncoding = shouldInferEncoding

  if (cb) this.on('finish', function () { cb(this.getBody()) })
  this.body = []
}

module.exports = ConcatStream
inherits(ConcatStream, Writable)

ConcatStream.prototype._write = function(chunk, enc, next) {
  this.body.push(chunk)
  next()
}

ConcatStream.prototype.inferEncoding = function (buff) {
  var firstBuffer = buff === undefined ? this.body[0] : buff;
  if (Buffer.isBuffer(firstBuffer)) return 'buffer'
  if (typeof Uint8Array !== 'undefined' && firstBuffer instanceof Uint8Array) return 'uint8array'
  if (Array.isArray(firstBuffer)) return 'array'
  if (typeof firstBuffer === 'string') return 'string'
  if (Object.prototype.toString.call(firstBuffer) === "[object Object]") return 'object'
  return 'buffer'
}

ConcatStream.prototype.getBody = function () {
  if (!this.encoding && this.body.length === 0) return []
  if (this.shouldInferEncoding) this.encoding = this.inferEncoding()
  if (this.encoding === 'array') return arrayConcat(this.body)
  if (this.encoding === 'string') return stringConcat(this.body)
  if (this.encoding === 'buffer') return bufferConcat(this.body)
  if (this.encoding === 'uint8array') return u8Concat(this.body)
  return this.body
}

var isArray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}

function isArrayish (arr) {
  return /Array\]$/.test(Object.prototype.toString.call(arr))
}

function isBufferish (p) {
  return typeof p === 'string' || isArrayish(p) || (p && typeof p.subarray === 'function')
}

function stringConcat (parts) {
  var strings = []
  var needsToString = false
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i]
    if (typeof p === 'string') {
      strings.push(p)
    } else if (Buffer.isBuffer(p)) {
      strings.push(p)
    } else if (isBufferish(p)) {
      strings.push(bufferFrom(p))
    } else {
      strings.push(bufferFrom(String(p)))
    }
  }
  if (Buffer.isBuffer(parts[0])) {
    strings = Buffer.concat(strings)
    strings = strings.toString('utf8')
  } else {
    strings = strings.join('')
  }
  return strings
}

function bufferConcat (parts) {
  var bufs = []
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i]
    if (Buffer.isBuffer(p)) {
      bufs.push(p)
    } else if (isBufferish(p)) {
      bufs.push(bufferFrom(p))
    } else {
      bufs.push(bufferFrom(String(p)))
    }
  }
  return Buffer.concat(bufs)
}

function arrayConcat (parts) {
  var res = []
  for (var i = 0; i < parts.length; i++) {
    res.push.apply(res, parts[i])
  }
  return res
}

function u8Concat (parts) {
  var len = 0
  for (var i = 0; i < parts.length; i++) {
    if (typeof parts[i] === 'string') {
      parts[i] = bufferFrom(parts[i])
    }
    len += parts[i].length
  }
  var u8 = new U8(len)
  for (var i = 0, offset = 0; i < parts.length; i++) {
    var part = parts[i]
    for (var j = 0; j < part.length; j++) {
      u8[offset++] = part[j]
    }
  }
  return u8
}


/***/ }),

/***/ 4137:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const binding = __nccwpck_require__(4240);

module.exports = binding.getCPUInfo;


/***/ }),

/***/ 2997:
/***/ ((module) => {

"use strict";


function assign(obj, props) {
    for (const key in props) {
        Object.defineProperty(obj, key, {
            value: props[key],
            enumerable: true,
            configurable: true,
        });
    }

    return obj;
}

function createError(err, code, props) {
    if (!err || typeof err === 'string') {
        throw new TypeError('Please pass an Error to err-code');
    }

    if (!props) {
        props = {};
    }

    if (typeof code === 'object') {
        props = code;
        code = undefined;
    }

    if (code != null) {
        props.code = code;
    }

    try {
        return assign(err, props);
    } catch (_) {
        props.message = err.message;
        props.stack = err.stack;

        const ErrClass = function () {};

        ErrClass.prototype = Object.create(Object.getPrototypeOf(err));

        return assign(new ErrClass(), props);
    }
}

module.exports = createError;


/***/ }),

/***/ 4124:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(1669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(8544);
}


/***/ }),

/***/ 8544:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 4742:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var errcode = __nccwpck_require__(2997);
var retry = __nccwpck_require__(4347);

var hasOwn = Object.prototype.hasOwnProperty;

function isRetryError(err) {
    return err && err.code === 'EPROMISERETRY' && hasOwn.call(err, 'retried');
}

function promiseRetry(fn, options) {
    var temp;
    var operation;

    if (typeof fn === 'object' && typeof options === 'function') {
        // Swap options and fn when using alternate signature (options, fn)
        temp = options;
        options = fn;
        fn = temp;
    }

    operation = retry.operation(options);

    return new Promise(function (resolve, reject) {
        operation.attempt(function (number) {
            Promise.resolve()
            .then(function () {
                return fn(function (err) {
                    if (isRetryError(err)) {
                        err = err.retried;
                    }

                    throw errcode(new Error('Retrying'), 'EPROMISERETRY', { retried: err });
                }, number);
            })
            .then(resolve, function (err) {
                if (isRetryError(err)) {
                    err = err.retried;

                    if (operation.retry(err || new Error())) {
                        return;
                    }
                }

                reject(err);
            });
        });
    });
}

module.exports = promiseRetry;


/***/ }),

/***/ 7214:
/***/ ((module) => {

"use strict";


const codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error
  }

  function getMessage (arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message
    } else {
      return message(arg1, arg2, arg3)
    }
  }

  class NodeError extends Base {
    constructor (arg1, arg2, arg3) {
      super(getMessage(arg1, arg2, arg3));
    }
  }

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;

  codes[code] = NodeError;
}

// https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js
function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    const len = expected.length;
    expected = expected.map((i) => String(i));
    if (len > 2) {
      return `one of ${thing} ${expected.slice(0, len - 1).join(', ')}, or ` +
             expected[len - 1];
    } else if (len === 2) {
      return `one of ${thing} ${expected[0]} or ${expected[1]}`;
    } else {
      return `of ${thing} ${expected[0]}`;
    }
  } else {
    return `of ${thing} ${String(expected)}`;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
function startsWith(str, search, pos) {
	return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
function endsWith(str, search, this_len) {
	if (this_len === undefined || this_len > str.length) {
		this_len = str.length;
	}
	return str.substring(this_len - search.length, this_len) === search;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"'
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  let determiner;
  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  let msg;
  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = `The ${name} ${determiner} ${oneOf(expected, 'type')}`;
  } else {
    const type = includes(name, '.') ? 'property' : 'argument';
    msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, 'type')}`;
  }

  msg += `. Received type ${typeof actual}`;
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented'
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');

module.exports.q = codes;


/***/ }),

/***/ 1359:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


module.exports = Duplex;

var Readable = __nccwpck_require__(1433);

var Writable = __nccwpck_require__(6993);

__nccwpck_require__(4124)(Duplex, Readable);

{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(Writable.prototype);

  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  this.allowHalfOpen = true;

  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;

    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
}); // the no-half-open enforcer

function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  process.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

/***/ }),

/***/ 1542:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.


module.exports = PassThrough;

var Transform = __nccwpck_require__(4415);

__nccwpck_require__(4124)(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),

/***/ 1433:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


module.exports = Readable;
/*<replacement>*/

var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;
/*<replacement>*/

var EE = __nccwpck_require__(8614).EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/


var Stream = __nccwpck_require__(2387);
/*</replacement>*/


var Buffer = __nccwpck_require__(4293).Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*<replacement>*/


var debugUtil = __nccwpck_require__(1669);

var debug;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/


var BufferList = __nccwpck_require__(2746);

var destroyImpl = __nccwpck_require__(7049);

var _require = __nccwpck_require__(9948),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = __nccwpck_require__(7214)/* .codes */ .q,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.


var StringDecoder;
var createReadableStreamAsyncIterator;
var from;

__nccwpck_require__(4124)(Readable, Stream);

var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || __nccwpck_require__(1359);
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

  this.autoDestroy = !!options.autoDestroy; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __nccwpck_require__(4841)/* .StringDecoder */ .s;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __nccwpck_require__(1359);
  if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;

Readable.prototype._destroy = function (err, cb) {
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  } // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.


  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }

  return er;
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __nccwpck_require__(4841)/* .StringDecoder */ .s;
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

  this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

  var p = this._readableState.buffer.head;
  var content = '';

  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }

  this._readableState.buffer.clear();

  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
}; // Don't raise the hwm > 1GB


var MAX_HWM = 0x40000000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true;

  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;

    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}

function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);

  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  } // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.


  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);

    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      });
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);

      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);

  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);

  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;

  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true; // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume'); // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()

    state.flowing = !state.readableListening;
    resume(this, state);
  }

  state.paused = false;
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  debug('resume', state.reading);

  if (!state.reading) {
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  this._readableState.paused = true;
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {
    ;
  }
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = __nccwpck_require__(3306);
    }

    return createReadableStreamAsyncIterator(this);
  };
}

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
}); // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');

    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;

      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}

if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = __nccwpck_require__(9082);
    }

    return from(Readable, iterable, opts);
  };
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}

/***/ }),

/***/ 4415:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.


module.exports = Transform;

var _require$codes = __nccwpck_require__(7214)/* .codes */ .q,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;

var Duplex = __nccwpck_require__(1359);

__nccwpck_require__(4124)(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}

/***/ }),

/***/ 6993:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.


module.exports = Writable;
/* <replacement> */

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
} // It seems a linked list but it is not
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;
/*<replacement>*/

var internalUtil = {
  deprecate: __nccwpck_require__(7127)
};
/*</replacement>*/

/*<replacement>*/

var Stream = __nccwpck_require__(2387);
/*</replacement>*/


var Buffer = __nccwpck_require__(4293).Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

var destroyImpl = __nccwpck_require__(7049);

var _require = __nccwpck_require__(9948),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = __nccwpck_require__(7214)/* .codes */ .q,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
    ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;

var errorOrDestroy = destroyImpl.errorOrDestroy;

__nccwpck_require__(4124)(Writable, Stream);

function nop() {}

function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || __nccwpck_require__(1359);
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')

  this.autoDestroy = !!options.autoDestroy; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __nccwpck_require__(1359); // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};

function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

  errorOrDestroy(stream, er);
  process.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var er;

  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }

  if (er) {
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
    return false;
  }

  return true;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  this._writableState.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending) endWritable(this, state, cb);
  return this;
};

Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      errorOrDestroy(stream, err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');

      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;

        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  } // reuse the free corkReq.


  state.corkedRequestsFree.next = corkReq;
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;

Writable.prototype._destroy = function (err, cb) {
  cb(err);
};

/***/ }),

/***/ 3306:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var _Object$setPrototypeO;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var finished = __nccwpck_require__(6080);

var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this;

    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;

  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

module.exports = createReadableStreamAsyncIterator;

/***/ }),

/***/ 2746:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = __nccwpck_require__(4293),
    Buffer = _require.Buffer;

var _require2 = __nccwpck_require__(1669),
    inspect = _require2.inspect;

var custom = inspect && inspect.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}

module.exports =
/*#__PURE__*/
function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    } // Consumes a specified amount of bytes or characters from the buffered data.

  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;

      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }

      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    } // Consumes a specified amount of characters from the buffered data.

  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;

      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;

        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Consumes a specified amount of bytes from the buffered data.

  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;

      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;

        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Make sure the linked list only shows the minimal necessary information.

  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread({}, options, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);

  return BufferList;
}();

/***/ }),

/***/ 7049:
/***/ ((module) => {

"use strict";
 // undocumented cb() API, needed for core, not for public API

function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.
  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};

/***/ }),

/***/ 6080:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).


var ERR_STREAM_PREMATURE_CLOSE = __nccwpck_require__(7214)/* .codes.ERR_STREAM_PREMATURE_CLOSE */ .q.ERR_STREAM_PREMATURE_CLOSE;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callback.apply(this, args);
  };
}

function noop() {}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;

  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };

  var writableEnded = stream._writableState && stream._writableState.finished;

  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };

  var readableEnded = stream._readableState && stream._readableState.endEmitted;

  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };

  var onerror = function onerror(err) {
    callback.call(stream, err);
  };

  var onclose = function onclose() {
    var err;

    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }

    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };

  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };

  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}

module.exports = eos;

/***/ }),

/***/ 9082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ERR_INVALID_ARG_TYPE = __nccwpck_require__(7214)/* .codes.ERR_INVALID_ARG_TYPE */ .q.ERR_INVALID_ARG_TYPE;

function from(Readable, iterable, opts) {
  var iterator;

  if (iterable && typeof iterable.next === 'function') {
    iterator = iterable;
  } else if (iterable && iterable[Symbol.asyncIterator]) iterator = iterable[Symbol.asyncIterator]();else if (iterable && iterable[Symbol.iterator]) iterator = iterable[Symbol.iterator]();else throw new ERR_INVALID_ARG_TYPE('iterable', ['Iterable'], iterable);

  var readable = new Readable(_objectSpread({
    objectMode: true
  }, opts)); // Reading boolean to protect against _read
  // being called before last iteration completion.

  var reading = false;

  readable._read = function () {
    if (!reading) {
      reading = true;
      next();
    }
  };

  function next() {
    return _next2.apply(this, arguments);
  }

  function _next2() {
    _next2 = _asyncToGenerator(function* () {
      try {
        var _ref = yield iterator.next(),
            value = _ref.value,
            done = _ref.done;

        if (done) {
          readable.push(null);
        } else if (readable.push((yield value))) {
          next();
        } else {
          reading = false;
        }
      } catch (err) {
        readable.destroy(err);
      }
    });
    return _next2.apply(this, arguments);
  }

  return readable;
}

module.exports = from;

/***/ }),

/***/ 6989:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).


var eos;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}

var _require$codes = __nccwpck_require__(7214)/* .codes */ .q,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;

function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = __nccwpck_require__(6080);
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true; // request.destroy just do .end - .abort is what we want

    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}

function call(fn) {
  fn();
}

function pipe(from, to) {
  return from.pipe(to);
}

function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}

function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }

  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}

module.exports = pipeline;

/***/ }),

/***/ 9948:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var ERR_INVALID_OPT_VALUE = __nccwpck_require__(7214)/* .codes.ERR_INVALID_OPT_VALUE */ .q.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

module.exports = {
  getHighWaterMark: getHighWaterMark
};

/***/ }),

/***/ 2387:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(2413);


/***/ }),

/***/ 1642:
/***/ ((module, exports, __nccwpck_require__) => {

var Stream = __nccwpck_require__(2413);
if (process.env.READABLE_STREAM === 'disable' && Stream) {
  module.exports = Stream.Readable;
  Object.assign(module.exports, Stream);
  module.exports.Stream = Stream;
} else {
  exports = module.exports = __nccwpck_require__(1433);
  exports.Stream = Stream || exports;
  exports.Readable = exports;
  exports.Writable = __nccwpck_require__(6993);
  exports.Duplex = __nccwpck_require__(1359);
  exports.Transform = __nccwpck_require__(4415);
  exports.PassThrough = __nccwpck_require__(1542);
  exports.finished = __nccwpck_require__(6080);
  exports.pipeline = __nccwpck_require__(6989);
}


/***/ }),

/***/ 4347:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(6244);

/***/ }),

/***/ 6244:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var RetryOperation = __nccwpck_require__(5369);

exports.operation = function(options) {
  var timeouts = exports.timeouts(options);
  return new RetryOperation(timeouts, {
      forever: options && options.forever,
      unref: options && options.unref,
      maxRetryTime: options && options.maxRetryTime
  });
};

exports.timeouts = function(options) {
  if (options instanceof Array) {
    return [].concat(options);
  }

  var opts = {
    retries: 10,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: Infinity,
    randomize: false
  };
  for (var key in options) {
    opts[key] = options[key];
  }

  if (opts.minTimeout > opts.maxTimeout) {
    throw new Error('minTimeout is greater than maxTimeout');
  }

  var timeouts = [];
  for (var i = 0; i < opts.retries; i++) {
    timeouts.push(this.createTimeout(i, opts));
  }

  if (options && options.forever && !timeouts.length) {
    timeouts.push(this.createTimeout(i, opts));
  }

  // sort the array numerically ascending
  timeouts.sort(function(a,b) {
    return a - b;
  });

  return timeouts;
};

exports.createTimeout = function(attempt, opts) {
  var random = (opts.randomize)
    ? (Math.random() + 1)
    : 1;

  var timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
  timeout = Math.min(timeout, opts.maxTimeout);

  return timeout;
};

exports.wrap = function(obj, options, methods) {
  if (options instanceof Array) {
    methods = options;
    options = null;
  }

  if (!methods) {
    methods = [];
    for (var key in obj) {
      if (typeof obj[key] === 'function') {
        methods.push(key);
      }
    }
  }

  for (var i = 0; i < methods.length; i++) {
    var method   = methods[i];
    var original = obj[method];

    obj[method] = function retryWrapper(original) {
      var op       = exports.operation(options);
      var args     = Array.prototype.slice.call(arguments, 1);
      var callback = args.pop();

      args.push(function(err) {
        if (op.retry(err)) {
          return;
        }
        if (err) {
          arguments[0] = op.mainError();
        }
        callback.apply(this, arguments);
      });

      op.attempt(function() {
        original.apply(obj, args);
      });
    }.bind(obj, original);
    obj[method].options = options;
  }
};


/***/ }),

/***/ 5369:
/***/ ((module) => {

function RetryOperation(timeouts, options) {
  // Compatibility for the old (timeouts, retryForever) signature
  if (typeof options === 'boolean') {
    options = { forever: options };
  }

  this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
  this._timeouts = timeouts;
  this._options = options || {};
  this._maxRetryTime = options && options.maxRetryTime || Infinity;
  this._fn = null;
  this._errors = [];
  this._attempts = 1;
  this._operationTimeout = null;
  this._operationTimeoutCb = null;
  this._timeout = null;
  this._operationStart = null;

  if (this._options.forever) {
    this._cachedTimeouts = this._timeouts.slice(0);
  }
}
module.exports = RetryOperation;

RetryOperation.prototype.reset = function() {
  this._attempts = 1;
  this._timeouts = this._originalTimeouts;
}

RetryOperation.prototype.stop = function() {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  this._timeouts       = [];
  this._cachedTimeouts = null;
};

RetryOperation.prototype.retry = function(err) {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  if (!err) {
    return false;
  }
  var currentTime = new Date().getTime();
  if (err && currentTime - this._operationStart >= this._maxRetryTime) {
    this._errors.unshift(new Error('RetryOperation timeout occurred'));
    return false;
  }

  this._errors.push(err);

  var timeout = this._timeouts.shift();
  if (timeout === undefined) {
    if (this._cachedTimeouts) {
      // retry forever, only keep last error
      this._errors.splice(this._errors.length - 1, this._errors.length);
      this._timeouts = this._cachedTimeouts.slice(0);
      timeout = this._timeouts.shift();
    } else {
      return false;
    }
  }

  var self = this;
  var timer = setTimeout(function() {
    self._attempts++;

    if (self._operationTimeoutCb) {
      self._timeout = setTimeout(function() {
        self._operationTimeoutCb(self._attempts);
      }, self._operationTimeout);

      if (self._options.unref) {
          self._timeout.unref();
      }
    }

    self._fn(self._attempts);
  }, timeout);

  if (this._options.unref) {
      timer.unref();
  }

  return true;
};

RetryOperation.prototype.attempt = function(fn, timeoutOps) {
  this._fn = fn;

  if (timeoutOps) {
    if (timeoutOps.timeout) {
      this._operationTimeout = timeoutOps.timeout;
    }
    if (timeoutOps.cb) {
      this._operationTimeoutCb = timeoutOps.cb;
    }
  }

  var self = this;
  if (this._operationTimeoutCb) {
    this._timeout = setTimeout(function() {
      self._operationTimeoutCb();
    }, self._operationTimeout);
  }

  this._operationStart = new Date().getTime();

  this._fn(this._attempts);
};

RetryOperation.prototype.try = function(fn) {
  console.log('Using RetryOperation.try() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = function(fn) {
  console.log('Using RetryOperation.start() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = RetryOperation.prototype.try;

RetryOperation.prototype.errors = function() {
  return this._errors;
};

RetryOperation.prototype.attempts = function() {
  return this._attempts;
};

RetryOperation.prototype.mainError = function() {
  if (this._errors.length === 0) {
    return null;
  }

  var counts = {};
  var mainError = null;
  var mainErrorCount = 0;

  for (var i = 0; i < this._errors.length; i++) {
    var error = this._errors[i];
    var message = error.message;
    var count = (counts[message] || 0) + 1;

    counts[message] = count;

    if (count >= mainErrorCount) {
      mainError = error;
      mainErrorCount = count;
    }
  }

  return mainError;
};


/***/ }),

/***/ 1867:
/***/ ((module, exports, __nccwpck_require__) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = __nccwpck_require__(4293)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ 5118:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable node/no-deprecated-api */



var buffer = __nccwpck_require__(4293)
var Buffer = buffer.Buffer

var safer = {}

var key

for (key in buffer) {
  if (!buffer.hasOwnProperty(key)) continue
  if (key === 'SlowBuffer' || key === 'Buffer') continue
  safer[key] = buffer[key]
}

var Safer = safer.Buffer = {}
for (key in Buffer) {
  if (!Buffer.hasOwnProperty(key)) continue
  if (key === 'allocUnsafe' || key === 'allocUnsafeSlow') continue
  Safer[key] = Buffer[key]
}

safer.Buffer.prototype = Buffer.prototype

if (!Safer.from || Safer.from === Uint8Array.from) {
  Safer.from = function (value, encodingOrOffset, length) {
    if (typeof value === 'number') {
      throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value)
    }
    if (value && typeof value.length === 'undefined') {
      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' + typeof value)
    }
    return Buffer(value, encodingOrOffset, length)
  }
}

if (!Safer.alloc) {
  Safer.alloc = function (size, fill, encoding) {
    if (typeof size !== 'number') {
      throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size)
    }
    if (size < 0 || size >= 2 * (1 << 30)) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"')
    }
    var buf = Buffer(size)
    if (!fill || fill.length === 0) {
      buf.fill(0)
    } else if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
    return buf
  }
}

if (!safer.kStringMaxLength) {
  try {
    safer.kStringMaxLength = process.binding('buffer').kStringMaxLength
  } catch (e) {
    // we can't determine kStringMaxLength in environments where process.binding
    // is unsupported, so let's not set it
  }
}

if (!safer.constants) {
  safer.constants = {
    MAX_LENGTH: safer.kMaxLength
  }
  if (safer.kStringMaxLength) {
    safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength
  }
}

module.exports = safer


/***/ }),

/***/ 3232:
/***/ ((module) => {

const errorCode = {
  generic: 'ERR_GENERIC_CLIENT',
  connect: 'ERR_NOT_CONNECTED',
  badPath: 'ERR_BAD_PATH',
  permission: 'EACCES',
  notexist: 'ENOENT',
  notdir: 'ENOTDIR',
};

const targetType = {
  writeFile: 1,
  readFile: 2,
  writeDir: 3,
  readDir: 4,
  readObj: 5,
  writeObj: 6,
};

module.exports = {
  errorCode,
  targetType,
};


/***/ }),

/***/ 7551:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/**
 * ssh2 sftp client for node
 */



const { Client } = __nccwpck_require__(5869);
const fs = __nccwpck_require__(5747);
const concat = __nccwpck_require__(5107);
const promiseRetry = __nccwpck_require__(4742);
const { join, parse } = __nccwpck_require__(5622);
const {
  fmtError,
  addTempListeners,
  removeTempListeners,
  haveConnection,
  normalizeRemotePath,
  localExists,
  haveLocalAccess,
  haveLocalCreate,
  sleep,
} = __nccwpck_require__(9432);
const { errorCode } = __nccwpck_require__(3232);

class SftpClient {
  constructor(clientName) {
    this.client = new Client();
    this.sftp = undefined;
    this.clientName = clientName ? clientName : 'sftp';
    this.endCalled = false;
    this.errorHandled = false;
    this.closeHandled = false;
    this.endHandled = false;
    this.remotePathSep = '/';
    this.remotePlatform = 'unix';
    this.debug = undefined;

    this.client.on('close', () => {
      if (this.endCalled || this.closeHandled) {
        // we are processing an expected end event or close event handled elsewhere
        this.debugMsg('Global: Ignoring handled close event');
      } else {
        this.debugMsg('Global: Handling unexpected close event');
        this.sftp = undefined;
      }
    });

    this.client.on('end', () => {
      if (this.endCalled || this.endHandled) {
        // end event expected or handled elsewhere
        this.debugMsg('Global: Ignoring hanlded end event');
      } else {
        this.debugMsg('Global: Handling unexpected end event');
        this.sftp = undefined;
      }
    });

    this.client.on('error', (err) => {
      if (this.endCalled || this.errorHandled) {
        // error event expected or handled elsewhere
        this.debugMsg(`Global: Ignoring handled error: ${err.message}`);
      } else {
        this.debugMsg(`Global; Handling unexpected error; ${err.message}`);
        this.sftp = undefined;
        console.log(
          `ssh2-sftp-client: Unexpected error: ${err.message}. Error code: ${err.code}`
        );
      }
    });
  }

  debugMsg(msg, obj) {
    if (this.debug) {
      if (obj) {
        this.debug(
          `CLIENT[${this.clientName}]: ${msg} ${JSON.stringify(obj, null, ' ')}`
        );
      } else {
        this.debug(`CLIENT[${this.clientName}]: ${msg}`);
      }
    }
  }

  /**
   * Add a listner to the client object. This is rarely necessary and can be
   * the source of errors. It is the client's responsibility to remove the
   * listeners when no longer required. Failure to do so can result in memory
   * leaks.
   *
   * @param {string} eventType - one of the supported event types
   * @param {function} callback - function called when event triggers
   */
  on(eventType, callback) {
    this.debugMsg(`Adding listener to ${eventType} event`);
    this.client.prependListener(eventType, callback);
  }

  removeListener(eventType, callback) {
    this.debugMsg(`Removing listener from ${eventType} event`);
    this.client.removeListener(eventType, callback);
  }

  _resetEventFlags() {
    this.closeHandled = false;
    this.endHandled = false;
    this.errorHandled = false;
  }

  /**
   * @async
   *
   * Create a new SFTP connection to a remote SFTP server
   *
   * @param {Object} config - an SFTP configuration object
   *
   * @return {Promise<Object>} which will resolve to an sftp client object
   *
   */
  getConnection(config) {
    let doReady, listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'getConnection', reject);
      this.debugMsg('getConnection: created promise');
      doReady = () => {
        this.debugMsg(
          'getConnection ready listener: got connection - promise resolved'
        );
        resolve(true);
      };
      this.on('ready', doReady);
      this.client.connect(config);
    }).finally(async () => {
      this.debugMsg('getConnection: finally clause fired');
      await sleep(500);
      this.removeListener('ready', doReady);
      removeTempListeners(this, listeners, 'getConnection');
      this._resetEventFlags();
    });
  }

  getSftpChannel() {
    let listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'getSftpChannel', reject);
      this.debugMsg('getSftpChannel: created promise');
      this.client.sftp((err, sftp) => {
        if (err) {
          this.debugMsg(`getSftpChannel: SFTP Channel Error: ${err.message}`);
          this.client.end();
          reject(fmtError(err, 'getSftpChannel', err.code));
        } else {
          this.debugMsg('getSftpChannel: SFTP channel established');
          this.sftp = sftp;
          resolve(sftp);
        }
      });
    }).finally(() => {
      this.debugMsg('getSftpChannel: finally clause fired');
      removeTempListeners(this, listeners, 'getSftpChannel');
      this._resetEventFlags();
    });
  }

  /**
   * @async
   *
   * Create a new SFTP connection to a remote SFTP server.
   * The connection options are the same as those offered
   * by the underlying SSH2 module.
   *
   * @param {Object} config - an SFTP configuration object
   *
   * @return {Promise<Object>} which will resolve to an sftp client object
   *
   */
  async connect(config) {
    try {
      if (config.debug) {
        this.debug = config.debug;
        this.debugMsg('connect: Debugging turned on');
      }
      if (this.sftp) {
        this.debugMsg('connect: Already connected - reject');
        throw fmtError(
          'An existing SFTP connection is already defined',
          'connect',
          errorCode.connect
        );
      }
      await promiseRetry(
        (retry, attempt) => {
          this.debugMsg(`connect: Connect attempt ${attempt}`);
          return this.getConnection(config).catch((err) => {
            this.debugMsg(
              `getConnection retry catch: ${err.message} Code: ${err.code}`
            );
            switch (err.code) {
              case 'ENOTFOUND':
              case 'ECONNREFUSED':
              case 'ERR_SOCKET_BAD_PORT':
                throw err;
              default:
                retry(err);
            }
          });
        },
        {
          retries: config.retries || 1,
          factor: config.retry_factor || 2,
          minTimeout: config.retry_minTimeout || 1000,
        }
      );
      return this.getSftpChannel();
    } catch (err) {
      this.debugMsg(`connect: Error ${err.message}`);
      this._resetEventFlags();
      throw fmtError(err, 'connect');
    }
  }

  /**
   * @async
   *
   * Returns the real absolute path on the remote server. Is able to handle
   * both '.' and '..' in path names, but not '~'. If the path is relative
   * then the current working directory is prepended to create an absolute path.
   * Returns undefined if the path does not exists.
   *
   * @param {String} remotePath - remote path, may be relative
   * @returns {Promise<String>} - remote absolute path or ''
   */
  realPath(remotePath) {
    let listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'realPath', reject);
      this.debugMsg(`realPath -> ${remotePath}`);
      if (haveConnection(this, 'realPath', reject)) {
        this.sftp.realpath(remotePath, (err, absPath) => {
          if (err) {
            this.debugMsg(`realPath Error: ${err.message} Code: ${err.code}`);
            if (err.code === 2) {
              resolve('');
            } else {
              reject(
                fmtError(`${err.message} ${remotePath}`, 'realPath', err.code)
              );
            }
          }
          this.debugMsg(`realPath <- ${absPath}`);
          resolve(absPath);
        });
      }
    }).finally(() => {
      removeTempListeners(this, listeners, 'realPath');
      this._resetEventFlags();
    });
  }

  /**
   * @async
   *
   * Return the current workding directory path
   *
   * @returns {Promise<String>} - current remote working directory
   */
  cwd() {
    return this.realPath('.');
  }

  /**
   * Retrieves attributes for path
   *
   * @param {String} remotePath - a string containing the path to a file
   * @return {Promise<Object>} stats - attributes info
   */
  async stat(remotePath) {
    const _stat = (aPath) => {
      let listeners;
      return new Promise((resolve, reject) => {
        listeners = addTempListeners(this, '_stat', reject);
        this.debugMsg(`_stat: ${aPath}`);
        this.sftp.stat(aPath, (err, stats) => {
          if (err) {
            this.debugMsg(`_stat: Error ${err.message} code: ${err.code}`);
            if (err.code === 2 || err.code === 4) {
              reject(
                fmtError(
                  `No such file: ${remotePath}`,
                  '_stat',
                  errorCode.notexist
                )
              );
            } else {
              reject(
                fmtError(`${err.message} ${remotePath}`, '_stat', err.code)
              );
            }
          } else {
            let result = {
              mode: stats.mode,
              uid: stats.uid,
              gid: stats.gid,
              size: stats.size,
              accessTime: stats.atime * 1000,
              modifyTime: stats.mtime * 1000,
              isDirectory: stats.isDirectory(),
              isFile: stats.isFile(),
              isBlockDevice: stats.isBlockDevice(),
              isCharacterDevice: stats.isCharacterDevice(),
              isSymbolicLink: stats.isSymbolicLink(),
              isFIFO: stats.isFIFO(),
              isSocket: stats.isSocket(),
            };
            this.debugMsg('_stat: stats <- ', result);
            resolve(result);
          }
        });
      }).finally(() => {
        removeTempListeners(this, listeners, '_stat');
      });
    };

    try {
      haveConnection(this, 'stat');
      let absPath = await normalizeRemotePath(this, remotePath);
      return _stat(absPath);
    } catch (err) {
      this._resetEventFlags();
      throw err.custom ? err : fmtError(err, 'stat', err.code);
    }
  }

  /**
   * @async
   *
   * Tests to see if an object exists. If it does, return the type of that object
   * (in the format returned by list). If it does not exist, return false.
   *
   * @param {string} remotePath - path to the object on the sftp server.
   *
   * @return {Promise<Boolean|String>} returns false if object does not exist. Returns type of
   *                   object if it does
   */
  async exists(remotePath) {
    try {
      if (haveConnection(this, 'exists')) {
        if (remotePath === '.') {
          this.debugMsg('exists: . = d');
          return 'd';
        }
        let absPath = await normalizeRemotePath(this, remotePath);
        try {
          this.debugMsg(`exists: ${remotePath} -> ${absPath}`);
          let info = await this.stat(absPath);
          this.debugMsg('exists: <- ', info);
          if (info.isDirectory) {
            this.debugMsg(`exists: ${remotePath} = d`);
            return 'd';
          }
          if (info.isSymbolicLink) {
            this.debugMsg(`exists: ${remotePath} = l`);
            return 'l';
          }
          if (info.isFile) {
            this.debugMsg(`exists: ${remotePath} = -`);
            return '-';
          }
          this.debugMsg(`exists: ${remotePath} = false`);
          return false;
        } catch (err) {
          if (err.code === errorCode.notexist) {
            this.debugMsg(
              `exists: ${remotePath} = false errorCode = ${err.code}`
            );
            return false;
          }
          this.debugMsg(`exists: throw error ${err.message} ${err.code}`);
          throw err;
        }
      }
      this.debugMsg(`exists: default ${remotePath} = false`);
      return false;
    } catch (err) {
      this._resetEventFlags();
      throw err.custom ? err : fmtError(err, 'exists', err.code);
    }
  }

  /**
   * @async
   *
   * List contents of a remote directory. If a pattern is provided,
   * filter the results to only include files with names that match
   * the supplied pattern. Return value is an array of file entry
   * objects that include properties for type, name, size, modifiyTime,
   * accessTime, rights {user, group other}, owner and group.
   *
   * @param {String} remotePath - path to remote directory
   * @param {RegExp} pattern - regular expression to match filenames
   * @returns {Promise<Array>} array of file description objects
   */
  list(remotePath, pattern = /.*/) {
    let listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'list', reject);
      if (haveConnection(this, 'list', reject)) {
        const reg = /-/gi;
        this.debugMsg(`list: ${remotePath} filter: ${pattern}`);
        this.sftp.readdir(remotePath, (err, fileList) => {
          if (err) {
            this.debugMsg(`list: Error ${err.message} code: ${err.code}`);
            reject(fmtError(`${err.message} ${remotePath}`, 'list', err.code));
          } else {
            let newList = [];
            // reset file info
            if (fileList) {
              newList = fileList.map((item) => {
                return {
                  type: item.longname.slice(0, 1),
                  name: item.filename,
                  size: item.attrs.size,
                  modifyTime: item.attrs.mtime * 1000,
                  accessTime: item.attrs.atime * 1000,
                  rights: {
                    user: item.longname.slice(1, 4).replace(reg, ''),
                    group: item.longname.slice(4, 7).replace(reg, ''),
                    other: item.longname.slice(7, 10).replace(reg, ''),
                  },
                  owner: item.attrs.uid,
                  group: item.attrs.gid,
                };
              });
            }
            // provide some compatibility for auxList
            let regex;
            if (pattern instanceof RegExp) {
              regex = pattern;
            } else {
              let newPattern = pattern.replace(/\*([^*])*?/gi, '.*');
              regex = new RegExp(newPattern);
            }
            let filteredList = newList.filter((item) => regex.test(item.name));
            this.debugMsg('list: result: ', filteredList);
            resolve(filteredList);
          }
        });
      }
    }).finally(() => {
      removeTempListeners(this, listeners, 'list');
      this._resetEventFlags();
    });
  }

  /**
   * get file
   *
   * If a dst argument is provided, it must be either a string, representing the
   * local path to where the data will be put, a stream, in which case data is
   * piped into the stream or undefined, in which case the data is returned as
   * a Buffer object.
   *
   * @param {String} remotePath - remote file path
   * @param {string|stream|undefined} dst - data destination
   * @param {Object} options - options object with supported properties of readStreamOptions,
   *                          writeStreamOptions and pipeOptions.
   *
   * @return {Promise<String|Stream|Buffer>}
   */
  get(
    remotePath,
    dst,
    options = { readStreamOptions: {}, writeStreamOptions: {}, pipeOptions: {} }
  ) {
    let rdr, wtr, listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'get', reject);
      if (haveConnection(this, 'get', reject)) {
        this.debugMsg(`get -> ${remotePath} `, options);
        rdr = this.sftp.createReadStream(
          remotePath,
          options.readStreamOptions ? options.readStreamOptions : {}
        );
        rdr.once('error', (err) => {
          reject(fmtError(`${err.message} ${remotePath}`, 'get', err.code));
        });
        if (dst === undefined) {
          // no dst specified, return buffer of data
          this.debugMsg('get returning buffer of data');
          wtr = concat((buff) => {
            //rdr.removeAllListeners('error');
            resolve(buff);
          });
        } else {
          if (typeof dst === 'string') {
            // dst local file path
            this.debugMsg('get returning local file');
            const localCheck = haveLocalCreate(dst);
            if (!localCheck.status) {
              return reject(
                fmtError(
                  `Bad path: ${dst}: ${localCheck.details}`,
                  'get',
                  localCheck.code
                )
              );
            }
            wtr = fs.createWriteStream(
              dst,
              options.writeStreamOptions ? options.writeStreamOptions : {}
            );
          } else {
            this.debugMsg('get returning data into supplied stream');
            wtr = dst;
          }
          wtr.once('error', (err) => {
            reject(
              fmtError(
                `${err.message} ${typeof dst === 'string' ? dst : ''}`,
                'get',
                err.code
              )
            );
          });
          if (
            Object.hasOwnProperty.call(options, 'pipeOptions') &&
            Object.hasOwnProperty.call(options.pipeOptions, 'end') &&
            !options.pipeOptions.end
          ) {
            rdr.once('end', () => {
              this.debugMsg('get resolved on reader end event');
              if (typeof dst === 'string') {
                resolve(dst);
              } else {
                resolve(wtr);
              }
            });
          } else {
            wtr.once('finish', () => {
              this.debugMsg('get resolved on writer finish event');
              if (typeof dst === 'string') {
                resolve(dst);
              } else {
                resolve(wtr);
              }
            });
          }
        }
        rdr.pipe(wtr, options.pipeOptions ? options.pipeOptions : {});
      }
    }).finally(() => {
      removeTempListeners(this, listeners, 'get');
      this._resetEventFlags();
      if (
        rdr &&
        Object.hasOwnProperty.call(options, 'readStreamOptions') &&
        Object.hasOwnProperty.call(options.readStreamOptions, 'autoClose') &&
        options.readStreamOptions.autoClose === false
      ) {
        rdr.destroy();
      }
      if (
        wtr &&
        Object.hasOwnProperty.call(options, 'writeStreamOptions') &&
        Object.hasOwnProperty.call(options.writeStreamOptions, 'autoClose') &&
        options.writeStreamOptions.autoClose === false &&
        typeof dst === 'string'
      ) {
        wtr.destroy();
      }
    });
  }

  /**
   * Use SSH2 fastGet for downloading the file.
   * Downloads a file at remotePath to localPath using parallel reads
   * for faster throughput.
   *
   * @param {String} remotePath
   * @param {String} localPath
   * @param {Object} options
   * @return {Promise<String>} the result of downloading the file
   */
  async fastGet(remotePath, localPath, options) {
    try {
      const ftype = await this.exists(remotePath);
      if (ftype !== '-') {
        const msg =
          ftype === false
            ? `No such file ${remotePath}`
            : `Not a regular file ${remotePath}`;
        let err = new Error(msg);
        err.code = errorCode.badPath;
        throw err;
      }
      const localCheck = haveLocalCreate(localPath);
      if (!localCheck.status) {
        let err = new Error(`Bad path: ${localPath}: ${localCheck.details}`);
        err.code = errorCode.badPath;
        throw err;
      }
      let listeners;
      let rslt = await new Promise((resolve, reject) => {
        listeners = addTempListeners(this, 'fastGet', reject);
        if (haveConnection(this, 'fastGet', reject)) {
          this.debugMsg(
            `fastGet -> remote: ${remotePath} local: ${localPath} `,
            options
          );
          this.sftp.fastGet(remotePath, localPath, options, (err) => {
            if (err) {
              this.debugMsg(`fastGet error ${err.message} code: ${err.code}`);
              reject(err);
            }
            resolve(`${remotePath} was successfully download to ${localPath}!`);
          });
        }
      }).finally(() => {
        removeTempListeners(this, listeners, 'fastGet');
      });
      return rslt;
    } catch (err) {
      this._resetEventFlags();
      throw fmtError(err, 'fastGet');
    }
  }

  /**
   * Use SSH2 fastPut for uploading the file.
   * Uploads a file from localPath to remotePath using parallel reads
   * for faster throughput.
   *
   * See 'fastPut' at
   * https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
   *
   * @param {String} localPath
   * @param {String} remotePath
   * @param {Object} options
   * @return {Promise<String>} the result of downloading the file
   */
  fastPut(localPath, remotePath, options) {
    let listeners;
    this.debugMsg(`fastPut -> local ${localPath} remote ${remotePath}`);
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'fastPut', reject);
      const localCheck = haveLocalAccess(localPath);
      if (!localCheck.status) {
        reject(
          fmtError(
            `Bad path: ${localPath}: ${localCheck.details}`,
            'fastPut',
            localCheck.code
          )
        );
      } else if (localCheck.status && localExists(localPath) === 'd') {
        reject(
          fmtError(
            `Bad path: ${localPath} not a regular file`,
            'fastPut',
            errorCode.badPath
          )
        );
      } else if (haveConnection(this, 'fastPut', reject)) {
        this.debugMsg(
          `fastPut -> local: ${localPath} remote: ${remotePath} opts: ${JSON.stringify(
            options
          )}`
        );
        this.sftp.fastPut(localPath, remotePath, options, (err) => {
          if (err) {
            this.debugMsg(`fastPut error ${err.message} ${err.code}`);
            reject(
              fmtError(
                `${err.message} Local: ${localPath} Remote: ${remotePath}`,
                'fastPut',
                err.code
              )
            );
          }
          this.debugMsg('fastPut file transferred');
          resolve(`${localPath} was successfully uploaded to ${remotePath}!`);
        });
      }
    }).finally(() => {
      removeTempListeners(this, listeners, 'fastPut');
      this._resetEventFlags();
    });
  }

  /**
   * Create a file on the remote server. The 'src' argument
   * can be a buffer, string or read stream. If 'src' is a string, it
   * should be the path to a local file.
   *
   * @param  {String|Buffer|stream} localSrc - source data to use
   * @param  {String} remotePath - path to remote file
   * @param  {Object} options - options used for read, write stream and pipe configuration
   *                            value supported by node. Allowed properties are readStreamOptions,
   *                            writeStreamOptions and pipeOptions.
   * @return {Promise<String>}
   */
  put(
    localSrc,
    remotePath,
    options = {
      readStreamOptions: {},
      writeStreamOptions: { autoClose: true },
      pipeOptions: {},
    }
  ) {
    let wtr, rdr, listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'put', reject);
      if (typeof localSrc === 'string') {
        const localCheck = haveLocalAccess(localSrc);
        if (!localCheck.status) {
          this.debugMsg(`put: local source check error ${localCheck.details}`);
          return reject(
            fmtError(
              `Bad path: ${localSrc}: ${localCheck.details}`,
              'put',
              localCheck.code
            )
          );
        }
      }
      if (haveConnection(this, 'put')) {
        wtr = this.sftp.createWriteStream(
          remotePath,
          options.writeStreamOptions
            ? { ...options.writeStreamOptions, autoClose: true }
            : {}
        );
        wtr.once('error', (err) => {
          this.debugMsg(`put: write stream error ${err.message}`);
          reject(fmtError(`${err.message} ${remotePath}`, 'put', err.code));
        });
        wtr.once('close', () => {
          this.debugMsg('put: promise resolved');
          resolve(`Uploaded data stream to ${remotePath}`);
        });
        if (localSrc instanceof Buffer) {
          this.debugMsg('put source is a buffer');
          wtr.end(localSrc);
        } else {
          if (typeof localSrc === 'string') {
            this.debugMsg(`put source is a file path: ${localSrc}`);
            rdr = fs.createReadStream(
              localSrc,
              options.readStreamOptions ? options.readStreamOptions : {}
            );
          } else {
            this.debugMsg('put source is a stream');
            rdr = localSrc;
          }
          rdr.once('error', (err) => {
            this.debugMsg(`put: read stream error ${err.message}`);
            reject(
              fmtError(
                `${err.message} ${
                  typeof localSrc === 'string' ? localSrc : ''
                }`,
                'put',
                err.code
              )
            );
          });
          rdr.pipe(wtr, options.pipeOptions ? options.pipeOptions : {});
        }
      }
    }).finally(() => {
      removeTempListeners(this, listeners, 'put');
      this._resetEventFlags();
      if (
        rdr &&
        Object.hasOwnProperty.call(options, 'readStreamOptions') &&
        Object.hasOwnProperty.call(options.readStreamOptions, 'autoClose') &&
        options.readStreamOptions.autoClose === false &&
        typeof localSrc === 'string'
      ) {
        rdr.destroy();
      }
    });
  }

  /**
   * Append to an existing remote file
   *
   * @param  {Buffer|stream} input
   * @param  {String} remotePath
   * @param  {Object} options
   * @return {Promise<String>}
   */
  async append(input, remotePath, options = {}) {
    const fileType = await this.exists(remotePath);
    if (fileType && fileType === 'd') {
      throw fmtError(
        `Bad path: ${remotePath}: cannot append to a directory`,
        'append',
        errorCode.badPath
      );
    }
    let listeners;
    return await new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'append', reject);
      if (haveConnection(this, 'append', reject)) {
        if (typeof input === 'string') {
          reject(fmtError('Cannot append one file to another', 'append'));
        } else {
          this.debugMsg(`append -> remote: ${remotePath} `, options);
          options.flags = 'a';
          let stream = this.sftp.createWriteStream(remotePath, options);
          stream.on('error', (err_1) => {
            reject(
              fmtError(`${err_1.message} ${remotePath}`, 'append', err_1.code)
            );
          });
          stream.on('finish', () => {
            resolve(`Appended data to ${remotePath}`);
          });
          if (input instanceof Buffer) {
            stream.write(input);
            stream.end();
          } else {
            input.pipe(stream);
          }
        }
      }
    }).finally(() => {
      removeTempListeners(this, listeners, 'append');
      this._resetEventFlags();
    });
  }

  /**
   * @async
   *
   * Make a directory on remote server
   *
   * @param {string} remotePath - remote directory path.
   * @param {boolean} recursive - if true, recursively create directories
   * @return {Promise<String>}
   */
  async mkdir(remotePath, recursive = false) {
    const _mkdir = (p) => {
      let listeners;
      return new Promise((resolve, reject) => {
        listeners = addTempListeners(this, '_mkdir', reject);
        this.debugMsg(`_mkdir: create ${p}`);
        this.sftp.mkdir(p, (err) => {
          if (err) {
            this.debugMsg(`_mkdir: Error ${err.message} code: ${err.code}`);
            if (err.code === 4) {
              //fix for windows dodgy error messages
              let error = new Error(`Bad path: ${p} permission denied`);
              error.code = errorCode.badPath;
              reject(error);
            } else if (err.code === 2) {
              let error = new Error(
                `Bad path: ${p} parent not a directory or not exist`
              );
              error.code = errorCode.badPath;
              reject(error);
            } else {
              reject(err);
            }
          } else {
            this.debugMsg('_mkdir: directory created');
            resolve(`${p} directory created`);
          }
        });
      }).finally(() => {
        removeTempListeners(this, listeners, '_mkdir');
        this._resetEventFlags();
      });
    };

    try {
      haveConnection(this, 'mkdir');
      let rPath = await normalizeRemotePath(this, remotePath);
      let targetExists = await this.exists(rPath);
      if (targetExists && targetExists !== 'd') {
        let error = new Error(`Bad path: ${rPath} already exists as a file`);
        error.code = errorCode.badPath;
        throw error;
      } else if (targetExists) {
        return `${rPath} already exists`;
      }
      if (!recursive) {
        return await _mkdir(rPath);
      }
      let dir = parse(rPath).dir;
      if (dir) {
        let dirExists = await this.exists(dir);
        if (!dirExists) {
          await this.mkdir(dir, true);
        } else if (dirExists !== 'd') {
          let error = new Error(`Bad path: ${dir} not a directory`);
          error.code = errorCode.badPath;
          throw error;
        }
      }
      return await _mkdir(rPath);
    } catch (err) {
      throw fmtError(`${err.message}`, 'mkdir', err.code);
    }
  }

  /**
   * @async
   *
   * Remove directory on remote server
   *
   * @param {string} remotePath - path to directory to be removed
   * @param {boolean} recursive - if true, remove directories/files in target
   *                             directory
   * @return {Promise<String>}
   */
  async rmdir(remotePath, recursive = false) {
    const _delete = (remotePath) => {
      return new Promise((resolve, reject) => {
        this.sftp.unlink(remotePath, (err) => {
          if (err && err.code !== 2) {
            reject(fmtError(`${err.message} ${remotePath}`, 'rmdir', err.code));
          }
          resolve(true);
        });
      });
    };

    const _rmdir = (p) => {
      return new Promise((resolve, reject) => {
        this.debugMsg(`rmdir -> ${p}`);
        this.sftp.rmdir(p, (err) => {
          if (err) {
            this.debugMsg(`rmdir error ${err.message} code: ${err.code}`);
            reject(fmtError(`${err.message} ${p}`, 'rmdir', err.code));
          }
          resolve('Successfully removed directory');
        });
      }).finally(() => {
        removeTempListeners(this, listeners, '_rmdir');
      });
    };

    const _dormdir = async (p, recur) => {
      try {
        if (recur) {
          let list = await this.list(p);
          if (list.length) {
            let files = list.filter((item) => item.type !== 'd');
            let dirs = list.filter((item) => item.type === 'd');
            this.debugMsg('rmdir contents (files): ', files);
            this.debugMsg('rmdir contents (dirs): ', dirs);
            let promiseList = [];
            for (let f of files) {
              promiseList.push(_delete(`${p}${this.remotePathSep}${f.name}`));
            }
            for (let d of dirs) {
              promiseList.push(
                _dormdir(`${p}${this.remotePathSep}${d.name}`, true)
              );
            }
            await Promise.all(promiseList);
          }
        }
        return await _rmdir(p);
      } catch (err) {
        throw err.custom ? err : fmtError(err, '_dormdir', err.code);
      }
    };

    let listeners;
    try {
      listeners = addTempListeners(this, 'rmdir');
      haveConnection(this, 'rmdir');
      let absPath = await normalizeRemotePath(this, remotePath);
      let dirStatus = await this.exists(absPath);
      if (dirStatus && dirStatus !== 'd') {
        throw fmtError(
          `Bad path: ${absPath} not a directory`,
          'rmdir',
          errorCode.badPath
        );
      } else if (!dirStatus) {
        throw fmtError(
          `Bad path: ${absPath} No such file`,
          'rmdir',
          errorCode.badPath
        );
      } else {
        return await _dormdir(absPath, recursive);
      }
    } catch (err) {
      this._resetEventFlags();
      throw err.custom ? err : fmtError(err, 'rmdir', err.code);
    } finally {
      removeTempListeners(this, listeners, 'rmdir');
    }
  }

  /**
   * @async
   *
   * Delete a file on the remote SFTP server
   *
   * @param {string} remotePath - path to the file to delete
   * @param {boolean} notFoundOK - if true, ignore errors for missing target.
   *                               Default is false.
   * @return {Promise<String>} with string 'Successfully deleted file' once resolved
   *
   */
  delete(remotePath, notFoundOK = false) {
    let listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'delete', reject);
      if (haveConnection(this, 'delete', reject)) {
        this.debugMsg(`delete -> ${remotePath}`);
        this.sftp.unlink(remotePath, (err) => {
          if (err) {
            this.debugMsg(`delete error ${err.message} code: ${err.code}`);
            if (notFoundOK && err.code === 2) {
              this.debugMsg('delete ignore missing target error');
              resolve(`Successfully deleted ${remotePath}`);
            } else {
              reject(
                fmtError(`${err.message} ${remotePath}`, 'delete', err.code)
              );
            }
          }
          resolve(`Successfully deleted ${remotePath}`);
        });
      }
    }).finally(() => {
      removeTempListeners(this, listeners, 'delete');
      this._resetEventFlags();
    });
  }

  /**
   * @async
   *
   * Rename a file on the remote SFTP repository
   *
   * @param {string} fromPath - path to the file to be renamed.
   * @param {string} toPath - path to the new name.
   *
   * @return {Promise<String>}
   *
   */
  rename(fromPath, toPath) {
    let listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'rename', reject);
      if (haveConnection(this, 'rename', reject)) {
        this.debugMsg(`rename -> ${fromPath} ${toPath}`);
        this.sftp.rename(fromPath, toPath, (err) => {
          if (err) {
            this.debugMsg(`rename error ${err.message} code: ${err.code}`);
            reject(
              fmtError(
                `${err.message} From: ${fromPath} To: ${toPath}`,
                'rename',
                err.code
              )
            );
          }
          resolve(`Successfully renamed ${fromPath} to ${toPath}`);
        });
      }
    }).finally(() => {
      removeTempListeners(this, listeners, 'rename');
      this._resetEventFlags();
    });
  }

  /**
   * @async
   *
   * Rename a file on the remote SFTP repository using the SSH extension
   * posix-rename@openssh.com using POSIX atomic rename. (Introduced in SSH 4.8)
   *
   * @param {string} fromPath - path to the file to be renamed.
   * @param {string} toPath - path  the new name.
   *
   * @return {Promise<String>}
   *
   */
  posixRename(fromPath, toPath) {
    let listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'posixRename', reject);
      if (haveConnection(this, 'posixRename', reject)) {
        this.debugMsg(`posixRename -> ${fromPath} ${toPath}`);
        this.sftp.ext_openssh_rename(fromPath, toPath, (err) => {
          if (err) {
            this.debugMsg(`posixRename error ${err.message} code: ${err.code}`);
            reject(
              fmtError(
                `${err.message} From: ${fromPath} To: ${toPath}`,
                'posixRename',
                err.code
              )
            );
          }
          resolve(`Successful POSIX rename ${fromPath} to ${toPath}`);
        });
      }
    }).finally(() => {
      removeTempListeners(this, listeners, 'posixRename');
      this._resetEventFlags();
    });
  }

  /**
   * @async
   *
   * Change the mode of a remote file on the SFTP repository
   *
   * @param {string} remotePath - path to the remote target object.
   * @param {number | string} mode - the new octal mode to set
   *
   * @return {Promise<String>}
   */
  chmod(remotePath, mode) {
    let listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'chmod', reject);
      this.debugMsg(`chmod -> ${remotePath} ${mode}`);
      this.sftp.chmod(remotePath, mode, (err) => {
        if (err) {
          reject(fmtError(`${err.message} ${remotePath}`, 'chmod', err.code));
        }
        resolve('Successfully change file mode');
      });
    }).finally(() => {
      removeTempListeners(this, listeners, 'chmod');
      this._resetEventFlags();
    });
  }

  /**
   * @async
   *
   * Upload the specified source directory to the specified destination
   * directory. All regular files and sub-directories are uploaded to the remote
   * server.
   * @param {String} srcDir - local source directory
   * @param {String} dstDir - remote destination directory
   * @param {RegExp} filter - (Optional) a regular expression used to select
   *                         files and directories to upload
   * @returns {Promise<String>}
   */
  async uploadDir(srcDir, dstDir, filter) {
    try {
      this.debugMsg(`uploadDir -> SRC = ${srcDir} DST = ${dstDir}`);
      haveConnection(this, 'uploadDir');
      //let absSrcDir = fs.realpathSync(srcDir);
      let absDstDir = await normalizeRemotePath(this, dstDir);

      this.debugMsg(`uploadDir <- SRC = ${srcDir} DST = ${absDstDir}`);
      const srcType = localExists(srcDir);
      if (!srcType) {
        throw fmtError(
          `Bad path: ${srcDir} not exist`,
          'uploadDir',
          errorCode.badPath
        );
      }
      if (srcType !== 'd') {
        throw fmtError(
          `Bad path: ${srcDir}: not a directory`,
          'uploadDir',
          errorCode.badPath
        );
      }
      let dstStatus = await this.exists(absDstDir);
      if (dstStatus && dstStatus !== 'd') {
        this.debugMsg(`UploadDir: DST ${absDstDir} exists but not a directory`);
        throw fmtError(
          `Bad path ${absDstDir} Not a directory`,
          'uploadDir',
          errorCode.badPath
        );
      }
      if (!dstStatus) {
        this.debugMsg(`UploadDir: Creating directory ${absDstDir}`);
        await this.mkdir(absDstDir, true);
      }
      let dirEntries = fs.readdirSync(srcDir, {
        encoding: 'utf8',
        withFileTypes: true,
      });
      if (filter) {
        dirEntries = dirEntries.filter((item) =>
          filter(join(srcDir, item.name), item.isDirectory())
        );
      }
      for (let e of dirEntries) {
        let newSrc = join(srcDir, e.name);
        let newDst = `${absDstDir}${this.remotePathSep}${e.name}`;
        if (e.isDirectory()) {
          await this.uploadDir(newSrc, newDst, filter);
        } else if (e.isFile()) {
          await this.put(newSrc, newDst);
          this.client.emit('upload', { source: newSrc, destination: newDst });
        } else {
          this.debugMsg(
            `uploadDir: File ignored: ${e.name} not a regular file`
          );
        }
      }
      return `${srcDir} uploaded to ${absDstDir}`;
    } catch (err) {
      this._resetEventFlags();
      throw err.custom ? err : fmtError(err, 'uploadDir');
    }
  }

  /**
   * @async
   *
   * Download the specified source directory to the specified destination
   * directory. All regular files and sub-directories are downloaded to the local
   * file system.
   * @param {String} srcDir - remote source directory
   * @param {String} dstDir - local destination directory
   * @param {RegExp} filter - (Optional) a regular expression used to select
   *                         files and directories to upload
   * @returns {Promise<String>}
   */
  async downloadDir(srcDir, dstDir, filter) {
    try {
      this.debugMsg(`downloadDir -> ${srcDir} ${dstDir}`);
      haveConnection(this, 'downloadDir');
      let fileList = await this.list(srcDir);
      if (filter) {
        fileList = fileList.filter((item) =>
          filter(
            `${srcDir}${this.remotePathSep}${item.name}`,
            item.type === 'd' ? true : false
          )
        );
      }
      const localCheck = haveLocalCreate(dstDir);
      if (!localCheck.status && localCheck.details === 'permission denied') {
        throw fmtError(
          `Bad path: ${dstDir}: ${localCheck.details}`,
          'downloadDir',
          localCheck.code
        );
      } else if (localCheck.status && !localCheck.type) {
        fs.mkdirSync(dstDir, { recursive: true });
      } else if (localCheck.status && localCheck.type !== 'd') {
        throw fmtError(
          `Bad path: ${dstDir}: not a directory`,
          'downloadDir',
          errorCode.badPath
        );
      }
      for (let f of fileList) {
        let newSrc = `${srcDir}${this.remotePathSep}${f.name}`;
        let newDst = join(dstDir, f.name);
        if (f.type === 'd') {
          await this.downloadDir(newSrc, newDst, filter);
        } else if (f.type === '-') {
          await this.get(newSrc, newDst);
          this.client.emit('download', { source: newSrc, destination: newDst });
        } else {
          this.debugMsg(
            `downloadDir: File ignored: ${f.name} not regular file`
          );
        }
      }
      return `${srcDir} downloaded to ${dstDir}`;
    } catch (err) {
      this._resetEventFlags();
      throw err.custom ? err : fmtError(err, 'downloadDir', err.code);
    }
  }

  /**
   * @async
   *
   * End the SFTP connection
   *
   * @returns {Promise<Boolean>}
   */
  end() {
    let endCloseHandler, listeners;
    return new Promise((resolve, reject) => {
      listeners = addTempListeners(this, 'end', reject);
      this.endCalled = true;
      endCloseHandler = () => {
        this.sftp = undefined;
        this.debugMsg('end: Connection closed');
        resolve(true);
      };
      this.on('close', endCloseHandler);
      if (haveConnection(this, 'end', reject)) {
        this.debugMsg('end: Have connection - calling end()');
        this.client.end();
      }
    }).finally(() => {
      this.debugMsg('end: finally clause fired');
      removeTempListeners(this, listeners, 'end');
      this.removeListener('close', endCloseHandler);
      this.endCalled = false;
      this._resetEventFlags();
    });
  }
}

module.exports = SftpClient;


/***/ }),

/***/ 9432:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(5747);
const path = __nccwpck_require__(5622);

const { errorCode } = __nccwpck_require__(3232);

/**
 * Generate a new Error object with a reformatted error message which
 * is a little more informative and useful to users.
 *
 * @param {Error|string} err - The Error object the new error will be based on
 * @param {number} retryCount - For those functions which use retry. Number of
 *                              attempts to complete before giving up
 * @returns {Error} New error with custom error message
 */
function fmtError(err, name = 'sftp', eCode, retryCount) {
  let msg = '';
  let code = '';
  let retry = retryCount
    ? ` after ${retryCount} ${retryCount > 1 ? 'attempts' : 'attempt'}`
    : '';

  if (err === undefined) {
    msg = `${name}: Undefined error - probably a bug!`;
    code = errorCode.generic;
  } else if (typeof err === 'string') {
    msg = `${name}: ${err}${retry}`;
    code = eCode ? eCode : errorCode.generic;
  } else if (err.custom) {
    msg = `${name}->${err.message}${retry}`;
    code = err.code;
  } else {
    switch (err.code) {
      case 'ENOTFOUND':
        msg =
          `${name}: ${err.level} error. ` +
          `Address lookup failed for host ${err.hostname}${retry}`;
        break;
      case 'ECONNREFUSED':
        msg =
          `${name}: ${err.level} error. Remote host at ` +
          `${err.address} refused connection${retry}`;
        break;
      case 'ECONNRESET':
        msg =
          `${name}: Remote host has reset the connection: ` +
          `${err.message}${retry}`;
        break;
      default:
        msg = `${name}: ${err.message}${retry}`;
    }
    code = err.code ? err.code : errorCode.generic;
  }
  let newError = new Error(msg);
  newError.code = code;
  newError.custom = true;
  return newError;
}

/**
 * Simple default error listener. Will reformat the error message and
 * throw a new error.
 *
 * @param {Error} err - source for defining new error
 * @throws {Error} Throws new error
 */
function errorListener(client, name, reject) {
  let fn = (err) => {
    if (client.endCalled || client.errorHandled) {
      client.debugMsg(`${name} Error: Ignoring handled error: ${err.message}`);
    } else {
      client.debugMsg(`${name} Error: Handling error: ${err.message}`);
      client.errorHandled = true;
      if (reject) {
        client.debugMsg(`${name} Error: handled error with reject`);
        reject(fmtError(err, name, err.code));
      } else {
        client.debugMsg(`${name} Error: handling error with throw`);
        throw fmtError(err, name, err.code);
      }
    }
  };
  return fn;
}

function endListener(client, name, reject) {
  let fn = function () {
    if (client.endCalled || client.endHandled) {
      client.debugMsg(`${name} End: Ignoring expected end event`);
    } else {
      client.debugMsg(`${name} End: Handling end event`);
      client.sftp = undefined;
      client.endHandled = true;
      if (reject) {
        client.debugMsg(`${name} End: handling end event with reject'`);
        reject(fmtError('Unexpected end event raised', name));
      } else {
        client.debugMsg(`${name} End: handling end event with throw`);
        throw fmtError('Unexpected end event raised', name);
      }
    }
  };
  return fn;
}

function closeListener(client, name, reject) {
  let fn = function () {
    if (client.endCalled || client.closeHandled) {
      client.debugMsg(`${name} Close: ignoring expected close event`);
    } else {
      client.debugMsg(`${name} Close: handling unexpected close event`);
      client.sftp = undefined;
      client.closeHandled = true;
      if (reject) {
        client.debugMsg(`${name} Close: handling close event with reject`);
        reject(fmtError('Unexpected close event raised', name));
      } else {
        client.debugMsg(`${name} Close: handling close event with throw`);
        throw fmtError('Unexpected close event raised', name);
      }
    }
  };
  return fn;
}

function addTempListeners(client, name, reject) {
  let listeners = {
    end: endListener(client, name, reject),
    close: closeListener(client, name, reject),
    error: errorListener(client, name, reject),
  };
  client.debugMsg(`${name}: Adding temp event listeners`);
  client.on('end', listeners.end);
  client.on('close', listeners.close);
  client.on('error', listeners.error);
  return listeners;
}

function removeTempListeners(client, listeners, name) {
  client.debugMsg(`${name}: Removing temp event listeners`);
  client.removeListener('end', listeners.end);
  client.removeListener('close', listeners.close);
  client.removeListener('error', listeners.error);
}

/**
 * Checks to verify local object exists. Returns a character string representing the type
 * type of local object if it exists, false if it doesn't.
 *
 * Return codes: l = symbolic link
 *               - = regular file
 *               d = directory
 *               s = socket
 *
 * @param {string} filePath - path to local object
 * @returns {string | boolean} returns a string for object type if it exists, false otherwise
 */
function localExists(filePath) {
  const stats = fs.statSync(filePath, { throwIfNoEntry: false });
  if (!stats) {
    return false;
  } else if (stats.isDirectory()) {
    return 'd';
  } else if (stats.isFile()) {
    return '-';
  } else {
    throw fmtError(
      `Bad path: ${filePath}: target must be a file or directory`,
      'localExists',
      errorCode.badPath
    );
  }
}

/**
 * Verify access to local object. Returns an object with properties for status, type,
 * details and code.
 *
 * return object {
 *                 status: true if exists and can be accessed, false otherwise
 *                 type: type of object '-' = file, 'd' = dir, 'l' = link, 's' = socket
 *                 details: 'access ok' if object can be accessed, 'not found' if
 *                          object does not exist, 'permission denied' if access denied
 *                 code: error code if object does not exist or permission denied
 *              }
 *
 * @param {string} filePath = path to local object
 * @param {string} mode = access mode - either 'r' or 'w'. Defaults to 'r'
 * @returns {Object} with properties status, type, details and code
 */
function haveLocalAccess(filePath, mode = 'r') {
  const accessMode =
    fs.constants.F_OK | (mode === 'w') ? fs.constants.W_OK : fs.constants.R_OK;

  try {
    fs.accessSync(filePath, accessMode);
    const type = localExists(filePath);
    return {
      status: true,
      type: type,
      details: 'access OK',
      code: 0,
    };
  } catch (err) {
    switch (err.errno) {
      case -2:
        return {
          status: false,
          type: null,
          details: 'not exist',
          code: -2,
        };
      case -13:
        return {
          status: false,
          type: localExists(filePath),
          details: 'permission denied',
          code: -13,
        };
      case -20:
        return {
          status: false,
          type: null,
          details: 'parent not a directory',
        };
      default:
        return {
          status: false,
          type: null,
          details: err.message,
        };
    }
  }
}

/**
 * Checks to verify the object specified by filePath can either be written to or created
 * if it doens't already exist. If it does not exist, checks to see if the parent entry in the
 * path is a directory and can be written to. Returns an object with the same format as the object
 * returned by 'haveLocalAccess'.
 *
 * @param {string} filePath - path to object to be created or written t
 * @returns {Object} Object with properties status, type, destils and code
 */
function haveLocalCreate(filePath) {
  const { status, details, type } = haveLocalAccess(filePath, 'w');
  if (!status && details === 'permission denied') {
    //throw new Error(`Bad path: ${filePath}: permission denied`);
    return {
      status,
      details,
      type,
    };
  } else if (!status) {
    const dirPath = path.dirname(filePath);
    const localCheck = haveLocalAccess(dirPath, 'w');
    if (localCheck.status && localCheck.type !== 'd') {
      //throw new Error(`Bad path: ${dirPath}: not a directory`);
      return {
        status: false,
        details: `${dirPath}: not a directory`,
        type: null,
      };
    } else if (!localCheck.status) {
      //throw new Error(`Bad path: ${dirPath}: ${localCheck.details}`);
      return {
        status: localCheck.status,
        details: `${dirPath}: ${localCheck.details}`,
        type: null,
      };
    } else {
      return {
        status: true,
        details: 'access OK',
        type: null,
        code: 0,
      };
    }
  }
  return { status, details, type };
}

async function normalizeRemotePath(client, aPath) {
  try {
    if (aPath.startsWith('..')) {
      let root = await client.realPath('..');
      return root + client.remotePathSep + aPath.slice(3);
    } else if (aPath.startsWith('.')) {
      let root = await client.realPath('.');
      return root + client.remotePathSep + aPath.slice(2);
    }
    return aPath;
  } catch (err) {
    throw fmtError(err, 'normalizeRemotePath');
  }
}

/**
 * Check to see if there is an active sftp connection
 *
 * @param {Object} client - current sftp object
 * @param {String} name - name given to this connection
 * @param {Function} reject - if defined, call this rather than throw
 *                            an error
 * @returns {Boolean} True if connection OK
 * @throws {Error}
 */
function haveConnection(client, name, reject) {
  if (!client.sftp) {
    let newError = fmtError(
      'No SFTP connection available',
      name,
      errorCode.connect
    );
    if (reject) {
      reject(newError);
      return false;
    } else {
      throw newError;
    }
  }
  return true;
}

function sleep(ms) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(true);
      }, ms);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  fmtError,
  errorListener,
  endListener,
  closeListener,
  addTempListeners,
  removeTempListeners,
  haveLocalAccess,
  haveLocalCreate,
  normalizeRemotePath,
  localExists,
  haveConnection,
  sleep,
};


/***/ }),

/***/ 3204:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  Duplex: DuplexStream,
  Readable: ReadableStream,
  Writable: WritableStream,
} = __nccwpck_require__(2413);

const {
  CHANNEL_EXTENDED_DATATYPE: { STDERR },
} = __nccwpck_require__(6832);
const { bufferSlice } = __nccwpck_require__(9475);

const PACKET_SIZE = 32 * 1024;
const MAX_WINDOW = 2 * 1024 * 1024;
const WINDOW_THRESHOLD = MAX_WINDOW / 2;

class ClientStderr extends ReadableStream {
  constructor(channel, streamOpts) {
    super(streamOpts);

    this._channel = channel;
  }
  _read(n) {
    if (this._channel._waitChanDrain) {
      this._channel._waitChanDrain = false;
      if (this._channel.incoming.window <= WINDOW_THRESHOLD)
        windowAdjust(this._channel);
    }
  }
}

class ServerStderr extends WritableStream {
  constructor(channel) {
    super({ highWaterMark: MAX_WINDOW });

    this._channel = channel;
  }

  _write(data, encoding, cb) {
    const channel = this._channel;
    const protocol = channel._client._protocol;
    const outgoing = channel.outgoing;
    const packetSize = outgoing.packetSize;
    const id = outgoing.id;
    let window = outgoing.window;
    const len = data.length;
    let p = 0;

    if (outgoing.state !== 'open')
      return;

    while (len - p > 0 && window > 0) {
      let sliceLen = len - p;
      if (sliceLen > window)
        sliceLen = window;
      if (sliceLen > packetSize)
        sliceLen = packetSize;

      if (p === 0 && sliceLen === len)
        protocol.channelExtData(id, data, STDERR);
      else
        protocol.channelExtData(id, bufferSlice(data, p, p + sliceLen), STDERR);

      p += sliceLen;
      window -= sliceLen;
    }

    outgoing.window = window;

    if (len - p > 0) {
      if (window === 0)
        channel._waitWindow = true;
      if (p > 0)
        channel._chunkErr = bufferSlice(data, p, len);
      else
        channel._chunkErr = data;
      channel._chunkcbErr = cb;
      return;
    }

    cb();
  }
}

class Channel extends DuplexStream {
  constructor(client, info, opts) {
    const streamOpts = {
      highWaterMark: MAX_WINDOW,
      allowHalfOpen: (!opts || (opts && opts.allowHalfOpen !== false)),
      emitClose: false,
    };
    super(streamOpts);
    this.allowHalfOpen = streamOpts.allowHalfOpen;

    const server = !!(opts && opts.server);

    this.server = server;
    this.type = info.type;
    this.subtype = undefined;

    /*
      incoming and outgoing contain these properties:
      {
        id: undefined,
        window: undefined,
        packetSize: undefined,
        state: 'closed'
      }
    */
    this.incoming = info.incoming;
    this.outgoing = info.outgoing;
    this._callbacks = [];

    this._client = client;
    this._hasX11 = false;
    this._exit = {
      code: undefined,
      signal: undefined,
      dump: undefined,
      desc: undefined,
    };

    this.stdin = this.stdout = this;

    if (server)
      this.stderr = new ServerStderr(this);
    else
      this.stderr = new ClientStderr(this, streamOpts);

    // Outgoing data
    this._waitWindow = false; // SSH-level backpressure

    // Incoming data
    this._waitChanDrain = false; // Channel Readable side backpressure

    this._chunk = undefined;
    this._chunkcb = undefined;
    this._chunkErr = undefined;
    this._chunkcbErr = undefined;

    this.on('finish', onFinish)
        .on('prefinish', onFinish); // For node v0.11+

    this.on('end', onEnd).on('close', onEnd);
  }

  _read(n) {
    if (this._waitChanDrain) {
      this._waitChanDrain = false;
      if (this.incoming.window <= WINDOW_THRESHOLD)
        windowAdjust(this);
    }
  }

  _write(data, encoding, cb) {
    const protocol = this._client._protocol;
    const outgoing = this.outgoing;
    const packetSize = outgoing.packetSize;
    const id = outgoing.id;
    let window = outgoing.window;
    const len = data.length;
    let p = 0;

    if (outgoing.state !== 'open')
      return;

    while (len - p > 0 && window > 0) {
      let sliceLen = len - p;
      if (sliceLen > window)
        sliceLen = window;
      if (sliceLen > packetSize)
        sliceLen = packetSize;

      if (p === 0 && sliceLen === len)
        protocol.channelData(id, data);
      else
        protocol.channelData(id, bufferSlice(data, p, p + sliceLen));

      p += sliceLen;
      window -= sliceLen;
    }

    outgoing.window = window;

    if (len - p > 0) {
      if (window === 0)
        this._waitWindow = true;
      if (p > 0)
        this._chunk = bufferSlice(data, p, len);
      else
        this._chunk = data;
      this._chunkcb = cb;
      return;
    }

    cb();
  }

  eof() {
    if (this.outgoing.state === 'open') {
      this.outgoing.state = 'eof';
      this._client._protocol.channelEOF(this.outgoing.id);
    }
  }

  close() {
    if (this.outgoing.state === 'open' || this.outgoing.state === 'eof') {
      this.outgoing.state = 'closing';
      this._client._protocol.channelClose(this.outgoing.id);
    }
  }

  destroy() {
    this.end();
    this.close();
    return this;
  }

  // Session type-specific methods =============================================
  setWindow(rows, cols, height, width) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    if (this.type === 'session'
        && (this.subtype === 'shell' || this.subtype === 'exec')
        && this.writable
        && this.outgoing.state === 'open') {
      this._client._protocol.windowChange(this.outgoing.id,
                                          rows,
                                          cols,
                                          height,
                                          width);
    }
  }

  signal(signalName) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    if (this.type === 'session'
        && this.writable
        && this.outgoing.state === 'open') {
      this._client._protocol.signal(this.outgoing.id, signalName);
    }
  }

  exit(statusOrSignal, coreDumped, msg) {
    if (!this.server)
      throw new Error('Server-only method called in client mode');

    if (this.type === 'session'
        && this.writable
        && this.outgoing.state === 'open') {
      if (typeof statusOrSignal === 'number') {
        this._client._protocol.exitStatus(this.outgoing.id, statusOrSignal);
      } else {
        this._client._protocol.exitSignal(this.outgoing.id,
                                          statusOrSignal,
                                          coreDumped,
                                          msg);
      }
    }
  }

}

function onFinish() {
  this.eof();
  if (this.server || !this.allowHalfOpen)
    this.close();
  this.writable = false;
}

function onEnd() {
  this.readable = false;
}

function windowAdjust(self) {
  if (self.outgoing.state === 'closed')
    return;
  const amt = MAX_WINDOW - self.incoming.window;
  if (amt <= 0)
    return;
  self.incoming.window += amt;
  self._client._protocol.channelWindowAdjust(self.outgoing.id, amt);
}

module.exports = {
  Channel,
  MAX_WINDOW,
  PACKET_SIZE,
  windowAdjust,
  WINDOW_THRESHOLD,
};


/***/ }),

/***/ 9054:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { Socket } = __nccwpck_require__(1631);
const { Duplex } = __nccwpck_require__(2413);
const { resolve } = __nccwpck_require__(5622);
const { readFile } = __nccwpck_require__(5747);
const { execFile, spawn } = __nccwpck_require__(3129);

const { isParsedKey, parseKey } = __nccwpck_require__(2218);

const {
  makeBufferParser,
  readUInt32BE,
  writeUInt32BE,
  writeUInt32LE,
} = __nccwpck_require__(9475);

function once(cb) {
  let called = false;
  return (...args) => {
    if (called)
      return;
    called = true;
    cb(...args);
  };
}

function concat(buf1, buf2) {
  const combined = Buffer.allocUnsafe(buf1.length + buf2.length);
  buf1.copy(combined, 0);
  buf2.copy(combined, buf1.length);
  return combined;
}

function noop() {}

const EMPTY_BUF = Buffer.alloc(0);

const binaryParser = makeBufferParser();

class BaseAgent {
  getIdentities(cb) {
    cb(new Error('Missing getIdentities() implementation'));
  }
  sign(pubKey, data, options, cb) {
    if (typeof options === 'function')
      cb = options;
    cb(new Error('Missing sign() implementation'));
  }
}

class OpenSSHAgent extends BaseAgent {
  constructor(socketPath) {
    super();
    this.socketPath = socketPath;
  }

  getStream(cb) {
    cb = once(cb);
    const sock = new Socket();
    sock.on('connect', () => {
      cb(null, sock);
    });
    sock.on('close', onFail)
        .on('end', onFail)
        .on('error', onFail);
    sock.connect(this.socketPath);

    function onFail() {
      try {
        sock.destroy();
      } catch {}

      cb(new Error('Failed to connect to agent'));
    }
  }

  getIdentities(cb) {
    cb = once(cb);
    this.getStream((err, stream) => {
      function onFail(err) {
        if (stream) {
          try {
            stream.destroy();
          } catch {}
        }
        if (!err)
          err = new Error('Failed to retrieve identities from agent');
        cb(err);
      }

      if (err)
        return onFail(err);

      const protocol = new AgentProtocol(true);
      protocol.on('error', onFail);
      protocol.pipe(stream).pipe(protocol);

      stream.on('close', onFail)
            .on('end', onFail)
            .on('error', onFail);

      protocol.getIdentities((err, keys) => {
        if (err)
          return onFail(err);
        try {
          stream.destroy();
        } catch {}
        cb(null, keys);
      });
    });
  }

  sign(pubKey, data, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    } else if (typeof options !== 'object' || options === null) {
      options = undefined;
    }

    cb = once(cb);
    this.getStream((err, stream) => {
      function onFail(err) {
        if (stream) {
          try {
            stream.destroy();
          } catch {}
        }
        if (!err)
          err = new Error('Failed to sign data with agent');
        cb(err);
      }

      if (err)
        return onFail(err);

      const protocol = new AgentProtocol(true);
      protocol.on('error', onFail);
      protocol.pipe(stream).pipe(protocol);

      stream.on('close', onFail)
            .on('end', onFail)
            .on('error', onFail);

      protocol.sign(pubKey, data, options, (err, sig) => {
        if (err)
          return onFail(err);

        try {
          stream.destroy();
        } catch {}

        cb(null, sig);
      });
    });
  }
}

const PageantAgent = (() => {
  const RET_ERR_BADARGS = 10;
  const RET_ERR_UNAVAILABLE = 11;
  const RET_ERR_NOMAP = 12;
  const RET_ERR_BINSTDIN = 13;
  const RET_ERR_BINSTDOUT = 14;
  const RET_ERR_BADLEN = 15;

  const EXEPATH = __nccwpck_require__.ab + "pagent.exe";
  const ERROR = {
    [RET_ERR_BADARGS]: new Error('Invalid pagent.exe arguments'),
    [RET_ERR_UNAVAILABLE]: new Error('Pageant is not running'),
    [RET_ERR_NOMAP]: new Error('pagent.exe could not create an mmap'),
    [RET_ERR_BINSTDIN]: new Error('pagent.exe could not set mode for stdin'),
    [RET_ERR_BINSTDOUT]: new Error('pagent.exe could not set mode for stdout'),
    [RET_ERR_BADLEN]:
      new Error('pagent.exe did not get expected input payload'),
  };

  function destroy(stream) {
    stream.buffer = null;
    if (stream.proc) {
      stream.proc.kill();
      stream.proc = undefined;
    }
  }

  class PageantSocket extends Duplex {
    constructor() {
      super();
      this.proc = undefined;
      this.buffer = null;
    }
    _read(n) {}
    _write(data, encoding, cb) {
      if (this.buffer === null) {
        this.buffer = data;
      } else {
        const newBuffer = Buffer.allocUnsafe(this.buffer.length + data.length);
        this.buffer.copy(newBuffer, 0);
        data.copy(newBuffer, this.buffer.length);
        this.buffer = newBuffer;
      }
      // Wait for at least all length bytes
      if (this.buffer.length < 4)
        return cb();

      const len = readUInt32BE(this.buffer, 0);
      // Make sure we have a full message before querying pageant
      if ((this.buffer.length - 4) < len)
        return cb();

      data = this.buffer.slice(0, 4 + len);
      if (this.buffer.length > (4 + len))
        return cb(new Error('Unexpected multiple agent requests'));
      this.buffer = null;

      let error;
      const proc = this.proc = spawn(__nccwpck_require__.ab + "pagent.exe", [ data.length ]);
      proc.stdout.on('data', (data) => {
        this.push(data);
      });
      proc.on('error', (err) => {
        error = err;
        cb(error);
      });
      proc.on('close', (code) => {
        this.proc = undefined;
        if (!error) {
          if (error = ERROR[code])
            return cb(error);
          cb();
        }
      });
      proc.stdin.end(data);
    }
    _final(cb) {
      destroy(this);
      cb();
    }
    _destroy(err, cb) {
      destroy(this);
      cb();
    }
  }

  return class PageantAgent extends OpenSSHAgent {
    getStream(cb) {
      cb(null, new PageantSocket());
    }
  };
})();

const CygwinAgent = (() => {
  const RE_CYGWIN_SOCK = /^!<socket >(\d+) s ([A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8})/;

  return class CygwinAgent extends OpenSSHAgent {
    getStream(cb) {
      cb = once(cb);

      // The cygwin ssh-agent connection process looks like this:
      //   1. Read the "socket" as a file to get the underlying TCP port and a
      //      special "secret" that must be sent to the TCP server.
      //   2. Connect to the server listening on localhost at the TCP port.
      //   3. Send the "secret" to the server.
      //   4. The server sends back the same "secret".
      //   5. Send three 32-bit integer values of zero. This is ordinarily the
      //      pid, uid, and gid of this process, but cygwin will actually
      //      send us the correct values as a response.
      //   6. The server sends back the pid, uid, gid.
      //   7. Disconnect.
      //   8. Repeat steps 2-6, except send the received pid, uid, and gid in
      //      step 5 instead of zeroes.
      //   9. Connection is ready to be used.

      let socketPath = this.socketPath;
      let triedCygpath = false;
      readFile(socketPath, function readCygsocket(err, data) {
        if (err) {
          if (triedCygpath)
            return cb(new Error('Invalid cygwin unix socket path'));

          // Try using `cygpath` to convert a possible *nix-style path to the
          // real Windows path before giving up ...
          execFile('cygpath', ['-w', socketPath], (err, stdout, stderr) => {
            if (err || stdout.length === 0)
              return cb(new Error('Invalid cygwin unix socket path'));

            triedCygpath = true;
            socketPath = stdout.toString().replace(/[\r\n]/g, '');
            readFile(socketPath, readCygsocket);
          });
          return;
        }

        const m = RE_CYGWIN_SOCK.exec(data.toString('ascii'));
        if (!m)
          return cb(new Error('Malformed cygwin unix socket file'));

        let state;
        let bc = 0;
        let isRetrying = false;
        const inBuf = [];
        let sock;

        // Use 0 for pid, uid, and gid to ensure we get an error and also
        // a valid uid and gid from cygwin so that we don't have to figure it
        // out ourselves
        let credsBuf = Buffer.alloc(12);

        // Parse cygwin unix socket file contents
        const port = parseInt(m[1], 10);
        const secret = m[2].replace(/-/g, '');
        const secretBuf = Buffer.allocUnsafe(16);
        for (let i = 0, j = 0; j < 32; ++i, j += 2)
          secretBuf[i] = parseInt(secret.substring(j, j + 2), 16);

        // Convert to host order (always LE for Windows)
        for (let i = 0; i < 16; i += 4)
          writeUInt32LE(secretBuf, readUInt32BE(secretBuf, i), i);

        tryConnect();

        function _onconnect() {
          bc = 0;
          state = 'secret';
          sock.write(secretBuf);
        }

        function _ondata(data) {
          bc += data.length;

          if (state === 'secret') {
            // The secret we sent is echoed back to us by cygwin, not sure of
            // the reason for that, but we ignore it nonetheless ...
            if (bc === 16) {
              bc = 0;
              state = 'creds';
              sock.write(credsBuf);
            }
            return;
          }

          if (state === 'creds') {
            // If this is the first attempt, make sure to gather the valid
            // uid and gid for our next attempt
            if (!isRetrying)
              inBuf.push(data);

            if (bc === 12) {
              sock.removeListener('connect', _onconnect);
              sock.removeListener('data', _ondata);
              sock.removeListener('error', onFail);
              sock.removeListener('end', onFail);
              sock.removeListener('close', onFail);

              if (isRetrying)
                return cb(null, sock);

              isRetrying = true;
              credsBuf = Buffer.concat(inBuf);
              writeUInt32LE(credsBuf, process.pid, 0);
              sock.on('error', () => {});
              sock.destroy();

              tryConnect();
            }
          }
        }

        function onFail() {
          cb(new Error('Problem negotiating cygwin unix socket security'));
        }

        function tryConnect() {
          sock = new Socket();
          sock.on('connect', _onconnect);
          sock.on('data', _ondata);
          sock.on('error', onFail);
          sock.on('end', onFail);
          sock.on('close', onFail);
          sock.connect(port);
        }
      });
    }
  };
})();

// Format of `//./pipe/ANYTHING`, with forward slashes and backward slashes
// being interchangeable
const WINDOWS_PIPE_REGEX = /^[/\\][/\\]\.[/\\]pipe[/\\].+/;
function createAgent(path) {
  if (process.platform === 'win32' && !WINDOWS_PIPE_REGEX.test(path)) {
    return (path === 'pageant'
            ? new PageantAgent()
            : new CygwinAgent(path));
  }
  return new OpenSSHAgent(path);
}

const AgentProtocol = (() => {
  // Client->Server messages
  const SSH_AGENTC_REQUEST_IDENTITIES = 11;
  const SSH_AGENTC_SIGN_REQUEST = 13;
  // const SSH_AGENTC_ADD_IDENTITY = 17;
  // const SSH_AGENTC_REMOVE_IDENTITY = 18;
  // const SSH_AGENTC_REMOVE_ALL_IDENTITIES = 19;
  // const SSH_AGENTC_ADD_SMARTCARD_KEY = 20;
  // const SSH_AGENTC_REMOVE_SMARTCARD_KEY = 21;
  // const SSH_AGENTC_LOCK = 22;
  // const SSH_AGENTC_UNLOCK = 23;
  // const SSH_AGENTC_ADD_ID_CONSTRAINED = 25;
  // const SSH_AGENTC_ADD_SMARTCARD_KEY_CONSTRAINED = 26;
  // const SSH_AGENTC_EXTENSION = 27;
  // Server->Client messages
  const SSH_AGENT_FAILURE = 5;
  // const SSH_AGENT_SUCCESS = 6;
  const SSH_AGENT_IDENTITIES_ANSWER = 12;
  const SSH_AGENT_SIGN_RESPONSE = 14;
  // const SSH_AGENT_EXTENSION_FAILURE = 28;

  // const SSH_AGENT_CONSTRAIN_LIFETIME = 1;
  // const SSH_AGENT_CONSTRAIN_CONFIRM = 2;
  // const SSH_AGENT_CONSTRAIN_EXTENSION = 255;

  const SSH_AGENT_RSA_SHA2_256 = (1 << 1);
  const SSH_AGENT_RSA_SHA2_512 = (1 << 2);

  const ROLE_CLIENT = 0;
  const ROLE_SERVER = 1;

  // Ensures that responses get sent back in the same order the requests were
  // received
  function processResponses(protocol) {
    let ret;
    while (protocol[SYM_REQS].length) {
      const nextResponse = protocol[SYM_REQS][0][SYM_RESP];
      if (nextResponse === undefined)
        break;

      protocol[SYM_REQS].shift();
      ret = protocol.push(nextResponse);
    }
    return ret;
  }

  const SYM_TYPE = Symbol('Inbound Request Type');
  const SYM_RESP = Symbol('Inbound Request Response');
  const SYM_CTX = Symbol('Inbound Request Context');
  class AgentInboundRequest {
    constructor(type, ctx) {
      this[SYM_TYPE] = type;
      this[SYM_RESP] = undefined;
      this[SYM_CTX] = ctx;
    }
    hasResponded() {
      return (this[SYM_RESP] !== undefined);
    }
    getType() {
      return this[SYM_TYPE];
    }
    getContext() {
      return this[SYM_CTX];
    }
  }
  function respond(protocol, req, data) {
    req[SYM_RESP] = data;
    return processResponses(protocol);
  }

  function cleanup(protocol) {
    protocol[SYM_BUFFER] = null;
    if (protocol[SYM_MODE] === ROLE_CLIENT) {
      const reqs = protocol[SYM_REQS];
      if (reqs && reqs.length) {
        protocol[SYM_REQS] = [];
        for (const req of reqs)
          req.cb(new Error('No reply from server'));
      }
    }

    // Node streams hackery to make streams do the "right thing"
    try {
      protocol.end();
    } catch {}
    setImmediate(() => {
      if (!protocol[SYM_ENDED])
        protocol.emit('end');
      if (!protocol[SYM_CLOSED])
        protocol.emit('close');
    });
  }

  function onClose() {
    this[SYM_CLOSED] = true;
  }

  function onEnd() {
    this[SYM_ENDED] = true;
  }

  const SYM_REQS = Symbol('Requests');
  const SYM_MODE = Symbol('Agent Protocol Role');
  const SYM_BUFFER = Symbol('Agent Protocol Buffer');
  const SYM_MSGLEN = Symbol('Agent Protocol Current Message Length');
  const SYM_CLOSED = Symbol('Agent Protocol Closed');
  const SYM_ENDED = Symbol('Agent Protocol Ended');
  // Implementation based on:
  // https://tools.ietf.org/html/draft-miller-ssh-agent-04
  return class AgentProtocol extends Duplex {
    /*
        Notes:
          - `constraint` type consists of:
               byte                    constraint_type
               byte[]                  constraint_data
            where `constraint_type` is one of:
              * SSH_AGENT_CONSTRAIN_LIFETIME
                - `constraint_data` consists of:
                     uint32                  seconds
              * SSH_AGENT_CONSTRAIN_CONFIRM
                - `constraint_data` N/A
              * SSH_AGENT_CONSTRAIN_EXTENSION
                - `constraint_data` consists of:
                     string                  extension name
                     byte[]                  extension-specific details
    */

    constructor(isClient) {
      super({ autoDestroy: true, emitClose: false });
      this[SYM_MODE] = (isClient ? ROLE_CLIENT : ROLE_SERVER);
      this[SYM_REQS] = [];
      this[SYM_BUFFER] = null;
      this[SYM_MSGLEN] = -1;
      this.once('end', onEnd);
      this.once('close', onClose);
    }

    _read(n) {}

    _write(data, encoding, cb) {
      /*
          Messages are of the format:
            uint32                    message length
            byte                      message type
            byte[message length - 1]  message contents
      */
      if (this[SYM_BUFFER] === null)
        this[SYM_BUFFER] = data;
      else
        this[SYM_BUFFER] = concat(this[SYM_BUFFER], data);

      let buffer = this[SYM_BUFFER];
      let bufferLen = buffer.length;

      let p = 0;
      while (p < bufferLen) {
        // Wait for length + type
        if (bufferLen < 5)
          break;

        if (this[SYM_MSGLEN] === -1)
          this[SYM_MSGLEN] = readUInt32BE(buffer, p);

        // Check if we have the entire message
        if (bufferLen < (4 + this[SYM_MSGLEN]))
          break;

        const msgType = buffer[p += 4];
        ++p;

        if (this[SYM_MODE] === ROLE_CLIENT) {
          if (this[SYM_REQS].length === 0)
            return cb(new Error('Received unexpected message from server'));

          const req = this[SYM_REQS].shift();

          switch (msgType) {
            case SSH_AGENT_FAILURE:
              req.cb(new Error('Agent responded with failure'));
              break;
            case SSH_AGENT_IDENTITIES_ANSWER: {
              if (req.type !== SSH_AGENTC_REQUEST_IDENTITIES)
                return cb(new Error('Agent responded with wrong message type'));

              /*
                 byte        SSH_AGENT_IDENTITIES_ANSWER
                 uint32      nkeys

                where `nkeys` is 0 or more of:
                 string      key blob
                 string      comment
              */

              binaryParser.init(buffer, p);

              const numKeys = binaryParser.readUInt32BE();

              if (numKeys === undefined) {
                binaryParser.clear();
                return cb(new Error('Malformed agent response'));
              }

              const keys = [];
              for (let i = 0; i < numKeys; ++i) {
                let pubKey = binaryParser.readString();
                if (pubKey === undefined) {
                  binaryParser.clear();
                  return cb(new Error('Malformed agent response'));
                }

                const comment = binaryParser.readString(true);
                if (comment === undefined) {
                  binaryParser.clear();
                  return cb(new Error('Malformed agent response'));
                }

                pubKey = parseKey(pubKey);
                // We continue parsing the packet if we encounter an error
                // in case the error is due to the key being an unsupported
                // type
                if (pubKey instanceof Error)
                  continue;

                pubKey.comment = pubKey.comment || comment;

                keys.push(pubKey);
              }
              p = binaryParser.pos();
              binaryParser.clear();

              req.cb(null, keys);
              break;
            }
            case SSH_AGENT_SIGN_RESPONSE: {
              if (req.type !== SSH_AGENTC_SIGN_REQUEST)
                return cb(new Error('Agent responded with wrong message type'));

              /*
                 byte        SSH_AGENT_SIGN_RESPONSE
                 string      signature
              */

              binaryParser.init(buffer, p);
              let signature = binaryParser.readString();
              p = binaryParser.pos();
              binaryParser.clear();

              if (signature === undefined)
                return cb(new Error('Malformed agent response'));

              // We strip the algorithm from OpenSSH's output and assume it's
              // using the algorithm we specified. This makes it easier on
              // custom Agent implementations so they don't have to construct
              // the correct binary format for a (OpenSSH-style) signature.

              // TODO: verify signature type based on key and options used
              // during initial sign request
              binaryParser.init(signature, 0);
              binaryParser.readString(true);
              signature = binaryParser.readString();
              binaryParser.clear();

              if (signature === undefined)
                return cb(new Error('Malformed OpenSSH signature format'));

              req.cb(null, signature);
              break;
            }
            default:
              return cb(
                new Error('Agent responded with unsupported message type')
              );
          }
        } else {
          switch (msgType) {
            case SSH_AGENTC_REQUEST_IDENTITIES: {
              const req = new AgentInboundRequest(msgType);
              this[SYM_REQS].push(req);
              /*
                byte        SSH_AGENTC_REQUEST_IDENTITIES
              */
              this.emit('identities', req);
              break;
            }
            case SSH_AGENTC_SIGN_REQUEST: {
              /*
                byte        SSH_AGENTC_SIGN_REQUEST
                string      key_blob
                string      data
                uint32      flags
              */
              binaryParser.init(buffer, p);
              let pubKey = binaryParser.readString();
              const data = binaryParser.readString();
              const flagsVal = binaryParser.readUInt32BE();
              p = binaryParser.pos();
              binaryParser.clear();
              if (flagsVal === undefined) {
                const req = new AgentInboundRequest(msgType);
                this[SYM_REQS].push(req);
                return this.failureReply(req);
              }

              pubKey = parseKey(pubKey);
              if (pubKey instanceof Error) {
                const req = new AgentInboundRequest(msgType);
                this[SYM_REQS].push(req);
                return this.failureReply(req);
              }

              const flags = {
                hash: undefined,
              };
              let ctx;
              if (pubKey.type === 'ssh-rsa') {
                if (flagsVal & SSH_AGENT_RSA_SHA2_256) {
                  ctx = 'rsa-sha2-256';
                  flags.hash = 'sha256';
                } else if (flagsVal & SSH_AGENT_RSA_SHA2_512) {
                  ctx = 'rsa-sha2-512';
                  flags.hash = 'sha512';
                }
              }
              if (ctx === undefined)
                ctx = pubKey.type;

              const req = new AgentInboundRequest(msgType, ctx);
              this[SYM_REQS].push(req);

              this.emit('sign', req, pubKey, data, flags);
              break;
            }
            default: {
              const req = new AgentInboundRequest(msgType);
              this[SYM_REQS].push(req);
              this.failureReply(req);
            }
          }
        }

        // Get ready for next message
        this[SYM_MSGLEN] = -1;
        if (p === bufferLen) {
          // Nothing left to process for now
          this[SYM_BUFFER] = null;
          break;
        } else {
          this[SYM_BUFFER] = buffer = buffer.slice(p);
          bufferLen = buffer.length;
          p = 0;
        }
      }

      cb();
    }

    _destroy(err, cb) {
      cleanup(this);
      cb();
    }

    _final(cb) {
      cleanup(this);
      cb();
    }

    // Client->Server messages =================================================
    sign(pubKey, data, options, cb) {
      if (this[SYM_MODE] !== ROLE_CLIENT)
        throw new Error('Client-only method called with server role');

      if (typeof options === 'function') {
        cb = options;
        options = undefined;
      } else if (typeof options !== 'object' || options === null) {
        options = undefined;
      }

      let flags = 0;

      pubKey = parseKey(pubKey);
      if (pubKey instanceof Error)
        throw new Error('Invalid public key argument');

      if (pubKey.type === 'ssh-rsa' && options) {
        switch (options.hash) {
          case 'sha256':
            flags = SSH_AGENT_RSA_SHA2_256;
            break;
          case 'sha512':
            flags = SSH_AGENT_RSA_SHA2_512;
            break;
        }
      }
      pubKey = pubKey.getPublicSSH();

      /*
        byte        SSH_AGENTC_SIGN_REQUEST
        string      key_blob
        string      data
        uint32      flags
      */
      const type = SSH_AGENTC_SIGN_REQUEST;
      const keyLen = pubKey.length;
      const dataLen = data.length;
      let p = 0;
      const buf = Buffer.allocUnsafe(4 + 1 + 4 + keyLen + 4 + dataLen + 4);

      writeUInt32BE(buf, buf.length - 4, p);

      buf[p += 4] = type;

      writeUInt32BE(buf, keyLen, ++p);
      pubKey.copy(buf, p += 4);

      writeUInt32BE(buf, dataLen, p += keyLen);
      data.copy(buf, p += 4);

      writeUInt32BE(buf, flags, p += dataLen);

      if (typeof cb !== 'function')
        cb = noop;

      this[SYM_REQS].push({ type, cb });

      return this.push(buf);
    }
    getIdentities(cb) {
      if (this[SYM_MODE] !== ROLE_CLIENT)
        throw new Error('Client-only method called with server role');

      /*
        byte        SSH_AGENTC_REQUEST_IDENTITIES
      */
      const type = SSH_AGENTC_REQUEST_IDENTITIES;

      let p = 0;
      const buf = Buffer.allocUnsafe(4 + 1);

      writeUInt32BE(buf, buf.length - 4, p);

      buf[p += 4] = type;

      if (typeof cb !== 'function')
        cb = noop;

      this[SYM_REQS].push({ type, cb });

      return this.push(buf);
    }

    // Server->Client messages =================================================
    failureReply(req) {
      if (this[SYM_MODE] !== ROLE_SERVER)
        throw new Error('Server-only method called with client role');

      if (!(req instanceof AgentInboundRequest))
        throw new Error('Wrong request argument');

      if (req.hasResponded())
        return true;

      let p = 0;
      const buf = Buffer.allocUnsafe(4 + 1);

      writeUInt32BE(buf, buf.length - 4, p);

      buf[p += 4] = SSH_AGENT_FAILURE;

      return respond(this, req, buf);
    }
    getIdentitiesReply(req, keys) {
      if (this[SYM_MODE] !== ROLE_SERVER)
        throw new Error('Server-only method called with client role');

      if (!(req instanceof AgentInboundRequest))
        throw new Error('Wrong request argument');

      if (req.hasResponded())
        return true;

      /*
         byte        SSH_AGENT_IDENTITIES_ANSWER
         uint32      nkeys

        where `nkeys` is 0 or more of:
         string      key blob
         string      comment
      */

      if (req.getType() !== SSH_AGENTC_REQUEST_IDENTITIES)
        throw new Error('Invalid response to request');

      if (!Array.isArray(keys))
        throw new Error('Keys argument must be an array');

      let totalKeysLen = 4; // Include `nkeys` size

      const newKeys = [];
      for (let i = 0; i < keys.length; ++i) {
        const entry = keys[i];
        if (typeof entry !== 'object' || entry === null)
          throw new Error(`Invalid key entry: ${entry}`);

        let pubKey;
        let comment;
        if (isParsedKey(entry)) {
          pubKey = entry;
        } else if (isParsedKey(entry.pubKey)) {
          pubKey = entry.pubKey;
        } else {
          if (typeof entry.pubKey !== 'object' || entry.pubKey === null)
            continue;
          ({ pubKey, comment } = entry.pubKey);
          pubKey = parseKey(pubKey);
          if (pubKey instanceof Error)
            continue; // TODO: add debug output
        }
        comment = pubKey.comment || comment;
        pubKey = pubKey.getPublicSSH();

        totalKeysLen += 4 + pubKey.length;

        if (comment && typeof comment === 'string')
          comment = Buffer.from(comment);
        else if (!Buffer.isBuffer(comment))
          comment = EMPTY_BUF;

        totalKeysLen += 4 + comment.length;

        newKeys.push({ pubKey, comment });
      }

      let p = 0;
      const buf = Buffer.allocUnsafe(4 + 1 + totalKeysLen);

      writeUInt32BE(buf, buf.length - 4, p);

      buf[p += 4] = SSH_AGENT_IDENTITIES_ANSWER;

      writeUInt32BE(buf, newKeys.length, ++p);
      p += 4;
      for (let i = 0; i < newKeys.length; ++i) {
        const { pubKey, comment } = newKeys[i];

        writeUInt32BE(buf, pubKey.length, p);
        pubKey.copy(buf, p += 4);

        writeUInt32BE(buf, comment.length, p += pubKey.length);
        p += 4;
        if (comment.length) {
          comment.copy(buf, p);
          p += comment.length;
        }
      }

      return respond(this, req, buf);
    }
    signReply(req, signature) {
      if (this[SYM_MODE] !== ROLE_SERVER)
        throw new Error('Server-only method called with client role');

      if (!(req instanceof AgentInboundRequest))
        throw new Error('Wrong request argument');

      if (req.hasResponded())
        return true;

      /*
         byte        SSH_AGENT_SIGN_RESPONSE
         string      signature
      */

      if (req.getType() !== SSH_AGENTC_SIGN_REQUEST)
        throw new Error('Invalid response to request');

      if (!Buffer.isBuffer(signature))
        throw new Error('Signature argument must be a Buffer');

      if (signature.length === 0)
        throw new Error('Signature argument must be non-empty');

      /*
        OpenSSH agent signatures are encoded as:

          string    signature format identifier (as specified by the
                    public key/certificate format)
          byte[n]   signature blob in format specific encoding.
            - This is actually a `string` for: rsa, dss, ecdsa, and ed25519
              types
      */

      let p = 0;
      const sigFormat = req.getContext();
      const sigFormatLen = Buffer.byteLength(sigFormat);
      const buf = Buffer.allocUnsafe(
        4 + 1 + 4 + 4 + sigFormatLen + 4 + signature.length
      );

      writeUInt32BE(buf, buf.length - 4, p);

      buf[p += 4] = SSH_AGENT_SIGN_RESPONSE;

      writeUInt32BE(buf, 4 + sigFormatLen + 4 + signature.length, ++p);
      writeUInt32BE(buf, sigFormatLen, p += 4);
      buf.utf8Write(sigFormat, p += 4, sigFormatLen);
      writeUInt32BE(buf, signature.length, p += sigFormatLen);
      signature.copy(buf, p += 4);

      return respond(this, req, buf);
    }
  };
})();

const SYM_AGENT = Symbol('Agent');
const SYM_AGENT_KEYS = Symbol('Agent Keys');
const SYM_AGENT_KEYS_IDX = Symbol('Agent Keys Index');
const SYM_AGENT_CBS = Symbol('Agent Init Callbacks');
class AgentContext {
  constructor(agent) {
    if (typeof agent === 'string')
      agent = createAgent(agent);
    else if (!isAgent(agent))
      throw new Error('Invalid agent argument');
    this[SYM_AGENT] = agent;
    this[SYM_AGENT_KEYS] = null;
    this[SYM_AGENT_KEYS_IDX] = -1;
    this[SYM_AGENT_CBS] = null;
  }
  init(cb) {
    if (typeof cb !== 'function')
      cb = noop;

    if (this[SYM_AGENT_KEYS] === null) {
      if (this[SYM_AGENT_CBS] === null) {
        this[SYM_AGENT_CBS] = [cb];

        const doCbs = (...args) => {
          process.nextTick(() => {
            const cbs = this[SYM_AGENT_CBS];
            this[SYM_AGENT_CBS] = null;
            for (const cb of cbs)
              cb(...args);
          });
        };

        this[SYM_AGENT].getIdentities(once((err, keys) => {
          if (err)
            return doCbs(err);

          if (!Array.isArray(keys)) {
            return doCbs(new Error(
              'Agent implementation failed to provide keys'
            ));
          }

          const newKeys = [];
          for (let key of keys) {
            key = parseKey(key);
            if (key instanceof Error) {
              // TODO: add debug output
              continue;
            }
            newKeys.push(key);
          }

          this[SYM_AGENT_KEYS] = newKeys;
          this[SYM_AGENT_KEYS_IDX] = -1;
          doCbs();
        }));
      } else {
        this[SYM_AGENT_CBS].push(cb);
      }
    } else {
      process.nextTick(cb);
    }
  }
  nextKey() {
    if (this[SYM_AGENT_KEYS] === null
        || ++this[SYM_AGENT_KEYS_IDX] >= this[SYM_AGENT_KEYS].length) {
      return false;
    }

    return this[SYM_AGENT_KEYS][this[SYM_AGENT_KEYS_IDX]];
  }
  currentKey() {
    if (this[SYM_AGENT_KEYS] === null
        || this[SYM_AGENT_KEYS_IDX] >= this[SYM_AGENT_KEYS].length) {
      return null;
    }

    return this[SYM_AGENT_KEYS][this[SYM_AGENT_KEYS_IDX]];
  }
  pos() {
    if (this[SYM_AGENT_KEYS] === null
        || this[SYM_AGENT_KEYS_IDX] >= this[SYM_AGENT_KEYS].length) {
      return -1;
    }

    return this[SYM_AGENT_KEYS_IDX];
  }
  reset() {
    this[SYM_AGENT_KEYS_IDX] = -1;
  }

  sign(...args) {
    this[SYM_AGENT].sign(...args);
  }
}

function isAgent(val) {
  return (val instanceof BaseAgent);
}

module.exports = {
  AgentContext,
  AgentProtocol,
  BaseAgent,
  createAgent,
  CygwinAgent,
  isAgent,
  OpenSSHAgent,
  PageantAgent,
};


/***/ }),

/***/ 6063:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// TODO:
//    * add `.connected` or similar property to allow immediate connection
//      status checking
//    * add/improve debug output during user authentication phase


const {
  createHash,
  getHashes,
  randomFillSync,
} = __nccwpck_require__(6417);
const { Socket } = __nccwpck_require__(1631);
const { lookup: dnsLookup } = __nccwpck_require__(881);
const EventEmitter = __nccwpck_require__(8614);
const HASHES = getHashes();

const {
  COMPAT,
  CHANNEL_EXTENDED_DATATYPE: { STDERR },
  CHANNEL_OPEN_FAILURE,
  DEFAULT_CIPHER,
  DEFAULT_COMPRESSION,
  DEFAULT_KEX,
  DEFAULT_MAC,
  DEFAULT_SERVER_HOST_KEY,
  DISCONNECT_REASON,
  DISCONNECT_REASON_BY_VALUE,
  SUPPORTED_CIPHER,
  SUPPORTED_COMPRESSION,
  SUPPORTED_KEX,
  SUPPORTED_MAC,
  SUPPORTED_SERVER_HOST_KEY,
} = __nccwpck_require__(6832);
const { init: cryptoInit } = __nccwpck_require__(5708);
const Protocol = __nccwpck_require__(9031);
const { parseKey } = __nccwpck_require__(2218);
const { SFTP } = __nccwpck_require__(2026);
const {
  bufferCopy,
  makeBufferParser,
  makeError,
  readUInt32BE,
  sigSSHToASN1,
  writeUInt32BE,
} = __nccwpck_require__(9475);

const { AgentContext, createAgent, isAgent } = __nccwpck_require__(9054);
const {
  Channel,
  MAX_WINDOW,
  PACKET_SIZE,
  windowAdjust,
  WINDOW_THRESHOLD,
} = __nccwpck_require__(3204);
const {
  ChannelManager,
  generateAlgorithmList,
  isWritable,
  onChannelOpenFailure,
  onCHANNEL_CLOSE,
} = __nccwpck_require__(834);

const bufferParser = makeBufferParser();
const sigParser = makeBufferParser();
const RE_OPENSSH = /^OpenSSH_(?:(?![0-4])\d)|(?:\d{2,})/;
const noop = (err) => {};

class Client extends EventEmitter {
  constructor() {
    super();

    this.config = {
      host: undefined,
      port: undefined,
      localAddress: undefined,
      localPort: undefined,
      forceIPv4: undefined,
      forceIPv6: undefined,
      keepaliveCountMax: undefined,
      keepaliveInterval: undefined,
      readyTimeout: undefined,
      ident: undefined,

      username: undefined,
      password: undefined,
      privateKey: undefined,
      tryKeyboard: undefined,
      agent: undefined,
      allowAgentFwd: undefined,
      authHandler: undefined,

      hostHashAlgo: undefined,
      hostHashCb: undefined,
      strictVendor: undefined,
      debug: undefined
    };

    this._agent = undefined;
    this._readyTimeout = undefined;
    this._chanMgr = undefined;
    this._callbacks = undefined;
    this._forwarding = undefined;
    this._forwardingUnix = undefined;
    this._acceptX11 = undefined;
    this._agentFwdEnabled = undefined;
    this._remoteVer = undefined;

    this._protocol = undefined;
    this._sock = undefined;
    this._resetKA = undefined;
  }

  connect(cfg) {
    if (this._sock && isWritable(this._sock)) {
      this.once('close', () => {
        this.connect(cfg);
      });
      this.end();
      return this;
    }

    this.config.host = cfg.hostname || cfg.host || 'localhost';
    this.config.port = cfg.port || 22;
    this.config.localAddress = (typeof cfg.localAddress === 'string'
                                ? cfg.localAddress
                                : undefined);
    this.config.localPort = (typeof cfg.localPort === 'string'
                             || typeof cfg.localPort === 'number'
                             ? cfg.localPort
                             : undefined);
    this.config.forceIPv4 = cfg.forceIPv4 || false;
    this.config.forceIPv6 = cfg.forceIPv6 || false;
    this.config.keepaliveCountMax = (typeof cfg.keepaliveCountMax === 'number'
                                     && cfg.keepaliveCountMax >= 0
                                     ? cfg.keepaliveCountMax
                                     : 3);
    this.config.keepaliveInterval = (typeof cfg.keepaliveInterval === 'number'
                                     && cfg.keepaliveInterval > 0
                                     ? cfg.keepaliveInterval
                                     : 0);
    this.config.readyTimeout = (typeof cfg.readyTimeout === 'number'
                                && cfg.readyTimeout >= 0
                                ? cfg.readyTimeout
                                : 20000);
    this.config.ident = (typeof cfg.ident === 'string'
                         || Buffer.isBuffer(cfg.ident)
                         ? cfg.ident
                         : undefined);

    const algorithms = {
      kex: undefined,
      serverHostKey: undefined,
      cs: {
        cipher: undefined,
        mac: undefined,
        compress: undefined,
        lang: [],
      },
      sc: undefined,
    };
    let allOfferDefaults = true;
    if (typeof cfg.algorithms === 'object' && cfg.algorithms !== null) {
      algorithms.kex = generateAlgorithmList(cfg.algorithms.kex,
                                             DEFAULT_KEX,
                                             SUPPORTED_KEX);
      if (algorithms.kex !== DEFAULT_KEX)
        allOfferDefaults = false;

      algorithms.serverHostKey =
        generateAlgorithmList(cfg.algorithms.serverHostKey,
                              DEFAULT_SERVER_HOST_KEY,
                              SUPPORTED_SERVER_HOST_KEY);
      if (algorithms.serverHostKey !== DEFAULT_SERVER_HOST_KEY)
        allOfferDefaults = false;

      algorithms.cs.cipher = generateAlgorithmList(cfg.algorithms.cipher,
                                                   DEFAULT_CIPHER,
                                                   SUPPORTED_CIPHER);
      if (algorithms.cs.cipher !== DEFAULT_CIPHER)
        allOfferDefaults = false;

      algorithms.cs.mac = generateAlgorithmList(cfg.algorithms.hmac,
                                                DEFAULT_MAC,
                                                SUPPORTED_MAC);
      if (algorithms.cs.mac !== DEFAULT_MAC)
        allOfferDefaults = false;

      algorithms.cs.compress = generateAlgorithmList(cfg.algorithms.compress,
                                                     DEFAULT_COMPRESSION,
                                                     SUPPORTED_COMPRESSION);
      if (algorithms.cs.compress !== DEFAULT_COMPRESSION)
        allOfferDefaults = false;

      if (!allOfferDefaults)
        algorithms.sc = algorithms.cs;
    }

    if (typeof cfg.username === 'string')
      this.config.username = cfg.username;
    else if (typeof cfg.user === 'string')
      this.config.username = cfg.user;
    else
      throw new Error('Invalid username');

    this.config.password = (typeof cfg.password === 'string'
                            ? cfg.password
                            : undefined);
    this.config.privateKey = (typeof cfg.privateKey === 'string'
                              || Buffer.isBuffer(cfg.privateKey)
                              ? cfg.privateKey
                              : undefined);
    this.config.localHostname = (typeof cfg.localHostname === 'string'
                                 ? cfg.localHostname
                                 : undefined);
    this.config.localUsername = (typeof cfg.localUsername === 'string'
                                 ? cfg.localUsername
                                 : undefined);
    this.config.tryKeyboard = (cfg.tryKeyboard === true);
    if (typeof cfg.agent === 'string' && cfg.agent.length)
      this.config.agent = createAgent(cfg.agent);
    else if (isAgent(cfg.agent))
      this.config.agent = cfg.agent;
    else
      this.config.agent = undefined;
    this.config.allowAgentFwd = (cfg.agentForward === true
                                 && this.config.agent !== undefined);
    let authHandler = this.config.authHandler = (
      typeof cfg.authHandler === 'function'
      || Array.isArray(cfg.authHandler)
      ? cfg.authHandler
      : undefined
    );

    this.config.strictVendor = (typeof cfg.strictVendor === 'boolean'
                                ? cfg.strictVendor
                                : true);

    const debug = this.config.debug = (typeof cfg.debug === 'function'
                                       ? cfg.debug
                                       : undefined);

    if (cfg.agentForward === true && !this.config.allowAgentFwd) {
      throw new Error(
        'You must set a valid agent path to allow agent forwarding'
      );
    }

    let callbacks = this._callbacks = [];
    this._chanMgr = new ChannelManager(this);
    this._forwarding = {};
    this._forwardingUnix = {};
    this._acceptX11 = 0;
    this._agentFwdEnabled = false;
    this._agent = (this.config.agent ? this.config.agent : undefined);
    this._remoteVer = undefined;
    let privateKey;

    if (this.config.privateKey) {
      privateKey = parseKey(this.config.privateKey, cfg.passphrase);
      if (privateKey instanceof Error)
        throw new Error(`Cannot parse privateKey: ${privateKey.message}`);
      if (Array.isArray(privateKey)) {
        // OpenSSH's newer format only stores 1 key for now
        privateKey = privateKey[0];
      }
      if (privateKey.getPrivatePEM() === null) {
        throw new Error(
          'privateKey value does not contain a (valid) private key'
        );
      }
    }

    let hostVerifier;
    if (typeof cfg.hostVerifier === 'function') {
      const hashCb = cfg.hostVerifier;
      let hasher;
      if (HASHES.indexOf(cfg.hostHash) !== -1) {
        // Default to old behavior of hashing on user's behalf
        hasher = createHash(cfg.hostHash);
      }
      hostVerifier = (key, verify) => {
        if (hasher) {
          hasher.update(key);
          key = hasher.digest('hex');
        }
        const ret = hashCb(key, verify);
        if (ret !== undefined)
          verify(ret);
      };
    }

    const sock = this._sock = (cfg.sock || new Socket());
    let ready = false;
    let sawHeader = false;
    if (this._protocol)
      this._protocol.cleanup();
    const DEBUG_HANDLER = (!debug ? undefined : (p, display, msg) => {
      debug(`Debug output from server: ${JSON.stringify(msg)}`);
    });
    const proto = this._protocol = new Protocol({
      ident: this.config.ident,
      offer: (allOfferDefaults ? undefined : algorithms),
      onWrite: (data) => {
        if (isWritable(sock))
          sock.write(data);
      },
      onError: (err) => {
        if (err.level === 'handshake')
          clearTimeout(this._readyTimeout);
        if (!proto._destruct)
          sock.removeAllListeners('data');
        this.emit('error', err);
        try {
          sock.end();
        } catch {}
      },
      onHeader: (header) => {
        sawHeader = true;
        this._remoteVer = header.versions.software;
        if (header.greeting)
          this.emit('greeting', header.greeting);
      },
      onHandshakeComplete: (negotiated) => {
        this.emit('handshake', negotiated);
        if (!ready) {
          ready = true;
          proto.service('ssh-userauth');
        }
      },
      debug,
      hostVerifier,
      messageHandlers: {
        DEBUG: DEBUG_HANDLER,
        DISCONNECT: (p, reason, desc) => {
          if (reason !== DISCONNECT_REASON.BY_APPLICATION) {
            if (!desc) {
              desc = DISCONNECT_REASON_BY_VALUE[reason];
              if (desc === undefined)
                desc = `Unexpected disconnection reason: ${reason}`;
            }
            const err = new Error(desc);
            err.code = reason;
            this.emit('error', err);
          }
          sock.end();
        },
        SERVICE_ACCEPT: (p, name) => {
          if (name === 'ssh-userauth')
            tryNextAuth();
        },
        USERAUTH_BANNER: (p, msg) => {
          this.emit('banner', msg);
        },
        USERAUTH_SUCCESS: (p) => {
          // Start keepalive mechanism
          resetKA();

          clearTimeout(this._readyTimeout);

          this.emit('ready');
        },
        USERAUTH_FAILURE: (p, authMethods, partialSuccess) => {
          if (curAuth.type === 'agent') {
            const pos = curAuth.agentCtx.pos();
            debug && debug(`Client: Agent key #${pos + 1} failed`);
            return tryNextAgentKey();
          }

          debug && debug(`Client: ${curAuth.type} auth failed`);

          curPartial = partialSuccess;
          curAuthsLeft = authMethods;
          tryNextAuth();
        },
        USERAUTH_PASSWD_CHANGEREQ: (p, prompt) => {
          if (curAuth.type === 'password') {
            // TODO: support a `changePrompt()` on `curAuth` that defaults to
            // emitting 'change password' as before
            this.emit('change password', prompt, (newPassword) => {
              proto.authPassword(
                this.config.username,
                this.config.password,
                newPassword
              );
            });
          }
        },
        USERAUTH_PK_OK: (p) => {
          if (curAuth.type === 'agent') {
            const key = curAuth.agentCtx.currentKey();
            proto.authPK(curAuth.username, key, (buf, cb) => {
              curAuth.agentCtx.sign(key, buf, {}, (err, signed) => {
                if (err) {
                  err.level = 'agent';
                  this.emit('error', err);
                } else {
                  return cb(signed);
                }

                tryNextAgentKey();
              });
            });
          } else if (curAuth.type === 'publickey') {
            proto.authPK(curAuth.username, curAuth.key, (buf, cb) => {
              const signature = curAuth.key.sign(buf);
              if (signature instanceof Error) {
                signature.message =
                  `Error signing data with key: ${signature.message}`;
                signature.level = 'client-authentication';
                this.emit('error', signature);
                return tryNextAuth();
              }
              cb(signature);
            });
          }
        },
        USERAUTH_INFO_REQUEST: (p, name, instructions, prompts) => {
          if (curAuth.type === 'keyboard-interactive') {
            const nprompts = (Array.isArray(prompts) ? prompts.length : 0);
            if (nprompts === 0) {
              debug && debug(
                'Client: Sending automatic USERAUTH_INFO_RESPONSE'
              );
              proto.authInfoRes();
              return;
            }
            // We sent a keyboard-interactive user authentication request and
            // now the server is sending us the prompts we need to present to
            // the user
            curAuth.prompt(
              name,
              instructions,
              '',
              prompts,
              (answers) => {
                proto.authInfoRes(answers);
              }
            );
          }
        },
        REQUEST_SUCCESS: (p, data) => {
          if (callbacks.length)
            callbacks.shift()(false, data);
        },
        REQUEST_FAILURE: (p) => {
          if (callbacks.length)
            callbacks.shift()(true);
        },
        GLOBAL_REQUEST: (p, name, wantReply, data) => {
          switch (name) {
            case 'hostkeys-00@openssh.com':
              // Automatically verify keys before passing to end user
              hostKeysProve(this, data, (err, keys) => {
                if (err)
                  return;
                this.emit('hostkeys', keys);
              });
              if (wantReply)
                proto.requestSuccess();
              break;
            default:
              // Auto-reject all other global requests, this can be especially
              // useful if the server is sending us dummy keepalive global
              // requests
              if (wantReply)
                proto.requestFailure();
          }
        },
        CHANNEL_OPEN: (p, info) => {
          // Handle incoming requests from server, typically a forwarded TCP or
          // X11 connection
          onCHANNEL_OPEN(this, info);
        },
        CHANNEL_OPEN_CONFIRMATION: (p, info) => {
          const channel = this._chanMgr.get(info.recipient);
          if (typeof channel !== 'function')
            return;

          const isSFTP = (channel.type === 'sftp');
          const type = (isSFTP ? 'session' : channel.type);
          const chanInfo = {
            type,
            incoming: {
              id: info.recipient,
              window: MAX_WINDOW,
              packetSize: PACKET_SIZE,
              state: 'open'
            },
            outgoing: {
              id: info.sender,
              window: info.window,
              packetSize: info.packetSize,
              state: 'open'
            }
          };
          const instance = (
            isSFTP
            ? new SFTP(this, chanInfo, { debug })
            : new Channel(this, chanInfo)
          );
          this._chanMgr.update(info.recipient, instance);
          channel(undefined, instance);
        },
        CHANNEL_OPEN_FAILURE: (p, recipient, reason, description) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'function')
            return;

          const info = { reason, description };
          onChannelOpenFailure(this, recipient, info, channel);
        },
        CHANNEL_DATA: (p, recipient, data) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          // The remote party should not be sending us data if there is no
          // window space available ...
          // TODO: raise error on data with not enough window?
          if (channel.incoming.window === 0)
            return;

          channel.incoming.window -= data.length;

          if (channel.push(data) === false) {
            channel._waitChanDrain = true;
            return;
          }

          if (channel.incoming.window <= WINDOW_THRESHOLD)
            windowAdjust(channel);
        },
        CHANNEL_EXTENDED_DATA: (p, recipient, data, type) => {
          if (type !== STDERR)
            return;

          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          // The remote party should not be sending us data if there is no
          // window space available ...
          // TODO: raise error on data with not enough window?
          if (channel.incoming.window === 0)
            return;

          channel.incoming.window -= data.length;

          if (!channel.stderr.push(data)) {
            channel._waitChanDrain = true;
            return;
          }

          if (channel.incoming.window <= WINDOW_THRESHOLD)
            windowAdjust(channel);
        },
        CHANNEL_WINDOW_ADJUST: (p, recipient, amount) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          // The other side is allowing us to send `amount` more bytes of data
          channel.outgoing.window += amount;

          if (channel._waitWindow) {
            channel._waitWindow = false;

            if (channel._chunk) {
              channel._write(channel._chunk, null, channel._chunkcb);
            } else if (channel._chunkcb) {
              channel._chunkcb();
            } else if (channel._chunkErr) {
              channel.stderr._write(channel._chunkErr,
                                    null,
                                    channel._chunkcbErr);
            } else if (channel._chunkcbErr) {
              channel._chunkcbErr();
            }
          }
        },
        CHANNEL_SUCCESS: (p, recipient) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          this._resetKA();

          if (channel._callbacks.length)
            channel._callbacks.shift()(false);
        },
        CHANNEL_FAILURE: (p, recipient) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          this._resetKA();

          if (channel._callbacks.length)
            channel._callbacks.shift()(true);
        },
        CHANNEL_REQUEST: (p, recipient, type, wantReply, data) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          const exit = channel._exit;
          if (exit.code !== undefined)
            return;
          switch (type) {
            case 'exit-status':
              channel.emit('exit', exit.code = data);
              return;
            case 'exit-signal':
              channel.emit('exit',
                           exit.code = null,
                           exit.signal = `SIG${data.signal}`,
                           exit.dump = data.coreDumped,
                           exit.desc = data.errorMessage);
              return;
          }

          // Keepalive request? OpenSSH will send one as a channel request if
          // there is a channel open

          if (wantReply)
            p.channelFailure(channel.outgoing.id);
        },
        CHANNEL_EOF: (p, recipient) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          if (channel.incoming.state !== 'open')
            return;
          channel.incoming.state = 'eof';

          if (channel.readable)
            channel.push(null);
          if (channel.stderr.readable)
            channel.stderr.push(null);
        },
        CHANNEL_CLOSE: (p, recipient) => {
          onCHANNEL_CLOSE(this, recipient, this._chanMgr.get(recipient));
        },
      },
    });

    sock.pause();

    // TODO: check keepalive implementation
    // Keepalive-related
    const kainterval = this.config.keepaliveInterval;
    const kacountmax = this.config.keepaliveCountMax;
    let kacount = 0;
    let katimer;
    const sendKA = () => {
      if (++kacount > kacountmax) {
        clearInterval(katimer);
        if (sock.readable) {
          const err = new Error('Keepalive timeout');
          err.level = 'client-timeout';
          this.emit('error', err);
          sock.destroy();
        }
        return;
      }
      if (isWritable(sock)) {
        // Append dummy callback to keep correct callback order
        callbacks.push(resetKA);
        proto.ping();
      } else {
        clearInterval(katimer);
      }
    };
    function resetKA() {
      if (kainterval > 0) {
        kacount = 0;
        clearInterval(katimer);
        if (isWritable(sock))
          katimer = setInterval(sendKA, kainterval);
      }
    }
    this._resetKA = resetKA;

    const onDone = (() => {
      let called = false;
      return () => {
        if (called)
          return;
        called = true;
        if (wasConnected && !sawHeader) {
          const err =
            makeError('Connection lost before handshake', 'protocol', true);
          this.emit('error', err);
        }
      };
    })();
    const onConnect = (() => {
      let called = false;
      return () => {
        if (called)
          return;
        called = true;

        wasConnected = true;
        debug && debug('Socket connected');
        this.emit('connect');

        cryptoInit.then(() => {
          proto.start();
          sock.on('data', (data) => {
            try {
              proto.parse(data, 0, data.length);
            } catch (ex) {
              this.emit('error', ex);
              try {
                if (isWritable(sock))
                  sock.end();
              } catch {}
            }
          });

          // Drain stderr if we are connection hopping using an exec stream
          if (sock.stderr && typeof sock.stderr.resume === 'function')
            sock.stderr.resume();

          sock.resume();
        }).catch((err) => {
          this.emit('error', err);
          try {
            if (isWritable(sock))
              sock.end();
          } catch {}
        });
      };
    })();
    let wasConnected = false;
    sock.on('connect', onConnect)
        .on('timeout', () => {
      this.emit('timeout');
    }).on('error', (err) => {
      debug && debug(`Socket error: ${err.message}`);
      clearTimeout(this._readyTimeout);
      err.level = 'client-socket';
      this.emit('error', err);
    }).on('end', () => {
      debug && debug('Socket ended');
      onDone();
      proto.cleanup();
      clearTimeout(this._readyTimeout);
      clearInterval(katimer);
      this.emit('end');
    }).on('close', () => {
      debug && debug('Socket closed');
      onDone();
      proto.cleanup();
      clearTimeout(this._readyTimeout);
      clearInterval(katimer);
      this.emit('close');

      // Notify outstanding channel requests of disconnection ...
      const callbacks_ = callbacks;
      callbacks = this._callbacks = [];
      const err = new Error('No response from server');
      for (let i = 0; i < callbacks_.length; ++i)
        callbacks_[i](err);

      // Simulate error for any channels waiting to be opened
      this._chanMgr.cleanup(err);
    });

    // Begin authentication handling ===========================================
    let curAuth;
    let curPartial = null;
    let curAuthsLeft = null;
    const authsAllowed = ['none'];
    if (this.config.password !== undefined)
      authsAllowed.push('password');
    if (privateKey !== undefined)
      authsAllowed.push('publickey');
    if (this._agent !== undefined)
      authsAllowed.push('agent');
    if (this.config.tryKeyboard)
      authsAllowed.push('keyboard-interactive');
    if (privateKey !== undefined
        && this.config.localHostname !== undefined
        && this.config.localUsername !== undefined) {
      authsAllowed.push('hostbased');
    }

    if (Array.isArray(authHandler))
      authHandler = makeSimpleAuthHandler(authHandler);
    else if (typeof authHandler !== 'function')
      authHandler = makeSimpleAuthHandler(authsAllowed);

    let hasSentAuth = false;
    const doNextAuth = (nextAuth) => {
      if (hasSentAuth)
        return;
      hasSentAuth = true;

      if (nextAuth === false) {
        const err = new Error('All configured authentication methods failed');
        err.level = 'client-authentication';
        this.emit('error', err);
        this.end();
        return;
      }

      if (typeof nextAuth === 'string') {
        // Remain backwards compatible with original `authHandler()` usage,
        // which only supported passing names of next method to try using data
        // from the `connect()` config object

        const type = nextAuth;
        if (authsAllowed.indexOf(type) === -1)
          return skipAuth(`Authentication method not allowed: ${type}`);

        const username = this.config.username;
        switch (type) {
          case 'password':
            nextAuth = { type, username, password: this.config.password };
            break;
          case 'publickey':
            nextAuth = { type, username, key: privateKey };
            break;
          case 'hostbased':
            nextAuth = {
              type,
              username,
              key: privateKey,
              localHostname: this.config.localHostname,
              localUsername: this.config.localUsername,
            };
            break;
          case 'agent':
            nextAuth = {
              type,
              username,
              agentCtx: new AgentContext(this._agent),
            };
            break;
          case 'keyboard-interactive':
            nextAuth = {
              type,
              username,
              prompt: (...args) => this.emit('keyboard-interactive', ...args),
            };
            break;
          case 'none':
            nextAuth = { type, username };
            break;
          default:
            return skipAuth(
              `Skipping unsupported authentication method: ${nextAuth}`
            );
        }
      } else if (typeof nextAuth !== 'object' || nextAuth === null) {
        return skipAuth(
          `Skipping invalid authentication attempt: ${nextAuth}`
        );
      } else {
        const username = nextAuth.username;
        if (typeof username !== 'string') {
          return skipAuth(
            `Skipping invalid authentication attempt: ${nextAuth}`
          );
        }
        const type = nextAuth.type;
        switch (type) {
          case 'password': {
            const { password } = nextAuth;
            if (typeof password !== 'string' && !Buffer.isBuffer(password))
              return skipAuth('Skipping invalid password auth attempt');
            nextAuth = { type, username, password };
            break;
          }
          case 'publickey': {
            const key = parseKey(nextAuth.key, nextAuth.passphrase);
            if (key instanceof Error)
              return skipAuth('Skipping invalid key auth attempt');
            if (!key.isPrivateKey())
              return skipAuth('Skipping non-private key');
            nextAuth = { type, username, key };
            break;
          }
          case 'hostbased': {
            const { localHostname, localUsername } = nextAuth;
            const key = parseKey(nextAuth.key, nextAuth.passphrase);
            if (key instanceof Error
                || typeof localHostname !== 'string'
                || typeof localUsername !== 'string') {
              return skipAuth('Skipping invalid hostbased auth attempt');
            }
            if (!key.isPrivateKey())
              return skipAuth('Skipping non-private key');
            nextAuth = { type, username, key, localHostname, localUsername };
            break;
          }
          case 'agent': {
            let agent = nextAuth.agent;
            if (typeof agent === 'string' && agent.length) {
              agent = createAgent(agent);
            } else if (!isAgent(agent)) {
              return skipAuth(
                `Skipping invalid agent: ${nextAuth.agent}`
              );
            }
            nextAuth = { type, username, agentCtx: new AgentContext(agent) };
            break;
          }
          case 'keyboard-interactive': {
            const { prompt } = nextAuth;
            if (typeof prompt !== 'function') {
              return skipAuth(
                'Skipping invalid keyboard-interactive auth attempt'
              );
            }
            nextAuth = { type, username, prompt };
            break;
          }
          case 'none':
            nextAuth = { type, username };
            break;
          default:
            return skipAuth(
              `Skipping unsupported authentication method: ${nextAuth}`
            );
        }
      }
      curAuth = nextAuth;

      // Begin authentication method's process
      try {
        const username = curAuth.username;
        switch (curAuth.type) {
          case 'password':
            proto.authPassword(username, curAuth.password);
            break;
          case 'publickey':
            proto.authPK(username, curAuth.key);
            break;
          case 'hostbased':
            proto.authHostbased(username,
                                curAuth.key,
                                curAuth.localHostname,
                                curAuth.localUsername,
                                (buf, cb) => {
              const signature = curAuth.key.sign(buf);
              if (signature instanceof Error) {
                signature.message =
                  `Error while signing with key: ${signature.message}`;
                signature.level = 'client-authentication';
                this.emit('error', signature);
                return tryNextAuth();
              }

              cb(signature);
            });
            break;
          case 'agent':
            curAuth.agentCtx.init((err) => {
              if (err) {
                err.level = 'agent';
                this.emit('error', err);
                return tryNextAuth();
              }
              tryNextAgentKey();
            });
            break;
          case 'keyboard-interactive':
            proto.authKeyboard(username);
            break;
          case 'none':
            proto.authNone(username);
            break;
        }
      } finally {
        hasSentAuth = false;
      }
    };

    function skipAuth(msg) {
      debug && debug(msg);
      process.nextTick(tryNextAuth);
    }

    function tryNextAuth() {
      hasSentAuth = false;
      const auth = authHandler(curAuthsLeft, curPartial, doNextAuth);
      if (hasSentAuth || auth === undefined)
        return;
      doNextAuth(auth);
    }

    const tryNextAgentKey = () => {
      if (curAuth.type === 'agent') {
        const key = curAuth.agentCtx.nextKey();
        if (key === false) {
          debug && debug('Agent: No more keys left to try');
          debug && debug('Client: agent auth failed');
          tryNextAuth();
        } else {
          const pos = curAuth.agentCtx.pos();
          debug && debug(`Agent: Trying key #${pos + 1}`);
          proto.authPK(curAuth.username, key);
        }
      }
    };

    const startTimeout = () => {
      if (this.config.readyTimeout > 0) {
        this._readyTimeout = setTimeout(() => {
          const err = new Error('Timed out while waiting for handshake');
          err.level = 'client-timeout';
          this.emit('error', err);
          sock.destroy();
        }, this.config.readyTimeout);
      }
    };

    if (!cfg.sock) {
      let host = this.config.host;
      const forceIPv4 = this.config.forceIPv4;
      const forceIPv6 = this.config.forceIPv6;

      debug && debug(`Client: Trying ${host} on port ${this.config.port} ...`);

      const doConnect = () => {
        startTimeout();
        sock.connect({
          host,
          port: this.config.port,
          localAddress: this.config.localAddress,
          localPort: this.config.localPort
        });
        sock.setNoDelay(true);
        sock.setMaxListeners(0);
        sock.setTimeout(typeof cfg.timeout === 'number' ? cfg.timeout : 0);
      };

      if ((!forceIPv4 && !forceIPv6) || (forceIPv4 && forceIPv6)) {
        doConnect();
      } else {
        dnsLookup(host, (forceIPv4 ? 4 : 6), (err, address, family) => {
          if (err) {
            const type = (forceIPv4 ? 'IPv4' : 'IPv6');
            const error = new Error(
              `Error while looking up ${type} address for '${host}': ${err}`
            );
            clearTimeout(this._readyTimeout);
            error.level = 'client-dns';
            this.emit('error', error);
            this.emit('close');
            return;
          }
          host = address;
          doConnect();
        });
      }
    } else {
      // Custom socket passed in
      startTimeout();
      if (typeof sock.connecting === 'boolean') {
        // net.Socket

        if (!sock.connecting) {
          // Already connected
          onConnect();
        }
      } else {
        // Assume socket/stream is already "connected"
        onConnect();
      }
    }

    return this;
  }

  end() {
    if (this._sock && isWritable(this._sock)) {
      this._protocol.disconnect(DISCONNECT_REASON.BY_APPLICATION);
      this._sock.end();
    }
    return this;
  }

  destroy() {
    this._sock && isWritable(this._sock) && this._sock.destroy();
    return this;
  }

  exec(cmd, opts, cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }

    const extraOpts = { allowHalfOpen: (opts.allowHalfOpen !== false) };

    openChannel(this, 'session', extraOpts, (err, chan) => {
      if (err) {
        cb(err);
        return;
      }

      const todo = [];

      function reqCb(err) {
        if (err) {
          chan.close();
          cb(err);
          return;
        }
        if (todo.length)
          todo.shift()();
      }

      if (this.config.allowAgentFwd === true
          || (opts
              && opts.agentForward === true
              && this._agent !== undefined)) {
        todo.push(() => reqAgentFwd(chan, reqCb));
      }

      if (typeof opts === 'object' && opts !== null) {
        if (typeof opts.env === 'object' && opts.env !== null)
          reqEnv(chan, opts.env);
        if ((typeof opts.pty === 'object' && opts.pty !== null)
            || opts.pty === true) {
          todo.push(() => reqPty(chan, opts.pty, reqCb));
        }
        if ((typeof opts.x11 === 'object' && opts.x11 !== null)
            || opts.x11 === 'number'
            || opts.x11 === true) {
          todo.push(() => reqX11(chan, opts.x11, reqCb));
        }
      }

      todo.push(() => reqExec(chan, cmd, opts, cb));
      todo.shift()();
    });

    return this;
  }

  shell(wndopts, opts, cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    if (typeof wndopts === 'function') {
      cb = wndopts;
      wndopts = opts = undefined;
    } else if (typeof opts === 'function') {
      cb = opts;
      opts = undefined;
    }
    if (wndopts && (wndopts.x11 !== undefined || wndopts.env !== undefined)) {
      opts = wndopts;
      wndopts = undefined;
    }

    openChannel(this, 'session', (err, chan) => {
      if (err) {
        cb(err);
        return;
      }

      const todo = [];

      function reqCb(err) {
        if (err) {
          chan.close();
          cb(err);
          return;
        }
        if (todo.length)
          todo.shift()();
      }

      if (this.config.allowAgentFwd === true
          || (opts
              && opts.agentForward === true
              && this._agent !== undefined)) {
        todo.push(() => reqAgentFwd(chan, reqCb));
      }

      if (wndopts !== false)
        todo.push(() => reqPty(chan, wndopts, reqCb));

      if (typeof opts === 'object' && opts !== null) {
        if (typeof opts.env === 'object' && opts.env !== null)
          reqEnv(chan, opts.env);
        if ((typeof opts.x11 === 'object' && opts.x11 !== null)
            || opts.x11 === 'number'
            || opts.x11 === true) {
          todo.push(() => reqX11(chan, opts.x11, reqCb));
        }
      }

      todo.push(() => reqShell(chan, cb));
      todo.shift()();
    });

    return this;
  }

  subsys(name, cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    openChannel(this, 'session', (err, chan) => {
      if (err) {
        cb(err);
        return;
      }

      reqSubsystem(chan, name, (err, stream) => {
        if (err) {
          cb(err);
          return;
        }

        cb(undefined, stream);
      });
    });

    return this;
  }

  forwardIn(bindAddr, bindPort, cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    // Send a request for the server to start forwarding TCP connections to us
    // on a particular address and port

    const wantReply = (typeof cb === 'function');

    if (wantReply) {
      this._callbacks.push((had_err, data) => {
        if (had_err) {
          cb(had_err !== true
             ? had_err
             : new Error(`Unable to bind to ${bindAddr}:${bindPort}`));
          return;
        }

        let realPort = bindPort;
        if (bindPort === 0 && data && data.length >= 4) {
          realPort = readUInt32BE(data, 0);
          if (!(this._protocol._compatFlags & COMPAT.DYN_RPORT_BUG))
            bindPort = realPort;
        }

        this._forwarding[`${bindAddr}:${bindPort}`] = realPort;

        cb(undefined, realPort);
      });
    }

    this._protocol.tcpipForward(bindAddr, bindPort, wantReply);

    return this;
  }

  unforwardIn(bindAddr, bindPort, cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    // Send a request to stop forwarding us new connections for a particular
    // address and port

    const wantReply = (typeof cb === 'function');

    if (wantReply) {
      this._callbacks.push((had_err) => {
        if (had_err) {
          cb(had_err !== true
             ? had_err
             : new Error(`Unable to unbind from ${bindAddr}:${bindPort}`));
          return;
        }

        delete this._forwarding[`${bindAddr}:${bindPort}`];

        cb();
      });
    }

    this._protocol.cancelTcpipForward(bindAddr, bindPort, wantReply);

    return this;
  }

  forwardOut(srcIP, srcPort, dstIP, dstPort, cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    // Send a request to forward a TCP connection to the server

    const cfg = {
      srcIP: srcIP,
      srcPort: srcPort,
      dstIP: dstIP,
      dstPort: dstPort
    };

    if (typeof cb !== 'function')
      cb = noop;

    openChannel(this, 'direct-tcpip', cfg, cb);

    return this;
  }

  openssh_noMoreSessions(cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    const wantReply = (typeof cb === 'function');

    if (!this.config.strictVendor
        || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
      if (wantReply) {
        this._callbacks.push((had_err) => {
          if (had_err) {
            cb(had_err !== true
               ? had_err
               : new Error('Unable to disable future sessions'));
            return;
          }

          cb();
        });
      }

      this._protocol.openssh_noMoreSessions(wantReply);
      return this;
    }

    if (!wantReply)
      return this;

    process.nextTick(
      cb,
      new Error(
        'strictVendor enabled and server is not OpenSSH or compatible version'
      )
    );

    return this;
  }

  openssh_forwardInStreamLocal(socketPath, cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    const wantReply = (typeof cb === 'function');

    if (!this.config.strictVendor
        || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
      if (wantReply) {
        this._callbacks.push((had_err) => {
          if (had_err) {
            cb(had_err !== true
               ? had_err
               : new Error(`Unable to bind to ${socketPath}`));
            return;
          }
          this._forwardingUnix[socketPath] = true;
          cb();
        });
      }

      this._protocol.openssh_streamLocalForward(socketPath, wantReply);
      return this;
    }

    if (!wantReply)
      return this;

    process.nextTick(
      cb,
      new Error(
        'strictVendor enabled and server is not OpenSSH or compatible version'
      )
    );

    return this;
  }

  openssh_unforwardInStreamLocal(socketPath, cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    const wantReply = (typeof cb === 'function');

    if (!this.config.strictVendor
        || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
      if (wantReply) {
        this._callbacks.push((had_err) => {
          if (had_err) {
            cb(had_err !== true
               ? had_err
               : new Error(`Unable to unbind from ${socketPath}`));
            return;
          }
          delete this._forwardingUnix[socketPath];
          cb();
        });
      }

      this._protocol.openssh_cancelStreamLocalForward(socketPath, wantReply);
      return this;
    }

    if (!wantReply)
      return this;

    process.nextTick(
      cb,
      new Error(
        'strictVendor enabled and server is not OpenSSH or compatible version'
      )
    );

    return this;
  }

  openssh_forwardOutStreamLocal(socketPath, cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    if (typeof cb !== 'function')
      cb = noop;

    if (!this.config.strictVendor
        || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
      openChannel(this, 'direct-streamlocal@openssh.com', { socketPath }, cb);
      return this;
    }
    process.nextTick(
      cb,
      new Error(
        'strictVendor enabled and server is not OpenSSH or compatible version'
      )
    );

    return this;
  }

  sftp(cb) {
    if (!this._sock || !isWritable(this._sock))
      throw new Error('Not connected');

    openChannel(this, 'sftp', (err, sftp) => {
      if (err) {
        cb(err);
        return;
      }

      reqSubsystem(sftp, 'sftp', (err, sftp_) => {
        if (err) {
          cb(err);
          return;
        }

        function removeListeners() {
          sftp.removeListener('ready', onReady);
          sftp.removeListener('error', onError);
          sftp.removeListener('exit', onExit);
          sftp.removeListener('close', onExit);
        }

        function onReady() {
          // TODO: do not remove exit/close in case remote end closes the
          // channel abruptly and we need to notify outstanding callbacks
          removeListeners();
          cb(undefined, sftp);
        }

        function onError(err) {
          removeListeners();
          cb(err);
        }

        function onExit(code, signal) {
          removeListeners();
          let msg;
          if (typeof code === 'number')
            msg = `Received exit code ${code} while establishing SFTP session`;
          else if (signal !== undefined)
            msg = `Received signal ${signal} while establishing SFTP session`;
          else
            msg = 'Received unexpected SFTP session termination';
          const err = new Error(msg);
          err.code = code;
          err.signal = signal;
          cb(err);
        }

        sftp.on('ready', onReady)
            .on('error', onError)
            .on('exit', onExit)
            .on('close', onExit);

        sftp._init();
      });
    });

    return this;
  }
}

function openChannel(self, type, opts, cb) {
  // Ask the server to open a channel for some purpose
  // (e.g. session (sftp, exec, shell), or forwarding a TCP connection
  const initWindow = MAX_WINDOW;
  const maxPacket = PACKET_SIZE;

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  const wrapper = (err, stream) => {
    cb(err, stream);
  };
  wrapper.type = type;

  const localChan = self._chanMgr.add(wrapper);

  if (localChan === -1) {
    cb(new Error('No free channels available'));
    return;
  }

  switch (type) {
    case 'session':
    case 'sftp':
      self._protocol.session(localChan, initWindow, maxPacket);
      break;
    case 'direct-tcpip':
      self._protocol.directTcpip(localChan, initWindow, maxPacket, opts);
      break;
    case 'direct-streamlocal@openssh.com':
      self._protocol.openssh_directStreamLocal(
        localChan, initWindow, maxPacket, opts
      );
      break;
    default:
      throw new Error(`Unsupported channel type: ${type}`);
  }
}

function reqX11(chan, screen, cb) {
  // Asks server to start sending us X11 connections
  const cfg = {
    single: false,
    protocol: 'MIT-MAGIC-COOKIE-1',
    cookie: undefined,
    screen: 0
  };

  if (typeof screen === 'function') {
    cb = screen;
  } else if (typeof screen === 'object' && screen !== null) {
    if (typeof screen.single === 'boolean')
      cfg.single = screen.single;
    if (typeof screen.screen === 'number')
      cfg.screen = screen.screen;
    if (typeof screen.protocol === 'string')
      cfg.protocol = screen.protocol;
    if (typeof screen.cookie === 'string')
      cfg.cookie = screen.cookie;
    else if (Buffer.isBuffer(screen.cookie))
      cfg.cookie = screen.cookie.hexSlice(0, screen.cookie.length);
  }
  if (cfg.cookie === undefined)
    cfg.cookie = randomCookie();

  const wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    if (wantReply)
      cb(new Error('Channel is not open'));
    return;
  }

  if (wantReply) {
    chan._callbacks.push((had_err) => {
      if (had_err) {
        cb(had_err !== true ? had_err : new Error('Unable to request X11'));
        return;
      }

      chan._hasX11 = true;
      ++chan._client._acceptX11;
      chan.once('close', () => {
        if (chan._client._acceptX11)
          --chan._client._acceptX11;
      });

      cb();
    });
  }

  chan._client._protocol.x11Forward(chan.outgoing.id, cfg, wantReply);
}

function reqPty(chan, opts, cb) {
  let rows = 24;
  let cols = 80;
  let width = 640;
  let height = 480;
  let term = 'vt100';
  let modes = null;

  if (typeof opts === 'function') {
    cb = opts;
  } else if (typeof opts === 'object' && opts !== null) {
    if (typeof opts.rows === 'number')
      rows = opts.rows;
    if (typeof opts.cols === 'number')
      cols = opts.cols;
    if (typeof opts.width === 'number')
      width = opts.width;
    if (typeof opts.height === 'number')
      height = opts.height;
    if (typeof opts.term === 'string')
      term = opts.term;
    if (typeof opts.modes === 'object')
      modes = opts.modes;
  }

  const wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    if (wantReply)
      cb(new Error('Channel is not open'));
    return;
  }

  if (wantReply) {
    chan._callbacks.push((had_err) => {
      if (had_err) {
        cb(had_err !== true
           ? had_err
           : new Error('Unable to request a pseudo-terminal'));
        return;
      }
      cb();
    });
  }

  chan._client._protocol.pty(chan.outgoing.id,
                             rows,
                             cols,
                             height,
                             width,
                             term,
                             modes,
                             wantReply);
}

function reqAgentFwd(chan, cb) {
  const wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    wantReply && cb(new Error('Channel is not open'));
    return;
  }
  if (chan._client._agentFwdEnabled) {
    wantReply && cb(false);
    return;
  }

  chan._client._agentFwdEnabled = true;

  chan._callbacks.push((had_err) => {
    if (had_err) {
      chan._client._agentFwdEnabled = false;
      if (wantReply) {
        cb(had_err !== true
           ? had_err
           : new Error('Unable to request agent forwarding'));
      }
      return;
    }

    if (wantReply)
      cb();
  });

  chan._client._protocol.openssh_agentForward(chan.outgoing.id, true);
}

function reqShell(chan, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return;
  }

  chan._callbacks.push((had_err) => {
    if (had_err) {
      cb(had_err !== true ? had_err : new Error('Unable to open shell'));
      return;
    }
    chan.subtype = 'shell';
    cb(undefined, chan);
  });

  chan._client._protocol.shell(chan.outgoing.id, true);
}

function reqExec(chan, cmd, opts, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return;
  }

  chan._callbacks.push((had_err) => {
    if (had_err) {
      cb(had_err !== true ? had_err : new Error('Unable to exec'));
      return;
    }
    chan.subtype = 'exec';
    chan.allowHalfOpen = (opts.allowHalfOpen !== false);
    cb(undefined, chan);
  });

  chan._client._protocol.exec(chan.outgoing.id, cmd, true);
}

function reqEnv(chan, env) {
  if (chan.outgoing.state !== 'open')
    return;

  const keys = Object.keys(env || {});

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    const val = env[key];
    chan._client._protocol.env(chan.outgoing.id, key, val, false);
  }
}

function reqSubsystem(chan, name, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return;
  }

  chan._callbacks.push((had_err) => {
    if (had_err) {
      cb(had_err !== true
         ? had_err
         : new Error(`Unable to start subsystem: ${name}`));
      return;
    }
    chan.subtype = 'subsystem';
    cb(undefined, chan);
  });

  chan._client._protocol.subsystem(chan.outgoing.id, name, true);
}

// TODO: inline implementation into single call site
function onCHANNEL_OPEN(self, info) {
  // The server is trying to open a channel with us, this is usually when
  // we asked the server to forward us connections on some port and now they
  // are asking us to accept/deny an incoming connection on their side

  let localChan = -1;
  let reason;

  const accept = () => {
    const chanInfo = {
      type: info.type,
      incoming: {
        id: localChan,
        window: MAX_WINDOW,
        packetSize: PACKET_SIZE,
        state: 'open'
      },
      outgoing: {
        id: info.sender,
        window: info.window,
        packetSize: info.packetSize,
        state: 'open'
      }
    };
    const stream = new Channel(self, chanInfo);
    self._chanMgr.update(localChan, stream);

    self._protocol.channelOpenConfirm(info.sender,
                                      localChan,
                                      MAX_WINDOW,
                                      PACKET_SIZE);
    return stream;
  };
  const reject = () => {
    if (reason === undefined) {
      if (localChan === -1)
        reason = CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE;
      else
        reason = CHANNEL_OPEN_FAILURE.CONNECT_FAILED;
    }

    if (localChan !== -1)
      self._chanMgr.remove(localChan);

    self._protocol.channelOpenFail(info.sender, reason, '');
  };
  const reserveChannel = () => {
    localChan = self._chanMgr.add();

    if (localChan === -1) {
      reason = CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE;
      if (self.config.debug) {
        self.config.debug(
          'Client: Automatic rejection of incoming channel open: '
            + 'no channels available'
        );
      }
    }

    return (localChan !== -1);
  };

  const data = info.data;
  switch (info.type) {
    case 'forwarded-tcpip': {
      const val = self._forwarding[`${data.destIP}:${data.destPort}`];
      if (val !== undefined && reserveChannel()) {
        if (data.destPort === 0)
          data.destPort = val;
        self.emit('tcp connection', data, accept, reject);
        return;
      }
      break;
    }
    case 'forwarded-streamlocal@openssh.com':
      if (self._forwardingUnix[data.socketPath] !== undefined
          && reserveChannel()) {
        self.emit('unix connection', data, accept, reject);
        return;
      }
      break;
    case 'auth-agent@openssh.com':
      if (self._agentFwdEnabled
          && typeof self._agent.getStream === 'function'
          && reserveChannel()) {
        self._agent.getStream((err, stream) => {
          if (err)
            return reject();

          const upstream = accept();
          upstream.pipe(stream).pipe(upstream);
        });
        return;
      }
      break;
    case 'x11':
      if (self._acceptX11 !== 0 && reserveChannel()) {
        self.emit('x11', data, accept, reject);
        return;
      }
      break;
    default:
      // Automatically reject any unsupported channel open requests
      reason = CHANNEL_OPEN_FAILURE.UNKNOWN_CHANNEL_TYPE;
      if (self.config.debug) {
        self.config.debug(
          'Client: Automatic rejection of unsupported incoming channel open '
            + `type: ${info.type}`
        );
      }
  }

  if (reason === undefined) {
    reason = CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
    if (self.config.debug) {
       self.config.debug(
        'Client: Automatic rejection of unexpected incoming channel open for: '
          + info.type
      );
    }
  }

  reject();
}

const randomCookie = (() => {
  const buffer = Buffer.allocUnsafe(16);
  return () => {
    randomFillSync(buffer, 0, 16);
    return buffer.hexSlice(0, 16);
  };
})();

function makeSimpleAuthHandler(authList) {
  if (!Array.isArray(authList))
    throw new Error('authList must be an array');

  let a = 0;
  return (authsLeft, partialSuccess, cb) => {
    if (a === authList.length)
      return false;
    return authList[a++];
  };
}

function hostKeysProve(client, keys_, cb) {
  if (!client._sock || !isWritable(client._sock))
    return;

  if (typeof cb !== 'function')
    cb = noop;

  if (!Array.isArray(keys_))
    throw new TypeError('Invalid keys argument type');

  const keys = [];
  for (const key of keys_) {
    const parsed = parseKey(key);
    if (parsed instanceof Error)
      throw parsed;
    keys.push(parsed);
  }

  if (!client.config.strictVendor
      || (client.config.strictVendor && RE_OPENSSH.test(client._remoteVer))) {
    client._callbacks.push((had_err, data) => {
      if (had_err) {
        cb(had_err !== true
           ? had_err
           : new Error('Server failed to prove supplied keys'));
        return;
      }

      // TODO: move all of this parsing/verifying logic out of the client?
      const ret = [];
      let keyIdx = 0;
      bufferParser.init(data, 0);
      while (bufferParser.avail()) {
        if (keyIdx === keys.length)
          break;
        const key = keys[keyIdx++];
        const keyPublic = key.getPublicSSH();

        const sigEntry = bufferParser.readString();
        sigParser.init(sigEntry, 0);
        const type = sigParser.readString(true);
        let value = sigParser.readString();

        let algo;
        if (type !== key.type) {
          if (key.type === 'ssh-rsa') {
            switch (type) {
              case 'rsa-sha2-256':
                algo = 'sha256';
                break;
              case 'rsa-sha2-512':
                algo = 'sha512';
                break;
              default:
                continue;
            }
          } else {
            continue;
          }
        }

        const sessionID = client._protocol._kex.sessionID;
        const verifyData = Buffer.allocUnsafe(
          4 + 29 + 4 + sessionID.length + 4 + keyPublic.length
        );
        let p = 0;
        writeUInt32BE(verifyData, 29, p);
        verifyData.utf8Write('hostkeys-prove-00@openssh.com', p += 4, 29);
        writeUInt32BE(verifyData, sessionID.length, p += 29);
        bufferCopy(sessionID, verifyData, 0, sessionID.length, p += 4);
        writeUInt32BE(verifyData, keyPublic.length, p += sessionID.length);
        bufferCopy(keyPublic, verifyData, 0, keyPublic.length, p += 4);

        if (!(value = sigSSHToASN1(value, type)))
          continue;
        if (key.verify(verifyData, value, algo) === true)
          ret.push(key);
      }
      sigParser.clear();
      bufferParser.clear();

      cb(null, ret);
    });

    client._protocol.openssh_hostKeysProve(keys);
    return;
  }

  process.nextTick(
    cb,
    new Error(
      'strictVendor enabled and server is not OpenSSH or compatible version'
    )
  );
}

module.exports = Client;


/***/ }),

/***/ 2994:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const { Agent: HttpAgent } = __nccwpck_require__(8605);
const { Agent: HttpsAgent } = __nccwpck_require__(7211);
const { connect: tlsConnect } = __nccwpck_require__(4016);

let Client;

for (const ctor of [HttpAgent, HttpsAgent]) {
  class SSHAgent extends ctor {
    constructor(connectCfg, agentOptions) {
      super(agentOptions);

      this._connectCfg = connectCfg;
      this._defaultSrcIP = (agentOptions && agentOptions.srcIP) || 'localhost';
    }

    createConnection(options, cb) {
      const srcIP = (options && options.localAddress) || this._defaultSrcIP;
      const srcPort = (options && options.localPort) || 0;
      const dstIP = options.host;
      const dstPort = options.port;

      if (Client === undefined)
        Client = __nccwpck_require__(6063);

      const client = new Client();
      let triedForward = false;
      client.on('ready', () => {
        client.forwardOut(srcIP, srcPort, dstIP, dstPort, (err, stream) => {
          triedForward = true;
          if (err) {
            client.end();
            return cb(err);
          }
          stream.once('close', () => client.end());
          cb(null, decorateStream(stream, ctor, options));
        });
      }).on('error', cb).on('close', () => {
        if (!triedForward)
          cb(new Error('Unexpected connection close'));
      }).connect(this._connectCfg);
    }
  }

  exports[ctor === HttpAgent ? 'SSHTTPAgent' : 'SSHTTPSAgent'] = SSHAgent;
}

function noop() {}

function decorateStream(stream, ctor, options) {
  if (ctor === HttpAgent) {
    // HTTP
    stream.setKeepAlive = noop;
    stream.setNoDelay = noop;
    stream.setTimeout = noop;
    stream.ref = noop;
    stream.unref = noop;
    stream.destroySoon = stream.destroy;
    return stream;
  }

  // HTTPS
  options.socket = stream;
  const wrapped = tlsConnect(options);

  // This is a workaround for a regression in node v12.16.3+
  // https://github.com/nodejs/node/issues/35904
  const onClose = (() => {
    let called = false;
    return () => {
      if (called)
        return;
      called = true;
      if (stream.isPaused())
        stream.resume();
    };
  })();
  // 'end' listener is needed because 'close' is not emitted in some scenarios
  // in node v12.x for some unknown reason
  wrapped.on('end', onClose).on('close', onClose);

  return wrapped;
}


/***/ }),

/***/ 5869:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  AgentProtocol,
  BaseAgent,
  createAgent,
  CygwinAgent,
  OpenSSHAgent,
  PageantAgent,
} = __nccwpck_require__(9054);
const {
  SSHTTPAgent: HTTPAgent,
  SSHTTPSAgent: HTTPSAgent,
} = __nccwpck_require__(2994);
const { parseKey } = __nccwpck_require__(2218);
const {
  flagsToString,
  OPEN_MODE,
  STATUS_CODE,
  stringToFlags,
} = __nccwpck_require__(2026);

module.exports = {
  AgentProtocol,
  BaseAgent,
  createAgent,
  Client: __nccwpck_require__(6063),
  CygwinAgent,
  HTTPAgent,
  HTTPSAgent,
  OpenSSHAgent,
  PageantAgent,
  Server: __nccwpck_require__(2986),
  utils: {
    parseKey,
    sftp: {
      flagsToString,
      OPEN_MODE,
      STATUS_CODE,
      stringToFlags,
    },
  },
};


/***/ }),

/***/ 9031:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
  TODO:
    * Replace `buffer._pos` usage in keyParser.js and elsewhere
    * Utilize optional "writev" support when writing packets from
      cipher.encrypt()
    * Built-in support for automatic re-keying, on by default
    * Revisit receiving unexpected/unknown packets
      * Error (fatal or otherwise) or ignore or pass on to user (in some or all
        cases)?
      * Including server/client check for single directional packet types?
      * Check packets for validity or bail as early as possible?
    * Automatic re-key every 2**31 packets after the last key exchange (sent or
      received), as suggested by RFC4344. OpenSSH currently does this.
    * Automatic re-key every so many blocks depending on cipher. RFC4344:
         Because of a birthday property of block ciphers and some modes of
         operation, implementations must be careful not to encrypt too many
         blocks with the same encryption key.

         Let L be the block length (in bits) of an SSH encryption method's
         block cipher (e.g., 128 for AES).  If L is at least 128, then, after
         rekeying, an SSH implementation SHOULD NOT encrypt more than 2**(L/4)
         blocks before rekeying again.  If L is at least 128, then SSH
         implementations should also attempt to force a rekey before receiving
         more than 2**(L/4) blocks.  If L is less than 128 (which is the case
         for older ciphers such as 3DES, Blowfish, CAST-128, and IDEA), then,
         although it may be too expensive to rekey every 2**(L/4) blocks, it
         is still advisable for SSH implementations to follow the original
         recommendation in [RFC4253]: rekey at least once for every gigabyte
         of transmitted data.

         Note that if L is less than or equal to 128, then the recommendation
         in this subsection supersedes the recommendation in Section 3.1.  If
         an SSH implementation uses a block cipher with a larger block size
         (e.g., Rijndael with 256-bit blocks), then the recommendations in
         Section 3.1 may supersede the recommendations in this subsection
         (depending on the lengths of the packets).
*/



const { inspect } = __nccwpck_require__(1669);

const { bindingAvailable, NullCipher, NullDecipher } = __nccwpck_require__(5708);
const {
  COMPAT_CHECKS,
  DISCONNECT_REASON,
  MESSAGE,
  SIGNALS,
  TERMINAL_MODE,
} = __nccwpck_require__(6832);
const {
  DEFAULT_KEXINIT,
  KexInit,
  kexinit,
  onKEXPayload,
} = __nccwpck_require__(4126);
const {
  parseKey,
} = __nccwpck_require__(2218);
const MESSAGE_HANDLERS = __nccwpck_require__(172);
const {
  bufferCopy,
  bufferFill,
  bufferSlice,
  convertSignature,
  sendPacket,
  writeUInt32BE,
} = __nccwpck_require__(9475);
const {
  PacketReader,
  PacketWriter,
  ZlibPacketReader,
  ZlibPacketWriter,
} = __nccwpck_require__(6715);

const MODULE_VER = __nccwpck_require__(6447)/* .version */ .i8;

const VALID_DISCONNECT_REASONS = new Map(
  Object.values(DISCONNECT_REASON).map((n) => [n, 1])
);
const IDENT_RAW = Buffer.from(`SSH-2.0-ssh2js${MODULE_VER}`);
const IDENT = Buffer.from(`${IDENT_RAW}\r\n`);
const MAX_LINE_LEN = 8192;
const MAX_LINES = 1024;
const PING_PAYLOAD = Buffer.from([
  MESSAGE.GLOBAL_REQUEST,
  // "keepalive@openssh.com"
  0, 0, 0, 21,
    107, 101, 101, 112, 97, 108, 105, 118, 101, 64, 111, 112, 101, 110, 115,
    115, 104, 46, 99, 111, 109,
  // Request a reply
  1,
]);
const NO_TERMINAL_MODES_BUFFER = Buffer.from([ TERMINAL_MODE.TTY_OP_END ]);

function noop() {}

/*
  Inbound:
    * kexinit payload (needed only until exchange hash is generated)
    * raw ident
    * rekey packet queue
    * expected packet (implemented as separate _parse() function?)
  Outbound:
    * kexinit payload (needed only until exchange hash is generated)
    * rekey packet queue
    * kex secret (needed only until NEWKEYS)
    * exchange hash (needed only until NEWKEYS)
    * session ID (set to exchange hash from initial handshake)
*/
class Protocol {
  constructor(config) {
    const onWrite = config.onWrite;
    if (typeof onWrite !== 'function')
      throw new Error('Missing onWrite function');
    this._onWrite = (data) => { onWrite(data); };

    const onError = config.onError;
    if (typeof onError !== 'function')
      throw new Error('Missing onError function');
    this._onError = (err) => { onError(err); };

    const debug = config.debug;
    this._debug = (typeof debug === 'function'
                   ? (msg) => { debug(msg); }
                   : undefined);

    const onHeader = config.onHeader;
    this._onHeader = (typeof onHeader === 'function'
                      ? (...args) => { onHeader(...args); }
                      : noop);

    const onPacket = config.onPacket;
    this._onPacket = (typeof onPacket === 'function'
                      ? () => { onPacket(); }
                      : noop);

    let onHandshakeComplete = config.onHandshakeComplete;
    if (typeof onHandshakeComplete !== 'function')
      onHandshakeComplete = noop;
    this._onHandshakeComplete = (...args) => {
      this._debug && this._debug('Handshake completed');

      // Process packets queued during a rekey where necessary
      const oldQueue = this._queue;
      if (oldQueue) {
        this._queue = undefined;
        this._debug && this._debug(
          `Draining outbound queue (${oldQueue.length}) ...`
        );
        for (let i = 0; i < oldQueue.length; ++i) {
          const data = oldQueue[i];
          // data === payload only

          // XXX: hacky
          let finalized = this._packetRW.write.finalize(data);
          if (finalized === data) {
            const packet = this._cipher.allocPacket(data.length);
            packet.set(data, 5);
            finalized = packet;
          }

          sendPacket(this, finalized);
        }
        this._debug && this._debug('... finished draining outbound queue');
      }

      onHandshakeComplete(...args);
    };
    this._queue = undefined;

    const messageHandlers = config.messageHandlers;
    if (typeof messageHandlers === 'object' && messageHandlers !== null)
      this._handlers = messageHandlers;
    else
      this._handlers = {};

    this._onPayload = onPayload.bind(this);

    this._server = !!config.server;
    this._banner = undefined;
    let greeting;
    if (this._server) {
      if (typeof config.hostKeys !== 'object' || config.hostKeys === null)
        throw new Error('Missing server host key(s)');
      this._hostKeys = config.hostKeys;

      // Greeting displayed before the ssh identification string is sent, this
      // is usually ignored by most clients
      if (typeof config.greeting === 'string' && config.greeting.length) {
        greeting = (config.greeting.slice(-2) === '\r\n'
                    ? config.greeting
                    : `${config.greeting}\r\n`);
      }

      // Banner shown after the handshake completes, but before user
      // authentication begins
      if (typeof config.banner === 'string' && config.banner.length) {
        this._banner = (config.banner.slice(-2) === '\r\n'
                        ? config.banner
                        : `${config.banner}\r\n`);
      }
    } else {
      this._hostKeys = undefined;
    }

    let offer = config.offer;
    if (typeof offer !== 'object' || offer === null)
      offer = DEFAULT_KEXINIT;
    else if (offer.constructor !== KexInit)
      offer = new KexInit(offer);
    this._kex = undefined;
    this._kexinit = undefined;
    this._offer = offer;
    this._cipher = new NullCipher(0, this._onWrite);
    this._decipher = undefined;
    this._skipNextInboundPacket = false;
    this._packetRW = {
      read: new PacketReader(),
      write: new PacketWriter(this),
    };
    this._hostVerifier = (!this._server
                           && typeof config.hostVerifier === 'function'
                          ? config.hostVerifier
                          : undefined);

    this._parse = parseHeader;
    this._buffer = undefined;
    this._authsQueue = [];
    this._authenticated = false;
    this._remoteIdentRaw = undefined;
    let sentIdent;
    if (typeof config.ident === 'string') {
      this._identRaw = Buffer.from(`SSH-2.0-${config.ident}`);

      sentIdent = Buffer.allocUnsafe(this._identRaw.length + 2);
      sentIdent.set(this._identRaw, 0);
      sentIdent[sentIdent.length - 2] = 13; // '\r'
      sentIdent[sentIdent.length - 1] = 10; // '\n'
    } else if (Buffer.isBuffer(config.ident)) {
      const fullIdent = Buffer.allocUnsafe(8 + config.ident.length);
      fullIdent.latin1Write('SSH-2.0-', 0, 8);
      fullIdent.set(config.ident, 8);
      this._identRaw = fullIdent;

      sentIdent = Buffer.allocUnsafe(fullIdent.length + 2);
      sentIdent.set(fullIdent, 0);
      sentIdent[sentIdent.length - 2] = 13; // '\r'
      sentIdent[sentIdent.length - 1] = 10; // '\n'
    } else {
      this._identRaw = IDENT_RAW;
      sentIdent = IDENT;
    }
    this._compatFlags = 0;

    if (this._debug) {
      if (bindingAvailable)
        this._debug('Custom crypto binding available');
      else
        this._debug('Custom crypto binding not available');
    }

    this._debug && this._debug(
      `Local ident: ${inspect(this._identRaw.toString())}`
    );
    this.start = () => {
      this.start = undefined;
      if (greeting)
        this._onWrite(greeting);
      this._onWrite(sentIdent);
    };
  }
  _destruct(reason) {
    this._packetRW.read.cleanup();
    this._packetRW.write.cleanup();
    this._cipher && this._cipher.free();
    this._decipher && this._decipher.free();
    if (typeof reason !== 'string' || reason.length === 0)
      reason = 'fatal error';
    this.parse = () => {
      throw new Error(`Instance unusable after ${reason}`);
    };
    this._onWrite = () => {
      throw new Error(`Instance unusable after ${reason}`);
    };
    this._destruct = undefined;
  }
  cleanup() {
    this._destruct && this._destruct();
  }
  parse(chunk, i, len) {
    while (i < len)
      i = this._parse(chunk, i, len);
  }

  // Protocol message API

  // ===========================================================================
  // Common/Shared =============================================================
  // ===========================================================================

  // Global
  // ------
  disconnect(reason) {
    const pktLen = 1 + 4 + 4 + 4;
    // We don't use _packetRW.write.* here because we need to make sure that
    // we always get a full packet allocated because this message can be sent
    // at any time -- even during a key exchange
    let p = this._packetRW.write.allocStartKEX;
    const packet = this._packetRW.write.alloc(pktLen, true);
    const end = p + pktLen;

    if (!VALID_DISCONNECT_REASONS.has(reason))
      reason = DISCONNECT_REASON.PROTOCOL_ERROR;

    packet[p] = MESSAGE.DISCONNECT;
    writeUInt32BE(packet, reason, ++p);
    packet.fill(0, p += 4, end);

    this._debug && this._debug(`Outbound: Sending DISCONNECT (${reason})`);
    sendPacket(this, this._packetRW.write.finalize(packet, true), true);
  }
  ping() {
    const p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(PING_PAYLOAD.length);

    packet.set(PING_PAYLOAD, p);

    this._debug && this._debug(
      'Outbound: Sending ping (GLOBAL_REQUEST: keepalive@openssh.com)'
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  rekey() {
    if (this._kexinit === undefined) {
      this._debug && this._debug('Outbound: Initiated explicit rekey');
      this._queue = [];
      kexinit(this);
    } else {
      this._debug && this._debug('Outbound: Ignoring rekey during handshake');
    }
  }

  // 'ssh-connection' service-specific
  // ---------------------------------
  requestSuccess(data) {
    let p = this._packetRW.write.allocStart;
    let packet;
    if (Buffer.isBuffer(data)) {
      packet = this._packetRW.write.alloc(1 + data.length);

      packet[p] = MESSAGE.REQUEST_SUCCESS;

      packet.set(data, ++p);
    } else {
      packet = this._packetRW.write.alloc(1);

      packet[p] = MESSAGE.REQUEST_SUCCESS;
    }

    this._debug && this._debug('Outbound: Sending REQUEST_SUCCESS');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  requestFailure() {
    const p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1);

    packet[p] = MESSAGE.REQUEST_FAILURE;

    this._debug && this._debug('Outbound: Sending REQUEST_FAILURE');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  channelSuccess(chan) {
    // Does not consume window space

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4);

    packet[p] = MESSAGE.CHANNEL_SUCCESS;

    writeUInt32BE(packet, chan, ++p);

    this._debug && this._debug(`Outbound: Sending CHANNEL_SUCCESS (r:${chan})`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  channelFailure(chan) {
    // Does not consume window space

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4);

    packet[p] = MESSAGE.CHANNEL_FAILURE;

    writeUInt32BE(packet, chan, ++p);

    this._debug && this._debug(`Outbound: Sending CHANNEL_FAILURE (r:${chan})`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  channelEOF(chan) {
    // Does not consume window space

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4);

    packet[p] = MESSAGE.CHANNEL_EOF;

    writeUInt32BE(packet, chan, ++p);

    this._debug && this._debug(`Outbound: Sending CHANNEL_EOF (r:${chan})`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  channelClose(chan) {
    // Does not consume window space

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4);

    packet[p] = MESSAGE.CHANNEL_CLOSE;

    writeUInt32BE(packet, chan, ++p);

    this._debug && this._debug(`Outbound: Sending CHANNEL_CLOSE (r:${chan})`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  channelWindowAdjust(chan, amount) {
    // Does not consume window space

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4);

    packet[p] = MESSAGE.CHANNEL_WINDOW_ADJUST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, amount, p += 4);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_WINDOW_ADJUST (r:${chan}, ${amount})`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  channelData(chan, data) {
    const isBuffer = Buffer.isBuffer(data);
    const dataLen = (isBuffer ? data.length : Buffer.byteLength(data));
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4 + dataLen);

    packet[p] = MESSAGE.CHANNEL_DATA;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, dataLen, p += 4);

    if (isBuffer)
      packet.set(data, p += 4);
    else
      packet.utf8Write(data, p += 4, dataLen);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_DATA (r:${chan}, ${dataLen})`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  channelExtData(chan, data, type) {
    const isBuffer = Buffer.isBuffer(data);
    const dataLen = (isBuffer ? data.length : Buffer.byteLength(data));
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4 + 4 + dataLen);

    packet[p] = MESSAGE.CHANNEL_EXTENDED_DATA;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, type, p += 4);

    writeUInt32BE(packet, dataLen, p += 4);

    if (isBuffer)
      packet.set(data, p += 4);
    else
      packet.utf8Write(data, p += 4, dataLen);

    this._debug
      && this._debug(`Outbound: Sending CHANNEL_EXTENDED_DATA (r:${chan})`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  channelOpenConfirm(remote, local, initWindow, maxPacket) {
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4 + 4 + 4);

    packet[p] = MESSAGE.CHANNEL_OPEN_CONFIRMATION;

    writeUInt32BE(packet, remote, ++p);

    writeUInt32BE(packet, local, p += 4);

    writeUInt32BE(packet, initWindow, p += 4);

    writeUInt32BE(packet, maxPacket, p += 4);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_OPEN_CONFIRMATION (r:${remote}, l:${local})`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  channelOpenFail(remote, reason, desc) {
    if (typeof desc !== 'string')
      desc = '';

    const descLen = Buffer.byteLength(desc);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4 + 4 + descLen + 4);

    packet[p] = MESSAGE.CHANNEL_OPEN_FAILURE;

    writeUInt32BE(packet, remote, ++p);

    writeUInt32BE(packet, reason, p += 4);

    writeUInt32BE(packet, descLen, p += 4);

    p += 4;
    if (descLen) {
      packet.utf8Write(desc, p, descLen);
      p += descLen;
    }

    writeUInt32BE(packet, 0, p); // Empty language tag

    this._debug
      && this._debug(`Outbound: Sending CHANNEL_OPEN_FAILURE (r:${remote})`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }

  // ===========================================================================
  // Client-specific ===========================================================
  // ===========================================================================

  // Global
  // ------
  service(name) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const nameLen = Buffer.byteLength(name);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + nameLen);

    packet[p] = MESSAGE.SERVICE_REQUEST;

    writeUInt32BE(packet, nameLen, ++p);
    packet.utf8Write(name, p += 4, nameLen);

    this._debug && this._debug(`Outbound: Sending SERVICE_REQUEST (${name})`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }

  // 'ssh-userauth' service-specific
  // -------------------------------
  authPassword(username, password, newPassword) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const userLen = Buffer.byteLength(username);
    const passLen = Buffer.byteLength(password);
    const newPassLen = (newPassword ? Buffer.byteLength(newPassword) : 0);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + userLen + 4 + 14 + 4 + 8 + 1 + 4 + passLen
        + (newPassword ? 4 + newPassLen : 0)
    );

    packet[p] = MESSAGE.USERAUTH_REQUEST;

    writeUInt32BE(packet, userLen, ++p);
    packet.utf8Write(username, p += 4, userLen);

    writeUInt32BE(packet, 14, p += userLen);
    packet.utf8Write('ssh-connection', p += 4, 14);

    writeUInt32BE(packet, 8, p += 14);
    packet.utf8Write('password', p += 4, 8);

    packet[p += 8] = (newPassword ? 1 : 0);

    writeUInt32BE(packet, passLen, ++p);
    if (Buffer.isBuffer(password))
      bufferCopy(password, packet, 0, passLen, p += 4);
    else
      packet.utf8Write(password, p += 4, passLen);

    if (newPassword) {
      writeUInt32BE(packet, newPassLen, p += passLen);
      if (Buffer.isBuffer(newPassword))
        bufferCopy(newPassword, packet, 0, newPassLen, p += 4);
      else
        packet.utf8Write(newPassword, p += 4, newPassLen);
      this._debug && this._debug(
        'Outbound: Sending USERAUTH_REQUEST (changed password)'
      );
    } else {
      this._debug && this._debug(
        'Outbound: Sending USERAUTH_REQUEST (password)'
      );
    }

    this._authsQueue.push('password');

    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  authPK(username, pubKey, cbSign) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    pubKey = parseKey(pubKey);
    if (pubKey instanceof Error)
      throw new Error('Invalid key');

    const keyType = pubKey.type;
    pubKey = pubKey.getPublicSSH();

    const userLen = Buffer.byteLength(username);
    const algoLen = Buffer.byteLength(keyType);
    const pubKeyLen = pubKey.length;
    const sessionID = this._kex.sessionID;
    const sesLen = sessionID.length;
    const payloadLen =
      (cbSign ? 4 + sesLen : 0)
        + 1 + 4 + userLen + 4 + 14 + 4 + 9 + 1 + 4 + algoLen + 4 + pubKeyLen;
    let packet;
    let p;
    if (cbSign) {
      packet = Buffer.allocUnsafe(payloadLen);
      p = 0;
      writeUInt32BE(packet, sesLen, p);
      packet.set(sessionID, p += 4);
      p += sesLen;
    } else {
      packet = this._packetRW.write.alloc(payloadLen);
      p = this._packetRW.write.allocStart;
    }

    packet[p] = MESSAGE.USERAUTH_REQUEST;

    writeUInt32BE(packet, userLen, ++p);
    packet.utf8Write(username, p += 4, userLen);

    writeUInt32BE(packet, 14, p += userLen);
    packet.utf8Write('ssh-connection', p += 4, 14);

    writeUInt32BE(packet, 9, p += 14);
    packet.utf8Write('publickey', p += 4, 9);

    packet[p += 9] = (cbSign ? 1 : 0);

    writeUInt32BE(packet, algoLen, ++p);
    packet.utf8Write(keyType, p += 4, algoLen);

    writeUInt32BE(packet, pubKeyLen, p += algoLen);
    packet.set(pubKey, p += 4);

    if (!cbSign) {
      this._authsQueue.push('publickey');

      this._debug && this._debug(
        'Outbound: Sending USERAUTH_REQUEST (publickey -- check)'
      );
      sendPacket(this, this._packetRW.write.finalize(packet));
      return;
    }

    cbSign(packet, (signature) => {
      signature = convertSignature(signature, keyType);
      if (signature === false)
        throw new Error('Error while converting handshake signature');

      const sigLen = signature.length;
      p = this._packetRW.write.allocStart;
      packet = this._packetRW.write.alloc(
        1 + 4 + userLen + 4 + 14 + 4 + 9 + 1 + 4 + algoLen + 4 + pubKeyLen + 4
          + 4 + algoLen + 4 + sigLen
      );

      // TODO: simply copy from original "packet" to new `packet` to avoid
      // having to write each individual field a second time?
      packet[p] = MESSAGE.USERAUTH_REQUEST;

      writeUInt32BE(packet, userLen, ++p);
      packet.utf8Write(username, p += 4, userLen);

      writeUInt32BE(packet, 14, p += userLen);
      packet.utf8Write('ssh-connection', p += 4, 14);

      writeUInt32BE(packet, 9, p += 14);
      packet.utf8Write('publickey', p += 4, 9);

      packet[p += 9] = 1;

      writeUInt32BE(packet, algoLen, ++p);
      packet.utf8Write(keyType, p += 4, algoLen);

      writeUInt32BE(packet, pubKeyLen, p += algoLen);
      packet.set(pubKey, p += 4);

      writeUInt32BE(packet, 4 + algoLen + 4 + sigLen, p += pubKeyLen);

      writeUInt32BE(packet, algoLen, p += 4);
      packet.utf8Write(keyType, p += 4, algoLen);

      writeUInt32BE(packet, sigLen, p += algoLen);
      packet.set(signature, p += 4);

      // Servers shouldn't send packet type 60 in response to signed publickey
      // attempts, but if they do, interpret as type 60.
      this._authsQueue.push('publickey');

      this._debug && this._debug(
        'Outbound: Sending USERAUTH_REQUEST (publickey)'
      );
      sendPacket(this, this._packetRW.write.finalize(packet));
    });
  }
  authHostbased(username, pubKey, hostname, userlocal, cbSign) {
    // TODO: Make DRY by sharing similar code with authPK()
    if (this._server)
      throw new Error('Client-only method called in server mode');

    pubKey = parseKey(pubKey);
    if (pubKey instanceof Error)
      throw new Error('Invalid key');

    const keyType = pubKey.type;
    pubKey = pubKey.getPublicSSH();

    const userLen = Buffer.byteLength(username);
    const algoLen = Buffer.byteLength(keyType);
    const pubKeyLen = pubKey.length;
    const sessionID = this._kex.sessionID;
    const sesLen = sessionID.length;
    const hostnameLen = Buffer.byteLength(hostname);
    const userlocalLen = Buffer.byteLength(userlocal);
    const data = Buffer.allocUnsafe(
      4 + sesLen + 1 + 4 + userLen + 4 + 14 + 4 + 9 + 4 + algoLen
        + 4 + pubKeyLen + 4 + hostnameLen + 4 + userlocalLen
    );
    let p = 0;

    writeUInt32BE(data, sesLen, p);
    data.set(sessionID, p += 4);

    data[p += sesLen] = MESSAGE.USERAUTH_REQUEST;

    writeUInt32BE(data, userLen, ++p);
    data.utf8Write(username, p += 4, userLen);

    writeUInt32BE(data, 14, p += userLen);
    data.utf8Write('ssh-connection', p += 4, 14);

    writeUInt32BE(data, 9, p += 14);
    data.utf8Write('hostbased', p += 4, 9);

    writeUInt32BE(data, algoLen, p += 9);
    data.utf8Write(keyType, p += 4, algoLen);

    writeUInt32BE(data, pubKeyLen, p += algoLen);
    data.set(pubKey, p += 4);

    writeUInt32BE(data, hostnameLen, p += pubKeyLen);
    data.utf8Write(hostname, p += 4, hostnameLen);

    writeUInt32BE(data, userlocalLen, p += hostnameLen);
    data.utf8Write(userlocal, p += 4, userlocalLen);

    cbSign(data, (signature) => {
      signature = convertSignature(signature, keyType);
      if (!signature)
        throw new Error('Error while converting handshake signature');

      const sigLen = signature.length;
      const reqDataLen = (data.length - sesLen - 4);
      p = this._packetRW.write.allocStart;
      const packet = this._packetRW.write.alloc(
        reqDataLen + 4 + 4 + algoLen + 4 + sigLen
      );

      bufferCopy(data, packet, 4 + sesLen, data.length, p);

      writeUInt32BE(packet, 4 + algoLen + 4 + sigLen, p += reqDataLen);
      writeUInt32BE(packet, algoLen, p += 4);
      packet.utf8Write(keyType, p += 4, algoLen);
      writeUInt32BE(packet, sigLen, p += algoLen);
      packet.set(signature, p += 4);

      this._authsQueue.push('hostbased');

      this._debug && this._debug(
        'Outbound: Sending USERAUTH_REQUEST (hostbased)'
      );
      sendPacket(this, this._packetRW.write.finalize(packet));
    });
  }
  authKeyboard(username) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const userLen = Buffer.byteLength(username);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + userLen + 4 + 14 + 4 + 20 + 4 + 4
    );

    packet[p] = MESSAGE.USERAUTH_REQUEST;

    writeUInt32BE(packet, userLen, ++p);
    packet.utf8Write(username, p += 4, userLen);

    writeUInt32BE(packet, 14, p += userLen);
    packet.utf8Write('ssh-connection', p += 4, 14);

    writeUInt32BE(packet, 20, p += 14);
    packet.utf8Write('keyboard-interactive', p += 4, 20);

    writeUInt32BE(packet, 0, p += 20);

    writeUInt32BE(packet, 0, p += 4);

    this._authsQueue.push('keyboard-interactive');

    this._debug && this._debug(
      'Outbound: Sending USERAUTH_REQUEST (keyboard-interactive)'
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  authNone(username) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const userLen = Buffer.byteLength(username);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + userLen + 4 + 14 + 4 + 4);

    packet[p] = MESSAGE.USERAUTH_REQUEST;

    writeUInt32BE(packet, userLen, ++p);
    packet.utf8Write(username, p += 4, userLen);

    writeUInt32BE(packet, 14, p += userLen);
    packet.utf8Write('ssh-connection', p += 4, 14);

    writeUInt32BE(packet, 4, p += 14);
    packet.utf8Write('none', p += 4, 4);

    this._authsQueue.push('none');

    this._debug && this._debug('Outbound: Sending USERAUTH_REQUEST (none)');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  authInfoRes(responses) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    let responsesTotalLen = 0;
    let responseLens;

    if (responses) {
      responseLens = new Array(responses.length);
      for (let i = 0; i < responses.length; ++i) {
        const len = Buffer.byteLength(responses[i]);
        responseLens[i] = len;
        responsesTotalLen += 4 + len;
      }
    }

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + responsesTotalLen);

    packet[p] = MESSAGE.USERAUTH_INFO_RESPONSE;

    if (responses) {
      writeUInt32BE(packet, responses.length, ++p);
      p += 4;
      for (let i = 0; i < responses.length; ++i) {
        const len = responseLens[i];
        writeUInt32BE(packet, len, p);
        p += 4;
        if (len) {
          packet.utf8Write(responses[i], p, len);
          p += len;
        }
      }
    } else {
      writeUInt32BE(packet, 0, ++p);
    }

    this._debug && this._debug('Outbound: Sending USERAUTH_INFO_RESPONSE');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }

  // 'ssh-connection' service-specific
  // ---------------------------------
  tcpipForward(bindAddr, bindPort, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const addrLen = Buffer.byteLength(bindAddr);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 13 + 1 + 4 + addrLen + 4);

    packet[p] = MESSAGE.GLOBAL_REQUEST;

    writeUInt32BE(packet, 13, ++p);
    packet.utf8Write('tcpip-forward', p += 4, 13);

    packet[p += 13] = (wantReply === undefined || wantReply === true ? 1 : 0);

    writeUInt32BE(packet, addrLen, ++p);
    packet.utf8Write(bindAddr, p += 4, addrLen);

    writeUInt32BE(packet, bindPort, p += addrLen);

    this._debug
      && this._debug('Outbound: Sending GLOBAL_REQUEST (tcpip-forward)');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  cancelTcpipForward(bindAddr, bindPort, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const addrLen = Buffer.byteLength(bindAddr);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 20 + 1 + 4 + addrLen + 4);

    packet[p] = MESSAGE.GLOBAL_REQUEST;

    writeUInt32BE(packet, 20, ++p);
    packet.utf8Write('cancel-tcpip-forward', p += 4, 20);

    packet[p += 20] = (wantReply === undefined || wantReply === true ? 1 : 0);

    writeUInt32BE(packet, addrLen, ++p);
    packet.utf8Write(bindAddr, p += 4, addrLen);

    writeUInt32BE(packet, bindPort, p += addrLen);

    this._debug
      && this._debug('Outbound: Sending GLOBAL_REQUEST (cancel-tcpip-forward)');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  openssh_streamLocalForward(socketPath, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const socketPathLen = Buffer.byteLength(socketPath);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 31 + 1 + 4 + socketPathLen
    );

    packet[p] = MESSAGE.GLOBAL_REQUEST;

    writeUInt32BE(packet, 31, ++p);
    packet.utf8Write('streamlocal-forward@openssh.com', p += 4, 31);

    packet[p += 31] = (wantReply === undefined || wantReply === true ? 1 : 0);

    writeUInt32BE(packet, socketPathLen, ++p);
    packet.utf8Write(socketPath, p += 4, socketPathLen);

    this._debug && this._debug(
      'Outbound: Sending GLOBAL_REQUEST (streamlocal-forward@openssh.com)'
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  openssh_cancelStreamLocalForward(socketPath, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const socketPathLen = Buffer.byteLength(socketPath);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 38 + 1 + 4 + socketPathLen
    );

    packet[p] = MESSAGE.GLOBAL_REQUEST;

    writeUInt32BE(packet, 38, ++p);
    packet.utf8Write('cancel-streamlocal-forward@openssh.com', p += 4, 38);

    packet[p += 38] = (wantReply === undefined || wantReply === true ? 1 : 0);

    writeUInt32BE(packet, socketPathLen, ++p);
    packet.utf8Write(socketPath, p += 4, socketPathLen);

    if (this._debug) {
      this._debug(
        'Outbound: Sending GLOBAL_REQUEST '
          + '(cancel-streamlocal-forward@openssh.com)'
      );
    }
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  directTcpip(chan, initWindow, maxPacket, cfg) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const srcLen = Buffer.byteLength(cfg.srcIP);
    const dstLen = Buffer.byteLength(cfg.dstIP);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 12 + 4 + 4 + 4 + 4 + srcLen + 4 + 4 + dstLen + 4
    );

    packet[p] = MESSAGE.CHANNEL_OPEN;

    writeUInt32BE(packet, 12, ++p);
    packet.utf8Write('direct-tcpip', p += 4, 12);

    writeUInt32BE(packet, chan, p += 12);

    writeUInt32BE(packet, initWindow, p += 4);

    writeUInt32BE(packet, maxPacket, p += 4);

    writeUInt32BE(packet, dstLen, p += 4);
    packet.utf8Write(cfg.dstIP, p += 4, dstLen);

    writeUInt32BE(packet, cfg.dstPort, p += dstLen);

    writeUInt32BE(packet, srcLen, p += 4);
    packet.utf8Write(cfg.srcIP, p += 4, srcLen);

    writeUInt32BE(packet, cfg.srcPort, p += srcLen);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_OPEN (r:${chan}, direct-tcpip)`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  openssh_directStreamLocal(chan, initWindow, maxPacket, cfg) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    const pathLen = Buffer.byteLength(cfg.socketPath);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 30 + 4 + 4 + 4 + 4 + pathLen + 4 + 4
    );

    packet[p] = MESSAGE.CHANNEL_OPEN;

    writeUInt32BE(packet, 30, ++p);
    packet.utf8Write('direct-streamlocal@openssh.com', p += 4, 30);

    writeUInt32BE(packet, chan, p += 30);

    writeUInt32BE(packet, initWindow, p += 4);

    writeUInt32BE(packet, maxPacket, p += 4);

    writeUInt32BE(packet, pathLen, p += 4);
    packet.utf8Write(cfg.socketPath, p += 4, pathLen);

    // zero-fill reserved fields (string and uint32)
    bufferFill(packet, 0, p += pathLen, p + 8);

    if (this._debug) {
      this._debug(
        'Outbound: Sending CHANNEL_OPEN '
          + `(r:${chan}, direct-streamlocal@openssh.com)`
      );
    }
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  openssh_noMoreSessions(wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 28 + 1);

    packet[p] = MESSAGE.GLOBAL_REQUEST;

    writeUInt32BE(packet, 28, ++p);
    packet.utf8Write('no-more-sessions@openssh.com', p += 4, 28);

    packet[p += 28] = (wantReply === undefined || wantReply === true ? 1 : 0);

    this._debug && this._debug(
      'Outbound: Sending GLOBAL_REQUEST (no-more-sessions@openssh.com)'
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  session(chan, initWindow, maxPacket) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 7 + 4 + 4 + 4);

    packet[p] = MESSAGE.CHANNEL_OPEN;

    writeUInt32BE(packet, 7, ++p);
    packet.utf8Write('session', p += 4, 7);

    writeUInt32BE(packet, chan, p += 7);

    writeUInt32BE(packet, initWindow, p += 4);

    writeUInt32BE(packet, maxPacket, p += 4);

    this._debug
      && this._debug(`Outbound: Sending CHANNEL_OPEN (r:${chan}, session)`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  windowChange(chan, rows, cols, height, width) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 4 + 13 + 1 + 4 + 4 + 4 + 4
    );

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 13, p += 4);
    packet.utf8Write('window-change', p += 4, 13);

    packet[p += 13] = 0;

    writeUInt32BE(packet, cols, ++p);

    writeUInt32BE(packet, rows, p += 4);

    writeUInt32BE(packet, width, p += 4);

    writeUInt32BE(packet, height, p += 4);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_REQUEST (r:${chan}, window-change)`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  pty(chan, rows, cols, height, width, term, modes, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space

    if (!term || !term.length)
      term = 'vt100';
    if (modes
        && !Buffer.isBuffer(modes)
        && !Array.isArray(modes)
        && typeof modes === 'object'
        && modes !== null) {
      modes = modesToBytes(modes);
    }
    if (!modes || !modes.length)
      modes = NO_TERMINAL_MODES_BUFFER;

    const termLen = term.length;
    const modesLen = modes.length;
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 4 + 7 + 1 + 4 + termLen + 4 + 4 + 4 + 4 + 4 + modesLen
    );

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 7, p += 4);
    packet.utf8Write('pty-req', p += 4, 7);

    packet[p += 7] = (wantReply === undefined || wantReply === true ? 1 : 0);

    writeUInt32BE(packet, termLen, ++p);
    packet.utf8Write(term, p += 4, termLen);

    writeUInt32BE(packet, cols, p += termLen);

    writeUInt32BE(packet, rows, p += 4);

    writeUInt32BE(packet, width, p += 4);

    writeUInt32BE(packet, height, p += 4);

    writeUInt32BE(packet, modesLen, p += 4);
    p += 4;
    if (Array.isArray(modes)) {
      for (let i = 0; i < modesLen; ++i)
        packet[p++] = modes[i];
    } else if (Buffer.isBuffer(modes)) {
      packet.set(modes, p);
    }

    this._debug
      && this._debug(`Outbound: Sending CHANNEL_REQUEST (r:${chan}, pty-req)`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  shell(chan, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4 + 5 + 1);

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 5, p += 4);
    packet.utf8Write('shell', p += 4, 5);

    packet[p += 5] = (wantReply === undefined || wantReply === true ? 1 : 0);

    this._debug
      && this._debug(`Outbound: Sending CHANNEL_REQUEST (r:${chan}, shell)`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  exec(chan, cmd, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space

    const isBuf = Buffer.isBuffer(cmd);
    const cmdLen = (isBuf ? cmd.length : Buffer.byteLength(cmd));
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4 + 4 + 1 + 4 + cmdLen);

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 4, p += 4);
    packet.utf8Write('exec', p += 4, 4);

    packet[p += 4] = (wantReply === undefined || wantReply === true ? 1 : 0);

    writeUInt32BE(packet, cmdLen, ++p);
    if (isBuf)
      packet.set(cmd, p += 4);
    else
      packet.utf8Write(cmd, p += 4, cmdLen);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_REQUEST (r:${chan}, exec: ${cmd})`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  signal(chan, signal) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space

    const origSignal = signal;

    signal = signal.toUpperCase();
    if (signal.slice(0, 3) === 'SIG')
      signal = signal.slice(3);

    if (SIGNALS[signal] !== 1)
      throw new Error(`Invalid signal: ${origSignal}`);

    const signalLen = signal.length;
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 4 + 6 + 1 + 4 + signalLen
    );

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 6, p += 4);
    packet.utf8Write('signal', p += 4, 6);

    packet[p += 6] = 0;

    writeUInt32BE(packet, signalLen, ++p);
    packet.utf8Write(signal, p += 4, signalLen);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_REQUEST (r:${chan}, signal: ${signal})`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  env(chan, key, val, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space

    const keyLen = Buffer.byteLength(key);
    const isBuf = Buffer.isBuffer(val);
    const valLen = (isBuf ? val.length : Buffer.byteLength(val));
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 4 + 3 + 1 + 4 + keyLen + 4 + valLen
    );

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 3, p += 4);
    packet.utf8Write('env', p += 4, 3);

    packet[p += 3] = (wantReply === undefined || wantReply === true ? 1 : 0);

    writeUInt32BE(packet, keyLen, ++p);
    packet.utf8Write(key, p += 4, keyLen);

    writeUInt32BE(packet, valLen, p += keyLen);
    if (isBuf)
      packet.set(val, p += 4);
    else
      packet.utf8Write(val, p += 4, valLen);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_REQUEST (r:${chan}, env: ${key}=${val})`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  x11Forward(chan, cfg, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space

    const protocol = cfg.protocol;
    const cookie = cfg.cookie;
    const isBufProto = Buffer.isBuffer(protocol);
    const protoLen = (isBufProto
                      ? protocol.length
                      : Buffer.byteLength(protocol));
    const isBufCookie = Buffer.isBuffer(cookie);
    const cookieLen = (isBufCookie
                       ? cookie.length
                       : Buffer.byteLength(cookie));
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 4 + 7 + 1 + 1 + 4 + protoLen + 4 + cookieLen + 4
    );

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 7, p += 4);
    packet.utf8Write('x11-req', p += 4, 7);

    packet[p += 7] = (wantReply === undefined || wantReply === true ? 1 : 0);

    packet[++p] = (cfg.single ? 1 : 0);

    writeUInt32BE(packet, protoLen, ++p);
    if (isBufProto)
      packet.set(protocol, p += 4);
    else
      packet.utf8Write(protocol, p += 4, protoLen);

    writeUInt32BE(packet, cookieLen, p += protoLen);
    if (isBufCookie)
      packet.set(cookie, p += 4);
    else
      packet.latin1Write(cookie, p += 4, cookieLen);

    writeUInt32BE(packet, (cfg.screen || 0), p += cookieLen);

    this._debug
      && this._debug(`Outbound: Sending CHANNEL_REQUEST (r:${chan}, x11-req)`);
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  subsystem(chan, name, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space
    const nameLen = Buffer.byteLength(name);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4 + 9 + 1 + 4 + nameLen);

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 9, p += 4);
    packet.utf8Write('subsystem', p += 4, 9);

    packet[p += 9] = (wantReply === undefined || wantReply === true ? 1 : 0);

    writeUInt32BE(packet, nameLen, ++p);
    packet.utf8Write(name, p += 4, nameLen);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_REQUEST (r:${chan}, subsystem: ${name})`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  openssh_agentForward(chan, wantReply) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    // Does not consume window space

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4 + 26 + 1);

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 26, p += 4);
    packet.utf8Write('auth-agent-req@openssh.com', p += 4, 26);

    packet[p += 26] = (wantReply === undefined || wantReply === true ? 1 : 0);

    if (this._debug) {
      this._debug(
        'Outbound: Sending CHANNEL_REQUEST '
          + `(r:${chan}, auth-agent-req@openssh.com)`
      );
    }
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  openssh_hostKeysProve(keys) {
    if (this._server)
      throw new Error('Client-only method called in server mode');

    let keysTotal = 0;
    const publicKeys = [];
    for (const key of keys) {
      const publicKey = key.getPublicSSH();
      keysTotal += 4 + publicKey.length;
      publicKeys.push(publicKey);
    }

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 29 + 1 + keysTotal);

    packet[p] = MESSAGE.GLOBAL_REQUEST;

    writeUInt32BE(packet, 29, ++p);
    packet.utf8Write('hostkeys-prove-00@openssh.com', p += 4, 29);

    packet[p += 29] = 1; // want reply

    ++p;
    for (const buf of publicKeys) {
      writeUInt32BE(packet, buf.length, p);
      bufferCopy(buf, packet, 0, buf.length, p += 4);
      p += buf.length;
    }

    if (this._debug) {
      this._debug(
        'Outbound: Sending GLOBAL_REQUEST (hostkeys-prove-00@openssh.com)'
      );
    }
    sendPacket(this, this._packetRW.write.finalize(packet));
  }

  // ===========================================================================
  // Server-specific ===========================================================
  // ===========================================================================

  // Global
  // ------
  serviceAccept(svcName) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    const svcNameLen = Buffer.byteLength(svcName);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + svcNameLen);

    packet[p] = MESSAGE.SERVICE_ACCEPT;

    writeUInt32BE(packet, svcNameLen, ++p);
    packet.utf8Write(svcName, p += 4, svcNameLen);

    this._debug && this._debug(`Outbound: Sending SERVICE_ACCEPT (${svcName})`);
    sendPacket(this, this._packetRW.write.finalize(packet));

    if (this._server && this._banner && svcName === 'ssh-userauth') {
      const banner = this._banner;
      this._banner = undefined; // Prevent banner from being displayed again
      const bannerLen = Buffer.byteLength(banner);
      p = this._packetRW.write.allocStart;
      const packet = this._packetRW.write.alloc(1 + 4 + bannerLen + 4);

      packet[p] = MESSAGE.USERAUTH_BANNER;

      writeUInt32BE(packet, bannerLen, ++p);
      packet.utf8Write(banner, p += 4, bannerLen);

      writeUInt32BE(packet, 0, p += bannerLen); // Empty language tag

      this._debug && this._debug('Outbound: Sending USERAUTH_BANNER');
      sendPacket(this, this._packetRW.write.finalize(packet));
    }
  }
  // 'ssh-connection' service-specific
  forwardedTcpip(chan, initWindow, maxPacket, cfg) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    const boundAddrLen = Buffer.byteLength(cfg.boundAddr);
    const remoteAddrLen = Buffer.byteLength(cfg.remoteAddr);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 15 + 4 + 4 + 4 + 4 + boundAddrLen + 4 + 4 + remoteAddrLen + 4
    );

    packet[p] = MESSAGE.CHANNEL_OPEN;

    writeUInt32BE(packet, 15, ++p);
    packet.utf8Write('forwarded-tcpip', p += 4, 15);

    writeUInt32BE(packet, chan, p += 15);

    writeUInt32BE(packet, initWindow, p += 4);

    writeUInt32BE(packet, maxPacket, p += 4);

    writeUInt32BE(packet, boundAddrLen, p += 4);
    packet.utf8Write(cfg.boundAddr, p += 4, boundAddrLen);

    writeUInt32BE(packet, cfg.boundPort, p += boundAddrLen);

    writeUInt32BE(packet, remoteAddrLen, p += 4);
    packet.utf8Write(cfg.remoteAddr, p += 4, remoteAddrLen);

    writeUInt32BE(packet, cfg.remotePort, p += remoteAddrLen);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_OPEN (r:${chan}, forwarded-tcpip)`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  x11(chan, initWindow, maxPacket, cfg) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    const addrLen = Buffer.byteLength(cfg.originAddr);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 3 + 4 + 4 + 4 + 4 + addrLen + 4
    );

    packet[p] = MESSAGE.CHANNEL_OPEN;

    writeUInt32BE(packet, 3, ++p);
    packet.utf8Write('x11', p += 4, 3);

    writeUInt32BE(packet, chan, p += 3);

    writeUInt32BE(packet, initWindow, p += 4);

    writeUInt32BE(packet, maxPacket, p += 4);

    writeUInt32BE(packet, addrLen, p += 4);
    packet.utf8Write(cfg.originAddr, p += 4, addrLen);

    writeUInt32BE(packet, cfg.originPort, p += addrLen);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_OPEN (r:${chan}, x11)`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  openssh_authAgent(chan, initWindow, maxPacket) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 22 + 4 + 4 + 4);

    packet[p] = MESSAGE.CHANNEL_OPEN;

    writeUInt32BE(packet, 22, ++p);
    packet.utf8Write('auth-agent@openssh.com', p += 4, 22);

    writeUInt32BE(packet, chan, p += 22);

    writeUInt32BE(packet, initWindow, p += 4);

    writeUInt32BE(packet, maxPacket, p += 4);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_OPEN (r:${chan}, auth-agent@openssh.com)`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  openssh_forwardedStreamLocal(chan, initWindow, maxPacket, cfg) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    const pathLen = Buffer.byteLength(cfg.socketPath);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 33 + 4 + 4 + 4 + 4 + pathLen + 4
    );

    packet[p] = MESSAGE.CHANNEL_OPEN;

    writeUInt32BE(packet, 33, ++p);
    packet.utf8Write('forwarded-streamlocal@openssh.com', p += 4, 33);

    writeUInt32BE(packet, chan, p += 33);

    writeUInt32BE(packet, initWindow, p += 4);

    writeUInt32BE(packet, maxPacket, p += 4);

    writeUInt32BE(packet, pathLen, p += 4);
    packet.utf8Write(cfg.socketPath, p += 4, pathLen);

    writeUInt32BE(packet, 0, p += pathLen);

    if (this._debug) {
      this._debug(
        'Outbound: Sending CHANNEL_OPEN '
          + `(r:${chan}, forwarded-streamlocal@openssh.com)`
      );
    }
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  exitStatus(chan, status) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    // Does not consume window space
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + 4 + 11 + 1 + 4);

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 11, p += 4);
    packet.utf8Write('exit-status', p += 4, 11);

    packet[p += 11] = 0;

    writeUInt32BE(packet, status, ++p);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_REQUEST (r:${chan}, exit-status: ${status})`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  exitSignal(chan, name, coreDumped, msg) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    // Does not consume window space

    const origSignal = name;

    if (typeof origSignal !== 'string' || !origSignal)
      throw new Error(`Invalid signal: ${origSignal}`);

    let signal = name.toUpperCase();
    if (signal.slice(0, 3) === 'SIG')
      signal = signal.slice(3);

    if (SIGNALS[signal] !== 1)
      throw new Error(`Invalid signal: ${origSignal}`);

    const nameLen = Buffer.byteLength(signal);
    const msgLen = (msg ? Buffer.byteLength(msg) : 0);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + 4 + 11 + 1 + 4 + nameLen + 1 + 4 + msgLen + 4
    );

    packet[p] = MESSAGE.CHANNEL_REQUEST;

    writeUInt32BE(packet, chan, ++p);

    writeUInt32BE(packet, 11, p += 4);
    packet.utf8Write('exit-signal', p += 4, 11);

    packet[p += 11] = 0;

    writeUInt32BE(packet, nameLen, ++p);
    packet.utf8Write(signal, p += 4, nameLen);

    packet[p += nameLen] = (coreDumped ? 1 : 0);

    writeUInt32BE(packet, msgLen, ++p);

    p += 4;
    if (msgLen) {
      packet.utf8Write(msg, p, msgLen);
      p += msgLen;
    }

    writeUInt32BE(packet, 0, p);

    this._debug && this._debug(
      `Outbound: Sending CHANNEL_REQUEST (r:${chan}, exit-signal: ${name})`
    );
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  // 'ssh-userauth' service-specific
  authFailure(authMethods, isPartial) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    if (this._authsQueue.length === 0)
      throw new Error('No auth in progress');

    let methods;

    if (typeof authMethods === 'boolean') {
      isPartial = authMethods;
      authMethods = undefined;
    }

    if (authMethods) {
      methods = [];
      for (let i = 0; i < authMethods.length; ++i) {
        if (authMethods[i].toLowerCase() === 'none')
          continue;
        methods.push(authMethods[i]);
      }
      methods = methods.join(',');
    } else {
      methods = '';
    }

    const methodsLen = methods.length;
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + methodsLen + 1);

    packet[p] = MESSAGE.USERAUTH_FAILURE;

    writeUInt32BE(packet, methodsLen, ++p);
    packet.utf8Write(methods, p += 4, methodsLen);

    packet[p += methodsLen] = (isPartial === true ? 1 : 0);

    this._authsQueue.shift();

    this._debug && this._debug('Outbound: Sending USERAUTH_FAILURE');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  authSuccess() {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    if (this._authsQueue.length === 0)
      throw new Error('No auth in progress');

    const p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1);

    packet[p] = MESSAGE.USERAUTH_SUCCESS;

    this._authsQueue.shift();
    this._authenticated = true;

    this._debug && this._debug('Outbound: Sending USERAUTH_SUCCESS');
    sendPacket(this, this._packetRW.write.finalize(packet));

    if (this._kex.negotiated.cs.compress === 'zlib@openssh.com')
      this._packetRW.read = new ZlibPacketReader();
    if (this._kex.negotiated.sc.compress === 'zlib@openssh.com')
      this._packetRW.write = new ZlibPacketWriter(this);
  }
  authPKOK(keyAlgo, key) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    if (this._authsQueue.length === 0 || this._authsQueue[0] !== 'publickey')
      throw new Error('"publickey" auth not in progress');

    // TODO: support parsed key for `key`

    const keyAlgoLen = Buffer.byteLength(keyAlgo);
    const keyLen = key.length;
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + keyAlgoLen + 4 + keyLen);

    packet[p] = MESSAGE.USERAUTH_PK_OK;

    writeUInt32BE(packet, keyAlgoLen, ++p);
    packet.utf8Write(keyAlgo, p += 4, keyAlgoLen);

    writeUInt32BE(packet, keyLen, p += keyAlgoLen);
    packet.set(key, p += 4);

    this._authsQueue.shift();

    this._debug && this._debug('Outbound: Sending USERAUTH_PK_OK');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  authPasswdChg(prompt) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    const promptLen = Buffer.byteLength(prompt);
    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(1 + 4 + promptLen + 4);

    packet[p] = MESSAGE.USERAUTH_PASSWD_CHANGEREQ;

    writeUInt32BE(packet, promptLen, ++p);
    packet.utf8Write(prompt, p += 4, promptLen);

    writeUInt32BE(packet, 0, p += promptLen); // Empty language tag

    this._debug && this._debug('Outbound: Sending USERAUTH_PASSWD_CHANGEREQ');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
  authInfoReq(name, instructions, prompts) {
    if (!this._server)
      throw new Error('Server-only method called in client mode');

    let promptsLen = 0;
    const nameLen = name ? Buffer.byteLength(name) : 0;
    const instrLen = instructions ? Buffer.byteLength(instructions) : 0;

    for (let i = 0; i < prompts.length; ++i)
      promptsLen += 4 + Buffer.byteLength(prompts[i].prompt) + 1;

    let p = this._packetRW.write.allocStart;
    const packet = this._packetRW.write.alloc(
      1 + 4 + nameLen + 4 + instrLen + 4 + 4 + promptsLen
    );

    packet[p] = MESSAGE.USERAUTH_INFO_REQUEST;

    writeUInt32BE(packet, nameLen, ++p);
    p += 4;
    if (name) {
      packet.utf8Write(name, p, nameLen);
      p += nameLen;
    }

    writeUInt32BE(packet, instrLen, p);
    p += 4;
    if (instructions) {
      packet.utf8Write(instructions, p, instrLen);
      p += instrLen;
    }

    writeUInt32BE(packet, 0, p);

    writeUInt32BE(packet, prompts.length, p += 4);
    p += 4;
    for (let i = 0; i < prompts.length; ++i) {
      const prompt = prompts[i];
      const promptLen = Buffer.byteLength(prompt.prompt);

      writeUInt32BE(packet, promptLen, p);
      p += 4;
      if (promptLen) {
        packet.utf8Write(prompt.prompt, p, promptLen);
        p += promptLen;
      }
      packet[p++] = (prompt.echo ? 1 : 0);
    }

    this._debug && this._debug('Outbound: Sending USERAUTH_INFO_REQUEST');
    sendPacket(this, this._packetRW.write.finalize(packet));
  }
}

// SSH-protoversion-softwareversion (SP comments) CR LF
const RE_IDENT = /^SSH-(2\.0|1\.99)-([^ ]+)(?: (.*))?$/;

// TODO: optimize this by starting n bytes from the end of this._buffer instead
// of the beginning
function parseHeader(chunk, p, len) {
  let data;
  let chunkOffset;
  if (this._buffer) {
    data = Buffer.allocUnsafe(this._buffer.length + (len - p));
    data.set(this._buffer, 0);
    if (p === 0) {
      data.set(chunk, this._buffer.length);
    } else {
      data.set(new Uint8Array(chunk.buffer,
                              chunk.byteOffset + p,
                              (len - p)),
               this._buffer.length);
    }
    chunkOffset = this._buffer.length;
    p = 0;
  } else {
    data = chunk;
    chunkOffset = 0;
  }
  const op = p;
  let start = p;
  let end = p;
  let needNL = false;
  let lineLen = 0;
  let lines = 0;
  for (; p < data.length; ++p) {
    const ch = data[p];

    if (ch === 13 /* '\r' */) {
      needNL = true;
      continue;
    }

    if (ch === 10 /* '\n' */) {
      if (end > start
          && end - start > 4
          && data[start] === 83 /* 'S' */
          && data[start + 1] === 83 /* 'S' */
          && data[start + 2] === 72 /* 'H' */
          && data[start + 3] === 45 /* '-' */) {

        const full = data.latin1Slice(op, end + 1);
        const identRaw = (start === op ? full : full.slice(start - op));
        const m = RE_IDENT.exec(identRaw);
        if (!m)
          throw new Error('Invalid identification string');

        const header = {
          greeting: (start === op ? '' : full.slice(0, start - op)),
          identRaw,
          versions: {
            protocol: m[1],
            software: m[2],
          },
          comments: m[3]
        };

        // Needed during handshake
        this._remoteIdentRaw = Buffer.from(identRaw);

        this._debug && this._debug(`Remote ident: ${inspect(identRaw)}`);
        this._compatFlags = getCompatFlags(header);

        this._buffer = undefined;
        this._decipher =
          new NullDecipher(0, onKEXPayload.bind(this, { firstPacket: true }));
        this._parse = parsePacket;

        this._onHeader(header);
        if (!this._destruct) {
          // We disconnected inside _onHeader
          return len;
        }

        kexinit(this);

        return p + 1 - chunkOffset;
      }

      // Only allow pre-ident greetings when we're a client
      if (this._server)
        throw new Error('Greetings from clients not permitted');

      if (++lines > MAX_LINES)
        throw new Error('Max greeting lines exceeded');

      needNL = false;
      start = p + 1;
      lineLen = 0;
    } else if (needNL) {
      throw new Error('Invalid header: expected newline');
    } else if (++lineLen >= MAX_LINE_LEN) {
      throw new Error('Header line too long');
    }

    end = p;
  }
  if (!this._buffer)
    this._buffer = bufferSlice(data, op);

  return p - chunkOffset;
}

function parsePacket(chunk, p, len) {
  return this._decipher.decrypt(chunk, p, len);
}

function onPayload(payload) {
  // XXX: move this to the Decipher implementations?

  this._onPacket();

  if (payload.length === 0) {
    this._debug && this._debug('Inbound: Skipping empty packet payload');
    return;
  }

  payload = this._packetRW.read.read(payload);

  const type = payload[0];
  if (type === MESSAGE.USERAUTH_SUCCESS
      && !this._server
      && !this._authenticated) {
    this._authenticated = true;
    if (this._kex.negotiated.cs.compress === 'zlib@openssh.com')
      this._packetRW.write = new ZlibPacketWriter(this);
    if (this._kex.negotiated.sc.compress === 'zlib@openssh.com')
      this._packetRW.read = new ZlibPacketReader();
  }
  const handler = MESSAGE_HANDLERS[type];
  if (handler === undefined) {
    this._debug && this._debug(`Inbound: Unsupported message type: ${type}`);
    return;
  }

  return handler(this, payload);
}

function getCompatFlags(header) {
  const software = header.versions.software;

  let flags = 0;

  for (const rule of COMPAT_CHECKS) {
    if (typeof rule[0] === 'string') {
      if (software === rule[0])
        flags |= rule[1];
    } else if (rule[0].test(software)) {
      flags |= rule[1];
    }
  }

  return flags;
}

function modesToBytes(modes) {
  const keys = Object.keys(modes);
  const bytes = Buffer.allocUnsafe((5 * keys.length) + 1);
  let b = 0;

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    if (key === 'TTY_OP_END')
      continue;

    const opcode = TERMINAL_MODE[key];
    if (opcode === undefined)
      continue;

    const val = modes[key];
    if (typeof val === 'number' && isFinite(val)) {
      bytes[b++] = opcode;
      bytes[b++] = val >>> 24;
      bytes[b++] = val >>> 16;
      bytes[b++] = val >>> 8;
      bytes[b++] = val;
    }
  }

  bytes[b++] = TERMINAL_MODE.TTY_OP_END;

  if (b < bytes.length)
    return bufferSlice(bytes, 0, b);

  return bytes;
}

module.exports = Protocol;


/***/ }),

/***/ 2026:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const EventEmitter = __nccwpck_require__(8614);
const fs = __nccwpck_require__(5747);
const { constants } = fs;
const {
  Readable: ReadableStream,
  Writable: WritableStream
} = __nccwpck_require__(2413);
const { inherits, isDate } = __nccwpck_require__(1669);

const FastBuffer = Buffer[Symbol.species];

const {
  bufferCopy,
  bufferSlice,
  makeBufferParser,
  writeUInt32BE,
} = __nccwpck_require__(9475);

const ATTR = {
  SIZE: 0x00000001,
  UIDGID: 0x00000002,
  PERMISSIONS: 0x00000004,
  ACMODTIME: 0x00000008,
  EXTENDED: 0x80000000,
};

// Large enough to store all possible attributes
const ATTRS_BUF = Buffer.alloc(28);

const STATUS_CODE = {
  OK: 0,
  EOF: 1,
  NO_SUCH_FILE: 2,
  PERMISSION_DENIED: 3,
  FAILURE: 4,
  BAD_MESSAGE: 5,
  NO_CONNECTION: 6,
  CONNECTION_LOST: 7,
  OP_UNSUPPORTED: 8
};

const VALID_STATUS_CODES = new Map(
  Object.values(STATUS_CODE).map((n) => [n, 1])
);

const STATUS_CODE_STR = {
  [STATUS_CODE.OK]: 'No error',
  [STATUS_CODE.EOF]: 'End of file',
  [STATUS_CODE.NO_SUCH_FILE]: 'No such file or directory',
  [STATUS_CODE.PERMISSION_DENIED]: 'Permission denied',
  [STATUS_CODE.FAILURE]: 'Failure',
  [STATUS_CODE.BAD_MESSAGE]: 'Bad message',
  [STATUS_CODE.NO_CONNECTION]: 'No connection',
  [STATUS_CODE.CONNECTION_LOST]: 'Connection lost',
  [STATUS_CODE.OP_UNSUPPORTED]: 'Operation unsupported',
};

const REQUEST = {
  INIT: 1,
  OPEN: 3,
  CLOSE: 4,
  READ: 5,
  WRITE: 6,
  LSTAT: 7,
  FSTAT: 8,
  SETSTAT: 9,
  FSETSTAT: 10,
  OPENDIR: 11,
  READDIR: 12,
  REMOVE: 13,
  MKDIR: 14,
  RMDIR: 15,
  REALPATH: 16,
  STAT: 17,
  RENAME: 18,
  READLINK: 19,
  SYMLINK: 20,
  EXTENDED: 200
};

const RESPONSE = {
  VERSION: 2,
  STATUS: 101,
  HANDLE: 102,
  DATA: 103,
  NAME: 104,
  ATTRS: 105,
  EXTENDED: 201
};

const OPEN_MODE = {
  READ: 0x00000001,
  WRITE: 0x00000002,
  APPEND: 0x00000004,
  CREAT: 0x00000008,
  TRUNC: 0x00000010,
  EXCL: 0x00000020
};

const PKT_RW_OVERHEAD = 2 * 1024;
const MAX_REQID = 2 ** 32 - 1;
const CLIENT_VERSION_BUFFER = Buffer.from([
  0, 0, 0, 5 /* length */,
    REQUEST.INIT,
    0, 0, 0, 3 /* version */
]);
const SERVER_VERSION_BUFFER = Buffer.from([
  0, 0, 0, 5 /* length */,
    RESPONSE.VERSION,
    0, 0, 0, 3 /* version */
]);

const RE_OPENSSH = /^SSH-2.0-(?:OpenSSH|dropbear)/;
const OPENSSH_MAX_PKT_LEN = 256 * 1024;

const bufferParser = makeBufferParser();

const fakeStderr = {
  readable: false,
  writable: false,
  push: (data) => {},
  once: () => {},
  on: () => {},
  emit: () => {},
  end: () => {},
};

function noop() {}

// Emulates enough of `Channel` to be able to be used as a drop-in replacement
// in order to process incoming data with as little overhead as possible
class SFTP extends EventEmitter {
  constructor(client, chanInfo, cfg) {
    super();

    if (typeof cfg !== 'object' || !cfg)
      cfg = {};

    const remoteIdentRaw = client._protocol._remoteIdentRaw;

    this.server = !!cfg.server;
    this._debug = (typeof cfg.debug === 'function' ? cfg.debug : undefined);
    this._isOpenSSH = (remoteIdentRaw && RE_OPENSSH.test(remoteIdentRaw));

    this._version = -1;
    this._extensions = {};
    this._biOpt = cfg.biOpt;
    this._pktLenBytes = 0;
    this._pktLen = 0;
    this._pktPos = 0;
    this._pktType = 0;
    this._pktData = undefined;
    this._writeReqid = -1;
    this._requests = {};
    this._maxInPktLen = OPENSSH_MAX_PKT_LEN;
    this._maxOutPktLen = 34000;
    this._maxReadLen =
      (this._isOpenSSH ? OPENSSH_MAX_PKT_LEN : 34000) - PKT_RW_OVERHEAD;
    this._maxWriteLen =
      (this._isOpenSSH ? OPENSSH_MAX_PKT_LEN : 34000) - PKT_RW_OVERHEAD;

    this.maxOpenHandles = undefined;

    // Channel compatibility
    this._client = client;
    this._protocol = client._protocol;
    this._callbacks = [];
    this._hasX11 = false;
    this._exit = {
      code: undefined,
      signal: undefined,
      dump: undefined,
      desc: undefined,
    };
    this._waitWindow = false; // SSH-level backpressure
    this._chunkcb = undefined;
    this._buffer = [];
    this.type = chanInfo.type;
    this.subtype = undefined;
    this.incoming = chanInfo.incoming;
    this.outgoing = chanInfo.outgoing;
    this.stderr = fakeStderr;
    this.readable = true;
  }

  // This handles incoming data to parse
  push(data) {
    if (data === null) {
      cleanupRequests(this);
      if (!this.readable)
        return;
      // No more incoming data from the remote side
      this.readable = false;
      this.emit('end');
      return;
    }
    /*
        uint32             length
        byte               type
        byte[length - 1]   data payload
    */
    let p = 0;

    while (p < data.length) {
      if (this._pktLenBytes < 4) {
        let nb = Math.min(4 - this._pktLenBytes, data.length - p);
        this._pktLenBytes += nb;

        while (nb--)
          this._pktLen = (this._pktLen << 8) + data[p++];

        if (this._pktLenBytes < 4)
          return;
        if (this._pktLen === 0)
          return doFatalSFTPError(this, 'Invalid packet length');
        if (this._pktLen > this._maxInPktLen) {
          const max = this._maxInPktLen;
          return doFatalSFTPError(
            this,
            `Packet length ${this._pktLen} exceeds max length of ${max}`
          );
        }
        if (p >= data.length)
          return;
      }
      if (this._pktPos < this._pktLen) {
        const nb = Math.min(this._pktLen - this._pktPos, data.length - p);
        if (p !== 0 || nb !== data.length) {
          if (nb === this._pktLen) {
            this._pkt = new FastBuffer(data.buffer, data.byteOffset + p, nb);
          } else {
            if (!this._pkt)
              this._pkt = Buffer.allocUnsafe(this._pktLen);
            this._pkt.set(
              new Uint8Array(data.buffer, data.byteOffset + p, nb),
              this._pktPos
            );
          }
        } else if (nb === this._pktLen) {
          this._pkt = data;
        } else {
          if (!this._pkt)
            this._pkt = Buffer.allocUnsafe(this._pktLen);
          this._pkt.set(data, this._pktPos);
        }
        p += nb;
        this._pktPos += nb;
        if (this._pktPos < this._pktLen)
          return;
      }

      const type = this._pkt[0];
      const payload = this._pkt;

      // Prepare for next packet
      this._pktLen = 0;
      this._pktLenBytes = 0;
      this._pkt = undefined;
      this._pktPos = 0;

      const handler = (this.server
                       ? SERVER_HANDLERS[type]
                       : CLIENT_HANDLERS[type]);
      if (!handler)
        return doFatalSFTPError(this, `Unknown packet type ${type}`);

      if (this._version === -1) {
        if (this.server) {
          if (type !== REQUEST.INIT)
            return doFatalSFTPError(this, `Expected INIT packet, got ${type}`);
        } else if (type !== RESPONSE.VERSION) {
          return doFatalSFTPError(this, `Expected VERSION packet, got ${type}`);
        }
      }

      if (handler(this, payload) === false)
        return;
    }
  }

  end() {
    this.destroy();
  }
  destroy() {
    if (this.outgoing.state === 'open' || this.outgoing.state === 'eof') {
      this.outgoing.state = 'closing';
      this._protocol.channelClose(this.outgoing.id);
    }
  }
  _init() {
    this._init = noop;
    if (!this.server)
      sendOrBuffer(this, CLIENT_VERSION_BUFFER);
  }

  // ===========================================================================
  // Client-specific ===========================================================
  // ===========================================================================
  createReadStream(path, options) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    return new ReadStream(this, path, options);
  }
  createWriteStream(path, options) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    return new WriteStream(this, path, options);
  }
  open(path, flags_, attrs, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    if (typeof attrs === 'function') {
      cb = attrs;
      attrs = undefined;
    }

    const flags = (typeof flags_ === 'number' ? flags_ : stringToFlags(flags_));
    if (flags === null)
      throw new Error(`Unknown flags string: ${flags_}`);

    let attrsFlags = 0;
    let attrsLen = 0;
    if (typeof attrs === 'string' || typeof attrs === 'number')
      attrs = { mode: attrs };
    if (typeof attrs === 'object' && attrs !== null) {
      attrs = attrsToBytes(attrs);
      attrsFlags = attrs.flags;
      attrsLen = attrs.nb;
    }

    /*
      uint32        id
      string        filename
      uint32        pflags
      ATTRS         attrs
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathLen + 4 + 4 + attrsLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.OPEN;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, pathLen, p);
    buf.utf8Write(path, p += 4, pathLen);
    writeUInt32BE(buf, flags, p += pathLen);
    writeUInt32BE(buf, attrsFlags, p += 4);
    if (attrsLen) {
      p += 4;

      if (attrsLen === ATTRS_BUF.length)
        buf.set(ATTRS_BUF, p);
      else
        bufferCopy(ATTRS_BUF, buf, 0, attrsLen, p);

      p += attrsLen;
    }
    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} OPEN`
    );
  }
  close(handle, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    if (!Buffer.isBuffer(handle))
      throw new Error('handle is not a Buffer');

    /*
      uint32     id
      string     handle
    */
    const handleLen = handle.length;
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handleLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.CLOSE;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, handleLen, p);
    buf.set(handle, p += 4);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} CLOSE`
    );
  }
  read(handle, buf, off, len, position, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');
    if (!Buffer.isBuffer(handle))
      throw new Error('handle is not a Buffer');
    if (!Buffer.isBuffer(buf))
      throw new Error('buffer is not a Buffer');
    if (off >= buf.length)
      throw new Error('offset is out of bounds');
    if (off + len > buf.length)
      throw new Error('length extends beyond buffer');
    if (position === null)
      throw new Error('null position currently unsupported');

    read_(this, handle, buf, off, len, position, cb);
  }
  readData(handle, buf, off, len, position, cb) {
    // Backwards compatibility
    this.read(handle, buf, off, len, position, cb);
  }
  write(handle, buf, off, len, position, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    if (!Buffer.isBuffer(handle))
      throw new Error('handle is not a Buffer');
    if (!Buffer.isBuffer(buf))
      throw new Error('buffer is not a Buffer');
    if (off > buf.length)
      throw new Error('offset is out of bounds');
    if (off + len > buf.length)
      throw new Error('length extends beyond buffer');
    if (position === null)
      throw new Error('null position currently unsupported');

    if (!len) {
      cb && process.nextTick(cb, undefined, 0);
      return;
    }

    const maxDataLen = this._maxWriteLen;
    const overflow = Math.max(len - maxDataLen, 0);
    const origPosition = position;

    if (overflow)
      len = maxDataLen;

    /*
      uint32     id
      string     handle
      uint64     offset
      string     data
    */
    const handleLen = handle.length;
    let p = 9;
    const out = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handleLen + 8 + 4 + len);

    writeUInt32BE(out, out.length - 4, 0);
    out[4] = REQUEST.WRITE;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(out, reqid, 5);

    writeUInt32BE(out, handleLen, p);
    out.set(handle, p += 4);
    p += handleLen;
    for (let i = 7; i >= 0; --i) {
      out[p + i] = position & 0xFF;
      position /= 256;
    }
    writeUInt32BE(out, len, p += 8);
    bufferCopy(buf, out, off, off + len, p += 4);

    this._requests[reqid] = {
      cb: (err) => {
        if (err) {
          if (typeof cb === 'function')
            cb(err);
        } else if (overflow) {
          this.write(handle,
                     buf,
                     off + len,
                     overflow,
                     origPosition + len,
                     cb);
        } else if (typeof cb === 'function') {
          cb(undefined, off + len);
        }
      }
    };

    const isSent = sendOrBuffer(this, out);
    if (this._debug) {
      const how = (isSent ? 'Sent' : 'Buffered');
      this._debug(`SFTP: Outbound: ${how} WRITE (id:${reqid})`);
    }
  }
  writeData(handle, buf, off, len, position, cb) {
    // Backwards compatibility
    this.write(handle, buf, off, len, position, cb);
  }
  fastGet(remotePath, localPath, opts, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    fastXfer(this, fs, remotePath, localPath, opts, cb);
  }
  fastPut(localPath, remotePath, opts, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    fastXfer(fs, this, localPath, remotePath, opts, cb);
  }
  readFile(path, options, callback_) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    let callback;
    if (typeof callback_ === 'function') {
      callback = callback_;
    } else if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    if (typeof options === 'string')
      options = { encoding: options, flag: 'r' };
    else if (!options)
      options = { encoding: null, flag: 'r' };
    else if (typeof options !== 'object')
      throw new TypeError('Bad arguments');

    const encoding = options.encoding;
    if (encoding && !Buffer.isEncoding(encoding))
      throw new Error(`Unknown encoding: ${encoding}`);

    // First stat the file, so we know the size.
    let size;
    let buffer; // Single buffer with file data
    let buffers; // List for when size is unknown
    let pos = 0;
    let handle;

    // SFTPv3 does not support using -1 for read position, so we have to track
    // read position manually
    let bytesRead = 0;

    const flag = options.flag || 'r';

    const read = () => {
      if (size === 0) {
        buffer = Buffer.allocUnsafe(8192);
        this.read(handle, buffer, 0, 8192, bytesRead, afterRead);
      } else {
        this.read(handle, buffer, pos, size - pos, bytesRead, afterRead);
      }
    };

    const afterRead = (er, nbytes) => {
      let eof;
      if (er) {
        eof = (er.code === STATUS_CODE.EOF);
        if (!eof) {
          return this.close(handle, () => {
            return callback && callback(er);
          });
        }
      } else {
        eof = false;
      }

      if (eof || (size === 0 && nbytes === 0))
        return close();

      bytesRead += nbytes;
      pos += nbytes;
      if (size !== 0) {
        if (pos === size)
          close();
        else
          read();
      } else {
        // Unknown size, just read until we don't get bytes.
        buffers.push(bufferSlice(buffer, 0, nbytes));
        read();
      }
    };
    afterRead._wantEOFError = true;

    const close = () => {
      this.close(handle, (er) => {
        if (size === 0) {
          // Collect the data into the buffers list.
          buffer = Buffer.concat(buffers, pos);
        } else if (pos < size) {
          buffer = bufferSlice(buffer, 0, pos);
        }

        if (encoding)
          buffer = buffer.toString(encoding);
        return callback && callback(er, buffer);
      });
    };

    this.open(path, flag, 0o666, (er, handle_) => {
      if (er)
        return callback && callback(er);
      handle = handle_;

      const tryStat = (er, st) => {
        if (er) {
          // Try stat() for sftp servers that may not support fstat() for
          // whatever reason
          this.stat(path, (er_, st_) => {
            if (er_) {
              return this.close(handle, () => {
                callback && callback(er);
              });
            }
            tryStat(null, st_);
          });
          return;
        }

        size = st.size || 0;
        if (size === 0) {
          // The kernel lies about many files.
          // Go ahead and try to read some bytes.
          buffers = [];
          return read();
        }

        buffer = Buffer.allocUnsafe(size);
        read();
      };
      this.fstat(handle, tryStat);
    });
  }
  writeFile(path, data, options, callback_) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    let callback;
    if (typeof callback_ === 'function') {
      callback = callback_;
    } else if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    if (typeof options === 'string')
      options = { encoding: options, mode: 0o666, flag: 'w' };
    else if (!options)
      options = { encoding: 'utf8', mode: 0o666, flag: 'w' };
    else if (typeof options !== 'object')
      throw new TypeError('Bad arguments');

    if (options.encoding && !Buffer.isEncoding(options.encoding))
      throw new Error(`Unknown encoding: ${options.encoding}`);

    const flag = options.flag || 'w';
    this.open(path, flag, options.mode, (openErr, handle) => {
      if (openErr) {
        callback && callback(openErr);
      } else {
        const buffer = (Buffer.isBuffer(data)
                        ? data
                        : Buffer.from('' + data, options.encoding || 'utf8'));
        const position = (/a/.test(flag) ? null : 0);

        // SFTPv3 does not support the notion of 'current position'
        // (null position), so we just attempt to append to the end of the file
        // instead
        if (position === null) {
          const tryStat = (er, st) => {
            if (er) {
              // Try stat() for sftp servers that may not support fstat() for
              // whatever reason
              this.stat(path, (er_, st_) => {
                if (er_) {
                  return this.close(handle, () => {
                    callback && callback(er);
                  });
                }
                tryStat(null, st_);
              });
              return;
            }
            writeAll(this, handle, buffer, 0, buffer.length, st.size, callback);
          };
          this.fstat(handle, tryStat);
          return;
        }
        writeAll(this, handle, buffer, 0, buffer.length, position, callback);
      }
    });
  }
  appendFile(path, data, options, callback_) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    let callback;
    if (typeof callback_ === 'function') {
      callback = callback_;
    } else if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    if (typeof options === 'string')
      options = { encoding: options, mode: 0o666, flag: 'a' };
    else if (!options)
      options = { encoding: 'utf8', mode: 0o666, flag: 'a' };
    else if (typeof options !== 'object')
      throw new TypeError('Bad arguments');

    if (!options.flag)
      options = Object.assign({ flag: 'a' }, options);
    this.writeFile(path, data, options, callback);
  }
  exists(path, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    this.stat(path, (err) => {
      cb && cb(err ? false : true);
    });
  }
  unlink(filename, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    /*
      uint32     id
      string     filename
    */
    const fnameLen = Buffer.byteLength(filename);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + fnameLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.REMOVE;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, fnameLen, p);
    buf.utf8Write(filename, p += 4, fnameLen);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} REMOVE`
    );
  }
  rename(oldPath, newPath, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    /*
      uint32     id
      string     oldpath
      string     newpath
    */
    const oldLen = Buffer.byteLength(oldPath);
    const newLen = Buffer.byteLength(newPath);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + oldLen + 4 + newLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.RENAME;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, oldLen, p);
    buf.utf8Write(oldPath, p += 4, oldLen);
    writeUInt32BE(buf, newLen, p += oldLen);
    buf.utf8Write(newPath, p += 4, newLen);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} RENAME`
    );
  }
  mkdir(path, attrs, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    let flags = 0;
    let attrsLen = 0;

    if (typeof attrs === 'function') {
      cb = attrs;
      attrs = undefined;
    }
    if (typeof attrs === 'object' && attrs !== null) {
      attrs = attrsToBytes(attrs);
      flags = attrs.flags;
      attrsLen = attrs.nb;
    }

    /*
      uint32     id
      string     path
      ATTRS      attrs
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathLen + 4 + attrsLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.MKDIR;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, pathLen, p);
    buf.utf8Write(path, p += 4, pathLen);
    writeUInt32BE(buf, flags, p += pathLen);
    if (attrsLen) {
      p += 4;

      if (attrsLen === ATTRS_BUF.length)
        buf.set(ATTRS_BUF, p);
      else
        bufferCopy(ATTRS_BUF, buf, 0, attrsLen, p);

      p += attrsLen;
    }

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} MKDIR`
    );
  }
  rmdir(path, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    /*
      uint32     id
      string     path
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.RMDIR;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, pathLen, p);
    buf.utf8Write(path, p += 4, pathLen);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} RMDIR`
    );
  }
  readdir(where, opts, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }
    if (typeof opts !== 'object' || opts === null)
      opts = {};

    const doFilter = (opts && opts.full ? false : true);

    if (!Buffer.isBuffer(where) && typeof where !== 'string')
      throw new Error('missing directory handle or path');

    if (typeof where === 'string') {
      const entries = [];
      let e = 0;

      const reread = (err, handle) => {
        if (err)
          return cb(err);

        this.readdir(handle, opts, (err, list) => {
          const eof = (err && err.code === STATUS_CODE.EOF);

          if (err && !eof)
            return this.close(handle, () => cb(err));

          if (eof) {
            return this.close(handle, (err) => {
              if (err)
                return cb(err);
              cb(undefined, entries);
            });
          }

          for (let i = 0; i < list.length; ++i, ++e)
            entries[e] = list[i];

          reread(undefined, handle);
        });
      };
      return this.opendir(where, reread);
    }

    /*
      uint32     id
      string     handle
    */
    const handleLen = where.length;
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handleLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.READDIR;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, handleLen, p);
    buf.set(where, p += 4);

    this._requests[reqid] = {
      cb: (doFilter
           ? (err, list) => {
               if (typeof cb !== 'function')
                 return;
               if (err)
                 return cb(err);

               for (let i = list.length - 1; i >= 0; --i) {
                 if (list[i].filename === '.' || list[i].filename === '..')
                   list.splice(i, 1);
               }

               cb(undefined, list);
             }
           : cb)
    };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} READDIR`
    );
  }
  fstat(handle, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    if (!Buffer.isBuffer(handle))
      throw new Error('handle is not a Buffer');

    /*
      uint32     id
      string     handle
    */
    const handleLen = handle.length;
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handleLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.FSTAT;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, handleLen, p);
    buf.set(handle, p += 4);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} FSTAT`
    );
  }
  stat(path, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    /*
      uint32     id
      string     path
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.STAT;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, pathLen, p);
    buf.utf8Write(path, p += 4, pathLen);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} STAT`
    );
  }
  lstat(path, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    /*
      uint32     id
      string     path
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.LSTAT;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, pathLen, p);
    buf.utf8Write(path, p += 4, pathLen);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} LSTAT`
    );
  }
  opendir(path, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    /*
      uint32     id
      string     path
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.OPENDIR;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, pathLen, p);
    buf.utf8Write(path, p += 4, pathLen);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} OPENDIR`
    );
  }
  setstat(path, attrs, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    let flags = 0;
    let attrsLen = 0;

    if (typeof attrs === 'object' && attrs !== null) {
      attrs = attrsToBytes(attrs);
      flags = attrs.flags;
      attrsLen = attrs.nb;
    } else if (typeof attrs === 'function') {
      cb = attrs;
    }

    /*
      uint32     id
      string     path
      ATTRS      attrs
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathLen + 4 + attrsLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.SETSTAT;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, pathLen, p);
    buf.utf8Write(path, p += 4, pathLen);
    writeUInt32BE(buf, flags, p += pathLen);
    if (attrsLen) {
      p += 4;

      if (attrsLen === ATTRS_BUF.length)
        buf.set(ATTRS_BUF, p);
      else
        bufferCopy(ATTRS_BUF, buf, 0, attrsLen, p);

      p += attrsLen;
    }

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} SETSTAT`
    );
  }
  fsetstat(handle, attrs, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    if (!Buffer.isBuffer(handle))
      throw new Error('handle is not a Buffer');

    let flags = 0;
    let attrsLen = 0;

    if (typeof attrs === 'object' && attrs !== null) {
      attrs = attrsToBytes(attrs);
      flags = attrs.flags;
      attrsLen = attrs.nb;
    } else if (typeof attrs === 'function') {
      cb = attrs;
    }

    /*
      uint32     id
      string     handle
      ATTRS      attrs
    */
    const handleLen = handle.length;
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handleLen + 4 + attrsLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.FSETSTAT;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, handleLen, p);
    buf.set(handle, p += 4);
    writeUInt32BE(buf, flags, p += handleLen);
    if (attrsLen) {
      p += 4;

      if (attrsLen === ATTRS_BUF.length)
        buf.set(ATTRS_BUF, p);
      else
        bufferCopy(ATTRS_BUF, buf, 0, attrsLen, p);

      p += attrsLen;
    }

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} FSETSTAT`
    );
  }
  futimes(handle, atime, mtime, cb) {
    return this.fsetstat(handle, {
      atime: toUnixTimestamp(atime),
      mtime: toUnixTimestamp(mtime)
    }, cb);
  }
  utimes(path, atime, mtime, cb) {
    return this.setstat(path, {
      atime: toUnixTimestamp(atime),
      mtime: toUnixTimestamp(mtime)
    }, cb);
  }
  fchown(handle, uid, gid, cb) {
    return this.fsetstat(handle, {
      uid: uid,
      gid: gid
    }, cb);
  }
  chown(path, uid, gid, cb) {
    return this.setstat(path, {
      uid: uid,
      gid: gid
    }, cb);
  }
  fchmod(handle, mode, cb) {
    return this.fsetstat(handle, {
      mode: mode
    }, cb);
  }
  chmod(path, mode, cb) {
    return this.setstat(path, {
      mode: mode
    }, cb);
  }
  readlink(path, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    /*
      uint32     id
      string     path
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.READLINK;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, pathLen, p);
    buf.utf8Write(path, p += 4, pathLen);

    this._requests[reqid] = {
      cb: (err, names) => {
        if (typeof cb !== 'function')
          return;
        if (err)
          return cb(err);
        if (!names || !names.length)
          return cb(new Error('Response missing link info'));
        cb(undefined, names[0].filename);
      }
    };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} READLINK`
    );
  }
  symlink(targetPath, linkPath, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    /*
      uint32     id
      string     linkpath
      string     targetpath
    */
    const linkLen = Buffer.byteLength(linkPath);
    const targetLen = Buffer.byteLength(targetPath);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + linkLen + 4 + targetLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.SYMLINK;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    if (this._isOpenSSH) {
      // OpenSSH has linkpath and targetpath positions switched
      writeUInt32BE(buf, targetLen, p);
      buf.utf8Write(targetPath, p += 4, targetLen);
      writeUInt32BE(buf, linkLen, p += targetLen);
      buf.utf8Write(linkPath, p += 4, linkLen);
    } else {
      writeUInt32BE(buf, linkLen, p);
      buf.utf8Write(linkPath, p += 4, linkLen);
      writeUInt32BE(buf, targetLen, p += linkLen);
      buf.utf8Write(targetPath, p += 4, targetLen);
    }

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} SYMLINK`
    );
  }
  realpath(path, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    /*
      uint32     id
      string     path
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.REALPATH;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, pathLen, p);
    buf.utf8Write(path, p += 4, pathLen);

    this._requests[reqid] = {
      cb: (err, names) => {
        if (typeof cb !== 'function')
          return;
        if (err)
          return cb(err);
        if (!names || !names.length)
          return cb(new Error('Response missing path info'));
        cb(undefined, names[0].filename);
      }
    };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} REALPATH`
    );
  }
  // extended requests
  ext_openssh_rename(oldPath, newPath, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    const ext = this._extensions['posix-rename@openssh.com'];
    if (!ext || ext !== '1')
      throw new Error('Server does not support this extended request');

    /*
      uint32    id
      string    "posix-rename@openssh.com"
      string    oldpath
      string    newpath
    */
    const oldLen = Buffer.byteLength(oldPath);
    const newLen = Buffer.byteLength(newPath);
    let p = 9;
    const buf =
      Buffer.allocUnsafe(4 + 1 + 4 + 4 + 24 + 4 + oldLen + 4 + newLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.EXTENDED;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, 24, p);
    buf.utf8Write('posix-rename@openssh.com', p += 4, 24);
    writeUInt32BE(buf, oldLen, p += 24);
    buf.utf8Write(oldPath, p += 4, oldLen);
    writeUInt32BE(buf, newLen, p += oldLen);
    buf.utf8Write(newPath, p += 4, newLen);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    if (this._debug) {
      const which = (isBuffered ? 'Buffered' : 'Sending');
      this._debug(`SFTP: Outbound: ${which} posix-rename@openssh.com`);
    }
  }
  ext_openssh_statvfs(path, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    const ext = this._extensions['statvfs@openssh.com'];
    if (!ext || ext !== '2')
      throw new Error('Server does not support this extended request');

    /*
      uint32    id
      string    "statvfs@openssh.com"
      string    path
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 19 + 4 + pathLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.EXTENDED;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, 19, p);
    buf.utf8Write('statvfs@openssh.com', p += 4, 19);
    writeUInt32BE(buf, pathLen, p += 19);
    buf.utf8Write(path, p += 4, pathLen);

    this._requests[reqid] = { extended: 'statvfs@openssh.com', cb };

    const isBuffered = sendOrBuffer(this, buf);
    if (this._debug) {
      const which = (isBuffered ? 'Buffered' : 'Sending');
      this._debug(`SFTP: Outbound: ${which} statvfs@openssh.com`);
    }
  }
  ext_openssh_fstatvfs(handle, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    const ext = this._extensions['fstatvfs@openssh.com'];
    if (!ext || ext !== '2')
      throw new Error('Server does not support this extended request');
    if (!Buffer.isBuffer(handle))
      throw new Error('handle is not a Buffer');

    /*
      uint32    id
      string    "fstatvfs@openssh.com"
      string    handle
    */
    const handleLen = handle.length;
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 20 + 4 + handleLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.EXTENDED;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, 20, p);
    buf.utf8Write('fstatvfs@openssh.com', p += 4, 20);
    writeUInt32BE(buf, handleLen, p += 20);
    buf.set(handle, p += 4);

    this._requests[reqid] = { extended: 'fstatvfs@openssh.com', cb };

    const isBuffered = sendOrBuffer(this, buf);
    if (this._debug) {
      const which = (isBuffered ? 'Buffered' : 'Sending');
      this._debug(`SFTP: Outbound: ${which} fstatvfs@openssh.com`);
    }
  }
  ext_openssh_hardlink(oldPath, newPath, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    const ext = this._extensions['hardlink@openssh.com'];
    if (ext !== '1')
      throw new Error('Server does not support this extended request');

    /*
      uint32    id
      string    "hardlink@openssh.com"
      string    oldpath
      string    newpath
    */
    const oldLen = Buffer.byteLength(oldPath);
    const newLen = Buffer.byteLength(newPath);
    let p = 9;
    const buf =
      Buffer.allocUnsafe(4 + 1 + 4 + 4 + 20 + 4 + oldLen + 4 + newLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.EXTENDED;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, 20, p);
    buf.utf8Write('hardlink@openssh.com', p += 4, 20);
    writeUInt32BE(buf, oldLen, p += 20);
    buf.utf8Write(oldPath, p += 4, oldLen);
    writeUInt32BE(buf, newLen, p += oldLen);
    buf.utf8Write(newPath, p += 4, newLen);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    if (this._debug) {
      const which = (isBuffered ? 'Buffered' : 'Sending');
      this._debug(`SFTP: Outbound: ${which} hardlink@openssh.com`);
    }
  }
  ext_openssh_fsync(handle, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    const ext = this._extensions['fsync@openssh.com'];
    if (ext !== '1')
      throw new Error('Server does not support this extended request');
    if (!Buffer.isBuffer(handle))
      throw new Error('handle is not a Buffer');

    /*
      uint32    id
      string    "fsync@openssh.com"
      string    handle
    */
    const handleLen = handle.length;
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 17 + 4 + handleLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.EXTENDED;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, 17, p);
    buf.utf8Write('fsync@openssh.com', p += 4, 17);
    writeUInt32BE(buf, handleLen, p += 17);
    buf.set(handle, p += 4);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} fsync@openssh.com`
    );
  }
  ext_openssh_lsetstat(path, attrs, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    const ext = this._extensions['lsetstat@openssh.com'];
    if (ext !== '1')
      throw new Error('Server does not support this extended request');

    let flags = 0;
    let attrsLen = 0;

    if (typeof attrs === 'object' && attrs !== null) {
      attrs = attrsToBytes(attrs);
      flags = attrs.flags;
      attrsLen = attrs.nb;
    } else if (typeof attrs === 'function') {
      cb = attrs;
    }

    /*
      uint32    id
      string    "lsetstat@openssh.com"
      string    path
      ATTRS     attrs
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf =
      Buffer.allocUnsafe(4 + 1 + 4 + 4 + 20 + 4 + pathLen + 4 + attrsLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.EXTENDED;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, 20, p);
    buf.utf8Write('lsetstat@openssh.com', p += 4, 20);

    writeUInt32BE(buf, pathLen, p += 20);
    buf.utf8Write(path, p += 4, pathLen);

    writeUInt32BE(buf, flags, p += pathLen);
    if (attrsLen) {
      p += 4;

      if (attrsLen === ATTRS_BUF.length)
        buf.set(ATTRS_BUF, p);
      else
        bufferCopy(ATTRS_BUF, buf, 0, attrsLen, p);

      p += attrsLen;
    }

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    if (this._debug) {
      const status = (isBuffered ? 'Buffered' : 'Sending');
      this._debug(`SFTP: Outbound: ${status} lsetstat@openssh.com`);
    }
  }
  ext_openssh_expandPath(path, cb) {
    if (this.server)
      throw new Error('Client-only method called in server mode');

    const ext = this._extensions['expand-path@openssh.com'];
    if (ext !== '1')
      throw new Error('Server does not support this extended request');

    /*
      uint32    id
      string    "expand-path@openssh.com"
      string    path
    */
    const pathLen = Buffer.byteLength(path);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 23 + 4 + pathLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = REQUEST.EXTENDED;
    const reqid = this._writeReqid = (this._writeReqid + 1) & MAX_REQID;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, 23, p);
    buf.utf8Write('expand-path@openssh.com', p += 4, 23);

    writeUInt32BE(buf, pathLen, p += 20);
    buf.utf8Write(path, p += 4, pathLen);

    this._requests[reqid] = { cb };

    const isBuffered = sendOrBuffer(this, buf);
    if (this._debug) {
      const status = (isBuffered ? 'Buffered' : 'Sending');
      this._debug(`SFTP: Outbound: ${status} expand-path@openssh.com`);
    }
  }
  // ===========================================================================
  // Server-specific ===========================================================
  // ===========================================================================
  handle(reqid, handle) {
    if (!this.server)
      throw new Error('Server-only method called in client mode');

    if (!Buffer.isBuffer(handle))
      throw new Error('handle is not a Buffer');

    const handleLen = handle.length;

    if (handleLen > 256)
      throw new Error('handle too large (> 256 bytes)');

    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handleLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = RESPONSE.HANDLE;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, handleLen, p);
    if (handleLen)
      buf.set(handle, p += 4);

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} HANDLE`
    );
  }
  status(reqid, code, message) {
    if (!this.server)
      throw new Error('Server-only method called in client mode');

    if (!VALID_STATUS_CODES.has(code))
      throw new Error(`Bad status code: ${code}`);

    message || (message = '');

    const msgLen = Buffer.byteLength(message);
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 4 + msgLen + 4);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = RESPONSE.STATUS;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, code, p);

    writeUInt32BE(buf, msgLen, p += 4);
    p += 4;
    if (msgLen) {
      buf.utf8Write(message, p, msgLen);
      p += msgLen;
    }

    writeUInt32BE(buf, 0, p); // Empty language tag

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} STATUS`
    );
  }
  data(reqid, data, encoding) {
    if (!this.server)
      throw new Error('Server-only method called in client mode');

    const isBuffer = Buffer.isBuffer(data);

    if (!isBuffer && typeof data !== 'string')
      throw new Error('data is not a Buffer or string');

    let isUTF8;
    if (!isBuffer && !encoding) {
      encoding = undefined;
      isUTF8 = true;
    }

    const dataLen = (
      isBuffer
      ? data.length
      : Buffer.byteLength(data, encoding)
    );
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + dataLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = RESPONSE.DATA;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, dataLen, p);
    if (dataLen) {
      if (isBuffer)
        buf.set(data, p += 4);
      else if (isUTF8)
        buf.utf8Write(data, p += 4, dataLen);
      else
        buf.write(data, p += 4, dataLen, encoding);
    }

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} DATA`
    );
  }
  name(reqid, names) {
    if (!this.server)
      throw new Error('Server-only method called in client mode');

    if (!Array.isArray(names)) {
      if (typeof names !== 'object' || names === null)
        throw new Error('names is not an object or array');
      names = [ names ];
    }

    const count = names.length;
    let namesLen = 0;
    let nameAttrs;
    const attrs = [];

    for (let i = 0; i < count; ++i) {
      const name = names[i];
      const filename = (
        !name || !name.filename || typeof name.filename !== 'string'
        ? ''
        : name.filename
      );
      namesLen += 4 + Buffer.byteLength(filename);
      const longname = (
        !name || !name.longname || typeof name.longname !== 'string'
        ? ''
        : name.longname
      );
      namesLen += 4 + Buffer.byteLength(longname);

      if (typeof name.attrs === 'object' && name.attrs !== null) {
        nameAttrs = attrsToBytes(name.attrs);
        namesLen += 4 + nameAttrs.nb;

        if (nameAttrs.nb) {
          let bytes;

          if (nameAttrs.nb === ATTRS_BUF.length) {
            bytes = new Uint8Array(ATTRS_BUF);
          } else {
            bytes = new Uint8Array(nameAttrs.nb);
            bufferCopy(ATTRS_BUF, bytes, 0, nameAttrs.nb, 0);
          }

          nameAttrs.bytes = bytes;
        }

        attrs.push(nameAttrs);
      } else {
        namesLen += 4;
        attrs.push(null);
      }
    }

    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + namesLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = RESPONSE.NAME;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, count, p);

    p += 4;

    for (let i = 0; i < count; ++i) {
      const name = names[i];

      {
        const filename = (
          !name || !name.filename || typeof name.filename !== 'string'
          ? ''
          : name.filename
        );
        const len = Buffer.byteLength(filename);
        writeUInt32BE(buf, len, p);
        p += 4;
        if (len) {
          buf.utf8Write(filename, p, len);
          p += len;
        }
      }

      {
        const longname = (
          !name || !name.longname || typeof name.longname !== 'string'
          ? ''
          : name.longname
        );
        const len = Buffer.byteLength(longname);
        writeUInt32BE(buf, len, p);
        p += 4;
        if (len) {
          buf.utf8Write(longname, p, len);
          p += len;
        }
      }

      const attr = attrs[i];
      if (attr) {
        writeUInt32BE(buf, attr.flags, p);
        p += 4;
        if (attr.flags && attr.bytes) {
          buf.set(attr.bytes, p);
          p += attr.nb;
        }
      } else {
        writeUInt32BE(buf, 0, p);
        p += 4;
      }
    }

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} NAME`
    );
  }
  attrs(reqid, attrs) {
    if (!this.server)
      throw new Error('Server-only method called in client mode');

    if (typeof attrs !== 'object' || attrs === null)
      throw new Error('attrs is not an object');

    attrs = attrsToBytes(attrs);
    const flags = attrs.flags;
    const attrsLen = attrs.nb;
    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + attrsLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = RESPONSE.ATTRS;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, flags, p);
    if (attrsLen) {
      p += 4;

      if (attrsLen === ATTRS_BUF.length)
        buf.set(ATTRS_BUF, p);
      else
        bufferCopy(ATTRS_BUF, buf, 0, attrsLen, p);

      p += attrsLen;
    }

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} ATTRS`
    );
  }
}

function tryCreateBuffer(size) {
  try {
    return Buffer.allocUnsafe(size);
  } catch (ex) {
    return ex;
  }
}

function read_(self, handle, buf, off, len, position, cb, req_) {
  const maxDataLen = self._maxReadLen;
  const overflow = Math.max(len - maxDataLen, 0);

  if (overflow)
    len = maxDataLen;

  /*
    uint32     id
    string     handle
    uint64     offset
    uint32     len
  */
  const handleLen = handle.length;
  let p = 9;
  let pos = position;
  const out = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handleLen + 8 + 4);

  writeUInt32BE(out, out.length - 4, 0);
  out[4] = REQUEST.READ;
  const reqid = self._writeReqid = (self._writeReqid + 1) & MAX_REQID;
  writeUInt32BE(out, reqid, 5);

  writeUInt32BE(out, handleLen, p);
  out.set(handle, p += 4);
  p += handleLen;
  for (let i = 7; i >= 0; --i) {
    out[p + i] = pos & 0xFF;
    pos /= 256;
  }
  writeUInt32BE(out, len, p += 8);

  if (typeof cb !== 'function')
    cb = noop;

  const req = (req_ || {
    nb: 0,
    position,
    off,
    origOff: off,
    len: undefined,
    overflow: undefined,
    cb: (err, data, nb) => {
      const len = req.len;
      const overflow = req.overflow;

      if (err) {
        if (cb._wantEOFError || err.code !== STATUS_CODE.EOF)
          return cb(err);
      } else if (nb > len) {
        return cb(new Error('Received more data than requested'));
      } else if (nb === len && overflow) {
        req.nb += nb;
        req.position += nb;
        req.off += nb;
        read_(self, handle, buf, req.off, overflow, req.position, cb, req);
        return;
      }

      if (req.origOff === 0 && buf.length === req.nb)
        data = buf;
      else
        data = bufferSlice(buf, req.origOff, req.origOff + req.nb);
      cb(undefined, req.nb + (nb || 0), data, req.position);
    },
    buffer: undefined,
  });

  req.len = len;
  req.overflow = overflow;

  // TODO: avoid creating multiple buffer slices when we need to re-call read_()
  // because of overflow
  req.buffer = bufferSlice(buf, off, off + len);

  self._requests[reqid] = req;

  const isBuffered = sendOrBuffer(self, out);
  self._debug && self._debug(
    `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} READ`
  );
}

function fastXfer(src, dst, srcPath, dstPath, opts, cb) {
  let concurrency = 64;
  let chunkSize = 32768;
  let onstep;
  let mode;
  let fileSize;

  if (typeof opts === 'function') {
    cb = opts;
  } else if (typeof opts === 'object' && opts !== null) {
    if (typeof opts.concurrency === 'number'
        && opts.concurrency > 0
        && !isNaN(opts.concurrency)) {
      concurrency = opts.concurrency;
    }
    if (typeof opts.chunkSize === 'number'
        && opts.chunkSize > 0
        && !isNaN(opts.chunkSize)) {
      chunkSize = opts.chunkSize;
    }
    if (typeof opts.fileSize === 'number'
        && opts.fileSize > 0
        && !isNaN(opts.fileSize)) {
      fileSize = opts.fileSize;
    }
    if (typeof opts.step === 'function')
      onstep = opts.step;

    if (typeof opts.mode === 'string' || typeof opts.mode === 'number')
      mode = modeNum(opts.mode);
  }

  // Internal state variables
  let fsize;
  let pdst = 0;
  let total = 0;
  let hadError = false;
  let srcHandle;
  let dstHandle;
  let readbuf;
  let bufsize = chunkSize * concurrency;

  function onerror(err) {
    if (hadError)
      return;

    hadError = true;

    let left = 0;
    let cbfinal;

    if (srcHandle || dstHandle) {
      cbfinal = () => {
        if (--left === 0)
          cb(err);
      };
      if (srcHandle && (src === fs || src.outgoing.state === 'open'))
        ++left;
      if (dstHandle && (dst === fs || dst.outgoing.state === 'open'))
        ++left;
      if (srcHandle && (src === fs || src.outgoing.state === 'open'))
        src.close(srcHandle, cbfinal);
      if (dstHandle && (dst === fs || dst.outgoing.state === 'open'))
        dst.close(dstHandle, cbfinal);
    } else {
      cb(err);
    }
  }

  src.open(srcPath, 'r', (err, sourceHandle) => {
    if (err)
      return onerror(err);

    srcHandle = sourceHandle;

    if (fileSize === undefined)
      src.fstat(srcHandle, tryStat);
    else
      tryStat(null, { size: fileSize });

    function tryStat(err, attrs) {
      if (err) {
        if (src !== fs) {
          // Try stat() for sftp servers that may not support fstat() for
          // whatever reason
          src.stat(srcPath, (err_, attrs_) => {
            if (err_)
              return onerror(err);
            tryStat(null, attrs_);
          });
          return;
        }
        return onerror(err);
      }
      fsize = attrs.size;

      dst.open(dstPath, 'w', (err, destHandle) => {
        if (err)
          return onerror(err);

        dstHandle = destHandle;

        if (fsize <= 0)
          return onerror();

        // Use less memory where possible
        while (bufsize > fsize) {
          if (concurrency === 1) {
            bufsize = fsize;
            break;
          }
          bufsize -= chunkSize;
          --concurrency;
        }

        readbuf = tryCreateBuffer(bufsize);
        if (readbuf instanceof Error)
          return onerror(readbuf);

        if (mode !== undefined) {
          dst.fchmod(dstHandle, mode, function tryAgain(err) {
            if (err) {
              // Try chmod() for sftp servers that may not support fchmod()
              // for whatever reason
              dst.chmod(dstPath, mode, (err_) => tryAgain());
              return;
            }
            startReads();
          });
        } else {
          startReads();
        }

        function onread(err, nb, data, dstpos, datapos, origChunkLen) {
          if (err)
            return onerror(err);

          datapos = datapos || 0;

          dst.write(dstHandle, readbuf, datapos, nb, dstpos, writeCb);

          function writeCb(err) {
            if (err)
              return onerror(err);

            total += nb;
            onstep && onstep(total, nb, fsize);

            if (nb < origChunkLen)
              return singleRead(datapos, dstpos + nb, origChunkLen - nb);

            if (total === fsize) {
              dst.close(dstHandle, (err) => {
                dstHandle = undefined;
                if (err)
                  return onerror(err);
                src.close(srcHandle, (err) => {
                  srcHandle = undefined;
                  if (err)
                    return onerror(err);
                  cb();
                });
              });
              return;
            }

            if (pdst >= fsize)
              return;

            const chunk =
              (pdst + chunkSize > fsize ? fsize - pdst : chunkSize);
            singleRead(datapos, pdst, chunk);
            pdst += chunk;
          }
        }

        function makeCb(psrc, pdst, chunk) {
          return (err, nb, data) => {
            onread(err, nb, data, pdst, psrc, chunk);
          };
        }

        function singleRead(psrc, pdst, chunk) {
          src.read(srcHandle,
                   readbuf,
                   psrc,
                   chunk,
                   pdst,
                   makeCb(psrc, pdst, chunk));
        }

        function startReads() {
          let reads = 0;
          let psrc = 0;
          while (pdst < fsize && reads < concurrency) {
            const chunk =
              (pdst + chunkSize > fsize ? fsize - pdst : chunkSize);
            singleRead(psrc, pdst, chunk);
            psrc += chunk;
            pdst += chunk;
            ++reads;
          }
        }
      });
    }
  });
}

function writeAll(sftp, handle, buffer, offset, length, position, callback_) {
  const callback = (typeof callback_ === 'function' ? callback_ : undefined);

  sftp.write(handle,
             buffer,
             offset,
             length,
             position,
             (writeErr, written) => {
    if (writeErr) {
      return sftp.close(handle, () => {
        callback && callback(writeErr);
      });
    }
    if (written === length) {
      sftp.close(handle, callback);
    } else {
      offset += written;
      length -= written;
      position += written;
      writeAll(sftp, handle, buffer, offset, length, position, callback);
    }
  });
}

class Stats {
  constructor(initial) {
    this.mode = (initial && initial.mode);
    this.uid = (initial && initial.uid);
    this.gid = (initial && initial.gid);
    this.size = (initial && initial.size);
    this.atime = (initial && initial.atime);
    this.mtime = (initial && initial.mtime);
    this.extended = (initial && initial.extended);
  }
  isDirectory() {
    return ((this.mode & constants.S_IFMT) === constants.S_IFDIR);
  }
  isFile() {
    return ((this.mode & constants.S_IFMT) === constants.S_IFREG);
  }
  isBlockDevice() {
    return ((this.mode & constants.S_IFMT) === constants.S_IFBLK);
  }
  isCharacterDevice() {
    return ((this.mode & constants.S_IFMT) === constants.S_IFCHR);
  }
  isSymbolicLink() {
    return ((this.mode & constants.S_IFMT) === constants.S_IFLNK);
  }
  isFIFO() {
    return ((this.mode & constants.S_IFMT) === constants.S_IFIFO);
  }
  isSocket() {
    return ((this.mode & constants.S_IFMT) === constants.S_IFSOCK);
  }
}

function attrsToBytes(attrs) {
  let flags = 0;
  let nb = 0;

  if (typeof attrs === 'object' && attrs !== null) {
    if (typeof attrs.size === 'number') {
      flags |= ATTR.SIZE;
      const val = attrs.size;
      // Big Endian
      ATTRS_BUF[nb++] = val / 72057594037927940; // 2**56
      ATTRS_BUF[nb++] = val / 281474976710656; // 2**48
      ATTRS_BUF[nb++] = val / 1099511627776; // 2**40
      ATTRS_BUF[nb++] = val / 4294967296; // 2**32
      ATTRS_BUF[nb++] = val / 16777216; // 2**24
      ATTRS_BUF[nb++] = val / 65536; // 2**16
      ATTRS_BUF[nb++] = val / 256; // 2**8
      ATTRS_BUF[nb++] = val;
    }
    if (typeof attrs.uid === 'number' && typeof attrs.gid === 'number') {
      flags |= ATTR.UIDGID;
      const uid = attrs.uid;
      const gid = attrs.gid;
      // Big Endian
      ATTRS_BUF[nb++] = uid >>> 24;
      ATTRS_BUF[nb++] = uid >>> 16;
      ATTRS_BUF[nb++] = uid >>> 8;
      ATTRS_BUF[nb++] = uid;
      ATTRS_BUF[nb++] = gid >>> 24;
      ATTRS_BUF[nb++] = gid >>> 16;
      ATTRS_BUF[nb++] = gid >>> 8;
      ATTRS_BUF[nb++] = gid;
    }
    if (typeof attrs.mode === 'number' || typeof attrs.mode === 'string') {
      const mode = modeNum(attrs.mode);
      flags |= ATTR.PERMISSIONS;
      // Big Endian
      ATTRS_BUF[nb++] = mode >>> 24;
      ATTRS_BUF[nb++] = mode >>> 16;
      ATTRS_BUF[nb++] = mode >>> 8;
      ATTRS_BUF[nb++] = mode;
    }
    if ((typeof attrs.atime === 'number' || isDate(attrs.atime))
        && (typeof attrs.mtime === 'number' || isDate(attrs.mtime))) {
      const atime = toUnixTimestamp(attrs.atime);
      const mtime = toUnixTimestamp(attrs.mtime);

      flags |= ATTR.ACMODTIME;
      // Big Endian
      ATTRS_BUF[nb++] = atime >>> 24;
      ATTRS_BUF[nb++] = atime >>> 16;
      ATTRS_BUF[nb++] = atime >>> 8;
      ATTRS_BUF[nb++] = atime;
      ATTRS_BUF[nb++] = mtime >>> 24;
      ATTRS_BUF[nb++] = mtime >>> 16;
      ATTRS_BUF[nb++] = mtime >>> 8;
      ATTRS_BUF[nb++] = mtime;
    }
    // TODO: extended attributes
  }

  return { flags, nb };
}

function toUnixTimestamp(time) {
  // eslint-disable-next-line no-self-compare
  if (typeof time === 'number' && time === time) // Valid, non-NaN number
    return time;
  if (isDate(time))
    return parseInt(time.getTime() / 1000, 10);
  throw new Error(`Cannot parse time: ${time}`);
}

function modeNum(mode) {
  // eslint-disable-next-line no-self-compare
  if (typeof mode === 'number' && mode === mode) // Valid, non-NaN number
    return mode;
  if (typeof mode === 'string')
    return modeNum(parseInt(mode, 8));
  throw new Error(`Cannot parse mode: ${mode}`);
}

const stringFlagMap = {
  'r': OPEN_MODE.READ,
  'r+': OPEN_MODE.READ | OPEN_MODE.WRITE,
  'w': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.WRITE,
  'wx': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'xw': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'w+': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE,
  'wx+': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL,
  'xw+': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL,
  'a': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.WRITE,
  'ax': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'xa': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'a+': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE,
  'ax+': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL,
  'xa+': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL
};

function stringToFlags(str) {
  const flags = stringFlagMap[str];
  return (flags !== undefined ? flags : null);
}

const flagsToString = (() => {
  const stringFlagMapKeys = Object.keys(stringFlagMap);
  return (flags) => {
    for (let i = 0; i < stringFlagMapKeys.length; ++i) {
      const key = stringFlagMapKeys[i];
      if (stringFlagMap[key] === flags)
        return key;
    }
    return null;
  };
})();

function readAttrs(biOpt) {
  /*
    uint32   flags
    uint64   size           present only if flag SSH_FILEXFER_ATTR_SIZE
    uint32   uid            present only if flag SSH_FILEXFER_ATTR_UIDGID
    uint32   gid            present only if flag SSH_FILEXFER_ATTR_UIDGID
    uint32   permissions    present only if flag SSH_FILEXFER_ATTR_PERMISSIONS
    uint32   atime          present only if flag SSH_FILEXFER_ACMODTIME
    uint32   mtime          present only if flag SSH_FILEXFER_ACMODTIME
    uint32   extended_count present only if flag SSH_FILEXFER_ATTR_EXTENDED
    string   extended_type
    string   extended_data
    ...      more extended data (extended_type - extended_data pairs),
               so that number of pairs equals extended_count
  */
  const flags = bufferParser.readUInt32BE();
  if (flags === undefined)
    return;

  const attrs = new Stats();
  if (flags & ATTR.SIZE) {
    const size = bufferParser.readUInt64BE(biOpt);
    if (size === undefined)
      return;
    attrs.size = size;
  }

  if (flags & ATTR.UIDGID) {
    const uid = bufferParser.readUInt32BE();
    const gid = bufferParser.readUInt32BE();
    if (gid === undefined)
      return;
    attrs.uid = uid;
    attrs.gid = gid;
  }

  if (flags & ATTR.PERMISSIONS) {
    const mode = bufferParser.readUInt32BE();
    if (mode === undefined)
      return;
    attrs.mode = mode;
  }

  if (flags & ATTR.ACMODTIME) {
    const atime = bufferParser.readUInt32BE();
    const mtime = bufferParser.readUInt32BE();
    if (mtime === undefined)
      return;
    attrs.atime = atime;
    attrs.mtime = mtime;
  }

  if (flags & ATTR.EXTENDED) {
    const count = bufferParser.readUInt32BE();
    if (count === undefined)
      return;
    const extended = {};
    for (let i = 0; i < count; ++i) {
      const type = bufferParser.readString(true);
      const data = bufferParser.readString();
      if (data === undefined)
        return;
      extended[type] = data;
    }
    attrs.extended = extended;
  }

  return attrs;
}

function sendOrBuffer(sftp, payload) {
  const ret = tryWritePayload(sftp, payload);
  if (ret !== undefined) {
    sftp._buffer.push(ret);
    return false;
  }
  return true;
}

function tryWritePayload(sftp, payload) {
  const outgoing = sftp.outgoing;
  if (outgoing.state !== 'open')
    return;

  if (outgoing.window === 0) {
    sftp._waitWindow = true; // XXX: Unnecessary?
    return payload;
  }

  let ret;
  const len = payload.length;
  let p = 0;

  while (len - p > 0 && outgoing.window > 0) {
    const actualLen = Math.min(len - p, outgoing.window, outgoing.packetSize);
    outgoing.window -= actualLen;
    if (outgoing.window === 0) {
      sftp._waitWindow = true;
      sftp._chunkcb = drainBuffer;
    }

    if (p === 0 && actualLen === len) {
      sftp._protocol.channelData(sftp.outgoing.id, payload);
    } else {
      sftp._protocol.channelData(sftp.outgoing.id,
                                 bufferSlice(payload, p, p + actualLen));
    }

    p += actualLen;
  }

  if (len - p > 0) {
    if (p > 0)
      ret = bufferSlice(payload, p, len);
    else
      ret = payload; // XXX: should never get here?
  }

  return ret;
}

function drainBuffer() {
  this._chunkcb = undefined;
  const buffer = this._buffer;
  let i = 0;
  while (i < buffer.length) {
    const payload = buffer[i];
    const ret = tryWritePayload(this, payload);
    if (ret !== undefined) {
      if (ret !== payload)
        buffer[i] = ret;
      if (i > 0)
        this._buffer = buffer.slice(i);
      return;
    }
    ++i;
  }
  if (i > 0)
    this._buffer = [];
}

function doFatalSFTPError(sftp, msg, noDebug) {
  const err = new Error(msg);
  err.level = 'sftp-protocol';
  if (!noDebug && sftp._debug)
    sftp._debug(`SFTP: Inbound: ${msg}`);
  sftp.emit('error', err);
  sftp.destroy();
  cleanupRequests(sftp);
  return false;
}

function cleanupRequests(sftp) {
  const keys = Object.keys(sftp._requests);
  if (keys.length === 0)
    return;

  const reqs = sftp._requests;
  sftp._requests = {};
  const err = new Error('No response from server');
  for (let i = 0; i < keys.length; ++i) {
    const req = reqs[keys[i]];
    if (typeof req.cb === 'function')
      req.cb(err);
  }
}

function requestLimits(sftp, cb) {
  /*
    uint32    id
    string    "limits@openssh.com"
  */
  let p = 9;
  const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 18);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.EXTENDED;
  const reqid = sftp._writeReqid = (sftp._writeReqid + 1) & MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, 18, p);
  buf.utf8Write('limits@openssh.com', p += 4, 18);

  sftp._requests[reqid] = { extended: 'limits@openssh.com', cb };

  const isBuffered = sendOrBuffer(sftp, buf);
  if (sftp._debug) {
    const which = (isBuffered ? 'Buffered' : 'Sending');
    sftp._debug(`SFTP: Outbound: ${which} limits@openssh.com`);
  }
}

const CLIENT_HANDLERS = {
  [RESPONSE.VERSION]: (sftp, payload) => {
    if (sftp._version !== -1)
      return doFatalSFTPError(sftp, 'Duplicate VERSION packet');

    const extensions = {};

    /*
      uint32 version
      <extension data>
    */
    bufferParser.init(payload, 1);
    let version = bufferParser.readUInt32BE();
    while (bufferParser.avail()) {
      const extName = bufferParser.readString(true);
      const extData = bufferParser.readString(true);
      if (extData === undefined) {
        version = undefined;
        break;
      }
      extensions[extName] = extData;
    }
    bufferParser.clear();

    if (version === undefined)
      return doFatalSFTPError(sftp, 'Malformed VERSION packet');

    if (sftp._debug) {
      const names = Object.keys(extensions);
      if (names.length) {
        sftp._debug(
          `SFTP: Inbound: Received VERSION (v${version}, exts:${names})`
        );
      } else {
        sftp._debug(`SFTP: Inbound: Received VERSION (v${version})`);
      }
    }

    sftp._version = version;
    sftp._extensions = extensions;

    if (extensions['limits@openssh.com'] === '1') {
      return requestLimits(sftp, (err, limits) => {
        if (!err) {
          if (limits.maxPktLen > 0)
            sftp._maxOutPktLen = limits.maxPktLen;
          if (limits.maxReadLen > 0)
            sftp._maxReadLen = limits.maxReadLen;
          if (limits.maxWriteLen > 0)
            sftp._maxWriteLen = limits.maxWriteLen;
          sftp.maxOpenHandles = (
            limits.maxOpenHandles > 0 ? limits.maxOpenHandles : Infinity
          );
        }
        sftp.emit('ready');
      });
    }

    sftp.emit('ready');
  },
  [RESPONSE.STATUS]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      uint32     error/status code
      string     error message (ISO-10646 UTF-8)
      string     language tag
    */
    const errorCode = bufferParser.readUInt32BE();
    const errorMsg = bufferParser.readString(true);
    bufferParser.clear();

    // Note: we avoid checking that the error message and language tag are in
    // the packet because there are some broken implementations that incorrectly
    // omit them. The language tag in general was never really used amongst ssh
    // implementations, so in the case of a missing error message we just
    // default to something sensible.

    if (sftp._debug) {
      const jsonMsg = JSON.stringify(errorMsg);
      sftp._debug(
        `SFTP: Inbound: Received STATUS (id:${reqID}, ${errorCode}, ${jsonMsg})`
      );
    }
    const req = sftp._requests[reqID];
    delete sftp._requests[reqID];
    if (req && typeof req.cb === 'function') {
      if (errorCode === STATUS_CODE.OK) {
        req.cb();
        return;
      }
      const err = new Error(errorMsg
                            || STATUS_CODE_STR[errorCode]
                            || 'Unknown status');
      err.code = errorCode;
      req.cb(err);
    }
  },
  [RESPONSE.HANDLE]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     handle
    */
    const handle = bufferParser.readString();
    bufferParser.clear();

    if (handle === undefined) {
      if (reqID !== undefined)
        delete sftp._requests[reqID];
      return doFatalSFTPError(sftp, 'Malformed HANDLE packet');
    }

    sftp._debug && sftp._debug(`SFTP: Inbound: Received HANDLE (id:${reqID})`);

    const req = sftp._requests[reqID];
    delete sftp._requests[reqID];
    if (req && typeof req.cb === 'function')
      req.cb(undefined, handle);
  },
  [RESPONSE.DATA]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    let req;
    if (reqID !== undefined) {
      req = sftp._requests[reqID];
      delete sftp._requests[reqID];
    }
    /*
      string     data
    */
    if (req && typeof req.cb === 'function') {
      if (req.buffer) {
        // We have already pre-allocated space to store the data

        const nb = bufferParser.readString(req.buffer);
        bufferParser.clear();

        if (nb !== undefined) {
          sftp._debug && sftp._debug(
            `SFTP: Inbound: Received DATA (id:${reqID}, ${nb})`
          );
          req.cb(undefined, req.buffer, nb);
          return;
        }
      } else {
        const data = bufferParser.readString();
        bufferParser.clear();

        if (data !== undefined) {
          sftp._debug && sftp._debug(
            `SFTP: Inbound: Received DATA (id:${reqID}, ${data.length})`
          );
          req.cb(undefined, data);
          return;
        }
      }
    } else {
      const nb = bufferParser.skipString();
      bufferParser.clear();
      if (nb !== undefined) {
        sftp._debug && sftp._debug(
          `SFTP: Inbound: Received DATA (id:${reqID}, ${nb})`
        );
        return;
      }
    }

    return doFatalSFTPError(sftp, 'Malformed DATA packet');
  },
  [RESPONSE.NAME]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    let req;
    if (reqID !== undefined) {
      req = sftp._requests[reqID];
      delete sftp._requests[reqID];
    }
    /*
      uint32     count
      repeats count times:
              string     filename
              string     longname
              ATTRS      attrs
    */
    const count = bufferParser.readUInt32BE();
    if (count !== undefined) {
      let names = [];
      for (let i = 0; i < count; ++i) {
        // We are going to assume UTF-8 for filenames despite the SFTPv3
        // spec not specifying an encoding because the specs for newer
        // versions of the protocol all explicitly specify UTF-8 for
        // filenames
        const filename = bufferParser.readString(true);

        // `longname` only exists in SFTPv3 and since it typically will
        // contain the filename, we assume it is also UTF-8
        const longname = bufferParser.readString(true);

        const attrs = readAttrs(sftp._biOpt);
        if (attrs === undefined) {
          names = undefined;
          break;
        }
        names.push({ filename, longname, attrs });
      }
      if (names !== undefined) {
        sftp._debug && sftp._debug(
          `SFTP: Inbound: Received NAME (id:${reqID}, ${names.length})`
        );
        bufferParser.clear();
        if (req && typeof req.cb === 'function')
          req.cb(undefined, names);
        return;
      }
    }

    bufferParser.clear();
    return doFatalSFTPError(sftp, 'Malformed NAME packet');
  },
  [RESPONSE.ATTRS]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    let req;
    if (reqID !== undefined) {
      req = sftp._requests[reqID];
      delete sftp._requests[reqID];
    }
    /*
      ATTRS      attrs
    */
    const attrs = readAttrs(sftp._biOpt);
    bufferParser.clear();
    if (attrs !== undefined) {
      sftp._debug && sftp._debug(`SFTP: Inbound: Received ATTRS (id:${reqID})`);
      if (req && typeof req.cb === 'function')
        req.cb(undefined, attrs);
      return;
    }

    return doFatalSFTPError(sftp, 'Malformed ATTRS packet');
  },
  [RESPONSE.EXTENDED]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    if (reqID !== undefined) {
      const req = sftp._requests[reqID];
      if (req) {
        delete sftp._requests[reqID];
        switch (req.extended) {
          case 'statvfs@openssh.com':
          case 'fstatvfs@openssh.com': {
            /*
              uint64    f_bsize   // file system block size
              uint64    f_frsize  // fundamental fs block size
              uint64    f_blocks  // number of blocks (unit f_frsize)
              uint64    f_bfree   // free blocks in file system
              uint64    f_bavail  // free blocks for non-root
              uint64    f_files   // total file inodes
              uint64    f_ffree   // free file inodes
              uint64    f_favail  // free file inodes for to non-root
              uint64    f_fsid    // file system id
              uint64    f_flag    // bit mask of f_flag values
              uint64    f_namemax // maximum filename length
            */
            const biOpt = sftp._biOpt;
            const stats = {
              f_bsize: bufferParser.readUInt64BE(biOpt),
              f_frsize: bufferParser.readUInt64BE(biOpt),
              f_blocks: bufferParser.readUInt64BE(biOpt),
              f_bfree: bufferParser.readUInt64BE(biOpt),
              f_bavail: bufferParser.readUInt64BE(biOpt),
              f_files: bufferParser.readUInt64BE(biOpt),
              f_ffree: bufferParser.readUInt64BE(biOpt),
              f_favail: bufferParser.readUInt64BE(biOpt),
              f_sid: bufferParser.readUInt64BE(biOpt),
              f_flag: bufferParser.readUInt64BE(biOpt),
              f_namemax: bufferParser.readUInt64BE(biOpt),
            };
            if (stats.f_namemax === undefined)
              break;
            if (sftp._debug) {
              sftp._debug(
                'SFTP: Inbound: Received EXTENDED_REPLY '
                  + `(id:${reqID}, ${req.extended})`
              );
            }
            bufferParser.clear();
            if (typeof req.cb === 'function')
              req.cb(undefined, stats);
            return;
          }
          case 'limits@openssh.com': {
            /*
              uint64          max-packet-length
              uint64          max-read-length
              uint64          max-write-length
              uint64          max-open-handles
            */
            const limits = {
              maxPktLen: bufferParser.readUInt64BE(),
              maxReadLen: bufferParser.readUInt64BE(),
              maxWriteLen: bufferParser.readUInt64BE(),
              maxOpenHandles: bufferParser.readUInt64BE(),
            };
            if (limits.maxOpenHandles === undefined)
              break;
            if (sftp._debug) {
              sftp._debug(
                'SFTP: Inbound: Received EXTENDED_REPLY '
                  + `(id:${reqID}, ${req.extended})`
              );
            }
            bufferParser.clear();
            if (typeof req.cb === 'function')
              req.cb(undefined, limits);
            return;
          }
          default:
            // Unknown extended request
            sftp._debug && sftp._debug(
              `SFTP: Inbound: Received EXTENDED_REPLY (id:${reqID}, ???)`
            );
            bufferParser.clear();
            if (typeof req.cb === 'function')
              req.cb();
            return;
        }
      } else {
        sftp._debug && sftp._debug(
          `SFTP: Inbound: Received EXTENDED_REPLY (id:${reqID}, ???)`
        );
        bufferParser.clear();
        return;
      }
    }

    bufferParser.clear();
    return doFatalSFTPError(sftp, 'Malformed EXTENDED_REPLY packet');
  },
};
const SERVER_HANDLERS = {
  [REQUEST.INIT]: (sftp, payload) => {
    if (sftp._version !== -1)
      return doFatalSFTPError(sftp, 'Duplicate INIT packet');

    const extensions = {};

    /*
      uint32 version
      <extension data>
    */
    bufferParser.init(payload, 1);
    let version = bufferParser.readUInt32BE();
    while (bufferParser.avail()) {
      const extName = bufferParser.readString(true);
      const extData = bufferParser.readString(true);
      if (extData === undefined) {
        version = undefined;
        break;
      }
      extensions[extName] = extData;
    }
    bufferParser.clear();

    if (version === undefined)
      return doFatalSFTPError(sftp, 'Malformed INIT packet');

    if (sftp._debug) {
      const names = Object.keys(extensions);
      if (names.length) {
        sftp._debug(
          `SFTP: Inbound: Received INIT (v${version}, exts:${names})`
        );
      } else {
        sftp._debug(`SFTP: Inbound: Received INIT (v${version})`);
      }
    }

    sendOrBuffer(sftp, SERVER_VERSION_BUFFER);

    sftp._version = version;
    sftp._extensions = extensions;
    sftp.emit('ready');
  },
  [REQUEST.OPEN]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string        filename
      uint32        pflags
      ATTRS         attrs
    */
    const filename = bufferParser.readString(true);
    const pflags = bufferParser.readUInt32BE();
    const attrs = readAttrs(sftp._biOpt);
    bufferParser.clear();

    if (attrs === undefined)
      return doFatalSFTPError(sftp, 'Malformed OPEN packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received OPEN (id:${reqID})`);

    if (!sftp.emit('OPEN', reqID, filename, pflags, attrs)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.CLOSE]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string        handle
    */
    const handle = bufferParser.readString();
    bufferParser.clear();

    if (handle === undefined || handle.length > 256)
      return doFatalSFTPError(sftp, 'Malformed CLOSE packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received CLOSE (id:${reqID})`);

    if (!sftp.emit('CLOSE', reqID, handle)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.READ]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     handle
      uint64     offset
      uint32     len
    */
    const handle = bufferParser.readString();
    const offset = bufferParser.readUInt64BE(sftp._biOpt);
    const len = bufferParser.readUInt32BE();
    bufferParser.clear();

    if (len === undefined || handle.length > 256)
      return doFatalSFTPError(sftp, 'Malformed READ packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received READ (id:${reqID})`);

    if (!sftp.emit('READ', reqID, handle, offset, len)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.WRITE]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     handle
      uint64     offset
      string     data
    */
    const handle = bufferParser.readString();
    const offset = bufferParser.readUInt64BE(sftp._biOpt);
    const data = bufferParser.readString();
    bufferParser.clear();

    if (data === undefined || handle.length > 256)
      return doFatalSFTPError(sftp, 'Malformed WRITE packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received WRITE (id:${reqID})`);

    if (!sftp.emit('WRITE', reqID, handle, offset, data)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.LSTAT]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     path
    */
    const path = bufferParser.readString(true);
    bufferParser.clear();

    if (path === undefined)
      return doFatalSFTPError(sftp, 'Malformed LSTAT packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received LSTAT (id:${reqID})`);

    if (!sftp.emit('LSTAT', reqID, path)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.FSTAT]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string        handle
    */
    const handle = bufferParser.readString();
    bufferParser.clear();

    if (handle === undefined || handle.length > 256)
      return doFatalSFTPError(sftp, 'Malformed FSTAT packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received FSTAT (id:${reqID})`);

    if (!sftp.emit('FSTAT', reqID, handle)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.SETSTAT]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     path
      ATTRS      attrs
    */
    const path = bufferParser.readString(true);
    const attrs = readAttrs(sftp._biOpt);
    bufferParser.clear();

    if (attrs === undefined)
      return doFatalSFTPError(sftp, 'Malformed SETSTAT packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received SETSTAT (id:${reqID})`);

    if (!sftp.emit('SETSTAT', reqID, path, attrs)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.FSETSTAT]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     handle
      ATTRS      attrs
    */
    const handle = bufferParser.readString();
    const attrs = readAttrs(sftp._biOpt);
    bufferParser.clear();

    if (attrs === undefined || handle.length > 256)
      return doFatalSFTPError(sftp, 'Malformed FSETSTAT packet');

    sftp._debug && sftp._debug(
      `SFTP: Inbound: Received FSETSTAT (id:${reqID})`
    );

    if (!sftp.emit('FSETSTAT', reqID, handle, attrs)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.OPENDIR]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     path
    */
    const path = bufferParser.readString(true);
    bufferParser.clear();

    if (path === undefined)
      return doFatalSFTPError(sftp, 'Malformed OPENDIR packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received OPENDIR (id:${reqID})`);

    if (!sftp.emit('OPENDIR', reqID, path)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.READDIR]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string        handle
    */
    const handle = bufferParser.readString();
    bufferParser.clear();

    if (handle === undefined || handle.length > 256)
      return doFatalSFTPError(sftp, 'Malformed READDIR packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received READDIR (id:${reqID})`);

    if (!sftp.emit('READDIR', reqID, handle)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.REMOVE]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     path
    */
    const path = bufferParser.readString(true);
    bufferParser.clear();

    if (path === undefined)
      return doFatalSFTPError(sftp, 'Malformed REMOVE packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received REMOVE (id:${reqID})`);

    if (!sftp.emit('REMOVE', reqID, path)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.MKDIR]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     path
      ATTRS      attrs
    */
    const path = bufferParser.readString(true);
    const attrs = readAttrs(sftp._biOpt);
    bufferParser.clear();

    if (attrs === undefined)
      return doFatalSFTPError(sftp, 'Malformed MKDIR packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received MKDIR (id:${reqID})`);

    if (!sftp.emit('MKDIR', reqID, path, attrs)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.RMDIR]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     path
    */
    const path = bufferParser.readString(true);
    bufferParser.clear();

    if (path === undefined)
      return doFatalSFTPError(sftp, 'Malformed RMDIR packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received RMDIR (id:${reqID})`);

    if (!sftp.emit('RMDIR', reqID, path)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.REALPATH]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     path
    */
    const path = bufferParser.readString(true);
    bufferParser.clear();

    if (path === undefined)
      return doFatalSFTPError(sftp, 'Malformed REALPATH packet');

    sftp._debug && sftp._debug(
      `SFTP: Inbound: Received REALPATH (id:${reqID})`
    );

    if (!sftp.emit('REALPATH', reqID, path)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.STAT]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     path
    */
    const path = bufferParser.readString(true);
    bufferParser.clear();

    if (path === undefined)
      return doFatalSFTPError(sftp, 'Malformed STAT packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received STAT (id:${reqID})`);

    if (!sftp.emit('STAT', reqID, path)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.RENAME]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     oldpath
      string     newpath
    */
    const oldPath = bufferParser.readString(true);
    const newPath = bufferParser.readString(true);
    bufferParser.clear();

    if (newPath === undefined)
      return doFatalSFTPError(sftp, 'Malformed RENAME packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received RENAME (id:${reqID})`);

    if (!sftp.emit('RENAME', reqID, oldPath, newPath)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.READLINK]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     path
    */
    const path = bufferParser.readString(true);
    bufferParser.clear();

    if (path === undefined)
      return doFatalSFTPError(sftp, 'Malformed READLINK packet');

    sftp._debug && sftp._debug(
      `SFTP: Inbound: Received READLINK (id:${reqID})`
    );

    if (!sftp.emit('READLINK', reqID, path)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.SYMLINK]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     linkpath
      string     targetpath
    */
    const linkPath = bufferParser.readString(true);
    const targetPath = bufferParser.readString(true);
    bufferParser.clear();

    if (targetPath === undefined)
      return doFatalSFTPError(sftp, 'Malformed SYMLINK packet');

    sftp._debug && sftp._debug(`SFTP: Inbound: Received SYMLINK (id:${reqID})`);

    let handled;
    if (sftp._isOpenSSH) {
      // OpenSSH has linkpath and targetpath positions switched
      handled = sftp.emit('SYMLINK', reqID, targetPath, linkPath);
    } else {
      handled = sftp.emit('SYMLINK', reqID, linkPath, targetPath);
    }
    if (!handled) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
  [REQUEST.EXTENDED]: (sftp, payload) => {
    bufferParser.init(payload, 1);
    const reqID = bufferParser.readUInt32BE();
    /*
      string     extended-request
      ... any request-specific data ...
    */
    const extName = bufferParser.readString(true);
    if (extName === undefined) {
      bufferParser.clear();
      return doFatalSFTPError(sftp, 'Malformed EXTENDED packet');
    }

    let extData;
    if (bufferParser.avail())
      extData = bufferParser.readRaw();
    bufferParser.clear();

    sftp._debug && sftp._debug(
      `SFTP: Inbound: Received EXTENDED (id:${reqID})`
    );

    if (!sftp.emit('EXTENDED', reqID, extName, extData)) {
      // Automatically reject request if no handler for request type
      sftp.status(reqID, STATUS_CODE.OP_UNSUPPORTED);
    }
  },
};

// =============================================================================
// ReadStream/WriteStream-related ==============================================
// =============================================================================
const {
  ERR_INVALID_ARG_TYPE,
  ERR_OUT_OF_RANGE,
  validateNumber
} = __nccwpck_require__(7609);

const kMinPoolSpace = 128;

let pool;
// It can happen that we expect to read a large chunk of data, and reserve
// a large chunk of the pool accordingly, but the read() call only filled
// a portion of it. If a concurrently executing read() then uses the same pool,
// the "reserved" portion cannot be used, so we allow it to be re-used as a
// new pool later.
const poolFragments = [];

function allocNewPool(poolSize) {
  if (poolFragments.length > 0)
    pool = poolFragments.pop();
  else
    pool = Buffer.allocUnsafe(poolSize);
  pool.used = 0;
}

// Check the `this.start` and `this.end` of stream.
function checkPosition(pos, name) {
  if (!Number.isSafeInteger(pos)) {
    validateNumber(pos, name);
    if (!Number.isInteger(pos))
      throw new ERR_OUT_OF_RANGE(name, 'an integer', pos);
    throw new ERR_OUT_OF_RANGE(name, '>= 0 and <= 2 ** 53 - 1', pos);
  }
  if (pos < 0)
    throw new ERR_OUT_OF_RANGE(name, '>= 0 and <= 2 ** 53 - 1', pos);
}

function roundUpToMultipleOf8(n) {
  return (n + 7) & ~7;  // Align to 8 byte boundary.
}

function ReadStream(sftp, path, options) {
  if (options === undefined)
    options = {};
  else if (typeof options === 'string')
    options = { encoding: options };
  else if (options === null || typeof options !== 'object')
    throw new TypeError('"options" argument must be a string or an object');
  else
    options = Object.create(options);

  // A little bit bigger buffer and water marks by default
  if (options.highWaterMark === undefined)
    options.highWaterMark = 64 * 1024;

  // For backwards compat do not emit close on destroy.
  options.emitClose = false;
  options.autoDestroy = false; // Node 14 major change.

  ReadableStream.call(this, options);

  this.path = path;
  this.flags = options.flags === undefined ? 'r' : options.flags;
  this.mode = options.mode === undefined ? 0o666 : options.mode;

  this.start = options.start;
  this.end = options.end;
  this.autoClose = options.autoClose === undefined ? true : options.autoClose;
  this.pos = 0;
  this.bytesRead = 0;
  this.closed = false;

  this.handle = options.handle === undefined ? null : options.handle;
  this.sftp = sftp;
  this._opening = false;

  if (this.start !== undefined) {
    checkPosition(this.start, 'start');

    this.pos = this.start;
  }

  if (this.end === undefined) {
    this.end = Infinity;
  } else if (this.end !== Infinity) {
    checkPosition(this.end, 'end');

    if (this.start !== undefined && this.start > this.end) {
      throw new ERR_OUT_OF_RANGE(
        'start',
        `<= "end" (here: ${this.end})`,
        this.start
      );
    }
  }

  this.on('end', function() {
    if (this.autoClose)
      this.destroy();
  });

  if (!Buffer.isBuffer(this.handle))
    this.open();
}
inherits(ReadStream, ReadableStream);

ReadStream.prototype.open = function() {
  if (this._opening)
    return;

  this._opening = true;

  this.sftp.open(this.path, this.flags, this.mode, (er, handle) => {
    this._opening = false;

    if (er) {
      this.emit('error', er);
      if (this.autoClose)
        this.destroy();
      return;
    }

    this.handle = handle;
    this.emit('open', handle);
    this.emit('ready');
    // Start the flow of data.
    this.read();
  });
};

ReadStream.prototype._read = function(n) {
  if (!Buffer.isBuffer(this.handle))
    return this.once('open', () => this._read(n));

  // XXX: safe to remove this?
  if (this.destroyed)
    return;

  if (!pool || pool.length - pool.used < kMinPoolSpace) {
    // Discard the old pool.
    allocNewPool(this.readableHighWaterMark
                 || this._readableState.highWaterMark);
  }

  // Grab another reference to the pool in the case that while we're
  // in the thread pool another read() finishes up the pool, and
  // allocates a new one.
  const thisPool = pool;
  let toRead = Math.min(pool.length - pool.used, n);
  const start = pool.used;

  if (this.end !== undefined)
    toRead = Math.min(this.end - this.pos + 1, toRead);

  // Already read everything we were supposed to read!
  // treat as EOF.
  if (toRead <= 0)
    return this.push(null);

  // the actual read.
  this.sftp.read(this.handle,
                 pool,
                 pool.used,
                 toRead,
                 this.pos,
                 (er, bytesRead) => {
    if (er) {
      this.emit('error', er);
      if (this.autoClose)
        this.destroy();
      return;
    }
    let b = null;

    // Now that we know how much data we have actually read, re-wind the
    // 'used' field if we can, and otherwise allow the remainder of our
    // reservation to be used as a new pool later.
    if (start + toRead === thisPool.used && thisPool === pool) {
      thisPool.used = roundUpToMultipleOf8(thisPool.used + bytesRead - toRead);
    } else {
      // Round down to the next lowest multiple of 8 to ensure the new pool
      // fragment start and end positions are aligned to an 8 byte boundary.
      const alignedEnd = (start + toRead) & ~7;
      const alignedStart = roundUpToMultipleOf8(start + bytesRead);
      if (alignedEnd - alignedStart >= kMinPoolSpace)
        poolFragments.push(thisPool.slice(alignedStart, alignedEnd));
    }

    if (bytesRead > 0) {
      this.bytesRead += bytesRead;
      b = thisPool.slice(start, start + bytesRead);
    }

    // Move the pool positions, and internal position for reading.
    this.pos += bytesRead;

    this.push(b);
  });

  pool.used = roundUpToMultipleOf8(pool.used + toRead);
};

ReadStream.prototype._destroy = function(err, cb) {
  if (this._opening && !Buffer.isBuffer(this.handle)) {
    this.once('open', closeStream.bind(null, this, cb, err));
    return;
  }

  closeStream(this, cb, err);
  this.handle = null;
  this._opening = false;
};

function closeStream(stream, cb, err) {
  if (!stream.handle)
    return onclose();

  stream.sftp.close(stream.handle, onclose);

  function onclose(er) {
    er = er || err;
    cb(er);
    stream.closed = true;
    if (!er)
      stream.emit('close');
  }
}

ReadStream.prototype.close = function(cb) {
  this.destroy(null, cb);
};

Object.defineProperty(ReadStream.prototype, 'pending', {
  get() {
    return this.handle === null;
  },
  configurable: true
});

// TODO: add `concurrency` setting to allow more than one in-flight WRITE
// request to server to improve throughput
function WriteStream(sftp, path, options) {
  if (options === undefined)
    options = {};
  else if (typeof options === 'string')
    options = { encoding: options };
  else if (options === null || typeof options !== 'object')
    throw new TypeError('"options" argument must be a string or an object');
  else
    options = Object.create(options);

  // For backwards compat do not emit close on destroy.
  options.emitClose = false;
  options.autoDestroy = false; // Node 14 major change.

  WritableStream.call(this, options);

  this.path = path;
  this.flags = options.flags === undefined ? 'w' : options.flags;
  this.mode = options.mode === undefined ? 0o666 : options.mode;

  this.start = options.start;
  this.autoClose = options.autoClose === undefined ? true : options.autoClose;
  this.pos = 0;
  this.bytesWritten = 0;
  this.closed = false;

  this.handle = options.handle === undefined ? null : options.handle;
  this.sftp = sftp;
  this._opening = false;

  if (this.start !== undefined) {
    checkPosition(this.start, 'start');

    this.pos = this.start;
  }

  if (options.encoding)
    this.setDefaultEncoding(options.encoding);

  // Node v6.x only
  this.on('finish', function() {
    if (this._writableState.finalCalled)
      return;
    if (this.autoClose)
      this.destroy();
  });

  if (!Buffer.isBuffer(this.handle))
    this.open();
}
inherits(WriteStream, WritableStream);

WriteStream.prototype._final = function(cb) {
  if (this.autoClose)
    this.destroy();
  cb();
};

WriteStream.prototype.open = function() {
  if (this._opening)
    return;

  this._opening = true;

  this.sftp.open(this.path, this.flags, this.mode, (er, handle) => {
    this._opening = false;

    if (er) {
      this.emit('error', er);
      if (this.autoClose)
        this.destroy();
      return;
    }

    this.handle = handle;

    const tryAgain = (err) => {
      if (err) {
        // Try chmod() for sftp servers that may not support fchmod() for
        // whatever reason
        this.sftp.chmod(this.path, this.mode, (err_) => tryAgain());
        return;
      }

      // SFTPv3 requires absolute offsets, no matter the open flag used
      if (this.flags[0] === 'a') {
        const tryStat = (err, st) => {
          if (err) {
            // Try stat() for sftp servers that may not support fstat() for
            // whatever reason
            this.sftp.stat(this.path, (err_, st_) => {
              if (err_) {
                this.destroy();
                this.emit('error', err);
                return;
              }
              tryStat(null, st_);
            });
            return;
          }

          this.pos = st.size;
          this.emit('open', handle);
          this.emit('ready');
        };

        this.sftp.fstat(handle, tryStat);
        return;
      }

      this.emit('open', handle);
      this.emit('ready');
    };

    this.sftp.fchmod(handle, this.mode, tryAgain);
  });
};

WriteStream.prototype._write = function(data, encoding, cb) {
  if (!Buffer.isBuffer(data)) {
    const err = new ERR_INVALID_ARG_TYPE('data', 'Buffer', data);
    return this.emit('error', err);
  }

  if (!Buffer.isBuffer(this.handle)) {
    return this.once('open', function() {
      this._write(data, encoding, cb);
    });
  }

  this.sftp.write(this.handle,
                  data,
                  0,
                  data.length,
                  this.pos,
                  (er, bytes) => {
    if (er) {
      if (this.autoClose)
        this.destroy();
      return cb(er);
    }
    this.bytesWritten += bytes;
    cb();
  });

  this.pos += data.length;
};

WriteStream.prototype._writev = function(data, cb) {
  if (!Buffer.isBuffer(this.handle)) {
    return this.once('open', function() {
      this._writev(data, cb);
    });
  }

  const sftp = this.sftp;
  const handle = this.handle;
  let writesLeft = data.length;

  const onwrite = (er, bytes) => {
    if (er) {
      this.destroy();
      return cb(er);
    }
    this.bytesWritten += bytes;
    if (--writesLeft === 0)
      cb();
  };

  // TODO: try to combine chunks to reduce number of requests to the server?
  for (let i = 0; i < data.length; ++i) {
    const chunk = data[i].chunk;

    sftp.write(handle, chunk, 0, chunk.length, this.pos, onwrite);
    this.pos += chunk.length;
  }
};

if (typeof WritableStream.prototype.destroy !== 'function')
  WriteStream.prototype.destroy = ReadStream.prototype.destroy;

WriteStream.prototype._destroy = ReadStream.prototype._destroy;
WriteStream.prototype.close = function(cb) {
  if (cb) {
    if (this.closed) {
      process.nextTick(cb);
      return;
    }
    this.on('close', cb);
  }

  // If we are not autoClosing, we should call
  // destroy on 'finish'.
  if (!this.autoClose)
    this.on('finish', this.destroy.bind(this));

  this.end();
};

// There is no shutdown() for files.
WriteStream.prototype.destroySoon = WriteStream.prototype.end;

Object.defineProperty(WriteStream.prototype, 'pending', {
  get() {
    return this.handle === null;
  },
  configurable: true
});
// =============================================================================

module.exports = {
  flagsToString,
  OPEN_MODE,
  SFTP,
  Stats,
  STATUS_CODE,
  stringToFlags,
};


/***/ }),

/***/ 6832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const crypto = __nccwpck_require__(6417);

let cpuInfo;
try {
  cpuInfo = __nccwpck_require__(4137)();
} catch {}

const { bindingAvailable, CIPHER_INFO, MAC_INFO } = __nccwpck_require__(5708);

const eddsaSupported = (() => {
  if (typeof crypto.sign === 'function'
      && typeof crypto.verify === 'function') {
    const key =
      '-----BEGIN PRIVATE KEY-----\r\nMC4CAQAwBQYDK2VwBCIEIHKj+sVa9WcD'
      + '/q2DJUJaf43Kptc8xYuUQA4bOFj9vC8T\r\n-----END PRIVATE KEY-----';
    const data = Buffer.from('a');
    let sig;
    let verified;
    try {
      sig = crypto.sign(null, data, key);
      verified = crypto.verify(null, data, key, sig);
    } catch {}
    return (Buffer.isBuffer(sig) && sig.length === 64 && verified === true);
  }

  return false;
})();

const curve25519Supported = (typeof crypto.diffieHellman === 'function'
                             && typeof crypto.generateKeyPairSync === 'function'
                             && typeof crypto.createPublicKey === 'function');

const DEFAULT_KEX = [
  // https://tools.ietf.org/html/rfc5656#section-10.1
  'ecdh-sha2-nistp256',
  'ecdh-sha2-nistp384',
  'ecdh-sha2-nistp521',

  // https://tools.ietf.org/html/rfc4419#section-4
  'diffie-hellman-group-exchange-sha256',

  // https://tools.ietf.org/html/rfc8268
  'diffie-hellman-group14-sha256',
  'diffie-hellman-group15-sha512',
  'diffie-hellman-group16-sha512',
  'diffie-hellman-group17-sha512',
  'diffie-hellman-group18-sha512',
];
if (curve25519Supported) {
  DEFAULT_KEX.unshift('curve25519-sha256');
  DEFAULT_KEX.unshift('curve25519-sha256@libssh.org');
}
const SUPPORTED_KEX = DEFAULT_KEX.concat([
  // https://tools.ietf.org/html/rfc4419#section-4
  'diffie-hellman-group-exchange-sha1',

  'diffie-hellman-group14-sha1', // REQUIRED
  'diffie-hellman-group1-sha1',  // REQUIRED
]);


const DEFAULT_SERVER_HOST_KEY = [
  'ecdsa-sha2-nistp256',
  'ecdsa-sha2-nistp384',
  'ecdsa-sha2-nistp521',
  'rsa-sha2-512', // RFC 8332
  'rsa-sha2-256', // RFC 8332
  'ssh-rsa',
];
if (eddsaSupported)
  DEFAULT_SERVER_HOST_KEY.unshift('ssh-ed25519');
const SUPPORTED_SERVER_HOST_KEY = DEFAULT_SERVER_HOST_KEY.concat([
  'ssh-dss',
]);


const canUseCipher = (() => {
  const ciphers = crypto.getCiphers();
  return (name) => ciphers.includes(CIPHER_INFO[name].sslName);
})();
let DEFAULT_CIPHER = [
  // http://tools.ietf.org/html/rfc5647
  'aes128-gcm@openssh.com',
  'aes256-gcm@openssh.com',

  // http://tools.ietf.org/html/rfc4344#section-4
  'aes128-ctr',
  'aes192-ctr',
  'aes256-ctr',
];
if (cpuInfo && cpuInfo.flags && !cpuInfo.flags.aes) {
  // We know for sure the CPU does not support AES acceleration
  if (bindingAvailable)
    DEFAULT_CIPHER.unshift('chacha20-poly1305@openssh.com');
  else
    DEFAULT_CIPHER.push('chacha20-poly1305@openssh.com');
} else if (bindingAvailable && cpuInfo && cpuInfo.arch === 'x86') {
  // Places chacha20-poly1305 immediately after GCM ciphers since GCM ciphers
  // seem to outperform it on x86, but it seems to be faster than CTR ciphers
  DEFAULT_CIPHER.splice(4, 0, 'chacha20-poly1305@openssh.com');
} else {
  DEFAULT_CIPHER.push('chacha20-poly1305@openssh.com');
}
DEFAULT_CIPHER = DEFAULT_CIPHER.filter(canUseCipher);
const SUPPORTED_CIPHER = DEFAULT_CIPHER.concat([
  'aes256-cbc',
  'aes192-cbc',
  'aes128-cbc',
  'blowfish-cbc',
  '3des-cbc',
  'aes128-gcm',
  'aes256-gcm',

  // http://tools.ietf.org/html/rfc4345#section-4:
  'arcfour256',
  'arcfour128',

  'cast128-cbc',
  'arcfour',
].filter(canUseCipher));


const canUseMAC = (() => {
  const hashes = crypto.getHashes();
  return (name) => hashes.includes(MAC_INFO[name].sslName);
})();
const DEFAULT_MAC = [
  'hmac-sha2-256-etm@openssh.com',
  'hmac-sha2-512-etm@openssh.com',
  'hmac-sha1-etm@openssh.com',
  'hmac-sha2-256',
  'hmac-sha2-512',
  'hmac-sha1',
].filter(canUseMAC);
const SUPPORTED_MAC = DEFAULT_MAC.concat([
  'hmac-md5',
  'hmac-sha2-256-96', // first 96 bits of HMAC-SHA256
  'hmac-sha2-512-96', // first 96 bits of HMAC-SHA512
  'hmac-ripemd160',
  'hmac-sha1-96',     // first 96 bits of HMAC-SHA1
  'hmac-md5-96',      // first 96 bits of HMAC-MD5
].filter(canUseMAC));

const DEFAULT_COMPRESSION = [
  'none',
  'zlib@openssh.com', // ZLIB (LZ77) compression, except
                      // compression/decompression does not start until after
                      // successful user authentication
  'zlib',             // ZLIB (LZ77) compression
];
const SUPPORTED_COMPRESSION = DEFAULT_COMPRESSION.concat([
]);


const COMPAT = {
  BAD_DHGEX: 1 << 0,
  OLD_EXIT: 1 << 1,
  DYN_RPORT_BUG: 1 << 2,
  BUG_DHGEX_LARGE: 1 << 3,
};

module.exports = {
  MESSAGE: {
    // Transport layer protocol -- generic (1-19)
    DISCONNECT: 1,
    IGNORE: 2,
    UNIMPLEMENTED: 3,
    DEBUG: 4,
    SERVICE_REQUEST: 5,
    SERVICE_ACCEPT: 6,

    // Transport layer protocol -- algorithm negotiation (20-29)
    KEXINIT: 20,
    NEWKEYS: 21,

    // Transport layer protocol -- key exchange method-specific (30-49)
    KEXDH_INIT: 30,
    KEXDH_REPLY: 31,

    KEXDH_GEX_GROUP: 31,
    KEXDH_GEX_INIT: 32,
    KEXDH_GEX_REPLY: 33,
    KEXDH_GEX_REQUEST: 34,

    KEXECDH_INIT: 30,
    KEXECDH_REPLY: 31,

    // User auth protocol -- generic (50-59)
    USERAUTH_REQUEST: 50,
    USERAUTH_FAILURE: 51,
    USERAUTH_SUCCESS: 52,
    USERAUTH_BANNER: 53,

    // User auth protocol -- user auth method-specific (60-79)
    USERAUTH_PASSWD_CHANGEREQ: 60,

    USERAUTH_PK_OK: 60,

    USERAUTH_INFO_REQUEST: 60,
    USERAUTH_INFO_RESPONSE: 61,

    // Connection protocol -- generic (80-89)
    GLOBAL_REQUEST: 80,
    REQUEST_SUCCESS: 81,
    REQUEST_FAILURE: 82,

    // Connection protocol -- channel-related (90-127)
    CHANNEL_OPEN: 90,
    CHANNEL_OPEN_CONFIRMATION: 91,
    CHANNEL_OPEN_FAILURE: 92,
    CHANNEL_WINDOW_ADJUST: 93,
    CHANNEL_DATA: 94,
    CHANNEL_EXTENDED_DATA: 95,
    CHANNEL_EOF: 96,
    CHANNEL_CLOSE: 97,
    CHANNEL_REQUEST: 98,
    CHANNEL_SUCCESS: 99,
    CHANNEL_FAILURE: 100

    // Reserved for client protocols (128-191)

    // Local extensions (192-155)
  },
  DISCONNECT_REASON: {
    HOST_NOT_ALLOWED_TO_CONNECT: 1,
    PROTOCOL_ERROR: 2,
    KEY_EXCHANGE_FAILED: 3,
    RESERVED: 4,
    MAC_ERROR: 5,
    COMPRESSION_ERROR: 6,
    SERVICE_NOT_AVAILABLE: 7,
    PROTOCOL_VERSION_NOT_SUPPORTED: 8,
    HOST_KEY_NOT_VERIFIABLE: 9,
    CONNECTION_LOST: 10,
    BY_APPLICATION: 11,
    TOO_MANY_CONNECTIONS: 12,
    AUTH_CANCELED_BY_USER: 13,
    NO_MORE_AUTH_METHODS_AVAILABLE: 14,
    ILLEGAL_USER_NAME: 15,
  },
  DISCONNECT_REASON_STR: undefined,
  CHANNEL_OPEN_FAILURE: {
    ADMINISTRATIVELY_PROHIBITED: 1,
    CONNECT_FAILED: 2,
    UNKNOWN_CHANNEL_TYPE: 3,
    RESOURCE_SHORTAGE: 4
  },
  TERMINAL_MODE: {
    TTY_OP_END: 0,        // Indicates end of options.
    VINTR: 1,             // Interrupt character; 255 if none. Similarly for the
                          //  other characters.  Not all of these characters are
                          //  supported on all systems.
    VQUIT: 2,             // The quit character (sends SIGQUIT signal on POSIX
                          //  systems).
    VERASE: 3,            // Erase the character to left of the cursor.
    VKILL: 4,             // Kill the current input line.
    VEOF: 5,              // End-of-file character (sends EOF from the
                          //  terminal).
    VEOL: 6,              // End-of-line character in addition to carriage
                          //  return and/or linefeed.
    VEOL2: 7,             // Additional end-of-line character.
    VSTART: 8,            // Continues paused output (normally control-Q).
    VSTOP: 9,             // Pauses output (normally control-S).
    VSUSP: 10,            // Suspends the current program.
    VDSUSP: 11,           // Another suspend character.
    VREPRINT: 12,         // Reprints the current input line.
    VWERASE: 13,          // Erases a word left of cursor.
    VLNEXT: 14,           // Enter the next character typed literally, even if
                          //  it is a special character
    VFLUSH: 15,           // Character to flush output.
    VSWTCH: 16,           // Switch to a different shell layer.
    VSTATUS: 17,          // Prints system status line (load, command, pid,
                          //  etc).
    VDISCARD: 18,         // Toggles the flushing of terminal output.
    IGNPAR: 30,           // The ignore parity flag.  The parameter SHOULD be 0
                          //  if this flag is FALSE, and 1 if it is TRUE.
    PARMRK: 31,           // Mark parity and framing errors.
    INPCK: 32,            // Enable checking of parity errors.
    ISTRIP: 33,           // Strip 8th bit off characters.
    INLCR: 34,            // Map NL into CR on input.
    IGNCR: 35,            // Ignore CR on input.
    ICRNL: 36,            // Map CR to NL on input.
    IUCLC: 37,            // Translate uppercase characters to lowercase.
    IXON: 38,             // Enable output flow control.
    IXANY: 39,            // Any char will restart after stop.
    IXOFF: 40,            // Enable input flow control.
    IMAXBEL: 41,          // Ring bell on input queue full.
    ISIG: 50,             // Enable signals INTR, QUIT, [D]SUSP.
    ICANON: 51,           // Canonicalize input lines.
    XCASE: 52,            // Enable input and output of uppercase characters by
                          //  preceding their lowercase equivalents with "\".
    ECHO: 53,             // Enable echoing.
    ECHOE: 54,            // Visually erase chars.
    ECHOK: 55,            // Kill character discards current line.
    ECHONL: 56,           // Echo NL even if ECHO is off.
    NOFLSH: 57,           // Don't flush after interrupt.
    TOSTOP: 58,           // Stop background jobs from output.
    IEXTEN: 59,           // Enable extensions.
    ECHOCTL: 60,          // Echo control characters as ^(Char).
    ECHOKE: 61,           // Visual erase for line kill.
    PENDIN: 62,           // Retype pending input.
    OPOST: 70,            // Enable output processing.
    OLCUC: 71,            // Convert lowercase to uppercase.
    ONLCR: 72,            // Map NL to CR-NL.
    OCRNL: 73,            // Translate carriage return to newline (output).
    ONOCR: 74,            // Translate newline to carriage return-newline
                          //  (output).
    ONLRET: 75,           // Newline performs a carriage return (output).
    CS7: 90,              // 7 bit mode.
    CS8: 91,              // 8 bit mode.
    PARENB: 92,           // Parity enable.
    PARODD: 93,           // Odd parity, else even.
    TTY_OP_ISPEED: 128,   // Specifies the input baud rate in bits per second.
    TTY_OP_OSPEED: 129,   // Specifies the output baud rate in bits per second.
  },
  CHANNEL_EXTENDED_DATATYPE: {
    STDERR: 1,
  },

  SIGNALS: [
    'ABRT', 'ALRM', 'FPE', 'HUP', 'ILL', 'INT', 'QUIT', 'SEGV', 'TERM', 'USR1',
    'USR2', 'KILL', 'PIPE'
  ].reduce((cur, val) => ({ ...cur, [val]: 1 }), {}),

  COMPAT,
  COMPAT_CHECKS: [
    [ 'Cisco-1.25', COMPAT.BAD_DHGEX ],
    [ /^Cisco-1\./, COMPAT.BUG_DHGEX_LARGE ],
    [ /^[0-9.]+$/, COMPAT.OLD_EXIT ], // old SSH.com implementations
    [ /^OpenSSH_5\.\d+/, COMPAT.DYN_RPORT_BUG ],
  ],

  // KEX proposal-related
  DEFAULT_KEX,
  SUPPORTED_KEX,
  DEFAULT_SERVER_HOST_KEY,
  SUPPORTED_SERVER_HOST_KEY,
  DEFAULT_CIPHER,
  SUPPORTED_CIPHER,
  DEFAULT_MAC,
  SUPPORTED_MAC,
  DEFAULT_COMPRESSION,
  SUPPORTED_COMPRESSION,

  curve25519Supported,
  eddsaSupported,
};

module.exports.DISCONNECT_REASON_BY_VALUE =
  Array.from(Object.entries(module.exports.DISCONNECT_REASON))
       .reduce((obj, [key, value]) => ({ ...obj, [value]: key }), {});


/***/ }),

/***/ 5708:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// TODO:
//    * make max packet size configurable
//    * if decompression is enabled, use `._packet` in decipher instances as
//      input to (sync) zlib inflater with appropriate offset and length to
//      avoid an additional copy of payload data before inflation
//    * factor decompression status into packet length checks


const {
  createCipheriv, createDecipheriv, createHmac, randomFillSync, timingSafeEqual
} = __nccwpck_require__(6417);

const { readUInt32BE, writeUInt32BE } = __nccwpck_require__(9475);

const FastBuffer = Buffer[Symbol.species];
const MAX_SEQNO = 2 ** 32 - 1;
const EMPTY_BUFFER = Buffer.alloc(0);
const BUF_INT = Buffer.alloc(4);
const DISCARD_CACHE = new Map();
const MAX_PACKET_SIZE = 35000;

let binding;
let AESGCMCipher;
let ChaChaPolyCipher;
let GenericCipher;
let AESGCMDecipher;
let ChaChaPolyDecipher;
let GenericDecipher;
try {
  binding = __nccwpck_require__(9041);
  ({ AESGCMCipher, ChaChaPolyCipher, GenericCipher,
     AESGCMDecipher, ChaChaPolyDecipher, GenericDecipher } = binding);
} catch {}

const CIPHER_STREAM = 1 << 0;
const CIPHER_INFO = (() => {
  function info(sslName, blockLen, keyLen, ivLen, authLen, discardLen, flags) {
    return {
      sslName,
      blockLen,
      keyLen,
      ivLen: (ivLen !== 0 || (flags & CIPHER_STREAM)
              ? ivLen
              : blockLen),
      authLen,
      discardLen,
      stream: !!(flags & CIPHER_STREAM),
    };
  }

  return {
    'chacha20-poly1305@openssh.com':
      info('chacha20', 8, 64, 0, 16, 0, CIPHER_STREAM),

    'aes128-gcm': info('aes-128-gcm', 16, 16, 12, 16, 0, CIPHER_STREAM),
    'aes256-gcm': info('aes-256-gcm', 16, 32, 12, 16, 0, CIPHER_STREAM),
    'aes128-gcm@openssh.com':
      info('aes-128-gcm', 16, 16, 12, 16, 0, CIPHER_STREAM),
    'aes256-gcm@openssh.com':
      info('aes-256-gcm', 16, 32, 12, 16, 0, CIPHER_STREAM),

    'aes128-cbc': info('aes-128-cbc', 16, 16, 0, 0, 0, 0),
    'aes192-cbc': info('aes-192-cbc', 16, 24, 0, 0, 0, 0),
    'aes256-cbc': info('aes-256-cbc', 16, 32, 0, 0, 0, 0),
    'rijndael-cbc@lysator.liu.se': info('aes-256-cbc', 16, 32, 0, 0, 0, 0),
    '3des-cbc': info('des-ede3-cbc', 8, 24, 0, 0, 0, 0),
    'blowfish-cbc': info('bf-cbc', 8, 16, 0, 0, 0, 0),
    'idea-cbc': info('idea-cbc', 8, 16, 0, 0, 0, 0),
    'cast128-cbc': info('cast-cbc', 8, 16, 0, 0, 0, 0),

    'aes128-ctr': info('aes-128-ctr', 16, 16, 16, 0, 0, CIPHER_STREAM),
    'aes192-ctr': info('aes-192-ctr', 16, 24, 16, 0, 0, CIPHER_STREAM),
    'aes256-ctr': info('aes-256-ctr', 16, 32, 16, 0, 0, CIPHER_STREAM),
    '3des-ctr': info('des-ede3', 8, 24, 8, 0, 0, CIPHER_STREAM),
    'blowfish-ctr': info('bf-ecb', 8, 16, 8, 0, 0, CIPHER_STREAM),
    'cast128-ctr': info('cast5-ecb', 8, 16, 8, 0, 0, CIPHER_STREAM),

    /* The "arcfour128" algorithm is the RC4 cipher, as described in
       [SCHNEIER], using a 128-bit key.  The first 1536 bytes of keystream
       generated by the cipher MUST be discarded, and the first byte of the
       first encrypted packet MUST be encrypted using the 1537th byte of
       keystream.

       -- http://tools.ietf.org/html/rfc4345#section-4 */
    'arcfour': info('rc4', 8, 16, 0, 0, 1536, CIPHER_STREAM),
    'arcfour128': info('rc4', 8, 16, 0, 0, 1536, CIPHER_STREAM),
    'arcfour256': info('rc4', 8, 32, 0, 0, 1536, CIPHER_STREAM),
    'arcfour512': info('rc4', 8, 64, 0, 0, 1536, CIPHER_STREAM),
  };
})();

const MAC_INFO = (() => {
  function info(sslName, len, actualLen, isETM) {
    return {
      sslName,
      len,
      actualLen,
      isETM,
    };
  }

  return {
    'hmac-md5': info('md5', 16, 16, false),
    'hmac-md5-96': info('md5', 16, 12, false),
    'hmac-ripemd160': info('ripemd160', 20, 20, false),
    'hmac-sha1': info('sha1', 20, 20, false),
    'hmac-sha1-etm@openssh.com': info('sha1', 20, 20, true),
    'hmac-sha1-96': info('sha1', 20, 12, false),
    'hmac-sha2-256': info('sha256', 32, 32, false),
    'hmac-sha2-256-etm@openssh.com': info('sha256', 32, 32, true),
    'hmac-sha2-256-96': info('sha256', 32, 12, false),
    'hmac-sha2-512': info('sha512', 64, 64, false),
    'hmac-sha2-512-etm@openssh.com': info('sha512', 64, 64, true),
    'hmac-sha2-512-96': info('sha512', 64, 12, false),
  };
})();


// Should only_be used during the initial handshake
class NullCipher {
  constructor(seqno, onWrite) {
    this.outSeqno = seqno;
    this._onWrite = onWrite;
    this._dead = false;
  }
  free() {
    this._dead = true;
  }
  allocPacket(payloadLen) {
    let pktLen = 4 + 1 + payloadLen;
    let padLen = 8 - (pktLen & (8 - 1));
    if (padLen < 4)
      padLen += 8;
    pktLen += padLen;

    const packet = Buffer.allocUnsafe(pktLen);

    writeUInt32BE(packet, pktLen - 4, 0);
    packet[4] = padLen;

    randomFillSync(packet, 5 + payloadLen, padLen);

    return packet;
  }
  encrypt(packet) {
    // `packet` === unencrypted packet

    if (this._dead)
      return;

    this._onWrite(packet);

    this.outSeqno = (this.outSeqno + 1) >>> 0;
  }
}


const POLY1305_ZEROS = Buffer.alloc(32);
const POLY1305_OUT_COMPUTE = Buffer.alloc(16);
let POLY1305_WASM_MODULE;
let POLY1305_RESULT_MALLOC;
let poly1305_auth;
class ChaChaPolyCipherNative {
  constructor(config) {
    const enc = config.outbound;
    this.outSeqno = enc.seqno;
    this._onWrite = enc.onWrite;
    this._encKeyMain = enc.cipherKey.slice(0, 32);
    this._encKeyPktLen = enc.cipherKey.slice(32);
    this._dead = false;
  }
  free() {
    this._dead = true;
  }
  allocPacket(payloadLen) {
    let pktLen = 4 + 1 + payloadLen;
    let padLen = 8 - ((pktLen - 4) & (8 - 1));
    if (padLen < 4)
      padLen += 8;
    pktLen += padLen;

    const packet = Buffer.allocUnsafe(pktLen);

    writeUInt32BE(packet, pktLen - 4, 0);
    packet[4] = padLen;

    randomFillSync(packet, 5 + payloadLen, padLen);

    return packet;
  }
  encrypt(packet) {
    // `packet` === unencrypted packet

    if (this._dead)
      return;

    // Generate Poly1305 key
    POLY1305_OUT_COMPUTE[0] = 0; // Set counter to 0 (little endian)
    writeUInt32BE(POLY1305_OUT_COMPUTE, this.outSeqno, 12);
    const polyKey =
      createCipheriv('chacha20', this._encKeyMain, POLY1305_OUT_COMPUTE)
      .update(POLY1305_ZEROS);

    // Encrypt packet length
    const pktLenEnc =
      createCipheriv('chacha20', this._encKeyPktLen, POLY1305_OUT_COMPUTE)
      .update(packet.slice(0, 4));
    this._onWrite(pktLenEnc);

    // Encrypt rest of packet
    POLY1305_OUT_COMPUTE[0] = 1; // Set counter to 1 (little endian)
    const payloadEnc =
      createCipheriv('chacha20', this._encKeyMain, POLY1305_OUT_COMPUTE)
      .update(packet.slice(4));
    this._onWrite(payloadEnc);

    // Calculate Poly1305 MAC
    poly1305_auth(POLY1305_RESULT_MALLOC,
                  pktLenEnc,
                  pktLenEnc.length,
                  payloadEnc,
                  payloadEnc.length,
                  polyKey);
    const mac = Buffer.allocUnsafe(16);
    mac.set(
      new Uint8Array(POLY1305_WASM_MODULE.HEAPU8.buffer,
                     POLY1305_RESULT_MALLOC,
                     16),
      0
    );
    this._onWrite(mac);

    this.outSeqno = (this.outSeqno + 1) >>> 0;
  }
}

class ChaChaPolyCipherBinding {
  constructor(config) {
    const enc = config.outbound;
    this.outSeqno = enc.seqno;
    this._onWrite = enc.onWrite;
    this._instance = new ChaChaPolyCipher(enc.cipherKey);
    this._dead = false;
  }
  free() {
    this._dead = true;
    this._instance.free();
  }
  allocPacket(payloadLen) {
    let pktLen = 4 + 1 + payloadLen;
    let padLen = 8 - ((pktLen - 4) & (8 - 1));
    if (padLen < 4)
      padLen += 8;
    pktLen += padLen;

    const packet = Buffer.allocUnsafe(pktLen + 16/* MAC */);

    writeUInt32BE(packet, pktLen - 4, 0);
    packet[4] = padLen;

    randomFillSync(packet, 5 + payloadLen, padLen);

    return packet;
  }
  encrypt(packet) {
    // `packet` === unencrypted packet

    if (this._dead)
      return;

    // Encrypts in-place
    this._instance.encrypt(packet, this.outSeqno);

    this._onWrite(packet);

    this.outSeqno = (this.outSeqno + 1) >>> 0;
  }
}


class AESGCMCipherNative {
  constructor(config) {
    const enc = config.outbound;
    this.outSeqno = enc.seqno;
    this._onWrite = enc.onWrite;
    this._encSSLName = enc.cipherInfo.sslName;
    this._encKey = enc.cipherKey;
    this._encIV = enc.cipherIV;
    this._dead = false;
  }
  free() {
    this._dead = true;
  }
  allocPacket(payloadLen) {
    let pktLen = 4 + 1 + payloadLen;
    let padLen = 16 - ((pktLen - 4) & (16 - 1));
    if (padLen < 4)
      padLen += 16;
    pktLen += padLen;

    const packet = Buffer.allocUnsafe(pktLen);

    writeUInt32BE(packet, pktLen - 4, 0);
    packet[4] = padLen;

    randomFillSync(packet, 5 + payloadLen, padLen);

    return packet;
  }
  encrypt(packet) {
    // `packet` === unencrypted packet

    if (this._dead)
      return;

    const cipher = createCipheriv(this._encSSLName, this._encKey, this._encIV);
    cipher.setAutoPadding(false);

    const lenData = packet.slice(0, 4);
    cipher.setAAD(lenData);
    this._onWrite(lenData);

    // Encrypt pad length, payload, and padding
    const encrypted = cipher.update(packet.slice(4));
    this._onWrite(encrypted);
    const final = cipher.final();
    // XXX: final.length === 0 always?
    if (final.length)
      this._onWrite(final);

    // Generate MAC
    const tag = cipher.getAuthTag();
    this._onWrite(tag);

    // Increment counter in IV by 1 for next packet
    ivIncrement(this._encIV);

    this.outSeqno = (this.outSeqno + 1) >>> 0;
  }
}

class AESGCMCipherBinding {
  constructor(config) {
    const enc = config.outbound;
    this.outSeqno = enc.seqno;
    this._onWrite = enc.onWrite;
    this._instance = new AESGCMCipher(enc.cipherInfo.sslName,
                                      enc.cipherKey,
                                      enc.cipherIV);
    this._dead = false;
  }
  free() {
    this._dead = true;
    this._instance.free();
  }
  allocPacket(payloadLen) {
    let pktLen = 4 + 1 + payloadLen;
    let padLen = 16 - ((pktLen - 4) & (16 - 1));
    if (padLen < 4)
      padLen += 16;
    pktLen += padLen;

    const packet = Buffer.allocUnsafe(pktLen + 16/* authTag */);

    writeUInt32BE(packet, pktLen - 4, 0);
    packet[4] = padLen;

    randomFillSync(packet, 5 + payloadLen, padLen);

    return packet;
  }
  encrypt(packet) {
    // `packet` === unencrypted packet

    if (this._dead)
      return;

    // Encrypts in-place
    this._instance.encrypt(packet);

    this._onWrite(packet);

    this.outSeqno = (this.outSeqno + 1) >>> 0;
  }
}


class GenericCipherNative {
  constructor(config) {
    const enc = config.outbound;
    this.outSeqno = enc.seqno;
    this._onWrite = enc.onWrite;
    this._encBlockLen = enc.cipherInfo.blockLen;
    this._cipherInstance = createCipheriv(enc.cipherInfo.sslName,
                                          enc.cipherKey,
                                          enc.cipherIV);
    this._macSSLName = enc.macInfo.sslName;
    this._macKey = enc.macKey;
    this._macActualLen = enc.macInfo.actualLen;
    this._macETM = enc.macInfo.isETM;
    this._aadLen = (this._macETM ? 4 : 0);
    this._dead = false;

    const discardLen = enc.cipherInfo.discardLen;
    if (discardLen) {
      let discard = DISCARD_CACHE.get(discardLen);
      if (discard === undefined) {
        discard = Buffer.alloc(discardLen);
        DISCARD_CACHE.set(discardLen, discard);
      }
      this._cipherInstance.update(discard);
    }
  }
  free() {
    this._dead = true;
  }
  allocPacket(payloadLen) {
    const blockLen = this._encBlockLen;

    let pktLen = 4 + 1 + payloadLen;
    let padLen = blockLen - ((pktLen - this._aadLen) & (blockLen - 1));
    if (padLen < 4)
      padLen += blockLen;
    pktLen += padLen;

    const packet = Buffer.allocUnsafe(pktLen);

    writeUInt32BE(packet, pktLen - 4, 0);
    packet[4] = padLen;

    randomFillSync(packet, 5 + payloadLen, padLen);

    return packet;
  }
  encrypt(packet) {
    // `packet` === unencrypted packet

    if (this._dead)
      return;

    let mac;
    if (this._macETM) {
      // Encrypt pad length, payload, and padding
      const lenBytes = new Uint8Array(packet.buffer, packet.byteOffset, 4);
      const encrypted = this._cipherInstance.update(
        new Uint8Array(packet.buffer,
                       packet.byteOffset + 4,
                       packet.length - 4)
      );

      this._onWrite(lenBytes);
      this._onWrite(encrypted);

      // TODO: look into storing seqno as 4-byte buffer and incrementing like we
      // do for AES-GCM IVs to avoid having to (re)write all 4 bytes every time
      mac = createHmac(this._macSSLName, this._macKey);
      writeUInt32BE(BUF_INT, this.outSeqno, 0);
      mac.update(BUF_INT);
      mac.update(lenBytes);
      mac.update(encrypted);
    } else {
      // Encrypt length field, pad length, payload, and padding
      const encrypted = this._cipherInstance.update(packet);
      this._onWrite(encrypted);

      // TODO: look into storing seqno as 4-byte buffer and incrementing like we
      // do for AES-GCM IVs to avoid having to (re)write all 4 bytes every time
      mac = createHmac(this._macSSLName, this._macKey);
      writeUInt32BE(BUF_INT, this.outSeqno, 0);
      mac.update(BUF_INT);
      mac.update(packet);
    }

    let digest = mac.digest();
    if (digest.length > this._macActualLen)
      digest = digest.slice(0, this._macActualLen);
    this._onWrite(digest);

    this.outSeqno = (this.outSeqno + 1) >>> 0;
  }
}

class GenericCipherBinding {
  constructor(config) {
    const enc = config.outbound;
    this.outSeqno = enc.seqno;
    this._onWrite = enc.onWrite;
    this._encBlockLen = enc.cipherInfo.blockLen;
    this._macLen = enc.macInfo.len;
    this._macActualLen = enc.macInfo.actualLen;
    this._aadLen = (enc.macInfo.isETM ? 4 : 0);
    this._instance = new GenericCipher(enc.cipherInfo.sslName,
                                       enc.cipherKey,
                                       enc.cipherIV,
                                       enc.macInfo.sslName,
                                       enc.macKey,
                                       enc.macInfo.isETM);
    this._dead = false;
  }
  free() {
    this._dead = true;
    this._instance.free();
  }
  allocPacket(payloadLen) {
    const blockLen = this._encBlockLen;

    let pktLen = 4 + 1 + payloadLen;
    let padLen = blockLen - ((pktLen - this._aadLen) & (blockLen - 1));
    if (padLen < 4)
      padLen += blockLen;
    pktLen += padLen;

    const packet = Buffer.allocUnsafe(pktLen + this._macLen);

    writeUInt32BE(packet, pktLen - 4, 0);
    packet[4] = padLen;

    randomFillSync(packet, 5 + payloadLen, padLen);

    return packet;
  }
  encrypt(packet) {
    // `packet` === unencrypted packet

    if (this._dead)
      return;

    // Encrypts in-place
    this._instance.encrypt(packet, this.outSeqno);

    if (this._macActualLen < this._macLen) {
      packet = new FastBuffer(packet.buffer,
                              packet.byteOffset,
                              (packet.length
                                - (this._macLen - this._macActualLen)));
    }
    this._onWrite(packet);

    this.outSeqno = (this.outSeqno + 1) >>> 0;
  }
}


class NullDecipher {
  constructor(seqno, onPayload) {
    this.inSeqno = seqno;
    this._onPayload = onPayload;
    this._len = 0;
    this._lenBytes = 0;
    this._packet = null;
    this._packetPos = 0;
  }
  free() {}
  decrypt(data, p, dataLen) {
    while (p < dataLen) {
      // Read packet length
      if (this._lenBytes < 4) {
        let nb = Math.min(4 - this._lenBytes, dataLen - p);

        this._lenBytes += nb;
        while (nb--)
          this._len = (this._len << 8) + data[p++];

        if (this._lenBytes < 4)
          return;

        if (this._len > MAX_PACKET_SIZE
            || this._len < 8
            || (4 + this._len & 7) !== 0) {
          throw new Error('Bad packet length');
        }
        if (p >= dataLen)
          return;
      }

      // Read padding length, payload, and padding
      if (this._packetPos < this._len) {
        const nb = Math.min(this._len - this._packetPos, dataLen - p);
        let chunk;
        if (p !== 0 || nb !== dataLen)
          chunk = new Uint8Array(data.buffer, data.byteOffset + p, nb);
        else
          chunk = data;
        if (nb === this._len) {
          this._packet = chunk;
        } else {
          if (!this._packet)
            this._packet = Buffer.allocUnsafe(this._len);
          this._packet.set(chunk, this._packetPos);
        }
        p += nb;
        this._packetPos += nb;
        if (this._packetPos < this._len)
          return;
      }

      const payload = (!this._packet
                       ? EMPTY_BUFFER
                       : new FastBuffer(this._packet.buffer,
                                        this._packet.byteOffset + 1,
                                        this._packet.length
                                          - this._packet[0] - 1));

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._len = 0;
      this._lenBytes = 0;
      this._packet = null;
      this._packetPos = 0;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }
}

class ChaChaPolyDecipherNative {
  constructor(config) {
    const dec = config.inbound;
    this.inSeqno = dec.seqno;
    this._onPayload = dec.onPayload;
    this._decKeyMain = dec.decipherKey.slice(0, 32);
    this._decKeyPktLen = dec.decipherKey.slice(32);
    this._len = 0;
    this._lenBuf = Buffer.alloc(4);
    this._lenPos = 0;
    this._packet = null;
    this._pktLen = 0;
    this._mac = Buffer.allocUnsafe(16);
    this._calcMac = Buffer.allocUnsafe(16);
    this._macPos = 0;
  }
  free() {}
  decrypt(data, p, dataLen) {
    // `data` === encrypted data

    while (p < dataLen) {
      // Read packet length
      if (this._lenPos < 4) {
        let nb = Math.min(4 - this._lenPos, dataLen - p);
        while (nb--)
          this._lenBuf[this._lenPos++] = data[p++];
        if (this._lenPos < 4)
          return;

        POLY1305_OUT_COMPUTE[0] = 0; // Set counter to 0 (little endian)
        writeUInt32BE(POLY1305_OUT_COMPUTE, this.inSeqno, 12);

        const decLenBytes =
          createDecipheriv('chacha20', this._decKeyPktLen, POLY1305_OUT_COMPUTE)
          .update(this._lenBuf);
        this._len = readUInt32BE(decLenBytes, 0);

        if (this._len > MAX_PACKET_SIZE
            || this._len < 8
            || (this._len & 7) !== 0) {
          throw new Error('Bad packet length');
        }
      }

      // Read padding length, payload, and padding
      if (this._pktLen < this._len) {
        if (p >= dataLen)
          return;
        const nb = Math.min(this._len - this._pktLen, dataLen - p);
        let encrypted;
        if (p !== 0 || nb !== dataLen)
          encrypted = new Uint8Array(data.buffer, data.byteOffset + p, nb);
        else
          encrypted = data;
        if (nb === this._len) {
          this._packet = encrypted;
        } else {
          if (!this._packet)
            this._packet = Buffer.allocUnsafe(this._len);
          this._packet.set(encrypted, this._pktLen);
        }
        p += nb;
        this._pktLen += nb;
        if (this._pktLen < this._len || p >= dataLen)
          return;
      }

      // Read Poly1305 MAC
      {
        const nb = Math.min(16 - this._macPos, dataLen - p);
        // TODO: avoid copying if entire MAC is in current chunk
        if (p !== 0 || nb !== dataLen) {
          this._mac.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._macPos
          );
        } else {
          this._mac.set(data, this._macPos);
        }
        p += nb;
        this._macPos += nb;
        if (this._macPos < 16)
          return;
      }

      // Generate Poly1305 key
      POLY1305_OUT_COMPUTE[0] = 0; // Set counter to 0 (little endian)
      writeUInt32BE(POLY1305_OUT_COMPUTE, this.inSeqno, 12);
      const polyKey =
        createCipheriv('chacha20', this._decKeyMain, POLY1305_OUT_COMPUTE)
        .update(POLY1305_ZEROS);

      // Calculate and compare Poly1305 MACs
      poly1305_auth(POLY1305_RESULT_MALLOC,
                    this._lenBuf,
                    4,
                    this._packet,
                    this._packet.length,
                    polyKey);

      this._calcMac.set(
        new Uint8Array(POLY1305_WASM_MODULE.HEAPU8.buffer,
                       POLY1305_RESULT_MALLOC,
                       16),
        0
      );
      if (!timingSafeEqual(this._calcMac, this._mac))
        throw new Error('Invalid MAC');

      // Decrypt packet
      POLY1305_OUT_COMPUTE[0] = 1; // Set counter to 1 (little endian)
      const packet =
        createDecipheriv('chacha20', this._decKeyMain, POLY1305_OUT_COMPUTE)
        .update(this._packet);

      const payload = new FastBuffer(packet.buffer,
                                     packet.byteOffset + 1,
                                     packet.length - packet[0] - 1);

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._len = 0;
      this._lenPos = 0;
      this._packet = null;
      this._pktLen = 0;
      this._macPos = 0;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }
}

class ChaChaPolyDecipherBinding {
  constructor(config) {
    const dec = config.inbound;
    this.inSeqno = dec.seqno;
    this._onPayload = dec.onPayload;
    this._instance = new ChaChaPolyDecipher(dec.decipherKey);
    this._len = 0;
    this._lenBuf = Buffer.alloc(4);
    this._lenPos = 0;
    this._packet = null;
    this._pktLen = 0;
    this._mac = Buffer.allocUnsafe(16);
    this._macPos = 0;
  }
  free() {
    this._instance.free();
  }
  decrypt(data, p, dataLen) {
    // `data` === encrypted data

    while (p < dataLen) {
      // Read packet length
      if (this._lenPos < 4) {
        let nb = Math.min(4 - this._lenPos, dataLen - p);
        while (nb--)
          this._lenBuf[this._lenPos++] = data[p++];
        if (this._lenPos < 4)
          return;

        this._len = this._instance.decryptLen(this._lenBuf, this.inSeqno);

        if (this._len > MAX_PACKET_SIZE
            || this._len < 8
            || (this._len & 7) !== 0) {
          throw new Error('Bad packet length');
        }

        if (p >= dataLen)
          return;
      }

      // Read padding length, payload, and padding
      if (this._pktLen < this._len) {
        const nb = Math.min(this._len - this._pktLen, dataLen - p);
        let encrypted;
        if (p !== 0 || nb !== dataLen)
          encrypted = new Uint8Array(data.buffer, data.byteOffset + p, nb);
        else
          encrypted = data;
        if (nb === this._len) {
          this._packet = encrypted;
        } else {
          if (!this._packet)
            this._packet = Buffer.allocUnsafe(this._len);
          this._packet.set(encrypted, this._pktLen);
        }
        p += nb;
        this._pktLen += nb;
        if (this._pktLen < this._len || p >= dataLen)
          return;
      }

      // Read Poly1305 MAC
      {
        const nb = Math.min(16 - this._macPos, dataLen - p);
        // TODO: avoid copying if entire MAC is in current chunk
        if (p !== 0 || nb !== dataLen) {
          this._mac.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._macPos
          );
        } else {
          this._mac.set(data, this._macPos);
        }
        p += nb;
        this._macPos += nb;
        if (this._macPos < 16)
          return;
      }

      this._instance.decrypt(this._packet, this._mac, this.inSeqno);

      const payload = new FastBuffer(this._packet.buffer,
                                     this._packet.byteOffset + 1,
                                     this._packet.length - this._packet[0] - 1);

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._len = 0;
      this._lenPos = 0;
      this._packet = null;
      this._pktLen = 0;
      this._macPos = 0;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }
}

class AESGCMDecipherNative {
  constructor(config) {
    const dec = config.inbound;
    this.inSeqno = dec.seqno;
    this._onPayload = dec.onPayload;
    this._decipherInstance = null;
    this._decipherSSLName = dec.decipherInfo.sslName;
    this._decipherKey = dec.decipherKey;
    this._decipherIV = dec.decipherIV;
    this._len = 0;
    this._lenBytes = 0;
    this._packet = null;
    this._packetPos = 0;
    this._pktLen = 0;
    this._tag = Buffer.allocUnsafe(16);
    this._tagPos = 0;
  }
  free() {}
  decrypt(data, p, dataLen) {
    // `data` === encrypted data

    while (p < dataLen) {
      // Read packet length (unencrypted, but AAD)
      if (this._lenBytes < 4) {
        let nb = Math.min(4 - this._lenBytes, dataLen - p);
        this._lenBytes += nb;
        while (nb--)
          this._len = (this._len << 8) + data[p++];
        if (this._lenBytes < 4)
          return;

        if ((this._len + 20) > MAX_PACKET_SIZE
            || this._len < 16
            || (this._len & 15) !== 0) {
          throw new Error('Bad packet length');
        }

        this._decipherInstance = createDecipheriv(
          this._decipherSSLName,
          this._decipherKey,
          this._decipherIV
        );
        this._decipherInstance.setAutoPadding(false);
        this._decipherInstance.setAAD(intToBytes(this._len));
      }

      // Read padding length, payload, and padding
      if (this._pktLen < this._len) {
        if (p >= dataLen)
          return;
        const nb = Math.min(this._len - this._pktLen, dataLen - p);
        let decrypted;
        if (p !== 0 || nb !== dataLen) {
          decrypted = this._decipherInstance.update(
            new Uint8Array(data.buffer, data.byteOffset + p, nb)
          );
        } else {
          decrypted = this._decipherInstance.update(data);
        }
        if (decrypted.length) {
          if (nb === this._len) {
            this._packet = decrypted;
          } else {
            if (!this._packet)
              this._packet = Buffer.allocUnsafe(this._len);
            this._packet.set(decrypted, this._packetPos);
          }
          this._packetPos += decrypted.length;
        }
        p += nb;
        this._pktLen += nb;
        if (this._pktLen < this._len || p >= dataLen)
          return;
      }

      // Read authentication tag
      {
        const nb = Math.min(16 - this._tagPos, dataLen - p);
        if (p !== 0 || nb !== dataLen) {
          this._tag.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._tagPos
          );
        } else {
          this._tag.set(data, this._tagPos);
        }
        p += nb;
        this._tagPos += nb;
        if (this._tagPos < 16)
          return;
      }

      {
        // Verify authentication tag
        this._decipherInstance.setAuthTag(this._tag);

        const decrypted = this._decipherInstance.final();

        // XXX: this should never output any data since stream ciphers always
        // return data from .update() and block ciphers must end on a multiple
        // of the block length, which would have caused an exception to be
        // thrown if the total input was not...
        if (decrypted.length) {
          if (this._packet)
            this._packet.set(decrypted, this._packetPos);
          else
            this._packet = decrypted;
        }
      }

      const payload = (!this._packet
                       ? EMPTY_BUFFER
                       : new FastBuffer(this._packet.buffer,
                                        this._packet.byteOffset + 1,
                                        this._packet.length
                                          - this._packet[0] - 1));

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      ivIncrement(this._decipherIV);
      this._len = 0;
      this._lenBytes = 0;
      this._packet = null;
      this._packetPos = 0;
      this._pktLen = 0;
      this._tagPos = 0;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }
}

class AESGCMDecipherBinding {
  constructor(config) {
    const dec = config.inbound;
    this.inSeqno = dec.seqno;
    this._onPayload = dec.onPayload;
    this._instance = new AESGCMDecipher(dec.decipherInfo.sslName,
                                        dec.decipherKey,
                                        dec.decipherIV);
    this._len = 0;
    this._lenBytes = 0;
    this._packet = null;
    this._pktLen = 0;
    this._tag = Buffer.allocUnsafe(16);
    this._tagPos = 0;
  }
  free() {}
  decrypt(data, p, dataLen) {
    // `data` === encrypted data

    while (p < dataLen) {
      // Read packet length (unencrypted, but AAD)
      if (this._lenBytes < 4) {
        let nb = Math.min(4 - this._lenBytes, dataLen - p);
        this._lenBytes += nb;
        while (nb--)
          this._len = (this._len << 8) + data[p++];
        if (this._lenBytes < 4)
          return;

        if ((this._len + 20) > MAX_PACKET_SIZE
            || this._len < 16
            || (this._len & 15) !== 0) {
          throw new Error(`Bad packet length: ${this._len}`);
        }
      }

      // Read padding length, payload, and padding
      if (this._pktLen < this._len) {
        if (p >= dataLen)
          return;
        const nb = Math.min(this._len - this._pktLen, dataLen - p);
        let encrypted;
        if (p !== 0 || nb !== dataLen)
          encrypted = new Uint8Array(data.buffer, data.byteOffset + p, nb);
        else
          encrypted = data;
        if (nb === this._len) {
          this._packet = encrypted;
        } else {
          if (!this._packet)
            this._packet = Buffer.allocUnsafe(this._len);
          this._packet.set(encrypted, this._pktLen);
        }
        p += nb;
        this._pktLen += nb;
        if (this._pktLen < this._len || p >= dataLen)
          return;
      }

      // Read authentication tag
      {
        const nb = Math.min(16 - this._tagPos, dataLen - p);
        if (p !== 0 || nb !== dataLen) {
          this._tag.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._tagPos
          );
        } else {
          this._tag.set(data, this._tagPos);
        }
        p += nb;
        this._tagPos += nb;
        if (this._tagPos < 16)
          return;
      }

      this._instance.decrypt(this._packet, this._len, this._tag);

      const payload = new FastBuffer(this._packet.buffer,
                                     this._packet.byteOffset + 1,
                                     this._packet.length - this._packet[0] - 1);

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._len = 0;
      this._lenBytes = 0;
      this._packet = null;
      this._pktLen = 0;
      this._tagPos = 0;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }
}

// TODO: test incremental .update()s vs. copying to _packet and doing a single
// .update() after entire packet read -- a single .update() would allow
// verifying MAC before decrypting for ETM MACs
class GenericDecipherNative {
  constructor(config) {
    const dec = config.inbound;
    this.inSeqno = dec.seqno;
    this._onPayload = dec.onPayload;
    this._decipherInstance = createDecipheriv(dec.decipherInfo.sslName,
                                              dec.decipherKey,
                                              dec.decipherIV);
    this._decipherInstance.setAutoPadding(false);
    this._block = Buffer.allocUnsafe(
      dec.macInfo.isETM ? 4 : dec.decipherInfo.blockLen
    );
    this._blockSize = dec.decipherInfo.blockLen;
    this._blockPos = 0;
    this._len = 0;
    this._packet = null;
    this._packetPos = 0;
    this._pktLen = 0;
    this._mac = Buffer.allocUnsafe(dec.macInfo.actualLen);
    this._macPos = 0;
    this._macSSLName = dec.macInfo.sslName;
    this._macKey = dec.macKey;
    this._macActualLen = dec.macInfo.actualLen;
    this._macETM = dec.macInfo.isETM;
    this._macInstance = null;

    const discardLen = dec.decipherInfo.discardLen;
    if (discardLen) {
      let discard = DISCARD_CACHE.get(discardLen);
      if (discard === undefined) {
        discard = Buffer.alloc(discardLen);
        DISCARD_CACHE.set(discardLen, discard);
      }
      this._decipherInstance.update(discard);
    }
  }
  free() {}
  decrypt(data, p, dataLen) {
    // `data` === encrypted data

    while (p < dataLen) {
      // Read first encrypted block
      if (this._blockPos < this._block.length) {
        const nb = Math.min(this._block.length - this._blockPos, dataLen - p);
        if (p !== 0 || nb !== dataLen || nb < data.length) {
          this._block.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._blockPos
          );
        } else {
          this._block.set(data, this._blockPos);
        }

        p += nb;
        this._blockPos += nb;
        if (this._blockPos < this._block.length)
          return;

        let decrypted;
        let need;
        if (this._macETM) {
          this._len = need = readUInt32BE(this._block, 0);
        } else {
          // Decrypt first block to get packet length
          decrypted = this._decipherInstance.update(this._block);
          this._len = readUInt32BE(decrypted, 0);
          need = 4 + this._len - this._blockSize;
        }

        if (this._len > MAX_PACKET_SIZE
            || this._len < 5
            || (need & (this._blockSize - 1)) !== 0) {
          throw new Error('Bad packet length');
        }

        // Create MAC up front to calculate in parallel with decryption
        this._macInstance = createHmac(this._macSSLName, this._macKey);

        writeUInt32BE(BUF_INT, this.inSeqno, 0);
        this._macInstance.update(BUF_INT);
        if (this._macETM) {
          this._macInstance.update(this._block);
        } else {
          this._macInstance.update(new Uint8Array(decrypted.buffer,
                                                  decrypted.byteOffset,
                                                  4));
          this._pktLen = decrypted.length - 4;
          this._packetPos = this._pktLen;
          this._packet = Buffer.allocUnsafe(this._len);
          this._packet.set(
            new Uint8Array(decrypted.buffer,
                           decrypted.byteOffset + 4,
                           this._packetPos),
            0
          );
        }

        if (p >= dataLen)
          return;
      }

      // Read padding length, payload, and padding
      if (this._pktLen < this._len) {
        const nb = Math.min(this._len - this._pktLen, dataLen - p);
        let encrypted;
        if (p !== 0 || nb !== dataLen)
          encrypted = new Uint8Array(data.buffer, data.byteOffset + p, nb);
        else
          encrypted = data;
        if (this._macETM)
          this._macInstance.update(encrypted);
        const decrypted = this._decipherInstance.update(encrypted);
        if (decrypted.length) {
          if (nb === this._len) {
            this._packet = decrypted;
          } else {
            if (!this._packet)
              this._packet = Buffer.allocUnsafe(this._len);
            this._packet.set(decrypted, this._packetPos);
          }
          this._packetPos += decrypted.length;
        }
        p += nb;
        this._pktLen += nb;
        if (this._pktLen < this._len || p >= dataLen)
          return;
      }

      // Read MAC
      {
        const nb = Math.min(this._macActualLen - this._macPos, dataLen - p);
        if (p !== 0 || nb !== dataLen) {
          this._mac.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._macPos
          );
        } else {
          this._mac.set(data, this._macPos);
        }
        p += nb;
        this._macPos += nb;
        if (this._macPos < this._macActualLen)
          return;
      }

      // Verify MAC
      if (!this._macETM)
        this._macInstance.update(this._packet);
      let calculated = this._macInstance.digest();
      if (this._macActualLen < calculated.length) {
        calculated = new Uint8Array(calculated.buffer,
                                    calculated.byteOffset,
                                    this._macActualLen);
      }
      if (!timingSafeEquals(calculated, this._mac))
        throw new Error('Invalid MAC');

      const payload = new FastBuffer(this._packet.buffer,
                                     this._packet.byteOffset + 1,
                                     this._packet.length - this._packet[0] - 1);

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._blockPos = 0;
      this._len = 0;
      this._packet = null;
      this._packetPos = 0;
      this._pktLen = 0;
      this._macPos = 0;
      this._macInstance = null;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }
}

class GenericDecipherBinding {
  constructor(config) {
    const dec = config.inbound;
    this.inSeqno = dec.seqno;
    this._onPayload = dec.onPayload;
    this._instance = new GenericDecipher(dec.decipherInfo.sslName,
                                         dec.decipherKey,
                                         dec.decipherIV,
                                         dec.macInfo.sslName,
                                         dec.macKey,
                                         dec.macInfo.isETM,
                                         dec.macInfo.actualLen);
    this._block = Buffer.allocUnsafe(
      dec.macInfo.isETM || dec.decipherInfo.stream
      ? 4
      : dec.decipherInfo.blockLen
    );
    this._blockPos = 0;
    this._len = 0;
    this._packet = null;
    this._pktLen = 0;
    this._mac = Buffer.allocUnsafe(dec.macInfo.actualLen);
    this._macPos = 0;
    this._macActualLen = dec.macInfo.actualLen;
    this._macETM = dec.macInfo.isETM;
  }
  free() {
    this._instance.free();
  }
  decrypt(data, p, dataLen) {
    // `data` === encrypted data

    while (p < dataLen) {
      // Read first encrypted block
      if (this._blockPos < this._block.length) {
        const nb = Math.min(this._block.length - this._blockPos, dataLen - p);
        if (p !== 0 || nb !== dataLen || nb < data.length) {
          this._block.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._blockPos
          );
        } else {
          this._block.set(data, this._blockPos);
        }

        p += nb;
        this._blockPos += nb;
        if (this._blockPos < this._block.length)
          return;

        let need;
        if (this._macETM) {
          this._len = need = readUInt32BE(this._block, 0);
        } else {
          // Decrypt first block to get packet length
          this._instance.decryptBlock(this._block);
          this._len = readUInt32BE(this._block, 0);
          need = 4 + this._len - this._block.length;
        }

        if (this._len > MAX_PACKET_SIZE
            || this._len < 5
            || (need & (this._block.length - 1)) !== 0) {
          throw new Error('Bad packet length');
        }

        if (!this._macETM) {
          this._pktLen = (this._block.length - 4);
          if (this._pktLen) {
            this._packet = Buffer.allocUnsafe(this._len);
            this._packet.set(
              new Uint8Array(this._block.buffer,
                             this._block.byteOffset + 4,
                             this._pktLen),
              0
            );
          }
        }

        if (p >= dataLen)
          return;
      }

      // Read padding length, payload, and padding
      if (this._pktLen < this._len) {
        const nb = Math.min(this._len - this._pktLen, dataLen - p);
        let encrypted;
        if (p !== 0 || nb !== dataLen)
          encrypted = new Uint8Array(data.buffer, data.byteOffset + p, nb);
        else
          encrypted = data;
        if (nb === this._len) {
          this._packet = encrypted;
        } else {
          if (!this._packet)
            this._packet = Buffer.allocUnsafe(this._len);
          this._packet.set(encrypted, this._pktLen);
        }
        p += nb;
        this._pktLen += nb;
        if (this._pktLen < this._len || p >= dataLen)
          return;
      }

      // Read MAC
      {
        const nb = Math.min(this._macActualLen - this._macPos, dataLen - p);
        if (p !== 0 || nb !== dataLen) {
          this._mac.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._macPos
          );
        } else {
          this._mac.set(data, this._macPos);
        }
        p += nb;
        this._macPos += nb;
        if (this._macPos < this._macActualLen)
          return;
      }

      // Decrypt and verify MAC
      this._instance.decrypt(this._packet,
                             this.inSeqno,
                             this._block,
                             this._mac);

      const payload = new FastBuffer(this._packet.buffer,
                                     this._packet.byteOffset + 1,
                                     this._packet.length - this._packet[0] - 1);

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._blockPos = 0;
      this._len = 0;
      this._packet = null;
      this._pktLen = 0;
      this._macPos = 0;
      this._macInstance = null;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }
}

// Increments unsigned, big endian counter (last 8 bytes) of AES-GCM IV
function ivIncrement(iv) {
  // eslint-disable-next-line no-unused-expressions
  ++iv[11] >>> 8
  && ++iv[10] >>> 8
  && ++iv[9] >>> 8
  && ++iv[8] >>> 8
  && ++iv[7] >>> 8
  && ++iv[6] >>> 8
  && ++iv[5] >>> 8
  && ++iv[4] >>> 8;
}

const intToBytes = (() => {
  const ret = Buffer.alloc(4);
  return (n) => {
    ret[0] = (n >>> 24);
    ret[1] = (n >>> 16);
    ret[2] = (n >>> 8);
    ret[3] = n;
    return ret;
  };
})();

function timingSafeEquals(a, b) {
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

function createCipher(config) {
  if (typeof config !== 'object' || config === null)
    throw new Error('Invalid config');

  if (typeof config.outbound !== 'object' || config.outbound === null)
    throw new Error('Invalid outbound');

  const outbound = config.outbound;

  if (typeof outbound.onWrite !== 'function')
    throw new Error('Invalid outbound.onWrite');

  if (typeof outbound.cipherInfo !== 'object' || outbound.cipherInfo === null)
    throw new Error('Invalid outbound.cipherInfo');

  if (!Buffer.isBuffer(outbound.cipherKey)
      || outbound.cipherKey.length !== outbound.cipherInfo.keyLen) {
    throw new Error('Invalid outbound.cipherKey');
  }

  if (outbound.cipherInfo.ivLen
      && (!Buffer.isBuffer(outbound.cipherIV)
          || outbound.cipherIV.length !== outbound.cipherInfo.ivLen)) {
    throw new Error('Invalid outbound.cipherIV');
  }

  if (typeof outbound.seqno !== 'number'
      || outbound.seqno < 0
      || outbound.seqno > MAX_SEQNO) {
    throw new Error('Invalid outbound.seqno');
  }

  const forceNative = !!outbound.forceNative;

  switch (outbound.cipherInfo.sslName) {
    case 'aes-128-gcm':
    case 'aes-256-gcm':
      return (AESGCMCipher && !forceNative
              ? new AESGCMCipherBinding(config)
              : new AESGCMCipherNative(config));
    case 'chacha20':
      return (ChaChaPolyCipher && !forceNative
              ? new ChaChaPolyCipherBinding(config)
              : new ChaChaPolyCipherNative(config));
    default: {
      if (typeof outbound.macInfo !== 'object' || outbound.macInfo === null)
        throw new Error('Invalid outbound.macInfo');
      if (!Buffer.isBuffer(outbound.macKey)
          || outbound.macKey.length !== outbound.macInfo.len) {
        throw new Error('Invalid outbound.macKey');
      }
      return (GenericCipher && !forceNative
              ? new GenericCipherBinding(config)
              : new GenericCipherNative(config));
    }
  }
}

function createDecipher(config) {
  if (typeof config !== 'object' || config === null)
    throw new Error('Invalid config');

  if (typeof config.inbound !== 'object' || config.inbound === null)
    throw new Error('Invalid inbound');

  const inbound = config.inbound;

  if (typeof inbound.onPayload !== 'function')
    throw new Error('Invalid inbound.onPayload');

  if (typeof inbound.decipherInfo !== 'object'
      || inbound.decipherInfo === null) {
    throw new Error('Invalid inbound.decipherInfo');
  }

  if (!Buffer.isBuffer(inbound.decipherKey)
      || inbound.decipherKey.length !== inbound.decipherInfo.keyLen) {
    throw new Error('Invalid inbound.decipherKey');
  }

  if (inbound.decipherInfo.ivLen
      && (!Buffer.isBuffer(inbound.decipherIV)
          || inbound.decipherIV.length !== inbound.decipherInfo.ivLen)) {
    throw new Error('Invalid inbound.decipherIV');
  }

  if (typeof inbound.seqno !== 'number'
      || inbound.seqno < 0
      || inbound.seqno > MAX_SEQNO) {
    throw new Error('Invalid inbound.seqno');
  }

  const forceNative = !!inbound.forceNative;

  switch (inbound.decipherInfo.sslName) {
    case 'aes-128-gcm':
    case 'aes-256-gcm':
      return (AESGCMDecipher && !forceNative
              ? new AESGCMDecipherBinding(config)
              : new AESGCMDecipherNative(config));
    case 'chacha20':
      return (ChaChaPolyDecipher && !forceNative
              ? new ChaChaPolyDecipherBinding(config)
              : new ChaChaPolyDecipherNative(config));
    default: {
      if (typeof inbound.macInfo !== 'object' || inbound.macInfo === null)
        throw new Error('Invalid inbound.macInfo');
      if (!Buffer.isBuffer(inbound.macKey)
          || inbound.macKey.length !== inbound.macInfo.len) {
        throw new Error('Invalid inbound.macKey');
      }
      return (GenericDecipher && !forceNative
              ? new GenericDecipherBinding(config)
              : new GenericDecipherNative(config));
    }
  }
}

module.exports = {
  CIPHER_INFO,
  MAC_INFO,
  bindingAvailable: !!binding,
  init: (() => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        POLY1305_WASM_MODULE = await __nccwpck_require__(4989)();
        POLY1305_RESULT_MALLOC = POLY1305_WASM_MODULE._malloc(16);
        poly1305_auth = POLY1305_WASM_MODULE.cwrap(
          'poly1305_auth',
          null,
          ['number', 'array', 'number', 'array', 'number', 'array']
        );
      } catch (ex) {
        return reject(ex);
      }
      resolve();
    });
  })(),

  NullCipher,
  createCipher,
  NullDecipher,
  createDecipher,
};


/***/ }),

/***/ 4989:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var createPoly1305 = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(createPoly1305) {
  createPoly1305 = createPoly1305 || {};


var b;b||(b=typeof createPoly1305 !== 'undefined' ? createPoly1305 : {});var q,r;b.ready=new Promise(function(a,c){q=a;r=c});var u={},w;for(w in b)b.hasOwnProperty(w)&&(u[w]=b[w]);var x="object"===typeof window,y="function"===typeof importScripts,z="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node,B="",C,D,E,F,G;
if(z)B=y?__nccwpck_require__(5622).dirname(B)+"/":__dirname+"/",C=function(a,c){var d=H(a);if(d)return c?d:d.toString();F||(F=__nccwpck_require__(5747));G||(G=__nccwpck_require__(5622));a=G.normalize(a);return F.readFileSync(a,c?null:"utf8")},E=function(a){a=C(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a},D=function(a,c,d){var e=H(a);e&&c(e);F||(F=__nccwpck_require__(5747));G||(G=__nccwpck_require__(5622));a=G.normalize(a);F.readFile(a,function(f,l){f?d(f):c(l.buffer)})},1<process.argv.length&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),
b.inspect=function(){return"[Emscripten Module object]"};else if(x||y)y?B=self.location.href:"undefined"!==typeof document&&document.currentScript&&(B=document.currentScript.src),_scriptDir&&(B=_scriptDir),0!==B.indexOf("blob:")?B=B.substr(0,B.lastIndexOf("/")+1):B="",C=function(a){try{var c=new XMLHttpRequest;c.open("GET",a,!1);c.send(null);return c.responseText}catch(f){if(a=H(a)){c=[];for(var d=0;d<a.length;d++){var e=a[d];255<e&&(ba&&assert(!1,"Character code "+e+" ("+String.fromCharCode(e)+")  at offset "+
d+" not in 0x00-0xFF."),e&=255);c.push(String.fromCharCode(e))}return c.join("")}throw f;}},y&&(E=function(a){try{var c=new XMLHttpRequest;c.open("GET",a,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)}catch(d){if(a=H(a))return a;throw d;}}),D=function(a,c,d){var e=new XMLHttpRequest;e.open("GET",a,!0);e.responseType="arraybuffer";e.onload=function(){if(200==e.status||0==e.status&&e.response)c(e.response);else{var f=H(a);f?c(f.buffer):d()}};e.onerror=d;e.send(null)};
b.print||console.log.bind(console);var I=b.printErr||console.warn.bind(console);for(w in u)u.hasOwnProperty(w)&&(b[w]=u[w]);u=null;var J;b.wasmBinary&&(J=b.wasmBinary);var noExitRuntime=b.noExitRuntime||!0;"object"!==typeof WebAssembly&&K("no native wasm support detected");var L,M=!1;function assert(a,c){a||K("Assertion failed: "+c)}function N(a){var c=b["_"+a];assert(c,"Cannot call unknown function "+a+", make sure it is exported");return c}
function ca(a,c,d,e){var f={string:function(g){var p=0;if(null!==g&&void 0!==g&&0!==g){var n=(g.length<<2)+1;p=O(n);var k=p,h=P;if(0<n){n=k+n-1;for(var v=0;v<g.length;++v){var m=g.charCodeAt(v);if(55296<=m&&57343>=m){var oa=g.charCodeAt(++v);m=65536+((m&1023)<<10)|oa&1023}if(127>=m){if(k>=n)break;h[k++]=m}else{if(2047>=m){if(k+1>=n)break;h[k++]=192|m>>6}else{if(65535>=m){if(k+2>=n)break;h[k++]=224|m>>12}else{if(k+3>=n)break;h[k++]=240|m>>18;h[k++]=128|m>>12&63}h[k++]=128|m>>6&63}h[k++]=128|m&63}}h[k]=
0}}return p},array:function(g){var p=O(g.length);Q.set(g,p);return p}},l=N(a),A=[];a=0;if(e)for(var t=0;t<e.length;t++){var aa=f[d[t]];aa?(0===a&&(a=da()),A[t]=aa(e[t])):A[t]=e[t]}d=l.apply(null,A);d=function(g){if("string"===c)if(g){for(var p=P,n=g+NaN,k=g;p[k]&&!(k>=n);)++k;if(16<k-g&&p.subarray&&ea)g=ea.decode(p.subarray(g,k));else{for(n="";g<k;){var h=p[g++];if(h&128){var v=p[g++]&63;if(192==(h&224))n+=String.fromCharCode((h&31)<<6|v);else{var m=p[g++]&63;h=224==(h&240)?(h&15)<<12|v<<6|m:(h&7)<<
18|v<<12|m<<6|p[g++]&63;65536>h?n+=String.fromCharCode(h):(h-=65536,n+=String.fromCharCode(55296|h>>10,56320|h&1023))}}else n+=String.fromCharCode(h)}g=n}}else g="";else g="boolean"===c?!!g:g;return g}(d);0!==a&&fa(a);return d}var ea="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0,ha,Q,P;
function ia(){var a=L.buffer;ha=a;b.HEAP8=Q=new Int8Array(a);b.HEAP16=new Int16Array(a);b.HEAP32=new Int32Array(a);b.HEAPU8=P=new Uint8Array(a);b.HEAPU16=new Uint16Array(a);b.HEAPU32=new Uint32Array(a);b.HEAPF32=new Float32Array(a);b.HEAPF64=new Float64Array(a)}var R,ja=[],ka=[],la=[];function ma(){var a=b.preRun.shift();ja.unshift(a)}var S=0,T=null,U=null;b.preloadedImages={};b.preloadedAudios={};
function K(a){if(b.onAbort)b.onAbort(a);I(a);M=!0;a=new WebAssembly.RuntimeError("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");r(a);throw a;}var V="data:application/octet-stream;base64,",W;W="data:application/octet-stream;base64,AGFzbQEAAAABIAZgAX8Bf2ADf39/AGABfwBgAABgAAF/YAZ/f39/f38AAgcBAWEBYQAAAwsKAAEDAQAAAgQFAgQFAXABAQEFBwEBgAKAgAIGCQF/AUGAjMACCwclCQFiAgABYwADAWQACQFlAAgBZgAHAWcABgFoAAUBaQAKAWoBAAqGTQpPAQJ/QYAIKAIAIgEgAEEDakF8cSICaiEAAkAgAkEAIAAgAU0bDQAgAD8AQRB0SwRAIAAQAEUNAQtBgAggADYCACABDwtBhAhBMDYCAEF/C4wFAg5+Cn8gACgCJCEUIAAoAiAhFSAAKAIcIREgACgCGCESIAAoAhQhEyACQRBPBEAgAC0ATEVBGHQhFyAAKAIEIhZBBWytIQ8gACgCCCIYQQVsrSENIAAoAgwiGUEFbK0hCyAAKAIQIhpBBWytIQkgADUCACEIIBqtIRAgGa0hDiAYrSEMIBatIQoDQCASIAEtAAMiEiABLQAEQQh0ciABLQAFQRB0ciABLQAGIhZBGHRyQQJ2Qf///x9xaq0iAyAOfiABLwAAIAEtAAJBEHRyIBNqIBJBGHRBgICAGHFqrSIEIBB+fCARIAEtAAdBCHQgFnIgAS0ACEEQdHIgAS0ACSIRQRh0ckEEdkH///8fcWqtIgUgDH58IAEtAApBCHQgEXIgAS0AC0EQdHIgAS0ADEEYdHJBBnYgFWqtIgYgCn58IBQgF2ogAS8ADSABLQAPQRB0cmqtIgcgCH58IAMgDH4gBCAOfnwgBSAKfnwgBiAIfnwgByAJfnwgAyAKfiAEIAx+fCAFIAh+fCAGIAl+fCAHIAt+fCADIAh+IAQgCn58IAUgCX58IAYgC358IAcgDX58IAMgCX4gBCAIfnwgBSALfnwgBiANfnwgByAPfnwiA0IaiEL/////D4N8IgRCGohC/////w+DfCIFQhqIQv////8Pg3wiBkIaiEL/////D4N8IgdCGoinQQVsIAOnQf///x9xaiITQRp2IASnQf///x9xaiESIAWnQf///x9xIREgBqdB////H3EhFSAHp0H///8fcSEUIBNB////H3EhEyABQRBqIQEgAkEQayICQQ9LDQALCyAAIBQ2AiQgACAVNgIgIAAgETYCHCAAIBI2AhggACATNgIUCwMAAQu2BAEGfwJAIAAoAjgiBARAIABBPGohBQJAIAJBECAEayIDIAIgA0kbIgZFDQAgBkEDcSEHAkAgBkEBa0EDSQRAQQAhAwwBCyAGQXxxIQhBACEDA0AgBSADIARqaiABIANqLQAAOgAAIAUgA0EBciIEIAAoAjhqaiABIARqLQAAOgAAIAUgA0ECciIEIAAoAjhqaiABIARqLQAAOgAAIAUgA0EDciIEIAAoAjhqaiABIARqLQAAOgAAIANBBGohAyAAKAI4IQQgCEEEayIIDQALCyAHRQ0AA0AgBSADIARqaiABIANqLQAAOgAAIANBAWohAyAAKAI4IQQgB0EBayIHDQALCyAAIAQgBmoiAzYCOCADQRBJDQEgACAFQRAQAiAAQQA2AjggAiAGayECIAEgBmohAQsgAkEQTwRAIAAgASACQXBxIgMQAiACQQ9xIQIgASADaiEBCyACRQ0AIAJBA3EhBCAAQTxqIQVBACEDIAJBAWtBA08EQCACQXxxIQcDQCAFIAAoAjggA2pqIAEgA2otAAA6AAAgBSADQQFyIgYgACgCOGpqIAEgBmotAAA6AAAgBSADQQJyIgYgACgCOGpqIAEgBmotAAA6AAAgBSADQQNyIgYgACgCOGpqIAEgBmotAAA6AAAgA0EEaiEDIAdBBGsiBw0ACwsgBARAA0AgBSAAKAI4IANqaiABIANqLQAAOgAAIANBAWohAyAEQQFrIgQNAAsLIAAgACgCOCACajYCOAsLoS0BDH8jAEEQayIMJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAEH0AU0EQEGICCgCACIFQRAgAEELakF4cSAAQQtJGyIIQQN2IgJ2IgFBA3EEQCABQX9zQQFxIAJqIgNBA3QiAUG4CGooAgAiBEEIaiEAAkAgBCgCCCICIAFBsAhqIgFGBEBBiAggBUF+IAN3cTYCAAwBCyACIAE2AgwgASACNgIICyAEIANBA3QiAUEDcjYCBCABIARqIgEgASgCBEEBcjYCBAwNCyAIQZAIKAIAIgpNDQEgAQRAAkBBAiACdCIAQQAgAGtyIAEgAnRxIgBBACAAa3FBAWsiACAAQQx2QRBxIgJ2IgFBBXZBCHEiACACciABIAB2IgFBAnZBBHEiAHIgASAAdiIBQQF2QQJxIgByIAEgAHYiAUEBdkEBcSIAciABIAB2aiIDQQN0IgBBuAhqKAIAIgQoAggiASAAQbAIaiIARgRAQYgIIAVBfiADd3EiBTYCAAwBCyABIAA2AgwgACABNgIICyAEQQhqIQAgBCAIQQNyNgIEIAQgCGoiAiADQQN0IgEgCGsiA0EBcjYCBCABIARqIAM2AgAgCgRAIApBA3YiAUEDdEGwCGohB0GcCCgCACEEAn8gBUEBIAF0IgFxRQRAQYgIIAEgBXI2AgAgBwwBCyAHKAIICyEBIAcgBDYCCCABIAQ2AgwgBCAHNgIMIAQgATYCCAtBnAggAjYCAEGQCCADNgIADA0LQYwIKAIAIgZFDQEgBkEAIAZrcUEBayIAIABBDHZBEHEiAnYiAUEFdkEIcSIAIAJyIAEgAHYiAUECdkEEcSIAciABIAB2IgFBAXZBAnEiAHIgASAAdiIBQQF2QQFxIgByIAEgAHZqQQJ0QbgKaigCACIBKAIEQXhxIAhrIQMgASECA0ACQCACKAIQIgBFBEAgAigCFCIARQ0BCyAAKAIEQXhxIAhrIgIgAyACIANJIgIbIQMgACABIAIbIQEgACECDAELCyABIAhqIgkgAU0NAiABKAIYIQsgASABKAIMIgRHBEAgASgCCCIAQZgIKAIASRogACAENgIMIAQgADYCCAwMCyABQRRqIgIoAgAiAEUEQCABKAIQIgBFDQQgAUEQaiECCwNAIAIhByAAIgRBFGoiAigCACIADQAgBEEQaiECIAQoAhAiAA0ACyAHQQA2AgAMCwtBfyEIIABBv39LDQAgAEELaiIAQXhxIQhBjAgoAgAiCUUNAEEAIAhrIQMCQAJAAkACf0EAIAhBgAJJDQAaQR8gCEH///8HSw0AGiAAQQh2IgAgAEGA/j9qQRB2QQhxIgJ0IgAgAEGA4B9qQRB2QQRxIgF0IgAgAEGAgA9qQRB2QQJxIgB0QQ92IAEgAnIgAHJrIgBBAXQgCCAAQRVqdkEBcXJBHGoLIgVBAnRBuApqKAIAIgJFBEBBACEADAELQQAhACAIQQBBGSAFQQF2ayAFQR9GG3QhAQNAAkAgAigCBEF4cSAIayIHIANPDQAgAiEEIAciAw0AQQAhAyACIQAMAwsgACACKAIUIgcgByACIAFBHXZBBHFqKAIQIgJGGyAAIAcbIQAgAUEBdCEBIAINAAsLIAAgBHJFBEBBACEEQQIgBXQiAEEAIABrciAJcSIARQ0DIABBACAAa3FBAWsiACAAQQx2QRBxIgJ2IgFBBXZBCHEiACACciABIAB2IgFBAnZBBHEiAHIgASAAdiIBQQF2QQJxIgByIAEgAHYiAUEBdkEBcSIAciABIAB2akECdEG4CmooAgAhAAsgAEUNAQsDQCAAKAIEQXhxIAhrIgEgA0khAiABIAMgAhshAyAAIAQgAhshBCAAKAIQIgEEfyABBSAAKAIUCyIADQALCyAERQ0AIANBkAgoAgAgCGtPDQAgBCAIaiIGIARNDQEgBCgCGCEFIAQgBCgCDCIBRwRAIAQoAggiAEGYCCgCAEkaIAAgATYCDCABIAA2AggMCgsgBEEUaiICKAIAIgBFBEAgBCgCECIARQ0EIARBEGohAgsDQCACIQcgACIBQRRqIgIoAgAiAA0AIAFBEGohAiABKAIQIgANAAsgB0EANgIADAkLIAhBkAgoAgAiAk0EQEGcCCgCACEDAkAgAiAIayIBQRBPBEBBkAggATYCAEGcCCADIAhqIgA2AgAgACABQQFyNgIEIAIgA2ogATYCACADIAhBA3I2AgQMAQtBnAhBADYCAEGQCEEANgIAIAMgAkEDcjYCBCACIANqIgAgACgCBEEBcjYCBAsgA0EIaiEADAsLIAhBlAgoAgAiBkkEQEGUCCAGIAhrIgE2AgBBoAhBoAgoAgAiAiAIaiIANgIAIAAgAUEBcjYCBCACIAhBA3I2AgQgAkEIaiEADAsLQQAhACAIQS9qIgkCf0HgCygCAARAQegLKAIADAELQewLQn83AgBB5AtCgKCAgICABDcCAEHgCyAMQQxqQXBxQdiq1aoFczYCAEH0C0EANgIAQcQLQQA2AgBBgCALIgFqIgVBACABayIHcSICIAhNDQpBwAsoAgAiBARAQbgLKAIAIgMgAmoiASADTQ0LIAEgBEsNCwtBxAstAABBBHENBQJAAkBBoAgoAgAiAwRAQcgLIQADQCADIAAoAgAiAU8EQCABIAAoAgRqIANLDQMLIAAoAggiAA0ACwtBABABIgFBf0YNBiACIQVB5AsoAgAiA0EBayIAIAFxBEAgAiABayAAIAFqQQAgA2txaiEFCyAFIAhNDQYgBUH+////B0sNBkHACygCACIEBEBBuAsoAgAiAyAFaiIAIANNDQcgACAESw0HCyAFEAEiACABRw0BDAgLIAUgBmsgB3EiBUH+////B0sNBSAFEAEiASAAKAIAIAAoAgRqRg0EIAEhAAsCQCAAQX9GDQAgCEEwaiAFTQ0AQegLKAIAIgEgCSAFa2pBACABa3EiAUH+////B0sEQCAAIQEMCAsgARABQX9HBEAgASAFaiEFIAAhAQwIC0EAIAVrEAEaDAULIAAiAUF/Rw0GDAQLAAtBACEEDAcLQQAhAQwFCyABQX9HDQILQcQLQcQLKAIAQQRyNgIACyACQf7///8HSw0BIAIQASEBQQAQASEAIAFBf0YNASAAQX9GDQEgACABTQ0BIAAgAWsiBSAIQShqTQ0BC0G4C0G4CygCACAFaiIANgIAQbwLKAIAIABJBEBBvAsgADYCAAsCQAJAAkBBoAgoAgAiBwRAQcgLIQADQCABIAAoAgAiAyAAKAIEIgJqRg0CIAAoAggiAA0ACwwCC0GYCCgCACIAQQAgACABTRtFBEBBmAggATYCAAtBACEAQcwLIAU2AgBByAsgATYCAEGoCEF/NgIAQawIQeALKAIANgIAQdQLQQA2AgADQCAAQQN0IgNBuAhqIANBsAhqIgI2AgAgA0G8CGogAjYCACAAQQFqIgBBIEcNAAtBlAggBUEoayIDQXggAWtBB3FBACABQQhqQQdxGyIAayICNgIAQaAIIAAgAWoiADYCACAAIAJBAXI2AgQgASADakEoNgIEQaQIQfALKAIANgIADAILIAAtAAxBCHENACADIAdLDQAgASAHTQ0AIAAgAiAFajYCBEGgCCAHQXggB2tBB3FBACAHQQhqQQdxGyIAaiICNgIAQZQIQZQIKAIAIAVqIgEgAGsiADYCACACIABBAXI2AgQgASAHakEoNgIEQaQIQfALKAIANgIADAELQZgIKAIAIAFLBEBBmAggATYCAAsgASAFaiECQcgLIQACQAJAAkACQAJAAkADQCACIAAoAgBHBEAgACgCCCIADQEMAgsLIAAtAAxBCHFFDQELQcgLIQADQCAHIAAoAgAiAk8EQCACIAAoAgRqIgQgB0sNAwsgACgCCCEADAALAAsgACABNgIAIAAgACgCBCAFajYCBCABQXggAWtBB3FBACABQQhqQQdxG2oiCSAIQQNyNgIEIAJBeCACa0EHcUEAIAJBCGpBB3EbaiIFIAggCWoiBmshAiAFIAdGBEBBoAggBjYCAEGUCEGUCCgCACACaiIANgIAIAYgAEEBcjYCBAwDCyAFQZwIKAIARgRAQZwIIAY2AgBBkAhBkAgoAgAgAmoiADYCACAGIABBAXI2AgQgACAGaiAANgIADAMLIAUoAgQiAEEDcUEBRgRAIABBeHEhBwJAIABB/wFNBEAgBSgCCCIDIABBA3YiAEEDdEGwCGpGGiADIAUoAgwiAUYEQEGICEGICCgCAEF+IAB3cTYCAAwCCyADIAE2AgwgASADNgIIDAELIAUoAhghCAJAIAUgBSgCDCIBRwRAIAUoAggiACABNgIMIAEgADYCCAwBCwJAIAVBFGoiACgCACIDDQAgBUEQaiIAKAIAIgMNAEEAIQEMAQsDQCAAIQQgAyIBQRRqIgAoAgAiAw0AIAFBEGohACABKAIQIgMNAAsgBEEANgIACyAIRQ0AAkAgBSAFKAIcIgNBAnRBuApqIgAoAgBGBEAgACABNgIAIAENAUGMCEGMCCgCAEF+IAN3cTYCAAwCCyAIQRBBFCAIKAIQIAVGG2ogATYCACABRQ0BCyABIAg2AhggBSgCECIABEAgASAANgIQIAAgATYCGAsgBSgCFCIARQ0AIAEgADYCFCAAIAE2AhgLIAUgB2ohBSACIAdqIQILIAUgBSgCBEF+cTYCBCAGIAJBAXI2AgQgAiAGaiACNgIAIAJB/wFNBEAgAkEDdiIAQQN0QbAIaiECAn9BiAgoAgAiAUEBIAB0IgBxRQRAQYgIIAAgAXI2AgAgAgwBCyACKAIICyEAIAIgBjYCCCAAIAY2AgwgBiACNgIMIAYgADYCCAwDC0EfIQAgAkH///8HTQRAIAJBCHYiACAAQYD+P2pBEHZBCHEiA3QiACAAQYDgH2pBEHZBBHEiAXQiACAAQYCAD2pBEHZBAnEiAHRBD3YgASADciAAcmsiAEEBdCACIABBFWp2QQFxckEcaiEACyAGIAA2AhwgBkIANwIQIABBAnRBuApqIQQCQEGMCCgCACIDQQEgAHQiAXFFBEBBjAggASADcjYCACAEIAY2AgAgBiAENgIYDAELIAJBAEEZIABBAXZrIABBH0YbdCEAIAQoAgAhAQNAIAEiAygCBEF4cSACRg0DIABBHXYhASAAQQF0IQAgAyABQQRxaiIEKAIQIgENAAsgBCAGNgIQIAYgAzYCGAsgBiAGNgIMIAYgBjYCCAwCC0GUCCAFQShrIgNBeCABa0EHcUEAIAFBCGpBB3EbIgBrIgI2AgBBoAggACABaiIANgIAIAAgAkEBcjYCBCABIANqQSg2AgRBpAhB8AsoAgA2AgAgByAEQScgBGtBB3FBACAEQSdrQQdxG2pBL2siACAAIAdBEGpJGyICQRs2AgQgAkHQCykCADcCECACQcgLKQIANwIIQdALIAJBCGo2AgBBzAsgBTYCAEHICyABNgIAQdQLQQA2AgAgAkEYaiEAA0AgAEEHNgIEIABBCGohASAAQQRqIQAgASAESQ0ACyACIAdGDQMgAiACKAIEQX5xNgIEIAcgAiAHayIEQQFyNgIEIAIgBDYCACAEQf8BTQRAIARBA3YiAEEDdEGwCGohAgJ/QYgIKAIAIgFBASAAdCIAcUUEQEGICCAAIAFyNgIAIAIMAQsgAigCCAshACACIAc2AgggACAHNgIMIAcgAjYCDCAHIAA2AggMBAtBHyEAIAdCADcCECAEQf///wdNBEAgBEEIdiIAIABBgP4/akEQdkEIcSICdCIAIABBgOAfakEQdkEEcSIBdCIAIABBgIAPakEQdkECcSIAdEEPdiABIAJyIAByayIAQQF0IAQgAEEVanZBAXFyQRxqIQALIAcgADYCHCAAQQJ0QbgKaiEDAkBBjAgoAgAiAkEBIAB0IgFxRQRAQYwIIAEgAnI2AgAgAyAHNgIAIAcgAzYCGAwBCyAEQQBBGSAAQQF2ayAAQR9GG3QhACADKAIAIQEDQCABIgIoAgRBeHEgBEYNBCAAQR12IQEgAEEBdCEAIAIgAUEEcWoiAygCECIBDQALIAMgBzYCECAHIAI2AhgLIAcgBzYCDCAHIAc2AggMAwsgAygCCCIAIAY2AgwgAyAGNgIIIAZBADYCGCAGIAM2AgwgBiAANgIICyAJQQhqIQAMBQsgAigCCCIAIAc2AgwgAiAHNgIIIAdBADYCGCAHIAI2AgwgByAANgIIC0GUCCgCACIAIAhNDQBBlAggACAIayIBNgIAQaAIQaAIKAIAIgIgCGoiADYCACAAIAFBAXI2AgQgAiAIQQNyNgIEIAJBCGohAAwDC0GECEEwNgIAQQAhAAwCCwJAIAVFDQACQCAEKAIcIgJBAnRBuApqIgAoAgAgBEYEQCAAIAE2AgAgAQ0BQYwIIAlBfiACd3EiCTYCAAwCCyAFQRBBFCAFKAIQIARGG2ogATYCACABRQ0BCyABIAU2AhggBCgCECIABEAgASAANgIQIAAgATYCGAsgBCgCFCIARQ0AIAEgADYCFCAAIAE2AhgLAkAgA0EPTQRAIAQgAyAIaiIAQQNyNgIEIAAgBGoiACAAKAIEQQFyNgIEDAELIAQgCEEDcjYCBCAGIANBAXI2AgQgAyAGaiADNgIAIANB/wFNBEAgA0EDdiIAQQN0QbAIaiECAn9BiAgoAgAiAUEBIAB0IgBxRQRAQYgIIAAgAXI2AgAgAgwBCyACKAIICyEAIAIgBjYCCCAAIAY2AgwgBiACNgIMIAYgADYCCAwBC0EfIQAgA0H///8HTQRAIANBCHYiACAAQYD+P2pBEHZBCHEiAnQiACAAQYDgH2pBEHZBBHEiAXQiACAAQYCAD2pBEHZBAnEiAHRBD3YgASACciAAcmsiAEEBdCADIABBFWp2QQFxckEcaiEACyAGIAA2AhwgBkIANwIQIABBAnRBuApqIQICQAJAIAlBASAAdCIBcUUEQEGMCCABIAlyNgIAIAIgBjYCACAGIAI2AhgMAQsgA0EAQRkgAEEBdmsgAEEfRht0IQAgAigCACEIA0AgCCIBKAIEQXhxIANGDQIgAEEddiECIABBAXQhACABIAJBBHFqIgIoAhAiCA0ACyACIAY2AhAgBiABNgIYCyAGIAY2AgwgBiAGNgIIDAELIAEoAggiACAGNgIMIAEgBjYCCCAGQQA2AhggBiABNgIMIAYgADYCCAsgBEEIaiEADAELAkAgC0UNAAJAIAEoAhwiAkECdEG4CmoiACgCACABRgRAIAAgBDYCACAEDQFBjAggBkF+IAJ3cTYCAAwCCyALQRBBFCALKAIQIAFGG2ogBDYCACAERQ0BCyAEIAs2AhggASgCECIABEAgBCAANgIQIAAgBDYCGAsgASgCFCIARQ0AIAQgADYCFCAAIAQ2AhgLAkAgA0EPTQRAIAEgAyAIaiIAQQNyNgIEIAAgAWoiACAAKAIEQQFyNgIEDAELIAEgCEEDcjYCBCAJIANBAXI2AgQgAyAJaiADNgIAIAoEQCAKQQN2IgBBA3RBsAhqIQRBnAgoAgAhAgJ/QQEgAHQiACAFcUUEQEGICCAAIAVyNgIAIAQMAQsgBCgCCAshACAEIAI2AgggACACNgIMIAIgBDYCDCACIAA2AggLQZwIIAk2AgBBkAggAzYCAAsgAUEIaiEACyAMQRBqJAAgAAsQACMAIABrQXBxIgAkACAACwYAIAAkAAsEACMAC4AJAgh/BH4jAEGQAWsiBiQAIAYgBS0AA0EYdEGAgIAYcSAFLwAAIAUtAAJBEHRycjYCACAGIAUoAANBAnZBg/7/H3E2AgQgBiAFKAAGQQR2Qf+B/x9xNgIIIAYgBSgACUEGdkH//8AfcTYCDCAFLwANIQggBS0ADyEJIAZCADcCFCAGQgA3AhwgBkEANgIkIAYgCCAJQRB0QYCAPHFyNgIQIAYgBSgAEDYCKCAGIAUoABQ2AiwgBiAFKAAYNgIwIAUoABwhBSAGQQA6AEwgBkEANgI4IAYgBTYCNCAGIAEgAhAEIAQEQCAGIAMgBBAECyAGKAI4IgEEQCAGQTxqIgIgAWpBAToAACABQQFqQQ9NBEAgASAGakE9aiEEAkBBDyABayIDRQ0AIAMgBGoiAUEBa0EAOgAAIARBADoAACADQQNJDQAgAUECa0EAOgAAIARBADoAASABQQNrQQA6AAAgBEEAOgACIANBB0kNACABQQRrQQA6AAAgBEEAOgADIANBCUkNACAEQQAgBGtBA3EiAWoiBEEANgIAIAQgAyABa0F8cSIBaiIDQQRrQQA2AgAgAUEJSQ0AIARBADYCCCAEQQA2AgQgA0EIa0EANgIAIANBDGtBADYCACABQRlJDQAgBEEANgIYIARBADYCFCAEQQA2AhAgBEEANgIMIANBEGtBADYCACADQRRrQQA2AgAgA0EYa0EANgIAIANBHGtBADYCACABIARBBHFBGHIiAWsiA0EgSQ0AIAEgBGohAQNAIAFCADcDGCABQgA3AxAgAUIANwMIIAFCADcDACABQSBqIQEgA0EgayIDQR9LDQALCwsgBkEBOgBMIAYgAkEQEAILIAY1AjQhECAGNQIwIREgBjUCLCEOIAAgBjUCKCAGKAIkIAYoAiAgBigCHCAGKAIYIgNBGnZqIgJBGnZqIgFBGnZqIgtBgICAYHIgAUH///8fcSINIAJB////H3EiCCAGKAIUIAtBGnZBBWxqIgFB////H3EiCUEFaiIFQRp2IANB////H3EgAUEadmoiA2oiAUEadmoiAkEadmoiBEEadmoiDEEfdSIHIANxIAEgDEEfdkEBayIDQf///x9xIgpxciIBQRp0IAUgCnEgByAJcXJyrXwiDzwAACAAIA9CGIg8AAMgACAPQhCIPAACIAAgD0IIiDwAASAAIA4gByAIcSACIApxciICQRR0IAFBBnZyrXwgD0IgiHwiDjwABCAAIA5CGIg8AAcgACAOQhCIPAAGIAAgDkIIiDwABSAAIBEgByANcSAEIApxciIBQQ50IAJBDHZyrXwgDkIgiHwiDjwACCAAIA5CGIg8AAsgACAOQhCIPAAKIAAgDkIIiDwACSAAIBAgAyAMcSAHIAtxckEIdCABQRJ2cq18IA5CIIh8Ig48AAwgACAOQhiIPAAPIAAgDkIQiDwADiAAIA5CCIg8AA0gBkIANwIwIAZCADcCKCAGQgA3AiAgBkIANwIYIAZCADcCECAGQgA3AgggBkIANwIAIAZBkAFqJAALpwwBB38CQCAARQ0AIABBCGsiAyAAQQRrKAIAIgFBeHEiAGohBQJAIAFBAXENACABQQNxRQ0BIAMgAygCACIBayIDQZgIKAIASQ0BIAAgAWohACADQZwIKAIARwRAIAFB/wFNBEAgAygCCCICIAFBA3YiBEEDdEGwCGpGGiACIAMoAgwiAUYEQEGICEGICCgCAEF+IAR3cTYCAAwDCyACIAE2AgwgASACNgIIDAILIAMoAhghBgJAIAMgAygCDCIBRwRAIAMoAggiAiABNgIMIAEgAjYCCAwBCwJAIANBFGoiAigCACIEDQAgA0EQaiICKAIAIgQNAEEAIQEMAQsDQCACIQcgBCIBQRRqIgIoAgAiBA0AIAFBEGohAiABKAIQIgQNAAsgB0EANgIACyAGRQ0BAkAgAyADKAIcIgJBAnRBuApqIgQoAgBGBEAgBCABNgIAIAENAUGMCEGMCCgCAEF+IAJ3cTYCAAwDCyAGQRBBFCAGKAIQIANGG2ogATYCACABRQ0CCyABIAY2AhggAygCECICBEAgASACNgIQIAIgATYCGAsgAygCFCICRQ0BIAEgAjYCFCACIAE2AhgMAQsgBSgCBCIBQQNxQQNHDQBBkAggADYCACAFIAFBfnE2AgQgAyAAQQFyNgIEIAAgA2ogADYCAA8LIAMgBU8NACAFKAIEIgFBAXFFDQACQCABQQJxRQRAIAVBoAgoAgBGBEBBoAggAzYCAEGUCEGUCCgCACAAaiIANgIAIAMgAEEBcjYCBCADQZwIKAIARw0DQZAIQQA2AgBBnAhBADYCAA8LIAVBnAgoAgBGBEBBnAggAzYCAEGQCEGQCCgCACAAaiIANgIAIAMgAEEBcjYCBCAAIANqIAA2AgAPCyABQXhxIABqIQACQCABQf8BTQRAIAUoAggiAiABQQN2IgRBA3RBsAhqRhogAiAFKAIMIgFGBEBBiAhBiAgoAgBBfiAEd3E2AgAMAgsgAiABNgIMIAEgAjYCCAwBCyAFKAIYIQYCQCAFIAUoAgwiAUcEQCAFKAIIIgJBmAgoAgBJGiACIAE2AgwgASACNgIIDAELAkAgBUEUaiICKAIAIgQNACAFQRBqIgIoAgAiBA0AQQAhAQwBCwNAIAIhByAEIgFBFGoiAigCACIEDQAgAUEQaiECIAEoAhAiBA0ACyAHQQA2AgALIAZFDQACQCAFIAUoAhwiAkECdEG4CmoiBCgCAEYEQCAEIAE2AgAgAQ0BQYwIQYwIKAIAQX4gAndxNgIADAILIAZBEEEUIAYoAhAgBUYbaiABNgIAIAFFDQELIAEgBjYCGCAFKAIQIgIEQCABIAI2AhAgAiABNgIYCyAFKAIUIgJFDQAgASACNgIUIAIgATYCGAsgAyAAQQFyNgIEIAAgA2ogADYCACADQZwIKAIARw0BQZAIIAA2AgAPCyAFIAFBfnE2AgQgAyAAQQFyNgIEIAAgA2ogADYCAAsgAEH/AU0EQCAAQQN2IgFBA3RBsAhqIQACf0GICCgCACICQQEgAXQiAXFFBEBBiAggASACcjYCACAADAELIAAoAggLIQIgACADNgIIIAIgAzYCDCADIAA2AgwgAyACNgIIDwtBHyECIANCADcCECAAQf///wdNBEAgAEEIdiIBIAFBgP4/akEQdkEIcSIBdCICIAJBgOAfakEQdkEEcSICdCIEIARBgIAPakEQdkECcSIEdEEPdiABIAJyIARyayIBQQF0IAAgAUEVanZBAXFyQRxqIQILIAMgAjYCHCACQQJ0QbgKaiEBAkACQAJAQYwIKAIAIgRBASACdCIHcUUEQEGMCCAEIAdyNgIAIAEgAzYCACADIAE2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgASgCACEBA0AgASIEKAIEQXhxIABGDQIgAkEddiEBIAJBAXQhAiAEIAFBBHFqIgdBEGooAgAiAQ0ACyAHIAM2AhAgAyAENgIYCyADIAM2AgwgAyADNgIIDAELIAQoAggiACADNgIMIAQgAzYCCCADQQA2AhggAyAENgIMIAMgADYCCAtBqAhBqAgoAgBBAWsiAEF/IAAbNgIACwsLCQEAQYEICwIGUA==";if(!W.startsWith(V)){var na=W;W=b.locateFile?b.locateFile(na,B):B+na}function pa(){var a=W;try{if(a==W&&J)return new Uint8Array(J);var c=H(a);if(c)return c;if(E)return E(a);throw"both async and sync fetching of the wasm failed";}catch(d){K(d)}}
function qa(){if(!J&&(x||y)){if("function"===typeof fetch&&!W.startsWith("file://"))return fetch(W,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+W+"'";return a.arrayBuffer()}).catch(function(){return pa()});if(D)return new Promise(function(a,c){D(W,function(d){a(new Uint8Array(d))},c)})}return Promise.resolve().then(function(){return pa()})}
function X(a){for(;0<a.length;){var c=a.shift();if("function"==typeof c)c(b);else{var d=c.m;"number"===typeof d?void 0===c.l?R.get(d)():R.get(d)(c.l):d(void 0===c.l?null:c.l)}}}
var ba=!1,ra="function"===typeof atob?atob:function(a){var c="",d=0;a=a.replace(/[^A-Za-z0-9\+\/=]/g,"");do{var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(d++));var f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(d++));var l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(d++));var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(d++));e=e<<
2|f>>4;f=(f&15)<<4|l>>2;var t=(l&3)<<6|A;c+=String.fromCharCode(e);64!==l&&(c+=String.fromCharCode(f));64!==A&&(c+=String.fromCharCode(t))}while(d<a.length);return c};
function H(a){if(a.startsWith(V)){a=a.slice(V.length);if("boolean"===typeof z&&z){var c=Buffer.from(a,"base64");c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength)}else try{var d=ra(a),e=new Uint8Array(d.length);for(a=0;a<d.length;++a)e[a]=d.charCodeAt(a);c=e}catch(f){throw Error("Converting base64 string to bytes failed.");}return c}}
var sa={a:function(a){var c=P.length;a>>>=0;if(2147483648<a)return!1;for(var d=1;4>=d;d*=2){var e=c*(1+.2/d);e=Math.min(e,a+100663296);e=Math.max(a,e);0<e%65536&&(e+=65536-e%65536);a:{try{L.grow(Math.min(2147483648,e)-ha.byteLength+65535>>>16);ia();var f=1;break a}catch(l){}f=void 0}if(f)return!0}return!1}};
(function(){function a(f){b.asm=f.exports;L=b.asm.b;ia();R=b.asm.j;ka.unshift(b.asm.c);S--;b.monitorRunDependencies&&b.monitorRunDependencies(S);0==S&&(null!==T&&(clearInterval(T),T=null),U&&(f=U,U=null,f()))}function c(f){a(f.instance)}function d(f){return qa().then(function(l){return WebAssembly.instantiate(l,e)}).then(f,function(l){I("failed to asynchronously prepare wasm: "+l);K(l)})}var e={a:sa};S++;b.monitorRunDependencies&&b.monitorRunDependencies(S);if(b.instantiateWasm)try{return b.instantiateWasm(e,
a)}catch(f){return I("Module.instantiateWasm callback failed with error: "+f),!1}(function(){return J||"function"!==typeof WebAssembly.instantiateStreaming||W.startsWith(V)||W.startsWith("file://")||"function"!==typeof fetch?d(c):fetch(W,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,e).then(c,function(l){I("wasm streaming compile failed: "+l);I("falling back to ArrayBuffer instantiation");return d(c)})})})().catch(r);return{}})();
b.___wasm_call_ctors=function(){return(b.___wasm_call_ctors=b.asm.c).apply(null,arguments)};b._poly1305_auth=function(){return(b._poly1305_auth=b.asm.d).apply(null,arguments)};var da=b.stackSave=function(){return(da=b.stackSave=b.asm.e).apply(null,arguments)},fa=b.stackRestore=function(){return(fa=b.stackRestore=b.asm.f).apply(null,arguments)},O=b.stackAlloc=function(){return(O=b.stackAlloc=b.asm.g).apply(null,arguments)};b._malloc=function(){return(b._malloc=b.asm.h).apply(null,arguments)};
b._free=function(){return(b._free=b.asm.i).apply(null,arguments)};b.cwrap=function(a,c,d,e){d=d||[];var f=d.every(function(l){return"number"===l});return"string"!==c&&f&&!e?N(a):function(){return ca(a,c,d,arguments)}};var Y;U=function ta(){Y||Z();Y||(U=ta)};
function Z(){function a(){if(!Y&&(Y=!0,b.calledRun=!0,!M)){X(ka);q(b);if(b.onRuntimeInitialized)b.onRuntimeInitialized();if(b.postRun)for("function"==typeof b.postRun&&(b.postRun=[b.postRun]);b.postRun.length;){var c=b.postRun.shift();la.unshift(c)}X(la)}}if(!(0<S)){if(b.preRun)for("function"==typeof b.preRun&&(b.preRun=[b.preRun]);b.preRun.length;)ma();X(ja);0<S||(b.setStatus?(b.setStatus("Running..."),setTimeout(function(){setTimeout(function(){b.setStatus("")},1);a()},1)):a())}}b.run=Z;
if(b.preInit)for("function"==typeof b.preInit&&(b.preInit=[b.preInit]);0<b.preInit.length;)b.preInit.pop()();Z();


  return createPoly1305.ready
}
);
})();
if (true)
  module.exports = createPoly1305;
else {}


/***/ }),

/***/ 172:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const MESSAGE_HANDLERS = new Array(256);
[
  __nccwpck_require__(4126).HANDLERS,
  __nccwpck_require__(6475),
].forEach((handlers) => {
  // eslint-disable-next-line prefer-const
  for (let [type, handler] of Object.entries(handlers)) {
    type = +type;
    if (isFinite(type) && type >= 0 && type < MESSAGE_HANDLERS.length)
      MESSAGE_HANDLERS[type] = handler;
  }
});

module.exports = MESSAGE_HANDLERS;


/***/ }),

/***/ 6475:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  bufferSlice,
  bufferParser,
  doFatalError,
  sigSSHToASN1,
  writeUInt32BE,
} = __nccwpck_require__(9475);

const {
  CHANNEL_OPEN_FAILURE,
  COMPAT,
  MESSAGE,
  TERMINAL_MODE,
} = __nccwpck_require__(6832);

const {
  parseKey,
} = __nccwpck_require__(2218);

const TERMINAL_MODE_BY_VALUE =
  Array.from(Object.entries(TERMINAL_MODE))
       .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

module.exports = {
  // Transport layer protocol ==================================================
  [MESSAGE.DISCONNECT]: (self, payload) => {
    /*
      byte      SSH_MSG_DISCONNECT
      uint32    reason code
      string    description in ISO-10646 UTF-8 encoding
      string    language tag
    */
    bufferParser.init(payload, 1);
    const reason = bufferParser.readUInt32BE();
    const desc = bufferParser.readString(true);
    const lang = bufferParser.readString();
    bufferParser.clear();

    if (lang === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed DISCONNECT packet'
      );
    }

    self._debug && self._debug(
      `Inbound: Received DISCONNECT (${reason}, "${desc}")`
    );

    const handler = self._handlers.DISCONNECT;
    handler && handler(self, reason, desc);
  },
  [MESSAGE.IGNORE]: (self, payload) => {
    /*
      byte      SSH_MSG_IGNORE
      string    data
    */
    self._debug && self._debug('Inbound: Received IGNORE');
  },
  [MESSAGE.UNIMPLEMENTED]: (self, payload) => {
    /*
      byte      SSH_MSG_UNIMPLEMENTED
      uint32    packet sequence number of rejected message
    */
    bufferParser.init(payload, 1);
    const seqno = bufferParser.readUInt32BE();
    bufferParser.clear();

    if (seqno === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed UNIMPLEMENTED packet'
      );
    }

    self._debug
      && self._debug(`Inbound: Received UNIMPLEMENTED (seqno ${seqno})`);
  },
  [MESSAGE.DEBUG]: (self, payload) => {
    /*
      byte      SSH_MSG_DEBUG
      boolean   always_display
      string    message in ISO-10646 UTF-8 encoding [RFC3629]
      string    language tag [RFC3066]
    */
    bufferParser.init(payload, 1);
    const display = bufferParser.readBool();
    const msg = bufferParser.readString(true);
    const lang = bufferParser.readString();
    bufferParser.clear();

    if (lang === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed DEBUG packet'
      );
    }

    self._debug && self._debug('Inbound: Received DEBUG');

    const handler = self._handlers.DEBUG;
    handler && handler(self, display, msg);
  },
  [MESSAGE.SERVICE_REQUEST]: (self, payload) => {
    /*
      byte      SSH_MSG_SERVICE_REQUEST
      string    service name
    */
    bufferParser.init(payload, 1);
    const name = bufferParser.readString(true);
    bufferParser.clear();

    if (name === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed SERVICE_REQUEST packet'
      );
    }

    self._debug && self._debug(`Inbound: Received SERVICE_REQUEST (${name})`);

    const handler = self._handlers.SERVICE_REQUEST;
    handler && handler(self, name);
  },
  [MESSAGE.SERVICE_ACCEPT]: (self, payload) => {
    // S->C
    /*
      byte      SSH_MSG_SERVICE_ACCEPT
      string    service name
    */
    bufferParser.init(payload, 1);
    const name = bufferParser.readString(true);
    bufferParser.clear();

    if (name === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed SERVICE_ACCEPT packet'
      );
    }

    self._debug && self._debug(`Inbound: Received SERVICE_ACCEPT (${name})`);

    const handler = self._handlers.SERVICE_ACCEPT;
    handler && handler(self, name);
  },

  // User auth protocol -- generic =============================================
  [MESSAGE.USERAUTH_REQUEST]: (self, payload) => {
    /*
      byte      SSH_MSG_USERAUTH_REQUEST
      string    user name in ISO-10646 UTF-8 encoding [RFC3629]
      string    service name in US-ASCII
      string    method name in US-ASCII
      ....      method specific fields
    */
    bufferParser.init(payload, 1);
    const user = bufferParser.readString(true);
    const service = bufferParser.readString(true);
    const method = bufferParser.readString(true);
    let methodData;
    let methodDesc;
    switch (method) {
      case 'none':
        methodData = null;
        break;
      case 'password': {
        /*
          boolean   <new password follows (old) plaintext password?>
          string    plaintext password in ISO-10646 UTF-8 encoding [RFC3629]
         [string    new password]
        */
        const isChange = bufferParser.readBool();
        if (isChange !== undefined) {
          methodData = bufferParser.readString(true);
          if (methodData !== undefined && isChange) {
            const newPassword = bufferParser.readString(true);
            if (newPassword !== undefined)
              methodData = { oldPassword: methodData, newPassword };
            else
              methodData = undefined;
          }
        }
        break;
      }
      case 'publickey': {
        /*
          boolean   <signature follows public key blob?>
          string    public key algorithm name
          string    public key blob
         [string    signature]
        */
        const hasSig = bufferParser.readBool();
        if (hasSig !== undefined) {
          const keyAlgo = bufferParser.readString(true);
          const key = bufferParser.readString();
          if (hasSig) {
            const blobEnd = bufferParser.pos();
            let signature = bufferParser.readString();
            if (signature !== undefined) {
              if (signature.length > (4 + keyAlgo.length + 4)
                  && signature.utf8Slice(4, 4 + keyAlgo.length) === keyAlgo) {
                // Skip algoLen + algo + sigLen
                signature = bufferSlice(signature, 4 + keyAlgo.length + 4);
              }

              signature = sigSSHToASN1(signature, keyAlgo);
              if (signature) {
                const sessionID = self._kex.sessionID;
                const blob = Buffer.allocUnsafe(4 + sessionID.length + blobEnd);
                writeUInt32BE(blob, sessionID.length, 0);
                blob.set(sessionID, 4);
                blob.set(
                  new Uint8Array(payload.buffer, payload.byteOffset, blobEnd),
                  4 + sessionID.length
                );
                methodData = {
                  keyAlgo,
                  key,
                  signature,
                  blob,
                };
              }
            }
          } else {
            methodData = { keyAlgo, key };
            methodDesc = 'publickey -- check';
          }
        }
        break;
      }
      case 'hostbased': {
        /*
          string    public key algorithm for host key
          string    public host key and certificates for client host
          string    client host name expressed as the FQDN in US-ASCII
          string    user name on the client host in ISO-10646 UTF-8 encoding
                     [RFC3629]
          string    signature
        */
        const keyAlgo = bufferParser.readString(true);
        const key = bufferParser.readString();
        const localHostname = bufferParser.readString(true);
        const localUsername = bufferParser.readString(true);

        const blobEnd = bufferParser.pos();
        let signature = bufferParser.readString();
        if (signature !== undefined) {
          if (signature.length > (4 + keyAlgo.length + 4)
              && signature.utf8Slice(4, 4 + keyAlgo.length) === keyAlgo) {
            // Skip algoLen + algo + sigLen
            signature = bufferSlice(signature, 4 + keyAlgo.length + 4);
          }

          signature = sigSSHToASN1(signature, keyAlgo);
          if (signature !== undefined) {
            const sessionID = self._kex.sessionID;
            const blob = Buffer.allocUnsafe(4 + sessionID.length + blobEnd);
            writeUInt32BE(blob, sessionID.length, 0);
            blob.set(sessionID, 4);
            blob.set(
              new Uint8Array(payload.buffer, payload.byteOffset, blobEnd),
              4 + sessionID.length
            );
            methodData = {
              keyAlgo,
              key,
              signature,
              blob,
              localHostname,
              localUsername,
            };
          }
        }
        break;
      }
      case 'keyboard-interactive':
        /*
          string    language tag (as defined in [RFC-3066])
          string    submethods (ISO-10646 UTF-8)
        */
        // Skip/ignore language field -- it's deprecated in RFC 4256
        bufferParser.skipString();

        methodData = bufferParser.readList();
        break;
      default:
        if (method !== undefined)
          methodData = bufferParser.readRaw();
    }
    bufferParser.clear();

    if (methodData === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed USERAUTH_REQUEST packet'
      );
    }

    if (methodDesc === undefined)
      methodDesc = method;

    self._authsQueue.push(method);

    self._debug
      && self._debug(`Inbound: Received USERAUTH_REQUEST (${methodDesc})`);

    const handler = self._handlers.USERAUTH_REQUEST;
    handler && handler(self, user, service, method, methodData);
  },
  [MESSAGE.USERAUTH_FAILURE]: (self, payload) => {
    // S->C
    /*
      byte         SSH_MSG_USERAUTH_FAILURE
      name-list    authentications that can continue
      boolean      partial success
    */
    bufferParser.init(payload, 1);
    const authMethods = bufferParser.readList();
    const partialSuccess = bufferParser.readBool();
    bufferParser.clear();

    if (partialSuccess === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed USERAUTH_FAILURE packet'
      );
    }

    self._debug
      && self._debug(`Inbound: Received USERAUTH_FAILURE (${authMethods})`);

    self._authsQueue.shift();
    const handler = self._handlers.USERAUTH_FAILURE;
    handler && handler(self, authMethods, partialSuccess);
  },
  [MESSAGE.USERAUTH_SUCCESS]: (self, payload) => {
    // S->C
    /*
      byte      SSH_MSG_USERAUTH_SUCCESS
    */
    self._debug && self._debug('Inbound: Received USERAUTH_SUCCESS');

    self._authsQueue.shift();
    const handler = self._handlers.USERAUTH_SUCCESS;
    handler && handler(self);
  },
  [MESSAGE.USERAUTH_BANNER]: (self, payload) => {
    // S->C
    /*
      byte      SSH_MSG_USERAUTH_BANNER
      string    message in ISO-10646 UTF-8 encoding [RFC3629]
      string    language tag [RFC3066]
    */
    bufferParser.init(payload, 1);
    const msg = bufferParser.readString(true);
    const lang = bufferParser.readString();
    bufferParser.clear();

    if (lang === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed USERAUTH_BANNER packet'
      );
    }

    self._debug && self._debug('Inbound: Received USERAUTH_BANNER');

    const handler = self._handlers.USERAUTH_BANNER;
    handler && handler(self, msg);
  },

  // User auth protocol -- method-specific =====================================
  60: (self, payload) => {
    if (!self._authsQueue.length) {
      self._debug
        && self._debug('Inbound: Received payload type 60 without auth');
      return;
    }

    switch (self._authsQueue[0]) {
      case 'password': {
        // S->C
        /*
          byte      SSH_MSG_USERAUTH_PASSWD_CHANGEREQ
          string    prompt in ISO-10646 UTF-8 encoding [RFC3629]
          string    language tag [RFC3066]
        */
        bufferParser.init(payload, 1);
        const prompt = bufferParser.readString(true);
        const lang = bufferParser.readString();
        bufferParser.clear();

        if (lang === undefined) {
          return doFatalError(
            self,
            'Inbound: Malformed USERAUTH_PASSWD_CHANGEREQ packet'
          );
        }

        self._debug
          && self._debug('Inbound: Received USERAUTH_PASSWD_CHANGEREQ');

        const handler = self._handlers.USERAUTH_PASSWD_CHANGEREQ;
        handler && handler(self, prompt);
        break;
      }
      case 'publickey': {
        // S->C
        /*
          byte      SSH_MSG_USERAUTH_PK_OK
          string    public key algorithm name from the request
          string    public key blob from the request
        */
        bufferParser.init(payload, 1);
        const keyAlgo = bufferParser.readString(true);
        const key = bufferParser.readString();
        bufferParser.clear();

        if (key === undefined) {
          return doFatalError(
            self,
            'Inbound: Malformed USERAUTH_PK_OK packet'
          );
        }

        self._debug && self._debug('Inbound: Received USERAUTH_PK_OK');

        self._authsQueue.shift();
        const handler = self._handlers.USERAUTH_PK_OK;
        handler && handler(self, keyAlgo, key);
        break;
      }
      case 'keyboard-interactive': {
        // S->C
        /*
          byte      SSH_MSG_USERAUTH_INFO_REQUEST
          string    name (ISO-10646 UTF-8)
          string    instruction (ISO-10646 UTF-8)
          string    language tag (as defined in [RFC-3066])
          int       num-prompts
          string    prompt[1] (ISO-10646 UTF-8)
          boolean   echo[1]
          ...
          string    prompt[num-prompts] (ISO-10646 UTF-8)
          boolean   echo[num-prompts]
        */
        bufferParser.init(payload, 1);
        const name = bufferParser.readString(true);
        const instructions = bufferParser.readString(true);
        bufferParser.readString(); // skip lang
        const numPrompts = bufferParser.readUInt32BE();
        let prompts;
        if (numPrompts !== undefined) {
          prompts = new Array(numPrompts);
          let i;
          for (i = 0; i < numPrompts; ++i) {
            const prompt = bufferParser.readString(true);
            const echo = bufferParser.readBool();
            if (echo === undefined)
              break;
            prompts[i] = { prompt, echo };
          }
          if (i !== numPrompts)
            prompts = undefined;
        }
        bufferParser.clear();

        if (prompts === undefined) {
          return doFatalError(
            self,
            'Inbound: Malformed USERAUTH_INFO_REQUEST packet'
          );
        }

        self._debug && self._debug('Inbound: Received USERAUTH_INFO_REQUEST');

        const handler = self._handlers.USERAUTH_INFO_REQUEST;
        handler && handler(self, name, instructions, prompts);
        break;
      }
      default:
        self._debug
          && self._debug('Inbound: Received unexpected payload type 60');
    }
  },
  61: (self, payload) => {
    if (!self._authsQueue.length) {
      self._debug
        && self._debug('Inbound: Received payload type 61 without auth');
      return;
    }
    /*
      byte      SSH_MSG_USERAUTH_INFO_RESPONSE
      int       num-responses
      string    response[1] (ISO-10646 UTF-8)
      ...
      string    response[num-responses] (ISO-10646 UTF-8)
    */
    if (self._authsQueue[0] !== 'keyboard-interactive') {
      return doFatalError(
        self,
        'Inbound: Received unexpected payload type 61'
      );
    }
    bufferParser.init(payload, 1);
    const numResponses = bufferParser.readUInt32BE();
    let responses;
    if (numResponses !== undefined) {
      responses = new Array(numResponses);
      let i;
      for (i = 0; i < numResponses; ++i) {
        const response = bufferParser.readString(true);
        if (response === undefined)
          break;
        responses[i] = response;
      }
      if (i !== numResponses)
        responses = undefined;
    }
    bufferParser.clear();

    if (responses === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed USERAUTH_INFO_RESPONSE packet'
      );
    }

    self._debug && self._debug('Inbound: Received USERAUTH_INFO_RESPONSE');

    const handler = self._handlers.USERAUTH_INFO_RESPONSE;
    handler && handler(self, responses);
  },

  // Connection protocol -- generic ============================================
  [MESSAGE.GLOBAL_REQUEST]: (self, payload) => {
    /*
      byte      SSH_MSG_GLOBAL_REQUEST
      string    request name in US-ASCII only
      boolean   want reply
      ....      request-specific data follows
    */
    bufferParser.init(payload, 1);
    const name = bufferParser.readString(true);
    const wantReply = bufferParser.readBool();
    let data;
    if (wantReply !== undefined) {
      switch (name) {
        case 'tcpip-forward':
        case 'cancel-tcpip-forward': {
          /*
            string    address to bind (e.g., "0.0.0.0")
            uint32    port number to bind
          */
          const bindAddr = bufferParser.readString(true);
          const bindPort = bufferParser.readUInt32BE();
          if (bindPort !== undefined)
            data = { bindAddr, bindPort };
          break;
        }
        case 'streamlocal-forward@openssh.com':
        case 'cancel-streamlocal-forward@openssh.com': {
          /*
            string    socket path
          */
          const socketPath = bufferParser.readString(true);
          if (socketPath !== undefined)
            data = { socketPath };
          break;
        }
        case 'no-more-sessions@openssh.com':
          data = null;
          break;
        case 'hostkeys-00@openssh.com': {
          data = [];
          while (bufferParser.avail() > 0) {
            const keyRaw = bufferParser.readString();
            if (keyRaw === undefined) {
              data = undefined;
              break;
            }
            const key = parseKey(keyRaw);
            if (!(key instanceof Error))
              data.push(key);
          }
          break;
        }
        default:
          data = bufferParser.readRaw();
      }
    }
    bufferParser.clear();

    if (data === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed GLOBAL_REQUEST packet'
      );
    }

    self._debug && self._debug(`Inbound: GLOBAL_REQUEST (${name})`);

    const handler = self._handlers.GLOBAL_REQUEST;
    if (handler)
      handler(self, name, wantReply, data);
    else
      self.requestFailure(); // Auto reject
  },
  [MESSAGE.REQUEST_SUCCESS]: (self, payload) => {
    /*
      byte      SSH_MSG_REQUEST_SUCCESS
      ....     response specific data
    */
    const data = (payload.length > 1 ? bufferSlice(payload, 1) : null);

    self._debug && self._debug('Inbound: REQUEST_SUCCESS');

    const handler = self._handlers.REQUEST_SUCCESS;
    handler && handler(self, data);
  },
  [MESSAGE.REQUEST_FAILURE]: (self, payload) => {
    /*
      byte      SSH_MSG_REQUEST_FAILURE
    */
    self._debug && self._debug('Inbound: Received REQUEST_FAILURE');

    const handler = self._handlers.REQUEST_FAILURE;
    handler && handler(self);
  },

  // Connection protocol -- channel-related ====================================
  [MESSAGE.CHANNEL_OPEN]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_OPEN
      string    channel type in US-ASCII only
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      ....      channel type specific data follows
    */
    bufferParser.init(payload, 1);
    const type = bufferParser.readString(true);
    const sender = bufferParser.readUInt32BE();
    const window = bufferParser.readUInt32BE();
    const packetSize = bufferParser.readUInt32BE();
    let channelInfo;

    switch (type) {
      case 'forwarded-tcpip': // S->C
      case 'direct-tcpip': { // C->S
        /*
          string    address that was connected / host to connect
          uint32    port that was connected / port to connect
          string    originator IP address
          uint32    originator port
        */
        const destIP = bufferParser.readString(true);
        const destPort = bufferParser.readUInt32BE();
        const srcIP = bufferParser.readString(true);
        const srcPort = bufferParser.readUInt32BE();
        if (srcPort !== undefined) {
          channelInfo = {
            type,
            sender,
            window,
            packetSize,
            data: { destIP, destPort, srcIP, srcPort }
          };
        }
        break;
      }
      case 'forwarded-streamlocal@openssh.com': // S->C
      case 'direct-streamlocal@openssh.com': { // C->S
        /*
          string    socket path
          string    reserved for future use

          (direct-streamlocal@openssh.com additionally has:)
          uint32    reserved
        */
        const socketPath = bufferParser.readString(true);
        if (socketPath !== undefined) {
          channelInfo = {
            type,
            sender,
            window,
            packetSize,
            data: { socketPath }
          };
        }
        break;
      }
      case 'x11': { // S->C
        /*
          string    originator address (e.g., "192.168.7.38")
          uint32    originator port
        */
        const srcIP = bufferParser.readString(true);
        const srcPort = bufferParser.readUInt32BE();
        if (srcPort !== undefined) {
          channelInfo = {
            type,
            sender,
            window,
            packetSize,
            data: { srcIP, srcPort }
          };
        }
        break;
      }
      default:
        // Includes:
        //   'session' (C->S)
        //   'auth-agent@openssh.com' (S->C)
        channelInfo = {
          type,
          sender,
          window,
          packetSize,
          data: {}
        };
    }
    bufferParser.clear();

    if (channelInfo === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_OPEN packet'
      );
    }

    self._debug && self._debug(`Inbound: CHANNEL_OPEN (s:${sender}, ${type})`);

    const handler = self._handlers.CHANNEL_OPEN;
    if (handler) {
      handler(self, channelInfo);
    } else {
      self.channelOpenFail(
        channelInfo.sender,
        CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED,
        '',
        ''
      );
    }
  },
  [MESSAGE.CHANNEL_OPEN_CONFIRMATION]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_OPEN_CONFIRMATION
      uint32    recipient channel
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      ....      channel type specific data follows
    */
    // "The 'recipient channel' is the channel number given in the
    // original open request, and 'sender channel' is the channel number
    // allocated by the other side."
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    const sender = bufferParser.readUInt32BE();
    const window = bufferParser.readUInt32BE();
    const packetSize = bufferParser.readUInt32BE();
    const data = (bufferParser.avail() ? bufferParser.readRaw() : undefined);
    bufferParser.clear();

    if (packetSize === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_OPEN_CONFIRMATION packet'
      );
    }

    self._debug && self._debug(
      `Inbound: CHANNEL_OPEN_CONFIRMATION (r:${recipient}, s:${sender})`
    );

    const handler = self._handlers.CHANNEL_OPEN_CONFIRMATION;
    if (handler)
      handler(self, { recipient, sender, window, packetSize, data });
  },
  [MESSAGE.CHANNEL_OPEN_FAILURE]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_OPEN_FAILURE
      uint32    recipient channel
      uint32    reason code
      string    description in ISO-10646 UTF-8 encoding [RFC3629]
      string    language tag [RFC3066]
    */
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    const reason = bufferParser.readUInt32BE();
    const description = bufferParser.readString(true);
    const lang = bufferParser.readString();
    bufferParser.clear();

    if (lang === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_OPEN_FAILURE packet'
      );
    }

    self._debug
      && self._debug(`Inbound: CHANNEL_OPEN_FAILURE (r:${recipient})`);

    const handler = self._handlers.CHANNEL_OPEN_FAILURE;
    handler && handler(self, recipient, reason, description);
  },
  [MESSAGE.CHANNEL_WINDOW_ADJUST]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_WINDOW_ADJUST
      uint32    recipient channel
      uint32    bytes to add
    */
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    const bytesToAdd = bufferParser.readUInt32BE();
    bufferParser.clear();

    if (bytesToAdd === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_WINDOW_ADJUST packet'
      );
    }

    self._debug && self._debug(
      `Inbound: CHANNEL_WINDOW_ADJUST (r:${recipient}, ${bytesToAdd})`
    );

    const handler = self._handlers.CHANNEL_WINDOW_ADJUST;
    handler && handler(self, recipient, bytesToAdd);
  },
  [MESSAGE.CHANNEL_DATA]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_DATA
      uint32    recipient channel
      string    data
    */
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    const data = bufferParser.readString();
    bufferParser.clear();

    if (data === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_DATA packet'
      );
    }

    self._debug
      && self._debug(`Inbound: CHANNEL_DATA (r:${recipient}, ${data.length})`);

    const handler = self._handlers.CHANNEL_DATA;
    handler && handler(self, recipient, data);
  },
  [MESSAGE.CHANNEL_EXTENDED_DATA]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_EXTENDED_DATA
      uint32    recipient channel
      uint32    data_type_code
      string    data
    */
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    const type = bufferParser.readUInt32BE();
    const data = bufferParser.readString();
    bufferParser.clear();

    if (data === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_EXTENDED_DATA packet'
      );
    }

    self._debug && self._debug(
      `Inbound: CHANNEL_EXTENDED_DATA (r:${recipient}, ${data.length})`
    );

    const handler = self._handlers.CHANNEL_EXTENDED_DATA;
    handler && handler(self, recipient, data, type);
  },
  [MESSAGE.CHANNEL_EOF]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_EOF
      uint32    recipient channel
    */
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    bufferParser.clear();

    if (recipient === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_EOF packet'
      );
    }

    self._debug && self._debug(`Inbound: CHANNEL_EOF (r:${recipient})`);

    const handler = self._handlers.CHANNEL_EOF;
    handler && handler(self, recipient);
  },
  [MESSAGE.CHANNEL_CLOSE]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_CLOSE
      uint32    recipient channel
    */
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    bufferParser.clear();

    if (recipient === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_CLOSE packet'
      );
    }

    self._debug && self._debug(`Inbound: CHANNEL_CLOSE (r:${recipient})`);

    const handler = self._handlers.CHANNEL_CLOSE;
    handler && handler(self, recipient);
  },
  [MESSAGE.CHANNEL_REQUEST]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    request type in US-ASCII characters only
      boolean   want reply
      ....      type-specific data follows
    */
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    const type = bufferParser.readString(true);
    const wantReply = bufferParser.readBool();
    let data;
    if (wantReply !== undefined) {
      switch (type) {
        case 'exit-status': // S->C
          /*
            uint32    exit_status
          */
          data = bufferParser.readUInt32BE();
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type}: ${data})`
          );
          break;
        case 'exit-signal': { // S->C
          /*
            string    signal name (without the "SIG" prefix)
            boolean   core dumped
            string    error message in ISO-10646 UTF-8 encoding
            string    language tag
          */
          let signal;
          let coreDumped;
          if (self._compatFlags & COMPAT.OLD_EXIT) {
            /*
              Instead of `signal name` and `core dumped`, we have just:
                uint32  signal number
            */
            const num = bufferParser.readUInt32BE();
            switch (num) {
              case 1:
                signal = 'HUP';
                break;
              case 2:
                signal = 'INT';
                break;
              case 3:
                signal = 'QUIT';
                break;
              case 6:
                signal = 'ABRT';
                break;
              case 9:
                signal = 'KILL';
                break;
              case 14:
                signal = 'ALRM';
                break;
              case 15:
                signal = 'TERM';
                break;
              default:
                if (num !== undefined) {
                  // Unknown or OS-specific
                  signal = `UNKNOWN (${num})`;
                }
            }
            coreDumped = false;
          } else {
            signal = bufferParser.readString(true);
            coreDumped = bufferParser.readBool();
            if (coreDumped === undefined)
              signal = undefined;
          }
          const errorMessage = bufferParser.readString(true);
          if (bufferParser.skipString() !== undefined)
            data = { signal, coreDumped, errorMessage };
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type}: ${signal})`
          );
          break;
        }
        case 'pty-req': { // C->S
          /*
            string    TERM environment variable value (e.g., vt100)
            uint32    terminal width, characters (e.g., 80)
            uint32    terminal height, rows (e.g., 24)
            uint32    terminal width, pixels (e.g., 640)
            uint32    terminal height, pixels (e.g., 480)
            string    encoded terminal modes
          */
          const term = bufferParser.readString(true);
          const cols = bufferParser.readUInt32BE();
          const rows = bufferParser.readUInt32BE();
          const width = bufferParser.readUInt32BE();
          const height = bufferParser.readUInt32BE();
          const modesBinary = bufferParser.readString();
          if (modesBinary !== undefined) {
            bufferParser.init(modesBinary, 1);
            let modes = {};
            while (bufferParser.avail()) {
              const opcode = bufferParser.readByte();
              if (opcode === TERMINAL_MODE.TTY_OP_END)
                break;
              const name = TERMINAL_MODE_BY_VALUE[opcode];
              const value = bufferParser.readUInt32BE();
              if (opcode === undefined
                  || name === undefined
                  || value === undefined) {
                modes = undefined;
                break;
              }
              modes[name] = value;
            }
            if (modes !== undefined)
              data = { term, cols, rows, width, height, modes };
          }
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type})`
          );
          break;
        }
        case 'window-change': { // C->S
          /*
            uint32    terminal width, columns
            uint32    terminal height, rows
            uint32    terminal width, pixels
            uint32    terminal height, pixels
          */
          const cols = bufferParser.readUInt32BE();
          const rows = bufferParser.readUInt32BE();
          const width = bufferParser.readUInt32BE();
          const height = bufferParser.readUInt32BE();
          if (height !== undefined)
            data = { cols, rows, width, height };
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type})`
          );
          break;
        }
        case 'x11-req': { // C->S
          /*
            boolean   single connection
            string    x11 authentication protocol
            string    x11 authentication cookie
            uint32    x11 screen number
          */
          const single = bufferParser.readBool();
          const protocol = bufferParser.readString(true);
          const cookie = bufferParser.readString();
          const screen = bufferParser.readUInt32BE();
          if (screen !== undefined)
            data = { single, protocol, cookie, screen };
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type})`
          );
          break;
        }
        case 'env': { // C->S
          /*
            string    variable name
            string    variable value
          */
          const name = bufferParser.readString(true);
          const value = bufferParser.readString(true);
          if (value !== undefined)
            data = { name, value };
          if (self._debug) {
            self._debug(
              `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type}: `
                + `${name}=${value})`
            );
          }
          break;
        }
        case 'shell': // C->S
          data = null; // No extra data
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type})`
          );
          break;
        case 'exec': // C->S
          /*
            string    command
          */
          data = bufferParser.readString(true);
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type}: ${data})`
          );
          break;
        case 'subsystem': // C->S
          /*
            string    subsystem name
          */
          data = bufferParser.readString(true);
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type}: ${data})`
          );
          break;
        case 'signal': // C->S
          /*
            string    signal name (without the "SIG" prefix)
          */
          data = bufferParser.readString(true);
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type}: ${data})`
          );
          break;
        case 'xon-xoff': // C->S
          /*
            boolean   client can do
          */
          data = bufferParser.readBool();
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type}: ${data})`
          );
          break;
        case 'auth-agent-req@openssh.com': // C-S
          data = null; // No extra data
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type})`
          );
          break;
        default:
          data = (bufferParser.avail() ? bufferParser.readRaw() : null);
          self._debug && self._debug(
            `Inbound: CHANNEL_REQUEST (r:${recipient}, ${type})`
          );
      }
    }
    bufferParser.clear();

    if (data === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_REQUEST packet'
      );
    }

    const handler = self._handlers.CHANNEL_REQUEST;
    handler && handler(self, recipient, type, wantReply, data);
  },
  [MESSAGE.CHANNEL_SUCCESS]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_SUCCESS
      uint32    recipient channel
    */
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    bufferParser.clear();

    if (recipient === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_SUCCESS packet'
      );
    }

    self._debug && self._debug(`Inbound: CHANNEL_SUCCESS (r:${recipient})`);

    const handler = self._handlers.CHANNEL_SUCCESS;
    handler && handler(self, recipient);
  },
  [MESSAGE.CHANNEL_FAILURE]: (self, payload) => {
    /*
      byte      SSH_MSG_CHANNEL_FAILURE
      uint32    recipient channel
    */
    bufferParser.init(payload, 1);
    const recipient = bufferParser.readUInt32BE();
    bufferParser.clear();

    if (recipient === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed CHANNEL_FAILURE packet'
      );
    }

    self._debug && self._debug(`Inbound: CHANNEL_FAILURE (r:${recipient})`);

    const handler = self._handlers.CHANNEL_FAILURE;
    handler && handler(self, recipient);
  },
};


/***/ }),

/***/ 4126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  createDiffieHellman,
  createDiffieHellmanGroup,
  createECDH,
  createHash,
  createPublicKey,
  diffieHellman,
  generateKeyPairSync,
  randomFillSync,
} = __nccwpck_require__(6417);

const { Ber } = __nccwpck_require__(970);

const {
  COMPAT,
  curve25519Supported,
  DEFAULT_KEX,
  DEFAULT_SERVER_HOST_KEY,
  DEFAULT_CIPHER,
  DEFAULT_MAC,
  DEFAULT_COMPRESSION,
  DISCONNECT_REASON,
  MESSAGE,
} = __nccwpck_require__(6832);
const {
  CIPHER_INFO,
  createCipher,
  createDecipher,
  MAC_INFO,
} = __nccwpck_require__(5708);
const { parseDERKey } = __nccwpck_require__(2218);
const {
  bufferFill,
  bufferParser,
  convertSignature,
  doFatalError,
  FastBuffer,
  sigSSHToASN1,
  writeUInt32BE,
} = __nccwpck_require__(9475);
const {
  PacketReader,
  PacketWriter,
  ZlibPacketReader,
  ZlibPacketWriter,
} = __nccwpck_require__(6715);

let MESSAGE_HANDLERS;

const GEX_MIN_BITS = 2048; // RFC 8270
const GEX_MAX_BITS = 8192; // RFC 8270

const EMPTY_BUFFER = Buffer.alloc(0);

// Client/Server
function kexinit(self) {
  /*
    byte         SSH_MSG_KEXINIT
    byte[16]     cookie (random bytes)
    name-list    kex_algorithms
    name-list    server_host_key_algorithms
    name-list    encryption_algorithms_client_to_server
    name-list    encryption_algorithms_server_to_client
    name-list    mac_algorithms_client_to_server
    name-list    mac_algorithms_server_to_client
    name-list    compression_algorithms_client_to_server
    name-list    compression_algorithms_server_to_client
    name-list    languages_client_to_server
    name-list    languages_server_to_client
    boolean      first_kex_packet_follows
    uint32       0 (reserved for future extension)
  */

  let payload;
  if (self._compatFlags & COMPAT.BAD_DHGEX) {
    const entry = self._offer.lists.kex;
    let kex = entry.array;
    let found = false;
    for (let i = 0; i < kex.length; ++i) {
      if (kex[i].includes('group-exchange')) {
        if (!found) {
          found = true;
          // Copy array lazily
          kex = kex.slice();
        }
        kex.splice(i--, 1);
      }
    }
    if (found) {
      let len = 1 + 16 + self._offer.totalSize + 1 + 4;
      const newKexBuf = Buffer.from(kex.join(','));
      len -= (entry.buffer.length - newKexBuf.length);

      const all = self._offer.lists.all;
      const rest = new Uint8Array(
        all.buffer,
        all.byteOffset + 4 + entry.buffer.length,
        all.length - (4 + entry.buffer.length)
      );

      payload = Buffer.allocUnsafe(len);
      writeUInt32BE(payload, newKexBuf.length, 17);
      payload.set(newKexBuf, 17 + 4);
      payload.set(rest, 17 + 4 + newKexBuf.length);
    }
  }

  if (payload === undefined) {
    payload = Buffer.allocUnsafe(1 + 16 + self._offer.totalSize + 1 + 4);
    self._offer.copyAllTo(payload, 17);
  }

  self._debug && self._debug('Outbound: Sending KEXINIT');

  payload[0] = MESSAGE.KEXINIT;
  randomFillSync(payload, 1, 16);

  // Zero-fill first_kex_packet_follows and reserved bytes
  bufferFill(payload, 0, payload.length - 5);

  self._kexinit = payload;

  // Needed to correct the starting position in allocated "packets" when packets
  // will be buffered due to active key exchange
  self._packetRW.write.allocStart = 0;

  // TODO: only create single buffer and set _kexinit as slice of packet instead
  {
    const p = self._packetRW.write.allocStartKEX;
    const packet = self._packetRW.write.alloc(payload.length, true);
    packet.set(payload, p);
    self._cipher.encrypt(self._packetRW.write.finalize(packet, true));
  }
}

function handleKexInit(self, payload) {
  /*
    byte         SSH_MSG_KEXINIT
    byte[16]     cookie (random bytes)
    name-list    kex_algorithms
    name-list    server_host_key_algorithms
    name-list    encryption_algorithms_client_to_server
    name-list    encryption_algorithms_server_to_client
    name-list    mac_algorithms_client_to_server
    name-list    mac_algorithms_server_to_client
    name-list    compression_algorithms_client_to_server
    name-list    compression_algorithms_server_to_client
    name-list    languages_client_to_server
    name-list    languages_server_to_client
    boolean      first_kex_packet_follows
    uint32       0 (reserved for future extension)
  */
  const init = {
    kex: undefined,
    serverHostKey: undefined,
    cs: {
      cipher: undefined,
      mac: undefined,
      compress: undefined,
      lang: undefined,
    },
    sc: {
      cipher: undefined,
      mac: undefined,
      compress: undefined,
      lang: undefined,
    },
  };

  bufferParser.init(payload, 17);

  if ((init.kex = bufferParser.readList()) === undefined
      || (init.serverHostKey = bufferParser.readList()) === undefined
      || (init.cs.cipher = bufferParser.readList()) === undefined
      || (init.sc.cipher = bufferParser.readList()) === undefined
      || (init.cs.mac = bufferParser.readList()) === undefined
      || (init.sc.mac = bufferParser.readList()) === undefined
      || (init.cs.compress = bufferParser.readList()) === undefined
      || (init.sc.compress = bufferParser.readList()) === undefined
      || (init.cs.lang = bufferParser.readList()) === undefined
      || (init.sc.lang = bufferParser.readList()) === undefined) {
    bufferParser.clear();
    return doFatalError(
      self,
      'Received malformed KEXINIT',
      'handshake',
      DISCONNECT_REASON.KEY_EXCHANGE_FAILED
    );
  }

  const pos = bufferParser.pos();
  const firstFollows = (pos < payload.length && payload[pos] === 1);
  bufferParser.clear();

  const local = self._offer;
  const remote = init;

  let localKex = local.lists.kex.array;
  if (self._compatFlags & COMPAT.BAD_DHGEX) {
    let found = false;
    for (let i = 0; i < localKex.length; ++i) {
      if (localKex[i].indexOf('group-exchange') !== -1) {
        if (!found) {
          found = true;
          // Copy array lazily
          localKex = localKex.slice();
        }
        localKex.splice(i--, 1);
      }
    }
  }

  let clientList;
  let serverList;
  let i;
  const debug = self._debug;

  debug && debug('Inbound: Handshake in progress');

  // Key exchange method =======================================================
  debug && debug(`Handshake: (local) KEX method: ${localKex}`);
  debug && debug(`Handshake: (remote) KEX method: ${remote.kex}`);
  if (self._server) {
    serverList = localKex;
    clientList = remote.kex;
  } else {
    serverList = remote.kex;
    clientList = localKex;
  }
  // Check for agreeable key exchange algorithm
  for (i = 0;
       i < clientList.length && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === clientList.length) {
    // No suitable match found!
    debug && debug('Handshake: No matching key exchange algorithm');
    return doFatalError(
      self,
      'Handshake failed: no matching key exchange algorithm',
      'handshake',
      DISCONNECT_REASON.KEY_EXCHANGE_FAILED
    );
  }
  init.kex = clientList[i];
  debug && debug(`Handshake: KEX algorithm: ${clientList[i]}`);
  if (firstFollows && (!remote.kex.length || clientList[i] !== remote.kex[0])) {
    // Ignore next inbound packet, it was a wrong first guess at KEX algorithm
    self._skipNextInboundPacket = true;
  }


  // Server host key format ====================================================
  const localSrvHostKey = local.lists.serverHostKey.array;
  debug && debug(`Handshake: (local) Host key format: ${localSrvHostKey}`);
  debug && debug(
    `Handshake: (remote) Host key format: ${remote.serverHostKey}`
  );
  if (self._server) {
    serverList = localSrvHostKey;
    clientList = remote.serverHostKey;
  } else {
    serverList = remote.serverHostKey;
    clientList = localSrvHostKey;
  }
  // Check for agreeable server host key format
  for (i = 0;
       i < clientList.length && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === clientList.length) {
    // No suitable match found!
    debug && debug('Handshake: No matching host key format');
    return doFatalError(
      self,
      'Handshake failed: no matching host key format',
      'handshake',
      DISCONNECT_REASON.KEY_EXCHANGE_FAILED
    );
  }
  init.serverHostKey = clientList[i];
  debug && debug(`Handshake: Host key format: ${clientList[i]}`);


  // Client->Server cipher =====================================================
  const localCSCipher = local.lists.cs.cipher.array;
  debug && debug(`Handshake: (local) C->S cipher: ${localCSCipher}`);
  debug && debug(`Handshake: (remote) C->S cipher: ${remote.cs.cipher}`);
  if (self._server) {
    serverList = localCSCipher;
    clientList = remote.cs.cipher;
  } else {
    serverList = remote.cs.cipher;
    clientList = localCSCipher;
  }
  // Check for agreeable client->server cipher
  for (i = 0;
       i < clientList.length && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === clientList.length) {
    // No suitable match found!
    debug && debug('Handshake: No matching C->S cipher');
    return doFatalError(
      self,
      'Handshake failed: no matching C->S cipher',
      'handshake',
      DISCONNECT_REASON.KEY_EXCHANGE_FAILED
    );
  }
  init.cs.cipher = clientList[i];
  debug && debug(`Handshake: C->S Cipher: ${clientList[i]}`);


  // Server->Client cipher =====================================================
  const localSCCipher = local.lists.sc.cipher.array;
  debug && debug(`Handshake: (local) S->C cipher: ${localSCCipher}`);
  debug && debug(`Handshake: (remote) S->C cipher: ${remote.sc.cipher}`);
  if (self._server) {
    serverList = localSCCipher;
    clientList = remote.sc.cipher;
  } else {
    serverList = remote.sc.cipher;
    clientList = localSCCipher;
  }
  // Check for agreeable server->client cipher
  for (i = 0;
       i < clientList.length && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === clientList.length) {
    // No suitable match found!
    debug && debug('Handshake: No matching S->C cipher');
    return doFatalError(
      self,
      'Handshake failed: no matching S->C cipher',
      'handshake',
      DISCONNECT_REASON.KEY_EXCHANGE_FAILED
    );
  }
  init.sc.cipher = clientList[i];
  debug && debug(`Handshake: S->C cipher: ${clientList[i]}`);


  // Client->Server MAC ========================================================
  const localCSMAC = local.lists.cs.mac.array;
  debug && debug(`Handshake: (local) C->S MAC: ${localCSMAC}`);
  debug && debug(`Handshake: (remote) C->S MAC: ${remote.cs.mac}`);
  if (CIPHER_INFO[init.cs.cipher].authLen > 0) {
    init.cs.mac = '';
    debug && debug('Handshake: C->S MAC: <implicit>');
  } else {
    if (self._server) {
      serverList = localCSMAC;
      clientList = remote.cs.mac;
    } else {
      serverList = remote.cs.mac;
      clientList = localCSMAC;
    }
    // Check for agreeable client->server hmac algorithm
    for (i = 0;
         i < clientList.length && serverList.indexOf(clientList[i]) === -1;
         ++i);
    if (i === clientList.length) {
      // No suitable match found!
      debug && debug('Handshake: No matching C->S MAC');
      return doFatalError(
        self,
        'Handshake failed: no matching C->S MAC',
        'handshake',
        DISCONNECT_REASON.KEY_EXCHANGE_FAILED
      );
    }
    init.cs.mac = clientList[i];
    debug && debug(`Handshake: C->S MAC: ${clientList[i]}`);
  }


  // Server->Client MAC ========================================================
  const localSCMAC = local.lists.sc.mac.array;
  debug && debug(`Handshake: (local) S->C MAC: ${localSCMAC}`);
  debug && debug(`Handshake: (remote) S->C MAC: ${remote.sc.mac}`);
  if (CIPHER_INFO[init.sc.cipher].authLen > 0) {
    init.sc.mac = '';
    debug && debug('Handshake: S->C MAC: <implicit>');
  } else {
    if (self._server) {
      serverList = localSCMAC;
      clientList = remote.sc.mac;
    } else {
      serverList = remote.sc.mac;
      clientList = localSCMAC;
    }
    // Check for agreeable server->client hmac algorithm
    for (i = 0;
         i < clientList.length && serverList.indexOf(clientList[i]) === -1;
         ++i);
    if (i === clientList.length) {
      // No suitable match found!
      debug && debug('Handshake: No matching S->C MAC');
      return doFatalError(
        self,
        'Handshake failed: no matching S->C MAC',
        'handshake',
        DISCONNECT_REASON.KEY_EXCHANGE_FAILED
      );
    }
    init.sc.mac = clientList[i];
    debug && debug(`Handshake: S->C MAC: ${clientList[i]}`);
  }


  // Client->Server compression ================================================
  const localCSCompress = local.lists.cs.compress.array;
  debug && debug(`Handshake: (local) C->S compression: ${localCSCompress}`);
  debug && debug(`Handshake: (remote) C->S compression: ${remote.cs.compress}`);
  if (self._server) {
    serverList = localCSCompress;
    clientList = remote.cs.compress;
  } else {
    serverList = remote.cs.compress;
    clientList = localCSCompress;
  }
  // Check for agreeable client->server compression algorithm
  for (i = 0;
       i < clientList.length && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === clientList.length) {
    // No suitable match found!
    debug && debug('Handshake: No matching C->S compression');
    return doFatalError(
      self,
      'Handshake failed: no matching C->S compression',
      'handshake',
      DISCONNECT_REASON.KEY_EXCHANGE_FAILED
    );
  }
  init.cs.compress = clientList[i];
  debug && debug(`Handshake: C->S compression: ${clientList[i]}`);


  // Server->Client compression ================================================
  const localSCCompress = local.lists.sc.compress.array;
  debug && debug(`Handshake: (local) S->C compression: ${localSCCompress}`);
  debug && debug(`Handshake: (remote) S->C compression: ${remote.sc.compress}`);
  if (self._server) {
    serverList = localSCCompress;
    clientList = remote.sc.compress;
  } else {
    serverList = remote.sc.compress;
    clientList = localSCCompress;
  }
  // Check for agreeable server->client compression algorithm
  for (i = 0;
       i < clientList.length && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === clientList.length) {
    // No suitable match found!
    debug && debug('Handshake: No matching S->C compression');
    return doFatalError(
      self,
      'Handshake failed: no matching S->C compression',
      'handshake',
      DISCONNECT_REASON.KEY_EXCHANGE_FAILED
    );
  }
  init.sc.compress = clientList[i];
  debug && debug(`Handshake: S->C compression: ${clientList[i]}`);

  init.cs.lang = '';
  init.sc.lang = '';

  // XXX: hack -- find a better way to do this
  if (self._kex) {
    if (!self._kexinit) {
      // We received a rekey request, but we haven't sent a KEXINIT in response
      // yet
      kexinit(self);
    }
    self._decipher._onPayload = onKEXPayload.bind(self, { firstPacket: false });
  }

  self._kex = createKeyExchange(init, self, payload);
  self._kex.start();
}

const createKeyExchange = (() => {
  function convertToMpint(buf) {
    let idx = 0;
    let length = buf.length;
    while (buf[idx] === 0x00) {
      ++idx;
      --length;
    }
    let newBuf;
    if (buf[idx] & 0x80) {
      newBuf = Buffer.allocUnsafe(1 + length);
      newBuf[0] = 0;
      buf.copy(newBuf, 1, idx);
      buf = newBuf;
    } else if (length !== buf.length) {
      newBuf = Buffer.allocUnsafe(length);
      buf.copy(newBuf, 0, idx);
      buf = newBuf;
    }
    return buf;
  }

  class KeyExchange {
    constructor(negotiated, protocol, remoteKexinit) {
      this._protocol = protocol;

      this.sessionID = (protocol._kex ? protocol._kex.sessionID : undefined);
      this.negotiated = negotiated;
      this._step = 1;
      this._public = null;
      this._dh = null;
      this._sentNEWKEYS = false;
      this._receivedNEWKEYS = false;
      this._finished = false;
      this._hostVerified = false;

      // Data needed for initializing cipher/decipher/etc.
      this._kexinit = protocol._kexinit;
      this._remoteKexinit = remoteKexinit;
      this._identRaw = protocol._identRaw;
      this._remoteIdentRaw = protocol._remoteIdentRaw;
      this._hostKey = undefined;
      this._dhData = undefined;
      this._sig = undefined;
    }
    finish() {
      if (this._finished)
        return false;
      this._finished = true;

      const isServer = this._protocol._server;
      const negotiated = this.negotiated;

      const pubKey = this.convertPublicKey(this._dhData);
      let secret = this.computeSecret(this._dhData);
      if (secret instanceof Error) {
        secret.message =
          `Error while computing DH secret (${this.type}): ${secret.message}`;
        secret.level = 'handshake';
        return doFatalError(
          this._protocol,
          secret,
          DISCONNECT_REASON.KEY_EXCHANGE_FAILED
        );
      }

      const hash = createHash(this.hashName);
      // V_C
      hashString(hash, (isServer ? this._remoteIdentRaw : this._identRaw));
      // "V_S"
      hashString(hash, (isServer ? this._identRaw : this._remoteIdentRaw));
      // "I_C"
      hashString(hash, (isServer ? this._remoteKexinit : this._kexinit));
      // "I_S"
      hashString(hash, (isServer ? this._kexinit : this._remoteKexinit));
      // "K_S"
      const serverPublicHostKey = (isServer
                                   ? this._hostKey.getPublicSSH()
                                   : this._hostKey);
      hashString(hash, serverPublicHostKey);

      if (this.type === 'groupex') {
        // Group exchange-specific
        const params = this.getDHParams();
        const num = Buffer.allocUnsafe(4);
        // min (uint32)
        writeUInt32BE(num, this._minBits, 0);
        hash.update(num);
        // preferred (uint32)
        writeUInt32BE(num, this._prefBits, 0);
        hash.update(num);
        // max (uint32)
        writeUInt32BE(num, this._maxBits, 0);
        hash.update(num);
        // prime
        hashString(hash, params.prime);
        // generator
        hashString(hash, params.generator);
      }

      // method-specific data sent by client
      hashString(hash, (isServer ? pubKey : this.getPublicKey()));
      // method-specific data sent by server
      const serverPublicKey = (isServer ? this.getPublicKey() : pubKey);
      hashString(hash, serverPublicKey);
      // shared secret ("K")
      hashString(hash, secret);

      // "H"
      const exchangeHash = hash.digest();

      if (!isServer) {
        bufferParser.init(this._sig, 0);
        const sigType = bufferParser.readString(true);

        if (!sigType) {
          return doFatalError(
            this._protocol,
            'Malformed packet while reading signature',
            'handshake',
            DISCONNECT_REASON.KEY_EXCHANGE_FAILED
          );
        }

        if (sigType !== negotiated.serverHostKey) {
          return doFatalError(
            this._protocol,
            `Wrong signature type: ${sigType}, `
              + `expected: ${negotiated.serverHostKey}`,
            'handshake',
            DISCONNECT_REASON.KEY_EXCHANGE_FAILED
          );
        }

        // "s"
        let sigValue = bufferParser.readString();

        bufferParser.clear();

        if (sigValue === undefined) {
          return doFatalError(
            this._protocol,
            'Malformed packet while reading signature',
            'handshake',
            DISCONNECT_REASON.KEY_EXCHANGE_FAILED
          );
        }

        if (!(sigValue = sigSSHToASN1(sigValue, sigType))) {
          return doFatalError(
            this._protocol,
            'Malformed signature',
            'handshake',
            DISCONNECT_REASON.KEY_EXCHANGE_FAILED
          );
        }

        let parsedHostKey;
        {
          bufferParser.init(this._hostKey, 0);
          const name = bufferParser.readString(true);
          const hostKey = this._hostKey.slice(bufferParser.pos());
          bufferParser.clear();
          parsedHostKey = parseDERKey(hostKey, name);
          if (parsedHostKey instanceof Error) {
            parsedHostKey.level = 'handshake';
            return doFatalError(
              this._protocol,
              parsedHostKey,
              DISCONNECT_REASON.KEY_EXCHANGE_FAILED
            );
          }
        }

        let hashAlgo;
        // Check if we need to override the default hash algorithm
        switch (this.negotiated.serverHostKey) {
          case 'rsa-sha2-256': hashAlgo = 'sha256'; break;
          case 'rsa-sha2-512': hashAlgo = 'sha512'; break;
        }

        this._protocol._debug
          && this._protocol._debug('Verifying signature ...');

        const verified = parsedHostKey.verify(exchangeHash, sigValue, hashAlgo);
        if (verified !== true) {
          if (verified instanceof Error) {
            this._protocol._debug && this._protocol._debug(
              `Signature verification failed: ${verified.stack}`
            );
          } else {
            this._protocol._debug && this._protocol._debug(
              'Signature verification failed'
            );
          }
          return doFatalError(
            this._protocol,
            'Handshake failed: signature verification failed',
            'handshake',
            DISCONNECT_REASON.KEY_EXCHANGE_FAILED
          );
        }
        this._protocol._debug && this._protocol._debug('Verified signature');
      } else {
        // Server

        let hashAlgo;
        // Check if we need to override the default hash algorithm
        switch (this.negotiated.serverHostKey) {
          case 'rsa-sha2-256': hashAlgo = 'sha256'; break;
          case 'rsa-sha2-512': hashAlgo = 'sha512'; break;
        }

        this._protocol._debug && this._protocol._debug(
          'Generating signature ...'
        );

        let signature = this._hostKey.sign(exchangeHash, hashAlgo);
        if (signature instanceof Error) {
          return doFatalError(
            this._protocol,
            'Handshake failed: signature generation failed for '
              + `${this._hostKey.type} host key: ${signature.message}`,
            'handshake',
            DISCONNECT_REASON.KEY_EXCHANGE_FAILED
          );
        }

        signature = convertSignature(signature, this._hostKey.type);
        if (signature === false) {
          return doFatalError(
            this._protocol,
            'Handshake failed: signature conversion failed for '
              + `${this._hostKey.type} host key`,
            'handshake',
            DISCONNECT_REASON.KEY_EXCHANGE_FAILED
          );
        }

        // Send KEX reply
        /*
          byte      SSH_MSG_KEXDH_REPLY
                      / SSH_MSG_KEX_DH_GEX_REPLY
                      / SSH_MSG_KEX_ECDH_REPLY
          string    server public host key and certificates (K_S)
          string    <method-specific data>
          string    signature of H
        */
        const sigType = this.negotiated.serverHostKey;
        const sigTypeLen = Buffer.byteLength(sigType);
        const sigLen = 4 + sigTypeLen + 4 + signature.length;
        let p = this._protocol._packetRW.write.allocStartKEX;
        const packet = this._protocol._packetRW.write.alloc(
          1
            + 4 + serverPublicHostKey.length
            + 4 + serverPublicKey.length
            + 4 + sigLen,
          true
        );

        packet[p] = MESSAGE.KEXDH_REPLY;

        writeUInt32BE(packet, serverPublicHostKey.length, ++p);
        packet.set(serverPublicHostKey, p += 4);

        writeUInt32BE(packet,
                      serverPublicKey.length,
                      p += serverPublicHostKey.length);
        packet.set(serverPublicKey, p += 4);

        writeUInt32BE(packet, sigLen, p += serverPublicKey.length);

        writeUInt32BE(packet, sigTypeLen, p += 4);
        packet.utf8Write(sigType, p += 4, sigTypeLen);

        writeUInt32BE(packet, signature.length, p += sigTypeLen);
        packet.set(signature, p += 4);

        if (this._protocol._debug) {
          let type;
          switch (this.type) {
            case 'group':
              type = 'KEXDH_REPLY';
              break;
            case 'groupex':
              type = 'KEXDH_GEX_REPLY';
              break;
            default:
              type = 'KEXECDH_REPLY';
          }
          this._protocol._debug(`Outbound: Sending ${type}`);
        }
        this._protocol._cipher.encrypt(
          this._protocol._packetRW.write.finalize(packet, true)
        );
      }
      trySendNEWKEYS(this);

      const completeHandshake = () => {
        if (!this.sessionID)
          this.sessionID = exchangeHash;

        {
          const newSecret = Buffer.allocUnsafe(4 + secret.length);
          writeUInt32BE(newSecret, secret.length, 0);
          newSecret.set(secret, 4);
          secret = newSecret;
        }

        // Initialize new ciphers, deciphers, etc.

        const csCipherInfo = CIPHER_INFO[negotiated.cs.cipher];
        const scCipherInfo = CIPHER_INFO[negotiated.sc.cipher];

        const csIV = generateKEXVal(csCipherInfo.ivLen,
                                    this.hashName,
                                    secret,
                                    exchangeHash,
                                    this.sessionID,
                                    'A');
        const scIV = generateKEXVal(scCipherInfo.ivLen,
                                    this.hashName,
                                    secret,
                                    exchangeHash,
                                    this.sessionID,
                                    'B');
        const csKey = generateKEXVal(csCipherInfo.keyLen,
                                     this.hashName,
                                     secret,
                                     exchangeHash,
                                     this.sessionID,
                                     'C');
        const scKey = generateKEXVal(scCipherInfo.keyLen,
                                     this.hashName,
                                     secret,
                                     exchangeHash,
                                     this.sessionID,
                                     'D');
        let csMacInfo;
        let csMacKey;
        if (!csCipherInfo.authLen) {
          csMacInfo = MAC_INFO[negotiated.cs.mac];
          csMacKey = generateKEXVal(csMacInfo.len,
                                    this.hashName,
                                    secret,
                                    exchangeHash,
                                    this.sessionID,
                                    'E');
        }
        let scMacInfo;
        let scMacKey;
        if (!scCipherInfo.authLen) {
          scMacInfo = MAC_INFO[negotiated.sc.mac];
          scMacKey = generateKEXVal(scMacInfo.len,
                                    this.hashName,
                                    secret,
                                    exchangeHash,
                                    this.sessionID,
                                    'F');
        }

        const config = {
          inbound: {
            onPayload: this._protocol._onPayload,
            seqno: this._protocol._decipher.inSeqno,
            decipherInfo: (!isServer ? scCipherInfo : csCipherInfo),
            decipherIV: (!isServer ? scIV : csIV),
            decipherKey: (!isServer ? scKey : csKey),
            macInfo: (!isServer ? scMacInfo : csMacInfo),
            macKey: (!isServer ? scMacKey : csMacKey),
          },
          outbound: {
            onWrite: this._protocol._onWrite,
            seqno: this._protocol._cipher.outSeqno,
            cipherInfo: (isServer ? scCipherInfo : csCipherInfo),
            cipherIV: (isServer ? scIV : csIV),
            cipherKey: (isServer ? scKey : csKey),
            macInfo: (isServer ? scMacInfo : csMacInfo),
            macKey: (isServer ? scMacKey : csMacKey),
          },
        };
        this._protocol._cipher && this._protocol._cipher.free();
        this._protocol._decipher && this._protocol._decipher.free();
        this._protocol._cipher = createCipher(config);
        this._protocol._decipher = createDecipher(config);

        const rw = {
          read: undefined,
          write: undefined,
        };
        switch (negotiated.cs.compress) {
          case 'zlib': // starts immediately
            if (isServer)
              rw.read = new ZlibPacketReader();
            else
              rw.write = new ZlibPacketWriter(this._protocol);
            break;
          case 'zlib@openssh.com':
            // Starts after successful user authentication

            if (this._protocol._authenticated) {
              // If a rekey happens and this compression method is selected and
              // we already authenticated successfully, we need to start
              // immediately instead
              if (isServer)
                rw.read = new ZlibPacketReader();
              else
                rw.write = new ZlibPacketWriter(this._protocol);
              break;
            }
          // FALLTHROUGH
          default:
            // none -- never any compression/decompression

            if (isServer)
              rw.read = new PacketReader();
            else
              rw.write = new PacketWriter(this._protocol);
        }
        switch (negotiated.sc.compress) {
          case 'zlib': // starts immediately
            if (isServer)
              rw.write = new ZlibPacketWriter(this._protocol);
            else
              rw.read = new ZlibPacketReader();
            break;
          case 'zlib@openssh.com':
            // Starts after successful user authentication

            if (this._protocol._authenticated) {
              // If a rekey happens and this compression method is selected and
              // we already authenticated successfully, we need to start
              // immediately instead
              if (isServer)
                rw.write = new ZlibPacketWriter(this._protocol);
              else
                rw.read = new ZlibPacketReader();
              break;
            }
          // FALLTHROUGH
          default:
            // none -- never any compression/decompression

            if (isServer)
              rw.write = new PacketWriter(this._protocol);
            else
              rw.read = new PacketReader();
        }
        this._protocol._packetRW.read.cleanup();
        this._protocol._packetRW.write.cleanup();
        this._protocol._packetRW = rw;

        // Cleanup/reset various state
        this._public = null;
        this._dh = null;
        this._kexinit = this._protocol._kexinit = undefined;
        this._remoteKexinit = undefined;
        this._identRaw = undefined;
        this._remoteIdentRaw = undefined;
        this._hostKey = undefined;
        this._dhData = undefined;
        this._sig = undefined;

        this._protocol._onHandshakeComplete(negotiated);

        return false;
      };
      if (!isServer)
        return completeHandshake();
      this.finish = completeHandshake;
    }

    start() {
      if (!this._protocol._server) {
        if (this._protocol._debug) {
          let type;
          switch (this.type) {
            case 'group':
              type = 'KEXDH_INIT';
              break;
            default:
              type = 'KEXECDH_INIT';
          }
          this._protocol._debug(`Outbound: Sending ${type}`);
        }

        const pubKey = this.getPublicKey();

        let p = this._protocol._packetRW.write.allocStartKEX;
        const packet = this._protocol._packetRW.write.alloc(
          1 + 4 + pubKey.length,
          true
        );
        packet[p] = MESSAGE.KEXDH_INIT;
        writeUInt32BE(packet, pubKey.length, ++p);
        packet.set(pubKey, p += 4);
        this._protocol._cipher.encrypt(
          this._protocol._packetRW.write.finalize(packet, true)
        );
      }
    }
    getPublicKey() {
      this.generateKeys();

      const key = this._public;

      if (key)
        return this.convertPublicKey(key);
    }
    convertPublicKey(key) {
      let newKey;
      let idx = 0;
      let len = key.length;
      while (key[idx] === 0x00) {
        ++idx;
        --len;
      }

      if (key[idx] & 0x80) {
        newKey = Buffer.allocUnsafe(1 + len);
        newKey[0] = 0;
        key.copy(newKey, 1, idx);
        return newKey;
      }

      if (len !== key.length) {
        newKey = Buffer.allocUnsafe(len);
        key.copy(newKey, 0, idx);
        key = newKey;
      }
      return key;
    }
    computeSecret(otherPublicKey) {
      this.generateKeys();

      try {
        return convertToMpint(this._dh.computeSecret(otherPublicKey));
      } catch (ex) {
        return ex;
      }
    }
    parse(payload) {
      const type = payload[0];
      switch (this._step) {
        case 1:
          if (this._protocol._server) {
            // Server
            if (type !== MESSAGE.KEXDH_INIT) {
              return doFatalError(
                this._protocol,
                `Received packet ${type} instead of ${MESSAGE.KEXDH_INIT}`,
                'handshake',
                DISCONNECT_REASON.KEY_EXCHANGE_FAILED
              );
            }
            this._protocol._debug && this._protocol._debug(
              'Received DH Init'
            );
            /*
              byte     SSH_MSG_KEXDH_INIT
                         / SSH_MSG_KEX_ECDH_INIT
              string   <method-specific data>
            */
            bufferParser.init(payload, 1);
            const dhData = bufferParser.readString();
            bufferParser.clear();
            if (dhData === undefined) {
              return doFatalError(
                this._protocol,
                'Received malformed KEX*_INIT',
                'handshake',
                DISCONNECT_REASON.KEY_EXCHANGE_FAILED
              );
            }

            // Client public key
            this._dhData = dhData;

            let hostKey =
              this._protocol._hostKeys[this.negotiated.serverHostKey];
            if (Array.isArray(hostKey))
              hostKey = hostKey[0];
            this._hostKey = hostKey;

            this.finish();
          } else {
            // Client
            if (type !== MESSAGE.KEXDH_REPLY) {
              return doFatalError(
                this._protocol,
                `Received packet ${type} instead of ${MESSAGE.KEXDH_REPLY}`,
                'handshake',
                DISCONNECT_REASON.KEY_EXCHANGE_FAILED
              );
            }
            this._protocol._debug && this._protocol._debug(
              'Received DH Reply'
            );
            /*
              byte      SSH_MSG_KEXDH_REPLY
                          / SSH_MSG_KEX_DH_GEX_REPLY
                          / SSH_MSG_KEX_ECDH_REPLY
              string    server public host key and certificates (K_S)
              string    <method-specific data>
              string    signature of H
            */
            bufferParser.init(payload, 1);
            let hostPubKey;
            let dhData;
            let sig;
            if ((hostPubKey = bufferParser.readString()) === undefined
                || (dhData = bufferParser.readString()) === undefined
                || (sig = bufferParser.readString()) === undefined) {
              bufferParser.clear();
              return doFatalError(
                this._protocol,
                'Received malformed KEX*_REPLY',
                'handshake',
                DISCONNECT_REASON.KEY_EXCHANGE_FAILED
              );
            }
            bufferParser.clear();

            // Check that the host public key type matches what was negotiated
            // during KEXINIT swap
            bufferParser.init(hostPubKey, 0);
            const hostPubKeyType = bufferParser.readString(true);
            bufferParser.clear();
            if (hostPubKeyType === undefined) {
              return doFatalError(
                this._protocol,
                'Received malformed host public key',
                'handshake',
                DISCONNECT_REASON.KEY_EXCHANGE_FAILED
              );
            }
            if (hostPubKeyType !== this.negotiated.serverHostKey) {
              // Check if we need to make an exception
              switch (this.negotiated.serverHostKey) {
                case 'rsa-sha2-256':
                case 'rsa-sha2-512':
                  if (hostPubKeyType === 'ssh-rsa')
                    break;
                // FALLTHROUGH
                default:
                  return doFatalError(
                    this._protocol,
                    'Host key does not match negotiated type',
                    'handshake',
                    DISCONNECT_REASON.KEY_EXCHANGE_FAILED
                  );
              }
            }

            this._hostKey = hostPubKey;
            this._dhData = dhData;
            this._sig = sig;

            let checked = false;
            let ret;
            if (this._protocol._hostVerifier === undefined) {
              ret = true;
              this._protocol._debug && this._protocol._debug(
                'Host accepted by default (no verification)'
              );
            } else {
              ret = this._protocol._hostVerifier(hostPubKey, (permitted) => {
                if (checked)
                  return;
                checked = true;
                if (permitted === false) {
                  this._protocol._debug && this._protocol._debug(
                    'Host denied (verification failed)'
                  );
                  return doFatalError(
                    this._protocol,
                    'Host denied (verification failed)',
                    'handshake',
                    DISCONNECT_REASON.KEY_EXCHANGE_FAILED
                  );
                }
                this._protocol._debug && this._protocol._debug(
                  'Host accepted (verified)'
                );
                this._hostVerified = true;
                if (this._receivedNEWKEYS)
                  this.finish();
                else
                  trySendNEWKEYS(this);
              });
            }
            if (ret === undefined) {
              // Async host verification
              ++this._step;
              return;
            }
            checked = true;
            if (ret === false) {
              this._protocol._debug && this._protocol._debug(
                'Host denied (verification failed)'
              );
              return doFatalError(
                this._protocol,
                'Host denied (verification failed)',
                'handshake',
                DISCONNECT_REASON.KEY_EXCHANGE_FAILED
              );
            }
            this._protocol._debug && this._protocol._debug(
              'Host accepted (verified)'
            );
            this._hostVerified = true;
            trySendNEWKEYS(this);
          }
          ++this._step;
          break;
        case 2:
          if (type !== MESSAGE.NEWKEYS) {
            return doFatalError(
              this._protocol,
              `Received packet ${type} instead of ${MESSAGE.NEWKEYS}`,
              'handshake',
              DISCONNECT_REASON.KEY_EXCHANGE_FAILED
            );
          }
          this._protocol._debug && this._protocol._debug(
            'Inbound: NEWKEYS'
          );
          this._receivedNEWKEYS = true;
          ++this._step;
          if (this._protocol._server || this._hostVerified)
            return this.finish();

          // Signal to current decipher that we need to change to a new decipher
          // for the next packet
          return false;
        default:
          return doFatalError(
            this._protocol,
            `Received unexpected packet ${type} after NEWKEYS`,
            'handshake',
            DISCONNECT_REASON.KEY_EXCHANGE_FAILED
          );
      }
    }
  }

  class Curve25519Exchange extends KeyExchange {
    constructor(hashName, ...args) {
      super(...args);

      this.type = '25519';
      this.hashName = hashName;
      this._keys = null;
    }
    generateKeys() {
      if (!this._keys)
        this._keys = generateKeyPairSync('x25519');
    }
    getPublicKey() {
      this.generateKeys();

      const key = this._keys.publicKey.export({ type: 'spki', format: 'der' });
      return key.slice(-32); // HACK: avoids parsing DER/BER header
    }
    convertPublicKey(key) {
      let newKey;
      let idx = 0;
      let len = key.length;
      while (key[idx] === 0x00) {
        ++idx;
        --len;
      }

      if (key.length === 32)
        return key;

      if (len !== key.length) {
        newKey = Buffer.allocUnsafe(len);
        key.copy(newKey, 0, idx);
        key = newKey;
      }
      return key;
    }
    computeSecret(otherPublicKey) {
      this.generateKeys();

      try {
        const asnWriter = new Ber.Writer();
        asnWriter.startSequence();
          // algorithm
          asnWriter.startSequence();
            asnWriter.writeOID('1.3.101.110'); // id-X25519
          asnWriter.endSequence();

          // PublicKey
          asnWriter.startSequence(Ber.BitString);
            asnWriter.writeByte(0x00);
            // XXX: hack to write a raw buffer without a tag -- yuck
            asnWriter._ensure(otherPublicKey.length);
            otherPublicKey.copy(asnWriter._buf,
                                asnWriter._offset,
                                0,
                                otherPublicKey.length);
            asnWriter._offset += otherPublicKey.length;
          asnWriter.endSequence();
        asnWriter.endSequence();

        return convertToMpint(diffieHellman({
          privateKey: this._keys.privateKey,
          publicKey: createPublicKey({
            key: asnWriter.buffer,
            type: 'spki',
            format: 'der',
          }),
        }));
      } catch (ex) {
        return ex;
      }
    }
  }

  class ECDHExchange extends KeyExchange {
    constructor(curveName, hashName, ...args) {
      super(...args);

      this.type = 'ecdh';
      this.curveName = curveName;
      this.hashName = hashName;
    }
    generateKeys() {
      if (!this._dh) {
        this._dh = createECDH(this.curveName);
        this._public = this._dh.generateKeys();
      }
    }
  }

  class DHGroupExchange extends KeyExchange {
    constructor(hashName, ...args) {
      super(...args);

      this.type = 'groupex';
      this.hashName = hashName;
      this._prime = null;
      this._generator = null;
      this._minBits = GEX_MIN_BITS;
      this._prefBits = dhEstimate(this.negotiated);
      if (this._protocol._compatFlags & COMPAT.BUG_DHGEX_LARGE)
        this._prefBits = Math.min(this._prefBits, 4096);
      this._maxBits = GEX_MAX_BITS;
    }
    start() {
      if (this._protocol._server)
        return;
      this._protocol._debug && this._protocol._debug(
        'Outbound: Sending KEXDH_GEX_REQUEST'
      );
      let p = this._protocol._packetRW.write.allocStartKEX;
      const packet = this._protocol._packetRW.write.alloc(
        1 + 4 + 4 + 4,
        true
      );
      packet[p] = MESSAGE.KEXDH_GEX_REQUEST;
      writeUInt32BE(packet, this._minBits, ++p);
      writeUInt32BE(packet, this._prefBits, p += 4);
      writeUInt32BE(packet, this._maxBits, p += 4);
      this._protocol._cipher.encrypt(
        this._protocol._packetRW.write.finalize(packet, true)
      );
    }
    generateKeys() {
      if (!this._dh && this._prime && this._generator) {
        this._dh = createDiffieHellman(this._prime, this._generator);
        this._public = this._dh.generateKeys();
      }
    }
    setDHParams(prime, generator) {
      if (!Buffer.isBuffer(prime))
        throw new Error('Invalid prime value');
      if (!Buffer.isBuffer(generator))
        throw new Error('Invalid generator value');
      this._prime = prime;
      this._generator = generator;
    }
    getDHParams() {
      if (this._dh) {
        return {
          prime: convertToMpint(this._dh.getPrime()),
          generator: convertToMpint(this._dh.getGenerator()),
        };
      }
    }
    parse(payload) {
      const type = payload[0];
      switch (this._step) {
        case 1:
          if (this._protocol._server) {
            if (type !== MESSAGE.KEXDH_GEX_REQUEST) {
              return doFatalError(
                this._protocol,
                `Received packet ${type} instead of `
                  + MESSAGE.KEXDH_GEX_REQUEST,
                'handshake',
                DISCONNECT_REASON.KEY_EXCHANGE_FAILED
              );
            }
            // TODO: allow user implementation to provide safe prime and
            // generator on demand to support group exchange on server side
            return doFatalError(
              this._protocol,
              'Group exchange not implemented for server',
              'handshake',
              DISCONNECT_REASON.KEY_EXCHANGE_FAILED
            );
          }

          if (type !== MESSAGE.KEXDH_GEX_GROUP) {
            return doFatalError(
              this._protocol,
              `Received packet ${type} instead of ${MESSAGE.KEXDH_GEX_GROUP}`,
              'handshake',
              DISCONNECT_REASON.KEY_EXCHANGE_FAILED
            );
          }

          this._protocol._debug && this._protocol._debug(
            'Received DH GEX Group'
          );

          /*
            byte    SSH_MSG_KEX_DH_GEX_GROUP
            mpint   p, safe prime
            mpint   g, generator for subgroup in GF(p)
          */
          bufferParser.init(payload, 1);
          let prime;
          let gen;
          if ((prime = bufferParser.readString()) === undefined
              || (gen = bufferParser.readString()) === undefined) {
            bufferParser.clear();
            return doFatalError(
              this._protocol,
              'Received malformed KEXDH_GEX_GROUP',
              'handshake',
              DISCONNECT_REASON.KEY_EXCHANGE_FAILED
            );
          }
          bufferParser.clear();

          // TODO: validate prime
          this.setDHParams(prime, gen);
          this.generateKeys();
          const pubkey = this.getPublicKey();

          this._protocol._debug && this._protocol._debug(
            'Outbound: Sending KEXDH_GEX_INIT'
          );

          let p = this._protocol._packetRW.write.allocStartKEX;
          const packet =
            this._protocol._packetRW.write.alloc(1 + 4 + pubkey.length, true);
          packet[p] = MESSAGE.KEXDH_GEX_INIT;
          writeUInt32BE(packet, pubkey.length, ++p);
          packet.set(pubkey, p += 4);
          this._protocol._cipher.encrypt(
            this._protocol._packetRW.write.finalize(packet, true)
          );

          ++this._step;
          break;
        case 2:
          if (this._protocol._server) {
            if (type !== MESSAGE.KEXDH_GEX_INIT) {
              return doFatalError(
                this._protocol,
                `Received packet ${type} instead of ${MESSAGE.KEXDH_GEX_INIT}`,
                'handshake',
                DISCONNECT_REASON.KEY_EXCHANGE_FAILED
              );
            }
            this._protocol._debug && this._protocol._debug(
              'Received DH GEX Init'
            );
            return doFatalError(
              this._protocol,
              'Group exchange not implemented for server',
              'handshake',
              DISCONNECT_REASON.KEY_EXCHANGE_FAILED
            );
          } else if (type !== MESSAGE.KEXDH_GEX_REPLY) {
            return doFatalError(
              this._protocol,
              `Received packet ${type} instead of ${MESSAGE.KEXDH_GEX_REPLY}`,
              'handshake',
              DISCONNECT_REASON.KEY_EXCHANGE_FAILED
            );
          }
          this._protocol._debug && this._protocol._debug(
            'Received DH GEX Reply'
          );
          this._step = 1;
          payload[0] = MESSAGE.KEXDH_REPLY;
          this.parse = KeyExchange.prototype.parse;
          this.parse(payload);
      }
    }
  }

  class DHExchange extends KeyExchange {
    constructor(groupName, hashName, ...args) {
      super(...args);

      this.type = 'group';
      this.groupName = groupName;
      this.hashName = hashName;
    }
    start() {
      if (!this._protocol._server) {
        this._protocol._debug && this._protocol._debug(
          'Outbound: Sending KEXDH_INIT'
        );
        const pubKey = this.getPublicKey();
        let p = this._protocol._packetRW.write.allocStartKEX;
        const packet =
          this._protocol._packetRW.write.alloc(1 + 4 + pubKey.length, true);
        packet[p] = MESSAGE.KEXDH_INIT;
        writeUInt32BE(packet, pubKey.length, ++p);
        packet.set(pubKey, p += 4);
        this._protocol._cipher.encrypt(
          this._protocol._packetRW.write.finalize(packet, true)
        );
      }
    }
    generateKeys() {
      if (!this._dh) {
        this._dh = createDiffieHellmanGroup(this.groupName);
        this._public = this._dh.generateKeys();
      }
    }
    getDHParams() {
      if (this._dh) {
        return {
          prime: convertToMpint(this._dh.getPrime()),
          generator: convertToMpint(this._dh.getGenerator()),
        };
      }
    }
  }

  return (negotiated, ...args) => {
    if (typeof negotiated !== 'object' || negotiated === null)
      throw new Error('Invalid negotiated argument');
    const kexType = negotiated.kex;
    if (typeof kexType === 'string') {
      args = [negotiated, ...args];
      switch (kexType) {
        case 'curve25519-sha256':
        case 'curve25519-sha256@libssh.org':
          if (!curve25519Supported)
            break;
          return new Curve25519Exchange('sha256', ...args);

        case 'ecdh-sha2-nistp256':
          return new ECDHExchange('prime256v1', 'sha256', ...args);
        case 'ecdh-sha2-nistp384':
          return new ECDHExchange('secp384r1', 'sha384', ...args);
        case 'ecdh-sha2-nistp521':
          return new ECDHExchange('secp521r1', 'sha512', ...args);

        case 'diffie-hellman-group1-sha1':
          return new DHExchange('modp2', 'sha1', ...args);
        case 'diffie-hellman-group14-sha1':
          return new DHExchange('modp14', 'sha1', ...args);
        case 'diffie-hellman-group14-sha256':
          return new DHExchange('modp14', 'sha256', ...args);
        case 'diffie-hellman-group15-sha512':
          return new DHExchange('modp15', 'sha512', ...args);
        case 'diffie-hellman-group16-sha512':
          return new DHExchange('modp16', 'sha512', ...args);
        case 'diffie-hellman-group17-sha512':
          return new DHExchange('modp17', 'sha512', ...args);
        case 'diffie-hellman-group18-sha512':
          return new DHExchange('modp18', 'sha512', ...args);

        case 'diffie-hellman-group-exchange-sha1':
          return new DHGroupExchange('sha1', ...args);
        case 'diffie-hellman-group-exchange-sha256':
          return new DHGroupExchange('sha256', ...args);
      }
      throw new Error(`Unsupported key exchange algorithm: ${kexType}`);
    }
    throw new Error(`Invalid key exchange type: ${kexType}`);
  };
})();

const KexInit = (() => {
  const KEX_PROPERTY_NAMES = [
    'kex',
    'serverHostKey',
    ['cs', 'cipher' ],
    ['sc', 'cipher' ],
    ['cs', 'mac' ],
    ['sc', 'mac' ],
    ['cs', 'compress' ],
    ['sc', 'compress' ],
    ['cs', 'lang' ],
    ['sc', 'lang' ],
  ];
  return class KexInit {
    constructor(obj) {
      if (typeof obj !== 'object' || obj === null)
        throw new TypeError('Argument must be an object');

      const lists = {
        kex: undefined,
        serverHostKey: undefined,
        cs: {
          cipher: undefined,
          mac: undefined,
          compress: undefined,
          lang: undefined,
        },
        sc: {
          cipher: undefined,
          mac: undefined,
          compress: undefined,
          lang: undefined,
        },

        all: undefined,
      };
      let totalSize = 0;
      for (const prop of KEX_PROPERTY_NAMES) {
        let base;
        let val;
        let desc;
        let key;
        if (typeof prop === 'string') {
          base = lists;
          val = obj[prop];
          desc = key = prop;
        } else {
          const parent = prop[0];
          base = lists[parent];
          key = prop[1];
          val = obj[parent][key];
          desc = `${parent}.${key}`;
        }
        const entry = { array: undefined, buffer: undefined };
        if (Buffer.isBuffer(val)) {
          entry.array = ('' + val).split(',');
          entry.buffer = val;
          totalSize += 4 + val.length;
        } else {
          if (typeof val === 'string')
            val = val.split(',');
          if (Array.isArray(val)) {
            entry.array = val;
            entry.buffer = Buffer.from(val.join(','));
          } else {
            throw new TypeError(`Invalid \`${desc}\` type: ${typeof val}`);
          }
          totalSize += 4 + entry.buffer.length;
        }
        base[key] = entry;
      }

      const all = Buffer.allocUnsafe(totalSize);
      lists.all = all;

      let allPos = 0;
      for (const prop of KEX_PROPERTY_NAMES) {
        let data;
        if (typeof prop === 'string')
          data = lists[prop].buffer;
        else
          data = lists[prop[0]][prop[1]].buffer;
        allPos = writeUInt32BE(all, data.length, allPos);
        all.set(data, allPos);
        allPos += data.length;
      }

      this.totalSize = totalSize;
      this.lists = lists;
    }
    copyAllTo(buf, offset) {
      const src = this.lists.all;
      if (typeof offset !== 'number')
        throw new TypeError(`Invalid offset value: ${typeof offset}`);
      if (buf.length - offset < src.length)
        throw new Error('Insufficient space to copy list');
      buf.set(src, offset);
      return src.length;
    }
  };
})();

const hashString = (() => {
  const LEN = Buffer.allocUnsafe(4);
  return (hash, buf) => {
    writeUInt32BE(LEN, buf.length, 0);
    hash.update(LEN);
    hash.update(buf);
  };
})();

function generateKEXVal(len, hashName, secret, exchangeHash, sessionID, char) {
  let ret;
  if (len) {
    let digest = createHash(hashName)
                   .update(secret)
                   .update(exchangeHash)
                   .update(char)
                   .update(sessionID)
                   .digest();
    while (digest.length < len) {
      const chunk = createHash(hashName)
                      .update(secret)
                      .update(exchangeHash)
                      .update(digest)
                      .digest();
      const extended = Buffer.allocUnsafe(digest.length + chunk.length);
      extended.set(digest, 0);
      extended.set(chunk, digest.length);
      digest = extended;
    }
    if (digest.length === len)
      ret = digest;
    else
      ret = new FastBuffer(digest.buffer, digest.byteOffset, len);
  } else {
    ret = EMPTY_BUFFER;
  }
  return ret;
}

function onKEXPayload(state, payload) {
  // XXX: move this to the Decipher implementations?
  if (payload.length === 0) {
    this._debug && this._debug('Inbound: Skipping empty packet payload');
    return;
  }

  if (this._skipNextInboundPacket) {
    this._skipNextInboundPacket = false;
    return;
  }

  payload = this._packetRW.read.read(payload);

  const type = payload[0];
  switch (type) {
    case MESSAGE.DISCONNECT:
    case MESSAGE.IGNORE:
    case MESSAGE.UNIMPLEMENTED:
    case MESSAGE.DEBUG:
      if (!MESSAGE_HANDLERS)
        MESSAGE_HANDLERS = __nccwpck_require__(172);
      return MESSAGE_HANDLERS[type](this, payload);
    case MESSAGE.KEXINIT:
      if (!state.firstPacket) {
        return doFatalError(
          this,
          'Received extra KEXINIT during handshake',
          'handshake',
          DISCONNECT_REASON.KEY_EXCHANGE_FAILED
        );
      }
      state.firstPacket = false;
      return handleKexInit(this, payload);
    default:
      if (type < 20 || type > 49) {
        return doFatalError(
          this,
          `Received unexpected packet type ${type}`,
          'handshake',
          DISCONNECT_REASON.KEY_EXCHANGE_FAILED
        );
      }
  }

  return this._kex.parse(payload);
}

function dhEstimate(neg) {
  const csCipher = CIPHER_INFO[neg.cs.cipher];
  const scCipher = CIPHER_INFO[neg.sc.cipher];
  // XXX: if OpenSSH's `umac-*` MACs are ever supported, their key lengths will
  // also need to be considered when calculating `bits`
  const bits = Math.max(
    0,
    (csCipher.sslName === 'des-ede3-cbc' ? 14 : csCipher.keyLen),
    csCipher.blockLen,
    csCipher.ivLen,
    (scCipher.sslName === 'des-ede3-cbc' ? 14 : scCipher.keyLen),
    scCipher.blockLen,
    scCipher.ivLen
  ) * 8;
  if (bits <= 112)
    return 2048;
  if (bits <= 128)
    return 3072;
  if (bits <= 192)
    return 7680;
  return 8192;
}

function trySendNEWKEYS(kex) {
  if (!kex._sentNEWKEYS) {
    kex._protocol._debug && kex._protocol._debug(
      'Outbound: Sending NEWKEYS'
    );
    const p = kex._protocol._packetRW.write.allocStartKEX;
    const packet = kex._protocol._packetRW.write.alloc(1, true);
    packet[p] = MESSAGE.NEWKEYS;
    kex._protocol._cipher.encrypt(
      kex._protocol._packetRW.write.finalize(packet, true)
    );
    kex._sentNEWKEYS = true;
  }
}

module.exports = {
  KexInit,
  kexinit,
  onKEXPayload,
  DEFAULT_KEXINIT: new KexInit({
    kex: DEFAULT_KEX,
    serverHostKey: DEFAULT_SERVER_HOST_KEY,
    cs: {
      cipher: DEFAULT_CIPHER,
      mac: DEFAULT_MAC,
      compress: DEFAULT_COMPRESSION,
      lang: [],
    },
    sc: {
      cipher: DEFAULT_CIPHER,
      mac: DEFAULT_MAC,
      compress: DEFAULT_COMPRESSION,
      lang: [],
    },
  }),
  HANDLERS: {
    [MESSAGE.KEXINIT]: handleKexInit,
  },
};


/***/ }),

/***/ 2218:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// TODO:
//    * utilize `crypto.create(Private|Public)Key()` and `keyObject.export()`
//    * handle multi-line header values (OpenSSH)?
//    * more thorough validation?


const {
  createDecipheriv,
  createECDH,
  createHash,
  createHmac,
  createSign,
  createVerify,
  getCiphers,
  sign: sign_,
  verify: verify_,
} = __nccwpck_require__(6417);
const supportedOpenSSLCiphers = getCiphers();

const { Ber } = __nccwpck_require__(970);
const bcrypt_pbkdf = __nccwpck_require__(5447).pbkdf;

const { CIPHER_INFO } = __nccwpck_require__(5708);
const { eddsaSupported, SUPPORTED_CIPHER } = __nccwpck_require__(6832);
const {
  bufferSlice,
  makeBufferParser,
  readString,
  readUInt32BE,
  writeUInt32BE,
} = __nccwpck_require__(9475);

const SYM_HASH_ALGO = Symbol('Hash Algorithm');
const SYM_PRIV_PEM = Symbol('Private key PEM');
const SYM_PUB_PEM = Symbol('Public key PEM');
const SYM_PUB_SSH = Symbol('Public key SSH');
const SYM_DECRYPTED = Symbol('Decrypted Key');

// Create OpenSSL cipher name -> SSH cipher name conversion table
const CIPHER_INFO_OPENSSL = Object.create(null);
{
  const keys = Object.keys(CIPHER_INFO);
  for (let i = 0; i < keys.length; ++i) {
    const cipherName = CIPHER_INFO[keys[i]].sslName;
    if (!cipherName || CIPHER_INFO_OPENSSL[cipherName])
      continue;
    CIPHER_INFO_OPENSSL[cipherName] = CIPHER_INFO[keys[i]];
  }
}

const binaryKeyParser = makeBufferParser();

function makePEM(type, data) {
  data = data.base64Slice(0, data.length);
  let formatted = data.replace(/.{64}/g, '$&\n');
  if (data.length & 63)
    formatted += '\n';
  return `-----BEGIN ${type} KEY-----\n${formatted}-----END ${type} KEY-----`;
}

function combineBuffers(buf1, buf2) {
  const result = Buffer.allocUnsafe(buf1.length + buf2.length);
  result.set(buf1, 0);
  result.set(buf2, buf1.length);
  return result;
}

function skipFields(buf, nfields) {
  const bufLen = buf.length;
  let pos = (buf._pos || 0);
  for (let i = 0; i < nfields; ++i) {
    const left = (bufLen - pos);
    if (pos >= bufLen || left < 4)
      return false;
    const len = readUInt32BE(buf, pos);
    if (left < 4 + len)
      return false;
    pos += 4 + len;
  }
  buf._pos = pos;
  return true;
}

function genOpenSSLRSAPub(n, e) {
  const asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.2.840.113549.1.1.1'); // rsaEncryption
      // algorithm parameters (RSA has none)
      asnWriter.writeNull();
    asnWriter.endSequence();

    // subjectPublicKey
    asnWriter.startSequence(Ber.BitString);
      asnWriter.writeByte(0x00);
      asnWriter.startSequence();
        asnWriter.writeBuffer(n, Ber.Integer);
        asnWriter.writeBuffer(e, Ber.Integer);
      asnWriter.endSequence();
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PUBLIC', asnWriter.buffer);
}

function genOpenSSHRSAPub(n, e) {
  const publicKey = Buffer.allocUnsafe(4 + 7 + 4 + e.length + 4 + n.length);

  writeUInt32BE(publicKey, 7, 0);
  publicKey.utf8Write('ssh-rsa', 4, 7);

  let i = 4 + 7;
  writeUInt32BE(publicKey, e.length, i);
  publicKey.set(e, i += 4);

  writeUInt32BE(publicKey, n.length, i += e.length);
  publicKey.set(n, i + 4);

  return publicKey;
}

const genOpenSSLRSAPriv = (() => {
  function genRSAASN1Buf(n, e, d, p, q, dmp1, dmq1, iqmp) {
    const asnWriter = new Ber.Writer();
    asnWriter.startSequence();
      asnWriter.writeInt(0x00, Ber.Integer);
      asnWriter.writeBuffer(n, Ber.Integer);
      asnWriter.writeBuffer(e, Ber.Integer);
      asnWriter.writeBuffer(d, Ber.Integer);
      asnWriter.writeBuffer(p, Ber.Integer);
      asnWriter.writeBuffer(q, Ber.Integer);
      asnWriter.writeBuffer(dmp1, Ber.Integer);
      asnWriter.writeBuffer(dmq1, Ber.Integer);
      asnWriter.writeBuffer(iqmp, Ber.Integer);
    asnWriter.endSequence();
    return asnWriter.buffer;
  }

  function bigIntFromBuffer(buf) {
    return BigInt(`0x${buf.hexSlice(0, buf.length)}`);
  }

  function bigIntToBuffer(bn) {
    let hex = bn.toString(16);
    if ((hex.length & 1) !== 0) {
      hex = `0${hex}`;
    } else {
      const sigbit = hex.charCodeAt(0);
      // BER/DER integers require leading zero byte to denote a positive value
      // when first byte >= 0x80
      if (sigbit === 56/* '8' */
          || sigbit === 57/* '9' */
          || (sigbit >= 97/* 'a' */ && sigbit <= 102/* 'f' */)) {
        hex = `00${hex}`;
      }
    }
    return Buffer.from(hex, 'hex');
  }

  return function genOpenSSLRSAPriv(n, e, d, iqmp, p, q) {
    const bn_d = bigIntFromBuffer(d);
    const dmp1 = bigIntToBuffer(bn_d % (bigIntFromBuffer(p) - 1n));
    const dmq1 = bigIntToBuffer(bn_d % (bigIntFromBuffer(q) - 1n));
    return makePEM('RSA PRIVATE',
                   genRSAASN1Buf(n, e, d, p, q, dmp1, dmq1, iqmp));
  };
})();

function genOpenSSLDSAPub(p, q, g, y) {
  const asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.2.840.10040.4.1'); // id-dsa
      // algorithm parameters
      asnWriter.startSequence();
        asnWriter.writeBuffer(p, Ber.Integer);
        asnWriter.writeBuffer(q, Ber.Integer);
        asnWriter.writeBuffer(g, Ber.Integer);
      asnWriter.endSequence();
    asnWriter.endSequence();

    // subjectPublicKey
    asnWriter.startSequence(Ber.BitString);
      asnWriter.writeByte(0x00);
      asnWriter.writeBuffer(y, Ber.Integer);
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PUBLIC', asnWriter.buffer);
}

function genOpenSSHDSAPub(p, q, g, y) {
  const publicKey = Buffer.allocUnsafe(
    4 + 7 + 4 + p.length + 4 + q.length + 4 + g.length + 4 + y.length
  );

  writeUInt32BE(publicKey, 7, 0);
  publicKey.utf8Write('ssh-dss', 4, 7);

  let i = 4 + 7;
  writeUInt32BE(publicKey, p.length, i);
  publicKey.set(p, i += 4);

  writeUInt32BE(publicKey, q.length, i += p.length);
  publicKey.set(q, i += 4);

  writeUInt32BE(publicKey, g.length, i += q.length);
  publicKey.set(g, i += 4);

  writeUInt32BE(publicKey, y.length, i += g.length);
  publicKey.set(y, i + 4);

  return publicKey;
}

function genOpenSSLDSAPriv(p, q, g, y, x) {
  const asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    asnWriter.writeInt(0x00, Ber.Integer);
    asnWriter.writeBuffer(p, Ber.Integer);
    asnWriter.writeBuffer(q, Ber.Integer);
    asnWriter.writeBuffer(g, Ber.Integer);
    asnWriter.writeBuffer(y, Ber.Integer);
    asnWriter.writeBuffer(x, Ber.Integer);
  asnWriter.endSequence();
  return makePEM('DSA PRIVATE', asnWriter.buffer);
}

function genOpenSSLEdPub(pub) {
  const asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.3.101.112'); // id-Ed25519
    asnWriter.endSequence();

    // PublicKey
    asnWriter.startSequence(Ber.BitString);
      asnWriter.writeByte(0x00);
      // XXX: hack to write a raw buffer without a tag -- yuck
      asnWriter._ensure(pub.length);
      asnWriter._buf.set(pub, asnWriter._offset);
      asnWriter._offset += pub.length;
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PUBLIC', asnWriter.buffer);
}

function genOpenSSHEdPub(pub) {
  const publicKey = Buffer.allocUnsafe(4 + 11 + 4 + pub.length);

  writeUInt32BE(publicKey, 11, 0);
  publicKey.utf8Write('ssh-ed25519', 4, 11);

  writeUInt32BE(publicKey, pub.length, 15);
  publicKey.set(pub, 19);

  return publicKey;
}

function genOpenSSLEdPriv(priv) {
  const asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // version
    asnWriter.writeInt(0x00, Ber.Integer);

    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.3.101.112'); // id-Ed25519
    asnWriter.endSequence();

    // PrivateKey
    asnWriter.startSequence(Ber.OctetString);
      asnWriter.writeBuffer(priv, Ber.OctetString);
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PRIVATE', asnWriter.buffer);
}

function genOpenSSLECDSAPub(oid, Q) {
  const asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.2.840.10045.2.1'); // id-ecPublicKey
      // algorithm parameters (namedCurve)
      asnWriter.writeOID(oid);
    asnWriter.endSequence();

    // subjectPublicKey
    asnWriter.startSequence(Ber.BitString);
      asnWriter.writeByte(0x00);
      // XXX: hack to write a raw buffer without a tag -- yuck
      asnWriter._ensure(Q.length);
      asnWriter._buf.set(Q, asnWriter._offset);
      asnWriter._offset += Q.length;
      // end hack
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PUBLIC', asnWriter.buffer);
}

function genOpenSSHECDSAPub(oid, Q) {
  let curveName;
  switch (oid) {
    case '1.2.840.10045.3.1.7':
      // prime256v1/secp256r1
      curveName = 'nistp256';
      break;
    case '1.3.132.0.34':
      // secp384r1
      curveName = 'nistp384';
      break;
    case '1.3.132.0.35':
      // secp521r1
      curveName = 'nistp521';
      break;
    default:
      return;
  }

  const publicKey = Buffer.allocUnsafe(4 + 19 + 4 + 8 + 4 + Q.length);

  writeUInt32BE(publicKey, 19, 0);
  publicKey.utf8Write(`ecdsa-sha2-${curveName}`, 4, 19);

  writeUInt32BE(publicKey, 8, 23);
  publicKey.utf8Write(curveName, 27, 8);

  writeUInt32BE(publicKey, Q.length, 35);
  publicKey.set(Q, 39);

  return publicKey;
}

function genOpenSSLECDSAPriv(oid, pub, priv) {
  const asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // version
    asnWriter.writeInt(0x01, Ber.Integer);
    // privateKey
    asnWriter.writeBuffer(priv, Ber.OctetString);
    // parameters (optional)
    asnWriter.startSequence(0xA0);
      asnWriter.writeOID(oid);
    asnWriter.endSequence();
    // publicKey (optional)
    asnWriter.startSequence(0xA1);
      asnWriter.startSequence(Ber.BitString);
        asnWriter.writeByte(0x00);
        // XXX: hack to write a raw buffer without a tag -- yuck
        asnWriter._ensure(pub.length);
        asnWriter._buf.set(pub, asnWriter._offset);
        asnWriter._offset += pub.length;
        // end hack
      asnWriter.endSequence();
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('EC PRIVATE', asnWriter.buffer);
}

function genOpenSSLECDSAPubFromPriv(curveName, priv) {
  const tempECDH = createECDH(curveName);
  tempECDH.setPrivateKey(priv);
  return tempECDH.getPublicKey();
}

const BaseKey = {
  sign: (() => {
    if (typeof sign_ === 'function') {
      return function sign(data, algo) {
        const pem = this[SYM_PRIV_PEM];
        if (pem === null)
          return new Error('No private key available');
        if (!algo || typeof algo !== 'string')
          algo = this[SYM_HASH_ALGO];
        try {
          return sign_(algo, data, pem);
        } catch (ex) {
          return ex;
        }
      };
    }
    return function sign(data, algo) {
      const pem = this[SYM_PRIV_PEM];
      if (pem === null)
        return new Error('No private key available');
      if (!algo || typeof algo !== 'string')
        algo = this[SYM_HASH_ALGO];
      const signature = createSign(algo);
      signature.update(data);
      try {
        return signature.sign(pem);
      } catch (ex) {
        return ex;
      }
    };
  })(),
  verify: (() => {
    if (typeof verify_ === 'function') {
      return function verify(data, signature, algo) {
        const pem = this[SYM_PUB_PEM];
        if (pem === null)
          return new Error('No public key available');
        if (!algo || typeof algo !== 'string')
          algo = this[SYM_HASH_ALGO];
        try {
          return verify_(algo, data, pem, signature);
        } catch (ex) {
          return ex;
        }
      };
    }
    return function verify(data, signature, algo) {
      const pem = this[SYM_PUB_PEM];
      if (pem === null)
        return new Error('No public key available');
      if (!algo || typeof algo !== 'string')
        algo = this[SYM_HASH_ALGO];
      const verifier = createVerify(algo);
      verifier.update(data);
      try {
        return verifier.verify(pem, signature);
      } catch (ex) {
        return ex;
      }
    };
  })(),
  isPrivateKey: function isPrivateKey() {
    return (this[SYM_PRIV_PEM] !== null);
  },
  getPrivatePEM: function getPrivatePEM() {
    return this[SYM_PRIV_PEM];
  },
  getPublicPEM: function getPublicPEM() {
    return this[SYM_PUB_PEM];
  },
  getPublicSSH: function getPublicSSH() {
    return this[SYM_PUB_SSH];
  },
  equals: function equals(key) {
    const parsed = parseKey(key);
    if (parsed instanceof Error)
      return false;
    return (
      this.type === parsed.type
      && this[SYM_PRIV_PEM] === parsed[SYM_PRIV_PEM]
      && this[SYM_PUB_PEM] === parsed[SYM_PUB_PEM]
      && this[SYM_PUB_SSH] === parsed[SYM_PUB_SSH]
    );
  },
};


function OpenSSH_Private(type, comment, privPEM, pubPEM, pubSSH, algo,
                         decrypted) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = privPEM;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = decrypted;
}
OpenSSH_Private.prototype = BaseKey;
{
  const regexp = /^-----BEGIN OPENSSH PRIVATE KEY-----(?:\r\n|\n)([\s\S]+)(?:\r\n|\n)-----END OPENSSH PRIVATE KEY-----$/;
  OpenSSH_Private.parse = (str, passphrase) => {
    const m = regexp.exec(str);
    if (m === null)
      return null;
    let ret;
    const data = Buffer.from(m[1], 'base64');
    if (data.length < 31) // magic (+ magic null term.) + minimum field lengths
      return new Error('Malformed OpenSSH private key');
    const magic = data.utf8Slice(0, 15);
    if (magic !== 'openssh-key-v1\0')
      return new Error(`Unsupported OpenSSH key magic: ${magic}`);

    const cipherName = readString(data, 15, true);
    if (cipherName === undefined)
      return new Error('Malformed OpenSSH private key');
    if (cipherName !== 'none' && SUPPORTED_CIPHER.indexOf(cipherName) === -1)
      return new Error(`Unsupported cipher for OpenSSH key: ${cipherName}`);

    const kdfName = readString(data, data._pos, true);
    if (kdfName === undefined)
      return new Error('Malformed OpenSSH private key');
    if (kdfName !== 'none') {
      if (cipherName === 'none')
        return new Error('Malformed OpenSSH private key');
      if (kdfName !== 'bcrypt')
        return new Error(`Unsupported kdf name for OpenSSH key: ${kdfName}`);
      if (!passphrase) {
        return new Error(
          'Encrypted private OpenSSH key detected, but no passphrase given'
        );
      }
    } else if (cipherName !== 'none') {
      return new Error('Malformed OpenSSH private key');
    }

    let encInfo;
    let cipherKey;
    let cipherIV;
    if (cipherName !== 'none')
      encInfo = CIPHER_INFO[cipherName];
    const kdfOptions = readString(data, data._pos);
    if (kdfOptions === undefined)
      return new Error('Malformed OpenSSH private key');
    if (kdfOptions.length) {
      switch (kdfName) {
        case 'none':
          return new Error('Malformed OpenSSH private key');
        case 'bcrypt':
          /*
            string salt
            uint32 rounds
          */
          const salt = readString(kdfOptions, 0);
          if (salt === undefined || kdfOptions._pos + 4 > kdfOptions.length)
            return new Error('Malformed OpenSSH private key');
          const rounds = readUInt32BE(kdfOptions, kdfOptions._pos);
          const gen = Buffer.allocUnsafe(encInfo.keyLen + encInfo.ivLen);
          const r = bcrypt_pbkdf(passphrase,
                                 passphrase.length,
                                 salt,
                                 salt.length,
                                 gen,
                                 gen.length,
                                 rounds);
          if (r !== 0)
            return new Error('Failed to generate information to decrypt key');
          cipherKey = bufferSlice(gen, 0, encInfo.keyLen);
          cipherIV = bufferSlice(gen, encInfo.keyLen, gen.length);
          break;
      }
    } else if (kdfName !== 'none') {
      return new Error('Malformed OpenSSH private key');
    }

    if (data._pos + 3 >= data.length)
      return new Error('Malformed OpenSSH private key');
    const keyCount = readUInt32BE(data, data._pos);
    data._pos += 4;

    if (keyCount > 0) {
      // TODO: place sensible limit on max `keyCount`

      // Read public keys first
      for (let i = 0; i < keyCount; ++i) {
        const pubData = readString(data, data._pos);
        if (pubData === undefined)
          return new Error('Malformed OpenSSH private key');
        const type = readString(pubData, 0, true);
        if (type === undefined)
          return new Error('Malformed OpenSSH private key');
      }

      let privBlob = readString(data, data._pos);
      if (privBlob === undefined)
        return new Error('Malformed OpenSSH private key');

      if (cipherKey !== undefined) {
        // Encrypted private key(s)
        if (privBlob.length < encInfo.blockLen
            || (privBlob.length % encInfo.blockLen) !== 0) {
          return new Error('Malformed OpenSSH private key');
        }
        try {
          const options = { authTagLength: encInfo.authLen };
          const decipher = createDecipheriv(encInfo.sslName,
                                            cipherKey,
                                            cipherIV,
                                            options);
          if (encInfo.authLen > 0) {
            if (data.length - data._pos < encInfo.authLen)
              return new Error('Malformed OpenSSH private key');
            decipher.setAuthTag(
              bufferSlice(data, data._pos, data._pos += encInfo.authLen)
            );
          }
          privBlob = combineBuffers(decipher.update(privBlob),
                                    decipher.final());
        } catch (ex) {
          return ex;
        }
      }
      // Nothing should we follow the private key(s), except a possible
      // authentication tag for relevant ciphers
      if (data._pos !== data.length)
        return new Error('Malformed OpenSSH private key');

      ret = parseOpenSSHPrivKeys(privBlob, keyCount, cipherKey !== undefined);
    } else {
      ret = [];
    }
    if (ret instanceof Error)
      return ret;
    // This will need to change if/when OpenSSH ever starts storing multiple
    // keys in their key files
    return ret[0];
  };

  function parseOpenSSHPrivKeys(data, nkeys, decrypted) {
    const keys = [];
    /*
      uint32  checkint
      uint32  checkint
      string  privatekey1
      string  comment1
      string  privatekey2
      string  comment2
      ...
      string  privatekeyN
      string  commentN
      char  1
      char  2
      char  3
      ...
      char  padlen % 255
    */
    if (data.length < 8)
      return new Error('Malformed OpenSSH private key');
    const check1 = readUInt32BE(data, 0);
    const check2 = readUInt32BE(data, 4);
    if (check1 !== check2) {
      if (decrypted) {
        return new Error(
          'OpenSSH key integrity check failed -- bad passphrase?'
        );
      }
      return new Error('OpenSSH key integrity check failed');
    }
    data._pos = 8;
    let i;
    let oid;
    for (i = 0; i < nkeys; ++i) {
      let algo;
      let privPEM;
      let pubPEM;
      let pubSSH;
      // The OpenSSH documentation for the key format actually lies, the
      // entirety of the private key content is not contained with a string
      // field, it's actually the literal contents of the private key, so to be
      // able to find the end of the key data you need to know the layout/format
      // of each key type ...
      const type = readString(data, data._pos, true);
      if (type === undefined)
        return new Error('Malformed OpenSSH private key');

      switch (type) {
        case 'ssh-rsa': {
          /*
            string  n -- public
            string  e -- public
            string  d -- private
            string  iqmp -- private
            string  p -- private
            string  q -- private
          */
          const n = readString(data, data._pos);
          if (n === undefined)
            return new Error('Malformed OpenSSH private key');
          const e = readString(data, data._pos);
          if (e === undefined)
            return new Error('Malformed OpenSSH private key');
          const d = readString(data, data._pos);
          if (d === undefined)
            return new Error('Malformed OpenSSH private key');
          const iqmp = readString(data, data._pos);
          if (iqmp === undefined)
            return new Error('Malformed OpenSSH private key');
          const p = readString(data, data._pos);
          if (p === undefined)
            return new Error('Malformed OpenSSH private key');
          const q = readString(data, data._pos);
          if (q === undefined)
            return new Error('Malformed OpenSSH private key');

          pubPEM = genOpenSSLRSAPub(n, e);
          pubSSH = genOpenSSHRSAPub(n, e);
          privPEM = genOpenSSLRSAPriv(n, e, d, iqmp, p, q);
          algo = 'sha1';
          break;
        }
        case 'ssh-dss': {
          /*
            string  p -- public
            string  q -- public
            string  g -- public
            string  y -- public
            string  x -- private
          */
          const p = readString(data, data._pos);
          if (p === undefined)
            return new Error('Malformed OpenSSH private key');
          const q = readString(data, data._pos);
          if (q === undefined)
            return new Error('Malformed OpenSSH private key');
          const g = readString(data, data._pos);
          if (g === undefined)
            return new Error('Malformed OpenSSH private key');
          const y = readString(data, data._pos);
          if (y === undefined)
            return new Error('Malformed OpenSSH private key');
          const x = readString(data, data._pos);
          if (x === undefined)
            return new Error('Malformed OpenSSH private key');

          pubPEM = genOpenSSLDSAPub(p, q, g, y);
          pubSSH = genOpenSSHDSAPub(p, q, g, y);
          privPEM = genOpenSSLDSAPriv(p, q, g, y, x);
          algo = 'sha1';
          break;
        }
        case 'ssh-ed25519': {
          if (!eddsaSupported)
            return new Error(`Unsupported OpenSSH private key type: ${type}`);
          /*
            * string  public key
            * string  private key + public key
          */
          const edpub = readString(data, data._pos);
          if (edpub === undefined || edpub.length !== 32)
            return new Error('Malformed OpenSSH private key');
          const edpriv = readString(data, data._pos);
          if (edpriv === undefined || edpriv.length !== 64)
            return new Error('Malformed OpenSSH private key');

          pubPEM = genOpenSSLEdPub(edpub);
          pubSSH = genOpenSSHEdPub(edpub);
          privPEM = genOpenSSLEdPriv(bufferSlice(edpriv, 0, 32));
          algo = null;
          break;
        }
        case 'ecdsa-sha2-nistp256':
          algo = 'sha256';
          oid = '1.2.840.10045.3.1.7';
        // FALLTHROUGH
        case 'ecdsa-sha2-nistp384':
          if (algo === undefined) {
            algo = 'sha384';
            oid = '1.3.132.0.34';
          }
        // FALLTHROUGH
        case 'ecdsa-sha2-nistp521': {
          if (algo === undefined) {
            algo = 'sha512';
            oid = '1.3.132.0.35';
          }
          /*
            string  curve name
            string  Q -- public
            string  d -- private
          */
          // TODO: validate curve name against type
          if (!skipFields(data, 1)) // Skip curve name
            return new Error('Malformed OpenSSH private key');
          const ecpub = readString(data, data._pos);
          if (ecpub === undefined)
            return new Error('Malformed OpenSSH private key');
          const ecpriv = readString(data, data._pos);
          if (ecpriv === undefined)
            return new Error('Malformed OpenSSH private key');

          pubPEM = genOpenSSLECDSAPub(oid, ecpub);
          pubSSH = genOpenSSHECDSAPub(oid, ecpub);
          privPEM = genOpenSSLECDSAPriv(oid, ecpub, ecpriv);
          break;
        }
        default:
          return new Error(`Unsupported OpenSSH private key type: ${type}`);
      }

      const privComment = readString(data, data._pos, true);
      if (privComment === undefined)
        return new Error('Malformed OpenSSH private key');

      keys.push(
        new OpenSSH_Private(type, privComment, privPEM, pubPEM, pubSSH, algo,
                            decrypted)
      );
    }
    let cnt = 0;
    for (i = data._pos; i < data.length; ++i) {
      if (data[i] !== (++cnt % 255))
        return new Error('Malformed OpenSSH private key');
    }

    return keys;
  }
}


function OpenSSH_Old_Private(type, comment, privPEM, pubPEM, pubSSH, algo,
                             decrypted) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = privPEM;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = decrypted;
}
OpenSSH_Old_Private.prototype = BaseKey;
{
  const regexp = /^-----BEGIN (RSA|DSA|EC) PRIVATE KEY-----(?:\r\n|\n)((?:[^:]+:\s*[\S].*(?:\r\n|\n))*)([\s\S]+)(?:\r\n|\n)-----END (RSA|DSA|EC) PRIVATE KEY-----$/;
  OpenSSH_Old_Private.parse = (str, passphrase) => {
    const m = regexp.exec(str);
    if (m === null)
      return null;
    let privBlob = Buffer.from(m[3], 'base64');
    let headers = m[2];
    let decrypted = false;
    if (headers !== undefined) {
      // encrypted key
      headers = headers.split(/\r\n|\n/g);
      for (let i = 0; i < headers.length; ++i) {
        const header = headers[i];
        let sepIdx = header.indexOf(':');
        if (header.slice(0, sepIdx) === 'DEK-Info') {
          const val = header.slice(sepIdx + 2);
          sepIdx = val.indexOf(',');
          if (sepIdx === -1)
            continue;
          const cipherName = val.slice(0, sepIdx).toLowerCase();
          if (supportedOpenSSLCiphers.indexOf(cipherName) === -1) {
            return new Error(
              `Cipher (${cipherName}) not supported `
                + 'for encrypted OpenSSH private key'
            );
          }
          const encInfo = CIPHER_INFO_OPENSSL[cipherName];
          if (!encInfo) {
            return new Error(
              `Cipher (${cipherName}) not supported `
                + 'for encrypted OpenSSH private key'
            );
          }
          const cipherIV = Buffer.from(val.slice(sepIdx + 1), 'hex');
          if (cipherIV.length !== encInfo.ivLen)
            return new Error('Malformed encrypted OpenSSH private key');
          if (!passphrase) {
            return new Error(
              'Encrypted OpenSSH private key detected, but no passphrase given'
            );
          }
          const ivSlice = bufferSlice(cipherIV, 0, 8);
          let cipherKey = createHash('md5')
                            .update(passphrase)
                            .update(ivSlice)
                            .digest();
          while (cipherKey.length < encInfo.keyLen) {
            cipherKey = combineBuffers(
              cipherKey,
              createHash('md5')
                .update(cipherKey)
                .update(passphrase)
                .update(ivSlice)
                .digest()
            );
          }
          if (cipherKey.length > encInfo.keyLen)
            cipherKey = bufferSlice(cipherKey, 0, encInfo.keyLen);
          try {
            const decipher = createDecipheriv(cipherName, cipherKey, cipherIV);
            decipher.setAutoPadding(false);
            privBlob = combineBuffers(decipher.update(privBlob),
                                      decipher.final());
            decrypted = true;
          } catch (ex) {
            return ex;
          }
        }
      }
    }

    let type;
    let privPEM;
    let pubPEM;
    let pubSSH;
    let algo;
    let reader;
    let errMsg = 'Malformed OpenSSH private key';
    if (decrypted)
      errMsg += '. Bad passphrase?';
    switch (m[1]) {
      case 'RSA':
        type = 'ssh-rsa';
        privPEM = makePEM('RSA PRIVATE', privBlob);
        try {
          reader = new Ber.Reader(privBlob);
          reader.readSequence();
          reader.readInt(); // skip version
          const n = reader.readString(Ber.Integer, true);
          if (n === null)
            return new Error(errMsg);
          const e = reader.readString(Ber.Integer, true);
          if (e === null)
            return new Error(errMsg);
          pubPEM = genOpenSSLRSAPub(n, e);
          pubSSH = genOpenSSHRSAPub(n, e);
        } catch {
          return new Error(errMsg);
        }
        algo = 'sha1';
        break;
      case 'DSA':
        type = 'ssh-dss';
        privPEM = makePEM('DSA PRIVATE', privBlob);
        try {
          reader = new Ber.Reader(privBlob);
          reader.readSequence();
          reader.readInt(); // skip version
          const p = reader.readString(Ber.Integer, true);
          if (p === null)
            return new Error(errMsg);
          const q = reader.readString(Ber.Integer, true);
          if (q === null)
            return new Error(errMsg);
          const g = reader.readString(Ber.Integer, true);
          if (g === null)
            return new Error(errMsg);
          const y = reader.readString(Ber.Integer, true);
          if (y === null)
            return new Error(errMsg);
          pubPEM = genOpenSSLDSAPub(p, q, g, y);
          pubSSH = genOpenSSHDSAPub(p, q, g, y);
        } catch {
          return new Error(errMsg);
        }
        algo = 'sha1';
        break;
      case 'EC':
        let ecSSLName;
        let ecPriv;
        let ecOID;
        try {
          reader = new Ber.Reader(privBlob);
          reader.readSequence();
          reader.readInt(); // skip version
          ecPriv = reader.readString(Ber.OctetString, true);
          reader.readByte(); // Skip "complex" context type byte
          const offset = reader.readLength(); // Skip context length
          if (offset !== null) {
            reader._offset = offset;
            ecOID = reader.readOID();
            if (ecOID === null)
              return new Error(errMsg);
            switch (ecOID) {
              case '1.2.840.10045.3.1.7':
                // prime256v1/secp256r1
                ecSSLName = 'prime256v1';
                type = 'ecdsa-sha2-nistp256';
                algo = 'sha256';
                break;
              case '1.3.132.0.34':
                // secp384r1
                ecSSLName = 'secp384r1';
                type = 'ecdsa-sha2-nistp384';
                algo = 'sha384';
                break;
              case '1.3.132.0.35':
                // secp521r1
                ecSSLName = 'secp521r1';
                type = 'ecdsa-sha2-nistp521';
                algo = 'sha512';
                break;
              default:
                return new Error(`Unsupported private key EC OID: ${ecOID}`);
            }
          } else {
            return new Error(errMsg);
          }
        } catch {
          return new Error(errMsg);
        }
        privPEM = makePEM('EC PRIVATE', privBlob);
        const pubBlob = genOpenSSLECDSAPubFromPriv(ecSSLName, ecPriv);
        pubPEM = genOpenSSLECDSAPub(ecOID, pubBlob);
        pubSSH = genOpenSSHECDSAPub(ecOID, pubBlob);
        break;
    }

    return new OpenSSH_Old_Private(type, '', privPEM, pubPEM, pubSSH, algo,
                                   decrypted);
  };
}


function PPK_Private(type, comment, privPEM, pubPEM, pubSSH, algo, decrypted) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = privPEM;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = decrypted;
}
PPK_Private.prototype = BaseKey;
{
  const EMPTY_PASSPHRASE = Buffer.alloc(0);
  const PPK_IV = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const PPK_PP1 = Buffer.from([0, 0, 0, 0]);
  const PPK_PP2 = Buffer.from([0, 0, 0, 1]);
  const regexp = /^PuTTY-User-Key-File-2: (ssh-(?:rsa|dss))\r?\nEncryption: (aes256-cbc|none)\r?\nComment: ([^\r\n]*)\r?\nPublic-Lines: \d+\r?\n([\s\S]+?)\r?\nPrivate-Lines: \d+\r?\n([\s\S]+?)\r?\nPrivate-MAC: ([^\r\n]+)/;
  PPK_Private.parse = (str, passphrase) => {
    const m = regexp.exec(str);
    if (m === null)
      return null;
    // m[1] = key type
    // m[2] = encryption type
    // m[3] = comment
    // m[4] = base64-encoded public key data:
    //         for "ssh-rsa":
    //          string "ssh-rsa"
    //          mpint  e    (public exponent)
    //          mpint  n    (modulus)
    //         for "ssh-dss":
    //          string "ssh-dss"
    //          mpint p     (modulus)
    //          mpint q     (prime)
    //          mpint g     (base number)
    //          mpint y     (public key parameter: g^x mod p)
    // m[5] = base64-encoded private key data:
    //         for "ssh-rsa":
    //          mpint  d    (private exponent)
    //          mpint  p    (prime 1)
    //          mpint  q    (prime 2)
    //          mpint  iqmp ([inverse of q] mod p)
    //         for "ssh-dss":
    //          mpint x     (private key parameter)
    // m[6] = SHA1 HMAC over:
    //          string  name of algorithm ("ssh-dss", "ssh-rsa")
    //          string  encryption type
    //          string  comment
    //          string  public key data
    //          string  private-plaintext (including the final padding)
    const cipherName = m[2];
    const encrypted = (cipherName !== 'none');
    if (encrypted && !passphrase) {
      return new Error(
        'Encrypted PPK private key detected, but no passphrase given'
      );
    }

    let privBlob = Buffer.from(m[5], 'base64');

    if (encrypted) {
      const encInfo = CIPHER_INFO[cipherName];
      let cipherKey = combineBuffers(
        createHash('sha1').update(PPK_PP1).update(passphrase).digest(),
        createHash('sha1').update(PPK_PP2).update(passphrase).digest()
      );
      if (cipherKey.length > encInfo.keyLen)
        cipherKey = bufferSlice(cipherKey, 0, encInfo.keyLen);
      try {
        const decipher = createDecipheriv(encInfo.sslName,
                                        cipherKey,
                                        PPK_IV);
        decipher.setAutoPadding(false);
        privBlob = combineBuffers(decipher.update(privBlob),
                                  decipher.final());
      } catch (ex) {
        return ex;
      }
    }

    const type = m[1];
    const comment = m[3];
    const pubBlob = Buffer.from(m[4], 'base64');

    const mac = m[6];
    const typeLen = type.length;
    const cipherNameLen = cipherName.length;
    const commentLen = Buffer.byteLength(comment);
    const pubLen = pubBlob.length;
    const privLen = privBlob.length;
    const macData = Buffer.allocUnsafe(4 + typeLen
                                       + 4 + cipherNameLen
                                       + 4 + commentLen
                                       + 4 + pubLen
                                       + 4 + privLen);
    let p = 0;

    writeUInt32BE(macData, typeLen, p);
    macData.utf8Write(type, p += 4, typeLen);
    writeUInt32BE(macData, cipherNameLen, p += typeLen);
    macData.utf8Write(cipherName, p += 4, cipherNameLen);
    writeUInt32BE(macData, commentLen, p += cipherNameLen);
    macData.utf8Write(comment, p += 4, commentLen);
    writeUInt32BE(macData, pubLen, p += commentLen);
    macData.set(pubBlob, p += 4);
    writeUInt32BE(macData, privLen, p += pubLen);
    macData.set(privBlob, p + 4);

    if (!passphrase)
      passphrase = EMPTY_PASSPHRASE;

    const calcMAC = createHmac(
      'sha1',
       createHash('sha1')
         .update('putty-private-key-file-mac-key')
         .update(passphrase)
         .digest()
    ).update(macData).digest('hex');

    if (calcMAC !== mac) {
      if (encrypted) {
        return new Error(
          'PPK private key integrity check failed -- bad passphrase?'
        );
      }
      return new Error('PPK private key integrity check failed');
    }

    let pubPEM;
    let pubSSH;
    let privPEM;
    pubBlob._pos = 0;
    skipFields(pubBlob, 1); // skip (duplicate) key type
    switch (type) {
      case 'ssh-rsa': {
        const e = readString(pubBlob, pubBlob._pos);
        if (e === undefined)
          return new Error('Malformed PPK public key');
        const n = readString(pubBlob, pubBlob._pos);
        if (n === undefined)
          return new Error('Malformed PPK public key');
        const d = readString(privBlob, 0);
        if (d === undefined)
          return new Error('Malformed PPK private key');
        const p = readString(privBlob, privBlob._pos);
        if (p === undefined)
          return new Error('Malformed PPK private key');
        const q = readString(privBlob, privBlob._pos);
        if (q === undefined)
          return new Error('Malformed PPK private key');
        const iqmp = readString(privBlob, privBlob._pos);
        if (iqmp === undefined)
          return new Error('Malformed PPK private key');
        pubPEM = genOpenSSLRSAPub(n, e);
        pubSSH = genOpenSSHRSAPub(n, e);
        privPEM = genOpenSSLRSAPriv(n, e, d, iqmp, p, q);
        break;
      }
      case 'ssh-dss': {
        const p = readString(pubBlob, pubBlob._pos);
        if (p === undefined)
          return new Error('Malformed PPK public key');
        const q = readString(pubBlob, pubBlob._pos);
        if (q === undefined)
          return new Error('Malformed PPK public key');
        const g = readString(pubBlob, pubBlob._pos);
        if (g === undefined)
          return new Error('Malformed PPK public key');
        const y = readString(pubBlob, pubBlob._pos);
        if (y === undefined)
          return new Error('Malformed PPK public key');
        const x = readString(privBlob, 0);
        if (x === undefined)
          return new Error('Malformed PPK private key');

        pubPEM = genOpenSSLDSAPub(p, q, g, y);
        pubSSH = genOpenSSHDSAPub(p, q, g, y);
        privPEM = genOpenSSLDSAPriv(p, q, g, y, x);
        break;
      }
    }

    return new PPK_Private(type, comment, privPEM, pubPEM, pubSSH, 'sha1',
                           encrypted);
  };
}


function OpenSSH_Public(type, comment, pubPEM, pubSSH, algo) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = null;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = false;
}
OpenSSH_Public.prototype = BaseKey;
{
  let regexp;
  if (eddsaSupported)
    regexp = /^(((?:ssh-(?:rsa|dss|ed25519))|ecdsa-sha2-nistp(?:256|384|521))(?:-cert-v0[01]@openssh.com)?) ([A-Z0-9a-z/+=]+)(?:$|\s+([\S].*)?)$/;
  else
    regexp = /^(((?:ssh-(?:rsa|dss))|ecdsa-sha2-nistp(?:256|384|521))(?:-cert-v0[01]@openssh.com)?) ([A-Z0-9a-z/+=]+)(?:$|\s+([\S].*)?)$/;
  OpenSSH_Public.parse = (str) => {
    const m = regexp.exec(str);
    if (m === null)
      return null;
    // m[1] = full type
    // m[2] = base type
    // m[3] = base64-encoded public key
    // m[4] = comment

    const fullType = m[1];
    const baseType = m[2];
    const data = Buffer.from(m[3], 'base64');
    const comment = (m[4] || '');

    const type = readString(data, data._pos, true);
    if (type === undefined || type.indexOf(baseType) !== 0)
      return new Error('Malformed OpenSSH public key');

    return parseDER(data, baseType, comment, fullType);
  };
}


function RFC4716_Public(type, comment, pubPEM, pubSSH, algo) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = null;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = false;
}
RFC4716_Public.prototype = BaseKey;
{
  const regexp = /^---- BEGIN SSH2 PUBLIC KEY ----(?:\r?\n)((?:.{0,72}\r?\n)+)---- END SSH2 PUBLIC KEY ----$/;
  const RE_DATA = /^[A-Z0-9a-z/+=\r\n]+$/;
  const RE_HEADER = /^([\x21-\x39\x3B-\x7E]{1,64}): ((?:[^\\]*\\\r?\n)*[^\r\n]+)\r?\n/gm;
  const RE_HEADER_ENDS = /\\\r?\n/g;
  RFC4716_Public.parse = (str) => {
    let m = regexp.exec(str);
    if (m === null)
      return null;

    const body = m[1];
    let dataStart = 0;
    let comment = '';

    while (m = RE_HEADER.exec(body)) {
      const headerName = m[1];
      const headerValue = m[2].replace(RE_HEADER_ENDS, '');
      if (headerValue.length > 1024) {
        RE_HEADER.lastIndex = 0;
        return new Error('Malformed RFC4716 public key');
      }

      dataStart = RE_HEADER.lastIndex;

      if (headerName.toLowerCase() === 'comment') {
        comment = headerValue;
        if (comment.length > 1
            && comment.charCodeAt(0) === 34/* '"' */
            && comment.charCodeAt(comment.length - 1) === 34/* '"' */) {
          comment = comment.slice(1, -1);
        }
      }
    }

    let data = body.slice(dataStart);
    if (!RE_DATA.test(data))
      return new Error('Malformed RFC4716 public key');

    data = Buffer.from(data, 'base64');

    const type = readString(data, 0, true);
    if (type === undefined)
      return new Error('Malformed RFC4716 public key');

    let pubPEM = null;
    let pubSSH = null;
    switch (type) {
      case 'ssh-rsa': {
        const e = readString(data, data._pos);
        if (e === undefined)
          return new Error('Malformed RFC4716 public key');
        const n = readString(data, data._pos);
        if (n === undefined)
          return new Error('Malformed RFC4716 public key');
        pubPEM = genOpenSSLRSAPub(n, e);
        pubSSH = genOpenSSHRSAPub(n, e);
        break;
      }
      case 'ssh-dss': {
        const p = readString(data, data._pos);
        if (p === undefined)
          return new Error('Malformed RFC4716 public key');
        const q = readString(data, data._pos);
        if (q === undefined)
          return new Error('Malformed RFC4716 public key');
        const g = readString(data, data._pos);
        if (g === undefined)
          return new Error('Malformed RFC4716 public key');
        const y = readString(data, data._pos);
        if (y === undefined)
          return new Error('Malformed RFC4716 public key');
        pubPEM = genOpenSSLDSAPub(p, q, g, y);
        pubSSH = genOpenSSHDSAPub(p, q, g, y);
        break;
      }
      default:
        return new Error('Malformed RFC4716 public key');
    }

    return new RFC4716_Public(type, comment, pubPEM, pubSSH, 'sha1');
  };
}


function parseDER(data, baseType, comment, fullType) {
  if (!isSupportedKeyType(baseType))
    return new Error(`Unsupported OpenSSH public key type: ${baseType}`);

  let algo;
  let oid;
  let pubPEM = null;
  let pubSSH = null;

  switch (baseType) {
    case 'ssh-rsa': {
      const e = readString(data, data._pos || 0);
      if (e === undefined)
        return new Error('Malformed OpenSSH public key');
      const n = readString(data, data._pos);
      if (n === undefined)
        return new Error('Malformed OpenSSH public key');
      pubPEM = genOpenSSLRSAPub(n, e);
      pubSSH = genOpenSSHRSAPub(n, e);
      algo = 'sha1';
      break;
    }
    case 'ssh-dss': {
      const p = readString(data, data._pos || 0);
      if (p === undefined)
        return new Error('Malformed OpenSSH public key');
      const q = readString(data, data._pos);
      if (q === undefined)
        return new Error('Malformed OpenSSH public key');
      const g = readString(data, data._pos);
      if (g === undefined)
        return new Error('Malformed OpenSSH public key');
      const y = readString(data, data._pos);
      if (y === undefined)
        return new Error('Malformed OpenSSH public key');
      pubPEM = genOpenSSLDSAPub(p, q, g, y);
      pubSSH = genOpenSSHDSAPub(p, q, g, y);
      algo = 'sha1';
      break;
    }
    case 'ssh-ed25519': {
      const edpub = readString(data, data._pos || 0);
      if (edpub === undefined || edpub.length !== 32)
        return new Error('Malformed OpenSSH public key');
      pubPEM = genOpenSSLEdPub(edpub);
      pubSSH = genOpenSSHEdPub(edpub);
      algo = null;
      break;
    }
    case 'ecdsa-sha2-nistp256':
      algo = 'sha256';
      oid = '1.2.840.10045.3.1.7';
    // FALLTHROUGH
    case 'ecdsa-sha2-nistp384':
      if (algo === undefined) {
        algo = 'sha384';
        oid = '1.3.132.0.34';
      }
    // FALLTHROUGH
    case 'ecdsa-sha2-nistp521': {
      if (algo === undefined) {
        algo = 'sha512';
        oid = '1.3.132.0.35';
      }
      // TODO: validate curve name against type
      if (!skipFields(data, 1)) // Skip curve name
        return new Error('Malformed OpenSSH public key');
      const ecpub = readString(data, data._pos || 0);
      if (ecpub === undefined)
        return new Error('Malformed OpenSSH public key');
      pubPEM = genOpenSSLECDSAPub(oid, ecpub);
      pubSSH = genOpenSSHECDSAPub(oid, ecpub);
      break;
    }
    default:
      return new Error(`Unsupported OpenSSH public key type: ${baseType}`);
  }

  return new OpenSSH_Public(fullType, comment, pubPEM, pubSSH, algo);
}

function isSupportedKeyType(type) {
  switch (type) {
    case 'ssh-rsa':
    case 'ssh-dss':
    case 'ecdsa-sha2-nistp256':
    case 'ecdsa-sha2-nistp384':
    case 'ecdsa-sha2-nistp521':
      return true;
    case 'ssh-ed25519':
      if (eddsaSupported)
        return true;
    // FALLTHROUGH
    default:
      return false;
  }
}

function isParsedKey(val) {
  if (!val)
    return false;
  return (typeof val[SYM_DECRYPTED] === 'boolean');
}

function parseKey(data, passphrase) {
  if (isParsedKey(data))
    return data;

  let origBuffer;
  if (Buffer.isBuffer(data)) {
    origBuffer = data;
    data = data.utf8Slice(0, data.length).trim();
  } else if (typeof data === 'string') {
    data = data.trim();
  } else {
    return new Error('Key data must be a Buffer or string');
  }

  // eslint-disable-next-line eqeqeq
  if (passphrase != undefined) {
    if (typeof passphrase === 'string')
      passphrase = Buffer.from(passphrase);
    else if (!Buffer.isBuffer(passphrase))
      return new Error('Passphrase must be a string or Buffer when supplied');
  }

  let ret;

  // First try as printable string format (e.g. PEM)

  // Private keys
  if ((ret = OpenSSH_Private.parse(data, passphrase)) !== null)
    return ret;
  if ((ret = OpenSSH_Old_Private.parse(data, passphrase)) !== null)
    return ret;
  if ((ret = PPK_Private.parse(data, passphrase)) !== null)
    return ret;

  // Public keys
  if ((ret = OpenSSH_Public.parse(data)) !== null)
    return ret;
  if ((ret = RFC4716_Public.parse(data)) !== null)
    return ret;

  // Finally try as a binary format if we were originally passed binary data
  if (origBuffer) {
    binaryKeyParser.init(origBuffer, 0);
    const type = binaryKeyParser.readString(true);
    if (type !== undefined) {
      data = binaryKeyParser.readRaw();
      if (data !== undefined) {
        ret = parseDER(data, type, '', type);
        // Ignore potentially useless errors in case the data was not actually
        // in the binary format
        if (ret instanceof Error)
          ret = null;
      }
    }
    binaryKeyParser.clear();
  }

  if (ret)
    return ret;

  return new Error('Unsupported key format');
}

module.exports = {
  isParsedKey,
  isSupportedKeyType,
  parseDERKey: (data, type) => parseDER(data, type, '', type),
  parseKey,
};


/***/ }),

/***/ 7609:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const assert = __nccwpck_require__(2357);
const { inspect } = __nccwpck_require__(1669);

// Only use this for integers! Decimal numbers do not work with this function.
function addNumericalSeparator(val) {
  let res = '';
  let i = val.length;
  const start = val[0] === '-' ? 1 : 0;
  for (; i >= start + 4; i -= 3)
    res = `_${val.slice(i - 3, i)}${res}`;
  return `${val.slice(0, i)}${res}`;
}

function oneOf(expected, thing) {
  assert(typeof thing === 'string', '`thing` has to be of type string');
  if (Array.isArray(expected)) {
    const len = expected.length;
    assert(len > 0, 'At least one expected value needs to be specified');
    expected = expected.map((i) => String(i));
    if (len > 2) {
      return `one of ${thing} ${expected.slice(0, len - 1).join(', ')}, or `
              + expected[len - 1];
    } else if (len === 2) {
      return `one of ${thing} ${expected[0]} or ${expected[1]}`;
    }
    return `of ${thing} ${expected[0]}`;
  }
  return `of ${thing} ${String(expected)}`;
}


exports.ERR_INTERNAL_ASSERTION = class ERR_INTERNAL_ASSERTION extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, ERR_INTERNAL_ASSERTION);

    const suffix = 'This is caused by either a bug in ssh2 '
                   + 'or incorrect usage of ssh2 internals.\n'
                   + 'Please open an issue with this stack trace at '
                   + 'https://github.com/mscdex/ssh2/issues\n';

    this.message = (message === undefined ? suffix : `${message}\n${suffix}`);
  }
};

const MAX_32BIT_INT = 2 ** 32;
const MAX_32BIT_BIGINT = (() => {
  try {
    return new Function('return 2n ** 32n')();
  } catch {}
})();
exports.ERR_OUT_OF_RANGE = class ERR_OUT_OF_RANGE extends RangeError {
  constructor(str, range, input, replaceDefaultBoolean) {
    super();
    Error.captureStackTrace(this, ERR_OUT_OF_RANGE);

    assert(range, 'Missing "range" argument');
    let msg = (replaceDefaultBoolean
               ? str
               : `The value of "${str}" is out of range.`);
    let received;
    if (Number.isInteger(input) && Math.abs(input) > MAX_32BIT_INT) {
      received = addNumericalSeparator(String(input));
    } else if (typeof input === 'bigint') {
      received = String(input);
      if (input > MAX_32BIT_BIGINT || input < -MAX_32BIT_BIGINT)
        received = addNumericalSeparator(received);
      received += 'n';
    } else {
      received = inspect(input);
    }
    msg += ` It must be ${range}. Received ${received}`;

    this.message = msg;
  }
};

class ERR_INVALID_ARG_TYPE extends TypeError {
  constructor(name, expected, actual) {
    super();
    Error.captureStackTrace(this, ERR_INVALID_ARG_TYPE);

    assert(typeof name === 'string', `'name' must be a string`);

    // determiner: 'must be' or 'must not be'
    let determiner;
    if (typeof expected === 'string' && expected.startsWith('not ')) {
      determiner = 'must not be';
      expected = expected.replace(/^not /, '');
    } else {
      determiner = 'must be';
    }

    let msg;
    if (name.endsWith(' argument')) {
      // For cases like 'first argument'
      msg = `The ${name} ${determiner} ${oneOf(expected, 'type')}`;
    } else {
      const type = (name.includes('.') ? 'property' : 'argument');
      msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, 'type')}`;
    }

    msg += `. Received type ${typeof actual}`;

    this.message = msg;
  }
}
exports.ERR_INVALID_ARG_TYPE = ERR_INVALID_ARG_TYPE;

exports.validateNumber = function validateNumber(value, name) {
  if (typeof value !== 'number')
    throw new ERR_INVALID_ARG_TYPE(name, 'number', value);
};


/***/ }),

/***/ 9475:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Ber = __nccwpck_require__(970).Ber;

let DISCONNECT_REASON;

const FastBuffer = Buffer[Symbol.species];
const TypedArrayFill = Object.getPrototypeOf(Uint8Array.prototype).fill;

function readUInt32BE(buf, offset) {
  return (buf[offset++] * 16777216)
         + (buf[offset++] * 65536)
         + (buf[offset++] * 256)
         + buf[offset];
}

function bufferCopy(src, dest, srcStart, srcEnd, destStart) {
  if (!destStart)
    destStart = 0;
  if (srcEnd > src.length)
    srcEnd = src.length;
  let nb = srcEnd - srcStart;
  const destLeft = (dest.length - destStart);
  if (nb > destLeft)
    nb = destLeft;
  dest.set(new Uint8Array(src.buffer, src.byteOffset + srcStart, nb),
           destStart);
  return nb;
}

function bufferSlice(buf, start, end) {
  if (end === undefined)
    end = buf.length;
  return new FastBuffer(buf.buffer, buf.byteOffset + start, end - start);
}

function makeBufferParser() {
  let pos = 0;
  let buffer;

  const self = {
    init: (buf, start) => {
      buffer = buf;
      pos = (typeof start === 'number' ? start : 0);
    },
    pos: () => pos,
    length: () => (buffer ? buffer.length : 0),
    avail: () => (buffer && pos < buffer.length ? buffer.length - pos : 0),
    clear: () => {
      buffer = undefined;
    },
    readUInt32BE: () => {
      if (!buffer || pos + 3 >= buffer.length)
        return;
      return (buffer[pos++] * 16777216)
             + (buffer[pos++] * 65536)
             + (buffer[pos++] * 256)
             + buffer[pos++];
    },
    readUInt64BE: (behavior) => {
      if (!buffer || pos + 7 >= buffer.length)
        return;
      switch (behavior) {
        case 'always':
          return BigInt(`0x${buffer.hexSlice(pos, pos += 8)}`);
        case 'maybe':
          if (buffer[pos] > 0x1F)
            return BigInt(`0x${buffer.hexSlice(pos, pos += 8)}`);
          // FALLTHROUGH
        default:
          return (buffer[pos++] * 72057594037927940)
                 + (buffer[pos++] * 281474976710656)
                 + (buffer[pos++] * 1099511627776)
                 + (buffer[pos++] * 4294967296)
                 + (buffer[pos++] * 16777216)
                 + (buffer[pos++] * 65536)
                 + (buffer[pos++] * 256)
                 + buffer[pos++];
      }
    },
    skip: (n) => {
      if (buffer && n > 0)
        pos += n;
    },
    skipString: () => {
      const len = self.readUInt32BE();
      if (len === undefined)
        return;
      pos += len;
      return (pos <= buffer.length ? len : undefined);
    },
    readByte: () => {
      if (buffer && pos < buffer.length)
        return buffer[pos++];
    },
    readBool: () => {
      if (buffer && pos < buffer.length)
        return !!buffer[pos++];
    },
    readList: () => {
      const list = self.readString(true);
      if (list === undefined)
        return;
      return (list ? list.split(',') : []);
    },
    readString: (dest, maxLen) => {
      if (typeof dest === 'number') {
        maxLen = dest;
        dest = undefined;
      }

      const len = self.readUInt32BE();
      if (len === undefined)
        return;

      if ((buffer.length - pos) < len
          || (typeof maxLen === 'number' && len > maxLen)) {
        return;
      }

      if (dest) {
        if (Buffer.isBuffer(dest))
          return bufferCopy(buffer, dest, pos, pos += len);
        return buffer.utf8Slice(pos, pos += len);
      }
      return bufferSlice(buffer, pos, pos += len);
    },
    readRaw: (len) => {
      if (!buffer)
        return;
      if (typeof len !== 'number')
        return bufferSlice(buffer, pos, pos += (buffer.length - pos));
      if ((buffer.length - pos) >= len)
        return bufferSlice(buffer, pos, pos += len);
    },
  };

  return self;
}

function makeError(msg, level, fatal) {
  const err = new Error(msg);
  if (typeof level === 'boolean') {
    fatal = level;
    err.level = 'protocol';
  } else {
    err.level = level || 'protocol';
  }
  err.fatal = !!fatal;
  return err;
}

function writeUInt32BE(buf, value, offset) {
  buf[offset++] = (value >>> 24);
  buf[offset++] = (value >>> 16);
  buf[offset++] = (value >>> 8);
  buf[offset++] = value;
  return offset;
}

const utilBufferParser = makeBufferParser();

module.exports = {
  bufferCopy,
  bufferSlice,
  FastBuffer,
  bufferFill: (buf, value, start, end) => {
    return TypedArrayFill.call(buf, value, start, end);
  },
  makeError,
  doFatalError: (protocol, msg, level, reason) => {
    let err;
    if (DISCONNECT_REASON === undefined)
      ({ DISCONNECT_REASON } = __nccwpck_require__(6832));
    if (msg instanceof Error) {
      // doFatalError(protocol, err[, reason])
      err = msg;
      if (typeof level !== 'number')
        reason = DISCONNECT_REASON.PROTOCOL_ERROR;
      else
        reason = level;
    } else {
      // doFatalError(protocol, msg[, level[, reason]])
      err = makeError(msg, level, true);
    }
    if (typeof reason !== 'number')
      reason = DISCONNECT_REASON.PROTOCOL_ERROR;
    protocol.disconnect(reason);
    protocol._destruct();
    protocol._onError(err);
    return Infinity;
  },
  readUInt32BE,
  writeUInt32BE,
  writeUInt32LE: (buf, value, offset) => {
    buf[offset++] = value;
    buf[offset++] = (value >>> 8);
    buf[offset++] = (value >>> 16);
    buf[offset++] = (value >>> 24);
    return offset;
  },
  makeBufferParser,
  bufferParser: makeBufferParser(),
  readString: (buffer, start, dest, maxLen) => {
    if (typeof dest === 'number') {
      maxLen = dest;
      dest = undefined;
    }

    if (start === undefined)
      start = 0;

    const left = (buffer.length - start);
    if (start < 0 || start >= buffer.length || left < 4)
      return;

    const len = readUInt32BE(buffer, start);
    if (left < (4 + len) || (typeof maxLen === 'number' && len > maxLen))
      return;

    start += 4;
    const end = start + len;
    buffer._pos = end;

    if (dest) {
      if (Buffer.isBuffer(dest))
        return bufferCopy(buffer, dest, start, end);
      return buffer.utf8Slice(start, end);
    }
    return bufferSlice(buffer, start, end);
  },
  sigSSHToASN1: (sig, type) => {
    switch (type) {
      case 'ssh-dss': {
        if (sig.length > 40)
          return sig;
        // Change bare signature r and s values to ASN.1 BER values for OpenSSL
        const asnWriter = new Ber.Writer();
        asnWriter.startSequence();
        let r = sig.slice(0, 20);
        let s = sig.slice(20);
        if (r[0] & 0x80) {
          const rNew = Buffer.allocUnsafe(21);
          rNew[0] = 0x00;
          r.copy(rNew, 1);
          r = rNew;
        } else if (r[0] === 0x00 && !(r[1] & 0x80)) {
          r = r.slice(1);
        }
        if (s[0] & 0x80) {
          const sNew = Buffer.allocUnsafe(21);
          sNew[0] = 0x00;
          s.copy(sNew, 1);
          s = sNew;
        } else if (s[0] === 0x00 && !(s[1] & 0x80)) {
          s = s.slice(1);
        }
        asnWriter.writeBuffer(r, Ber.Integer);
        asnWriter.writeBuffer(s, Ber.Integer);
        asnWriter.endSequence();
        return asnWriter.buffer;
      }
      case 'ecdsa-sha2-nistp256':
      case 'ecdsa-sha2-nistp384':
      case 'ecdsa-sha2-nistp521': {
        utilBufferParser.init(sig, 0);
        const r = utilBufferParser.readString();
        const s = utilBufferParser.readString();
        utilBufferParser.clear();
        if (r === undefined || s === undefined)
          return;

        const asnWriter = new Ber.Writer();
        asnWriter.startSequence();
        asnWriter.writeBuffer(r, Ber.Integer);
        asnWriter.writeBuffer(s, Ber.Integer);
        asnWriter.endSequence();
        return asnWriter.buffer;
      }
      default:
        return sig;
    }
  },
  convertSignature: (signature, keyType) => {
    switch (keyType) {
      case 'ssh-dss': {
        if (signature.length <= 40)
          return signature;
        // This is a quick and dirty way to get from BER encoded r and s that
        // OpenSSL gives us, to just the bare values back to back (40 bytes
        // total) like OpenSSH (and possibly others) are expecting
        const asnReader = new Ber.Reader(signature);
        asnReader.readSequence();
        let r = asnReader.readString(Ber.Integer, true);
        let s = asnReader.readString(Ber.Integer, true);
        let rOffset = 0;
        let sOffset = 0;
        if (r.length < 20) {
          const rNew = Buffer.allocUnsafe(20);
          rNew.set(r, 1);
          r = rNew;
          r[0] = 0;
        }
        if (s.length < 20) {
          const sNew = Buffer.allocUnsafe(20);
          sNew.set(s, 1);
          s = sNew;
          s[0] = 0;
        }
        if (r.length > 20 && r[0] === 0)
          rOffset = 1;
        if (s.length > 20 && s[0] === 0)
          sOffset = 1;
        const newSig =
          Buffer.allocUnsafe((r.length - rOffset) + (s.length - sOffset));
        bufferCopy(r, newSig, rOffset, r.length, 0);
        bufferCopy(s, newSig, sOffset, s.length, r.length - rOffset);
        return newSig;
      }
      case 'ecdsa-sha2-nistp256':
      case 'ecdsa-sha2-nistp384':
      case 'ecdsa-sha2-nistp521': {
        if (signature[0] === 0)
          return signature;
        // Convert SSH signature parameters to ASN.1 BER values for OpenSSL
        const asnReader = new Ber.Reader(signature);
        asnReader.readSequence();
        const r = asnReader.readString(Ber.Integer, true);
        const s = asnReader.readString(Ber.Integer, true);
        if (r === null || s === null)
          return;
        const newSig = Buffer.allocUnsafe(4 + r.length + 4 + s.length);
        writeUInt32BE(newSig, r.length, 0);
        newSig.set(r, 4);
        writeUInt32BE(newSig, s.length, 4 + r.length);
        newSig.set(s, 4 + 4 + r.length);
        return newSig;
      }
    }

    return signature;
  },
  sendPacket: (proto, packet, bypass) => {
    if (!bypass && proto._kexinit !== undefined) {
      // We're currently in the middle of a handshake

      if (proto._queue === undefined)
        proto._queue = [];
      proto._queue.push(packet);
      proto._debug && proto._debug('Outbound: ... packet queued');
      return false;
    }
    proto._cipher.encrypt(packet);
    return true;
  },
};


/***/ }),

/***/ 6715:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { kMaxLength } = __nccwpck_require__(4293);
const {
  createInflate,
  constants: {
    DEFLATE,
    INFLATE,
    Z_DEFAULT_CHUNK,
    Z_DEFAULT_COMPRESSION,
    Z_DEFAULT_MEMLEVEL,
    Z_DEFAULT_STRATEGY,
    Z_DEFAULT_WINDOWBITS,
    Z_PARTIAL_FLUSH,
  }
} = __nccwpck_require__(8761);
const ZlibHandle = createInflate()._handle.constructor;

function processCallback() {
  throw new Error('Should not get here');
}

function zlibOnError(message, errno, code) {
  const self = this._owner;
  // There is no way to cleanly recover.
  // Continuing only obscures problems.

  const error = new Error(message);
  error.errno = errno;
  error.code = code;
  self._err = error;
}

function _close(engine) {
  // Caller may invoke .close after a zlib error (which will null _handle).
  if (!engine._handle)
    return;

  engine._handle.close();
  engine._handle = null;
}

class Zlib {
  constructor(mode) {
    const windowBits = Z_DEFAULT_WINDOWBITS;
    const level = Z_DEFAULT_COMPRESSION;
    const memLevel = Z_DEFAULT_MEMLEVEL;
    const strategy = Z_DEFAULT_STRATEGY;
    const dictionary = undefined;

    this._err = undefined;
    this._writeState = new Uint32Array(2);
    this._chunkSize = Z_DEFAULT_CHUNK;
    this._maxOutputLength = kMaxLength;
    this._outBuffer = Buffer.allocUnsafe(this._chunkSize);
    this._outOffset = 0;

    this._handle = new ZlibHandle(mode);
    this._handle._owner = this;
    this._handle.onerror = zlibOnError;
    this._handle.init(windowBits,
                      level,
                      memLevel,
                      strategy,
                      this._writeState,
                      processCallback,
                      dictionary);
  }

  writeSync(chunk, retChunks) {
    const handle = this._handle;
    if (!handle)
      throw new Error('Invalid Zlib instance');

    let availInBefore = chunk.length;
    let availOutBefore = this._chunkSize - this._outOffset;
    let inOff = 0;
    let availOutAfter;
    let availInAfter;

    let buffers;
    let nread = 0;
    const state = this._writeState;
    let buffer = this._outBuffer;
    let offset = this._outOffset;
    const chunkSize = this._chunkSize;

    while (true) {
      handle.writeSync(Z_PARTIAL_FLUSH,
                       chunk, // in
                       inOff, // in_off
                       availInBefore, // in_len
                       buffer, // out
                       offset, // out_off
                       availOutBefore); // out_len
      if (this._err)
        throw this._err;

      availOutAfter = state[0];
      availInAfter = state[1];

      const inDelta = availInBefore - availInAfter;
      const have = availOutBefore - availOutAfter;

      if (have > 0) {
        const out = (offset === 0 && have === buffer.length
                     ? buffer
                     : buffer.slice(offset, offset + have));
        offset += have;
        if (!buffers)
          buffers = out;
        else if (buffers.push === undefined)
          buffers = [buffers, out];
        else
          buffers.push(out);
        nread += out.byteLength;

        if (nread > this._maxOutputLength) {
          _close(this);
          throw new Error(
            `Output length exceeded maximum of ${this._maxOutputLength}`
          );
        }
      } else if (have !== 0) {
        throw new Error('have should not go down');
      }

      // Exhausted the output buffer, or used all the input create a new one.
      if (availOutAfter === 0 || offset >= chunkSize) {
        availOutBefore = chunkSize;
        offset = 0;
        buffer = Buffer.allocUnsafe(chunkSize);
      }

      if (availOutAfter === 0) {
        // Not actually done. Need to reprocess.
        // Also, update the availInBefore to the availInAfter value,
        // so that if we have to hit it a third (fourth, etc.) time,
        // it'll have the correct byte counts.
        inOff += inDelta;
        availInBefore = availInAfter;
      } else {
        break;
      }
    }

    this._outBuffer = buffer;
    this._outOffset = offset;

    if (nread === 0)
      buffers = Buffer.alloc(0);

    if (retChunks) {
      buffers.totalLen = nread;
      return buffers;
    }

    if (buffers.push === undefined)
      return buffers;

    const output = Buffer.allocUnsafe(nread);
    for (let i = 0, p = 0; i < buffers.length; ++i) {
      const buf = buffers[i];
      output.set(buf, p);
      p += buf.length;
    }
    return output;
  }
}

class ZlibPacketWriter {
  constructor(protocol) {
    this.allocStart = 0;
    this.allocStartKEX = 0;
    this._protocol = protocol;
    this._zlib = new Zlib(DEFLATE);
  }

  cleanup() {
    if (this._zlib)
      _close(this._zlib);
  }

  alloc(payloadSize, force) {
    return Buffer.allocUnsafe(payloadSize);
  }

  finalize(payload, force) {
    if (this._protocol._kexinit === undefined || force) {
      const output = this._zlib.writeSync(payload, true);
      const packet = this._protocol._cipher.allocPacket(output.totalLen);
      if (output.push === undefined) {
        packet.set(output, 5);
      } else {
        for (let i = 0, p = 5; i < output.length; ++i) {
          const chunk = output[i];
          packet.set(chunk, p);
          p += chunk.length;
        }
      }
      return packet;
    }
    return payload;
  }
}

class PacketWriter {
  constructor(protocol) {
    this.allocStart = 5;
    this.allocStartKEX = 5;
    this._protocol = protocol;
  }

  cleanup() {}

  alloc(payloadSize, force) {
    if (this._protocol._kexinit === undefined || force)
      return this._protocol._cipher.allocPacket(payloadSize);
    return Buffer.allocUnsafe(payloadSize);
  }

  finalize(packet, force) {
    return packet;
  }
}

class ZlibPacketReader {
  constructor() {
    this._zlib = new Zlib(INFLATE);
  }

  cleanup() {
    if (this._zlib)
      _close(this._zlib);
  }

  read(data) {
    return this._zlib.writeSync(data, false);
  }
}

class PacketReader {
  cleanup() {}

  read(data) {
    return data;
  }
}

module.exports = {
  PacketReader,
  PacketWriter,
  ZlibPacketReader,
  ZlibPacketWriter,
};


/***/ }),

/***/ 2986:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// TODO:
//   * convert listenerCount() usage to emit() return value checking?
//   * emit error when connection severed early (e.g. before handshake)
//   * add '.connected' or similar property to connection objects to allow
//     immediate connection status checking


const { Server: netServer } = __nccwpck_require__(1631);
const EventEmitter = __nccwpck_require__(8614);
const { listenerCount } = EventEmitter;

const {
  CHANNEL_OPEN_FAILURE,
  DEFAULT_CIPHER,
  DEFAULT_COMPRESSION,
  DEFAULT_KEX,
  DEFAULT_MAC,
  DEFAULT_SERVER_HOST_KEY,
  DISCONNECT_REASON,
  DISCONNECT_REASON_BY_VALUE,
  SUPPORTED_CIPHER,
  SUPPORTED_COMPRESSION,
  SUPPORTED_KEX,
  SUPPORTED_MAC,
  SUPPORTED_SERVER_HOST_KEY,
} = __nccwpck_require__(6832);
const { init: cryptoInit } = __nccwpck_require__(5708);
const { KexInit } = __nccwpck_require__(4126);
const { parseKey } = __nccwpck_require__(2218);
const Protocol = __nccwpck_require__(9031);
const { SFTP } = __nccwpck_require__(2026);
const { writeUInt32BE } = __nccwpck_require__(9475);

const {
  Channel,
  MAX_WINDOW,
  PACKET_SIZE,
  windowAdjust,
  WINDOW_THRESHOLD,
} = __nccwpck_require__(3204);

const {
  ChannelManager,
  generateAlgorithmList,
  isWritable,
  onChannelOpenFailure,
  onCHANNEL_CLOSE,
} = __nccwpck_require__(834);

const MAX_PENDING_AUTHS = 10;

class AuthContext extends EventEmitter {
  constructor(protocol, username, service, method, cb) {
    super();

    this.username = this.user = username;
    this.service = service;
    this.method = method;
    this._initialResponse = false;
    this._finalResponse = false;
    this._multistep = false;
    this._cbfinal = (allowed, methodsLeft, isPartial) => {
      if (!this._finalResponse) {
        this._finalResponse = true;
        cb(this, allowed, methodsLeft, isPartial);
      }
    };
    this._protocol = protocol;
  }

  accept() {
    this._cleanup && this._cleanup();
    this._initialResponse = true;
    this._cbfinal(true);
  }
  reject(methodsLeft, isPartial) {
    this._cleanup && this._cleanup();
    this._initialResponse = true;
    this._cbfinal(false, methodsLeft, isPartial);
  }
}


class KeyboardAuthContext extends AuthContext {
  constructor(protocol, username, service, method, submethods, cb) {
    super(protocol, username, service, method, cb);

    this._multistep = true;

    this._cb = undefined;
    this._onInfoResponse = (responses) => {
      const callback = this._cb;
      if (callback) {
        this._cb = undefined;
        callback(responses);
      }
    };
    this.submethods = submethods;
    this.on('abort', () => {
      this._cb && this._cb(new Error('Authentication request aborted'));
    });
  }

  prompt(prompts, title, instructions, cb) {
    if (!Array.isArray(prompts))
      prompts = [ prompts ];

    if (typeof title === 'function') {
      cb = title;
      title = instructions = undefined;
    } else if (typeof instructions === 'function') {
      cb = instructions;
      instructions = undefined;
    } else if (typeof cb !== 'function') {
      cb = undefined;
    }

    for (let i = 0; i < prompts.length; ++i) {
      if (typeof prompts[i] === 'string') {
        prompts[i] = {
          prompt: prompts[i],
          echo: true
        };
      }
    }

    this._cb = cb;
    this._initialResponse = true;

    this._protocol.authInfoReq(title, instructions, prompts);
  }
}

class PKAuthContext extends AuthContext {
  constructor(protocol, username, service, method, pkInfo, cb) {
    super(protocol, username, service, method, cb);

    this.key = { algo: pkInfo.keyAlgo, data: pkInfo.key };
    this.signature = pkInfo.signature;
    this.blob = pkInfo.blob;
  }

  accept() {
    if (!this.signature) {
      this._initialResponse = true;
      this._protocol.authPKOK(this.key.algo, this.key.data);
    } else {
      AuthContext.prototype.accept.call(this);
    }
  }
}

class HostbasedAuthContext extends AuthContext {
  constructor(protocol, username, service, method, pkInfo, cb) {
    super(protocol, username, service, method, cb);

    this.key = { algo: pkInfo.keyAlgo, data: pkInfo.key };
    this.signature = pkInfo.signature;
    this.blob = pkInfo.blob;
    this.localHostname = pkInfo.localHostname;
    this.localUsername = pkInfo.localUsername;
  }
}

class PwdAuthContext extends AuthContext {
  constructor(protocol, username, service, method, password, cb) {
    super(protocol, username, service, method, cb);

    this.password = password;
    this._changeCb = undefined;
  }

  requestChange(prompt, cb) {
    if (this._changeCb)
      throw new Error('Change request already in progress');
    if (typeof prompt !== 'string')
      throw new Error('prompt argument must be a string');
    if (typeof cb !== 'function')
      throw new Error('Callback argument must be a function');
    this._changeCb = cb;
    this._protocol.authPasswdChg(prompt);
  }
}


class Session extends EventEmitter {
  constructor(client, info, localChan) {
    super();

    this.type = 'session';
    this.subtype = undefined;
    this.server = true;
    this._ending = false;
    this._channel = undefined;
    this._chanInfo = {
      type: 'session',
      incoming: {
        id: localChan,
        window: MAX_WINDOW,
        packetSize: PACKET_SIZE,
        state: 'open'
      },
      outgoing: {
        id: info.sender,
        window: info.window,
        packetSize: info.packetSize,
        state: 'open'
      }
    };
  }
}


class Server extends EventEmitter {
  constructor(cfg, listener) {
    super();

    if (typeof cfg !== 'object' || cfg === null)
      throw new Error('Missing configuration object');

    const hostKeys = Object.create(null);
    const hostKeyAlgoOrder = [];

    const hostKeys_ = cfg.hostKeys;
    if (!Array.isArray(hostKeys_))
      throw new Error('hostKeys must be an array');

    const cfgAlgos = (
      typeof cfg.algorithms === 'object' && cfg.algorithms !== null
      ? cfg.algorithms
      : {}
    );

    const hostKeyAlgos = generateAlgorithmList(
      cfgAlgos.serverHostKey,
      DEFAULT_SERVER_HOST_KEY,
      SUPPORTED_SERVER_HOST_KEY
    );
    for (let i = 0; i < hostKeys_.length; ++i) {
      let privateKey;
      if (Buffer.isBuffer(hostKeys_[i]) || typeof hostKeys_[i] === 'string')
        privateKey = parseKey(hostKeys_[i]);
      else
        privateKey = parseKey(hostKeys_[i].key, hostKeys_[i].passphrase);

      if (privateKey instanceof Error)
        throw new Error(`Cannot parse privateKey: ${privateKey.message}`);

      if (Array.isArray(privateKey)) {
        // OpenSSH's newer format only stores 1 key for now
        privateKey = privateKey[0];
      }

      if (privateKey.getPrivatePEM() === null)
        throw new Error('privateKey value contains an invalid private key');

      // Discard key if we already found a key of the same type
      if (hostKeyAlgoOrder.includes(privateKey.type))
        continue;

      if (privateKey.type === 'ssh-rsa') {
        // SSH supports multiple signature hashing algorithms for RSA, so we add
        // the algorithms in the desired order
        let sha1Pos = hostKeyAlgos.indexOf('ssh-rsa');
        const sha256Pos = hostKeyAlgos.indexOf('rsa-sha2-256');
        const sha512Pos = hostKeyAlgos.indexOf('rsa-sha2-512');
        if (sha1Pos === -1) {
          // Fall back to giving SHA1 the lowest priority
          sha1Pos = Infinity;
        }
        [sha1Pos, sha256Pos, sha512Pos].sort(compareNumbers).forEach((pos) => {
          if (pos === -1)
            return;

          let type;
          switch (pos) {
            case sha1Pos: type = 'ssh-rsa'; break;
            case sha256Pos: type = 'rsa-sha2-256'; break;
            case sha512Pos: type = 'rsa-sha2-512'; break;
            default: return;
          }

          // Store same RSA key under each hash algorithm name for convenience
          hostKeys[type] = privateKey;

          hostKeyAlgoOrder.push(type);
        });
      } else {
        hostKeys[privateKey.type] = privateKey;
        hostKeyAlgoOrder.push(privateKey.type);
      }
    }

    const algorithms = {
      kex: generateAlgorithmList(cfgAlgos.kex, DEFAULT_KEX, SUPPORTED_KEX),
      serverHostKey: hostKeyAlgoOrder,
      cs: {
        cipher: generateAlgorithmList(
                  cfgAlgos.cipher,
                  DEFAULT_CIPHER,
                  SUPPORTED_CIPHER
                ),
        mac: generateAlgorithmList(cfgAlgos.hmac, DEFAULT_MAC, SUPPORTED_MAC),
        compress: generateAlgorithmList(
                    cfgAlgos.compress,
                    DEFAULT_COMPRESSION,
                    SUPPORTED_COMPRESSION
                  ),
        lang: [],
      },
      sc: undefined,
    };
    algorithms.sc = algorithms.cs;

    if (typeof listener === 'function')
      this.on('connection', listener);

    const origDebug = (typeof cfg.debug === 'function' ? cfg.debug : undefined);
    const ident = (cfg.ident ? Buffer.from(cfg.ident) : undefined);
    const offer = new KexInit(algorithms);

    this._srv = new netServer((socket) => {
      if (this._connections >= this.maxConnections) {
        socket.destroy();
        return;
      }
      ++this._connections;
      socket.once('close', () => {
        --this._connections;
      });

      let debug;
      if (origDebug) {
        // Prepend debug output with a unique identifier in case there are
        // multiple clients connected at the same time
        const debugPrefix = `[${process.hrtime().join('.')}] `;
        debug = (msg) => {
          origDebug(`${debugPrefix}${msg}`);
        };
      }

      // eslint-disable-next-line no-use-before-define
      new Client(socket, hostKeys, ident, offer, debug, this, cfg);
    }).on('error', (err) => {
      this.emit('error', err);
    }).on('listening', () => {
      this.emit('listening');
    }).on('close', () => {
      this.emit('close');
    });
    this._connections = 0;
    this.maxConnections = Infinity;
  }

  injectSocket(socket) {
    this._srv.emit('connection', socket);
  }

  listen(...args) {
    this._srv.listen(...args);
    return this;
  }

  address() {
    return this._srv.address();
  }

  getConnections(cb) {
    this._srv.getConnections(cb);
    return this;
  }

  close(cb) {
    this._srv.close(cb);
    return this;
  }

  ref() {
    this._srv.ref();
    return this;
  }

  unref() {
    this._srv.unref();
    return this;
  }
}
Server.KEEPALIVE_CLIENT_INTERVAL = 15000;
Server.KEEPALIVE_CLIENT_COUNT_MAX = 3;


class Client extends EventEmitter {
  constructor(socket, hostKeys, ident, offer, debug, server, srvCfg) {
    super();

    let exchanges = 0;
    let acceptedAuthSvc = false;
    let pendingAuths = [];
    let authCtx;
    let kaTimer;
    let onPacket;
    const unsentGlobalRequestsReplies = [];
    this._sock = socket;
    this._chanMgr = new ChannelManager(this);
    this._debug = debug;
    this.noMoreSessions = false;
    this.authenticated = false;

    // Silence pre-header errors
    function onClientPreHeaderError(err) {}
    this.on('error', onClientPreHeaderError);

    const DEBUG_HANDLER = (!debug ? undefined : (p, display, msg) => {
      debug(`Debug output from client: ${JSON.stringify(msg)}`);
    });

    const kaIntvl = (
      typeof srvCfg.keepaliveInterval === 'number'
        && isFinite(srvCfg.keepaliveInterval)
        && srvCfg.keepaliveInterval > 0
      ? srvCfg.keepaliveInterval
      : (
        typeof Server.KEEPALIVE_CLIENT_INTERVAL === 'number'
          && isFinite(Server.KEEPALIVE_CLIENT_INTERVAL)
          && Server.KEEPALIVE_CLIENT_INTERVAL > 0
        ? Server.KEEPALIVE_CLIENT_INTERVAL
        : -1
      )
    );
    const kaCountMax = (
      typeof srvCfg.keepaliveCountMax === 'number'
        && isFinite(srvCfg.keepaliveCountMax)
        && srvCfg.keepaliveCountMax >= 0
      ? srvCfg.keepaliveCountMax
      : (
        typeof Server.KEEPALIVE_CLIENT_COUNT_MAX === 'number'
          && isFinite(Server.KEEPALIVE_CLIENT_COUNT_MAX)
          && Server.KEEPALIVE_CLIENT_COUNT_MAX >= 0
        ? Server.KEEPALIVE_CLIENT_COUNT_MAX
        : -1
      )
    );
    let kaCurCount = 0;
    if (kaIntvl !== -1 && kaCountMax !== -1) {
      this.once('ready', () => {
        const onClose = () => {
          clearInterval(kaTimer);
        };
        this.on('close', onClose).on('end', onClose);
        kaTimer = setInterval(() => {
          if (++kaCurCount > kaCountMax) {
            clearInterval(kaTimer);
            const err = new Error('Keepalive timeout');
            err.level = 'client-timeout';
            this.emit('error', err);
            this.end();
          } else {
            // XXX: if the server ever starts sending real global requests to
            //      the client, we will need to add a dummy callback here to
            //      keep the correct reply order
            proto.ping();
          }
        }, kaIntvl);
      });
      // TODO: re-verify keepalive behavior with OpenSSH
      onPacket = () => {
        kaTimer && kaTimer.refresh();
        kaCurCount = 0;
      };
    }

    const proto = this._protocol = new Protocol({
      server: true,
      hostKeys,
      ident,
      offer,
      onPacket,
      greeting: srvCfg.greeting,
      banner: srvCfg.banner,
      onWrite: (data) => {
        if (isWritable(socket))
          socket.write(data);
      },
      onError: (err) => {
        if (!proto._destruct)
          socket.removeAllListeners('data');
        this.emit('error', err);
        try {
          socket.end();
        } catch {}
      },
      onHeader: (header) => {
        this.removeListener('error', onClientPreHeaderError);

        const info = {
          ip: socket.remoteAddress,
          family: socket.remoteFamily,
          port: socket.remotePort,
          header,
        };
        if (!server.emit('connection', this, info)) {
          // auto reject
          proto.disconnect(DISCONNECT_REASON.BY_APPLICATION);
          socket.end();
          return;
        }

        if (header.greeting)
          this.emit('greeting', header.greeting);
      },
      onHandshakeComplete: (negotiated) => {
        if (++exchanges > 1)
          this.emit('rekey');
        this.emit('handshake', negotiated);
      },
      debug,
      messageHandlers: {
        DEBUG: DEBUG_HANDLER,
        DISCONNECT: (p, reason, desc) => {
          if (reason !== DISCONNECT_REASON.BY_APPLICATION) {
            if (!desc) {
              desc = DISCONNECT_REASON_BY_VALUE[reason];
              if (desc === undefined)
                desc = `Unexpected disconnection reason: ${reason}`;
            }
            const err = new Error(desc);
            err.code = reason;
            this.emit('error', err);
          }
          socket.end();
        },
        CHANNEL_OPEN: (p, info) => {
          // Handle incoming requests from client

          // Do early reject in some cases to prevent wasteful channel
          // allocation
          if ((info.type === 'session' && this.noMoreSessions)
              || !this.authenticated) {
            const reasonCode = CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
            return proto.channelOpenFail(info.sender, reasonCode);
          }

          let localChan = -1;
          let reason;
          let replied = false;

          let accept;
          const reject = () => {
            if (replied)
              return;
            replied = true;

            if (reason === undefined) {
              if (localChan === -1)
                reason = CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE;
              else
                reason = CHANNEL_OPEN_FAILURE.CONNECT_FAILED;
            }

            if (localChan !== -1)
              this._chanMgr.remove(localChan);
            proto.channelOpenFail(info.sender, reason, '');
          };
          const reserveChannel = () => {
            localChan = this._chanMgr.add();

            if (localChan === -1) {
              reason = CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE;
              if (debug) {
                debug('Automatic rejection of incoming channel open: '
                        + 'no channels available');
              }
            }

            return (localChan !== -1);
          };

          const data = info.data;
          switch (info.type) {
            case 'session':
              if (listenerCount(this, 'session') && reserveChannel()) {
                accept = () => {
                  if (replied)
                    return;
                  replied = true;

                  const instance = new Session(this, info, localChan);
                  this._chanMgr.update(localChan, instance);

                  proto.channelOpenConfirm(info.sender,
                                           localChan,
                                           MAX_WINDOW,
                                           PACKET_SIZE);

                  return instance;
                };

                this.emit('session', accept, reject);
                return;
              }
              break;
            case 'direct-tcpip':
              if (listenerCount(this, 'tcpip') && reserveChannel()) {
                accept = () => {
                  if (replied)
                    return;
                  replied = true;

                  const chanInfo = {
                    type: undefined,
                    incoming: {
                      id: localChan,
                      window: MAX_WINDOW,
                      packetSize: PACKET_SIZE,
                      state: 'open'
                    },
                    outgoing: {
                      id: info.sender,
                      window: info.window,
                      packetSize: info.packetSize,
                      state: 'open'
                    }
                  };

                  const stream = new Channel(this, chanInfo, { server: true });
                  this._chanMgr.update(localChan, stream);

                  proto.channelOpenConfirm(info.sender,
                                           localChan,
                                           MAX_WINDOW,
                                           PACKET_SIZE);

                  return stream;
                };

                this.emit('tcpip', accept, reject, data);
                return;
              }
              break;
            case 'direct-streamlocal@openssh.com':
              if (listenerCount(this, 'openssh.streamlocal')
                  && reserveChannel()) {
                accept = () => {
                  if (replied)
                    return;
                  replied = true;

                  const chanInfo = {
                    type: undefined,
                    incoming: {
                      id: localChan,
                      window: MAX_WINDOW,
                      packetSize: PACKET_SIZE,
                      state: 'open'
                    },
                    outgoing: {
                      id: info.sender,
                      window: info.window,
                      packetSize: info.packetSize,
                      state: 'open'
                    }
                  };

                  const stream = new Channel(this, chanInfo, { server: true });
                  this._chanMgr.update(localChan, stream);

                  proto.channelOpenConfirm(info.sender,
                                           localChan,
                                           MAX_WINDOW,
                                           PACKET_SIZE);

                  return stream;
                };

                this.emit('openssh.streamlocal', accept, reject, data);
                return;
              }
              break;
            default:
              // Automatically reject any unsupported channel open requests
              reason = CHANNEL_OPEN_FAILURE.UNKNOWN_CHANNEL_TYPE;
              if (debug) {
                debug('Automatic rejection of unsupported incoming channel open'
                        + ` type: ${info.type}`);
              }
          }

          if (reason === undefined) {
            reason = CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
            if (debug) {
              debug('Automatic rejection of unexpected incoming channel open'
                      + ` for: ${info.type}`);
            }
          }

          reject();
        },
        CHANNEL_OPEN_CONFIRMATION: (p, info) => {
          const channel = this._chanMgr.get(info.recipient);
          if (typeof channel !== 'function')
            return;

          const chanInfo = {
            type: channel.type,
            incoming: {
              id: info.recipient,
              window: MAX_WINDOW,
              packetSize: PACKET_SIZE,
              state: 'open'
            },
            outgoing: {
              id: info.sender,
              window: info.window,
              packetSize: info.packetSize,
              state: 'open'
            }
          };

          const instance = new Channel(this, chanInfo, { server: true });
          this._chanMgr.update(info.recipient, instance);
          channel(undefined, instance);
        },
        CHANNEL_OPEN_FAILURE: (p, recipient, reason, description) => {
          const channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'function')
            return;

          const info = { reason, description };
          onChannelOpenFailure(this, recipient, info, channel);
        },
        CHANNEL_DATA: (p, recipient, data) => {
          let channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          if (channel.constructor === Session) {
            channel = channel._channel;
            if (!channel)
              return;
          }

          // The remote party should not be sending us data if there is no
          // window space available ...
          // TODO: raise error on data with not enough window?
          if (channel.incoming.window === 0)
            return;

          channel.incoming.window -= data.length;

          if (channel.push(data) === false) {
            channel._waitChanDrain = true;
            return;
          }

          if (channel.incoming.window <= WINDOW_THRESHOLD)
            windowAdjust(channel);
        },
        CHANNEL_EXTENDED_DATA: (p, recipient, data, type) => {
          // NOOP -- should not be sent by client
        },
        CHANNEL_WINDOW_ADJUST: (p, recipient, amount) => {
          let channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          if (channel.constructor === Session) {
            channel = channel._channel;
            if (!channel)
              return;
          }

          // The other side is allowing us to send `amount` more bytes of data
          channel.outgoing.window += amount;

          if (channel._waitWindow) {
            channel._waitWindow = false;

            if (channel._chunk) {
              channel._write(channel._chunk, null, channel._chunkcb);
            } else if (channel._chunkcb) {
              channel._chunkcb();
            } else if (channel._chunkErr) {
              channel.stderr._write(channel._chunkErr,
                                    null,
                                    channel._chunkcbErr);
            } else if (channel._chunkcbErr) {
              channel._chunkcbErr();
            }
          }
        },
        CHANNEL_SUCCESS: (p, recipient) => {
          let channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          if (channel.constructor === Session) {
            channel = channel._channel;
            if (!channel)
              return;
          }

          if (channel._callbacks.length)
            channel._callbacks.shift()(false);
        },
        CHANNEL_FAILURE: (p, recipient) => {
          let channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          if (channel.constructor === Session) {
            channel = channel._channel;
            if (!channel)
              return;
          }

          if (channel._callbacks.length)
            channel._callbacks.shift()(true);
        },
        CHANNEL_REQUEST: (p, recipient, type, wantReply, data) => {
          const session = this._chanMgr.get(recipient);
          if (typeof session !== 'object' || session === null)
            return;

          let replied = false;
          let accept;
          let reject;

          if (session.constructor !== Session) {
            // normal Channel instance
            if (wantReply)
              proto.channelFailure(session.outgoing.id);
            return;
          }

          if (wantReply) {
            // "real session" requests will have custom accept behaviors
            if (type !== 'shell'
                && type !== 'exec'
                && type !== 'subsystem') {
              accept = () => {
                if (replied || session._ending || session._channel)
                  return;
                replied = true;

                proto.channelSuccess(session._chanInfo.outgoing.id);
              };
            }

            reject = () => {
              if (replied || session._ending || session._channel)
                return;
              replied = true;

              proto.channelFailure(session._chanInfo.outgoing.id);
            };
          }

          if (session._ending) {
            reject && reject();
            return;
          }

          switch (type) {
            // "pre-real session start" requests
            case 'env':
              if (listenerCount(session, 'env')) {
                session.emit('env', accept, reject, {
                  key: data.name,
                  val: data.value
                });
                return;
              }
              break;
            case 'pty-req':
              if (listenerCount(session, 'pty')) {
                session.emit('pty', accept, reject, data);
                return;
              }
              break;
            case 'window-change':
              if (listenerCount(session, 'window-change'))
                session.emit('window-change', accept, reject, data);
              else
                reject && reject();
              break;
            case 'x11-req':
              if (listenerCount(session, 'x11')) {
                session.emit('x11', accept, reject, data);
                return;
              }
              break;
            // "post-real session start" requests
            case 'signal':
              if (listenerCount(session, 'signal')) {
                session.emit('signal', accept, reject, {
                  name: data
                });
                return;
              }
              break;
            // XXX: is `auth-agent-req@openssh.com` really "post-real session
            // start"?
            case 'auth-agent-req@openssh.com':
              if (listenerCount(session, 'auth-agent')) {
                session.emit('auth-agent', accept, reject);
                return;
              }
              break;
            // "real session start" requests
            case 'shell':
              if (listenerCount(session, 'shell')) {
                accept = () => {
                  if (replied || session._ending || session._channel)
                    return;
                  replied = true;

                  if (wantReply)
                    proto.channelSuccess(session._chanInfo.outgoing.id);

                  const channel = new Channel(
                    this, session._chanInfo, { server: true }
                  );

                  channel.subtype = session.subtype = type;
                  session._channel = channel;

                  return channel;
                };

                session.emit('shell', accept, reject);
                return;
              }
              break;
            case 'exec':
              if (listenerCount(session, 'exec')) {
                accept = () => {
                  if (replied || session._ending || session._channel)
                    return;
                  replied = true;

                  if (wantReply)
                    proto.channelSuccess(session._chanInfo.outgoing.id);

                  const channel = new Channel(
                    this, session._chanInfo, { server: true }
                  );

                  channel.subtype = session.subtype = type;
                  session._channel = channel;

                  return channel;
                };

                session.emit('exec', accept, reject, {
                  command: data
                });
                return;
              }
              break;
            case 'subsystem': {
              let useSFTP = (data === 'sftp');
              accept = () => {
                if (replied || session._ending || session._channel)
                  return;
                replied = true;

                if (wantReply)
                  proto.channelSuccess(session._chanInfo.outgoing.id);

                let instance;
                if (useSFTP) {
                  instance = new SFTP(this, session._chanInfo, {
                    server: true,
                    debug,
                  });
                } else {
                  instance = new Channel(
                    this, session._chanInfo, { server: true }
                  );
                  instance.subtype =
                    session.subtype = `${type}:${data}`;
                }
                session._channel = instance;

                return instance;
              };

              if (data === 'sftp') {
                if (listenerCount(session, 'sftp')) {
                  session.emit('sftp', accept, reject);
                  return;
                }
                useSFTP = false;
              }
              if (listenerCount(session, 'subsystem')) {
                session.emit('subsystem', accept, reject, {
                  name: data
                });
                return;
              }
              break;
            }
          }
          debug && debug(
            `Automatic rejection of incoming channel request: ${type}`
          );
          reject && reject();
        },
        CHANNEL_EOF: (p, recipient) => {
          let channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          if (channel.constructor === Session) {
            if (!channel._ending) {
              channel._ending = true;
              channel.emit('eof');
              channel.emit('end');
            }
            channel = channel._channel;
            if (!channel)
              return;
          }

          if (channel.incoming.state !== 'open')
            return;
          channel.incoming.state = 'eof';

          if (channel.readable)
            channel.push(null);
        },
        CHANNEL_CLOSE: (p, recipient) => {
          let channel = this._chanMgr.get(recipient);
          if (typeof channel !== 'object' || channel === null)
            return;

          if (channel.constructor === Session) {
            channel._ending = true;
            channel.emit('close');
            channel = channel._channel;
            if (!channel)
              return;
          }

          onCHANNEL_CLOSE(this, recipient, channel);
        },
        // Begin service/auth-related ==========================================
        SERVICE_REQUEST: (p, service) => {
          if (exchanges === 0
              || acceptedAuthSvc
              || this.authenticated
              || service !== 'ssh-userauth') {
            proto.disconnect(DISCONNECT_REASON.SERVICE_NOT_AVAILABLE);
            socket.end();
            return;
          }

          acceptedAuthSvc = true;
          proto.serviceAccept(service);
        },
        USERAUTH_REQUEST: (p, username, service, method, methodData) => {
          if (exchanges === 0
              || this.authenticated
              || (authCtx
                  && (authCtx.username !== username
                      || authCtx.service !== service))
                // TODO: support hostbased auth
              || (method !== 'password'
                  && method !== 'publickey'
                  && method !== 'hostbased'
                  && method !== 'keyboard-interactive'
                  && method !== 'none')
              || pendingAuths.length === MAX_PENDING_AUTHS) {
            proto.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
            socket.end();
            return;
          } else if (service !== 'ssh-connection') {
            proto.disconnect(DISCONNECT_REASON.SERVICE_NOT_AVAILABLE);
            socket.end();
            return;
          }

          let ctx;
          switch (method) {
            case 'keyboard-interactive':
              ctx = new KeyboardAuthContext(proto, username, service, method,
                                            methodData, onAuthDecide);
              break;
            case 'publickey':
              ctx = new PKAuthContext(proto, username, service, method,
                                      methodData, onAuthDecide);
              break;
            case 'hostbased':
              ctx = new HostbasedAuthContext(proto, username, service, method,
                                             methodData, onAuthDecide);
              break;
            case 'password':
              if (authCtx
                  && authCtx instanceof PwdAuthContext
                  && authCtx._changeCb) {
                const cb = authCtx._changeCb;
                authCtx._changeCb = undefined;
                cb(methodData.newPassword);
                return;
              }
              ctx = new PwdAuthContext(proto, username, service, method,
                                       methodData, onAuthDecide);
              break;
            case 'none':
              ctx = new AuthContext(proto, username, service, method,
                                    onAuthDecide);
              break;
          }

          if (authCtx) {
            if (!authCtx._initialResponse) {
              return pendingAuths.push(ctx);
            } else if (authCtx._multistep && !authCtx._finalResponse) {
              // RFC 4252 says to silently abort the current auth request if a
              // new auth request comes in before the final response from an
              // auth method that requires additional request/response exchanges
              // -- this means keyboard-interactive for now ...
              authCtx._cleanup && authCtx._cleanup();
              authCtx.emit('abort');
            }
          }

          authCtx = ctx;

          if (listenerCount(this, 'authentication'))
            this.emit('authentication', authCtx);
          else
            authCtx.reject();
        },
        USERAUTH_INFO_RESPONSE: (p, responses) => {
          if (authCtx && authCtx instanceof KeyboardAuthContext)
            authCtx._onInfoResponse(responses);
        },
        // End service/auth-related ============================================
        GLOBAL_REQUEST: (p, name, wantReply, data) => {
          const reply = {
            type: null,
            buf: null
          };

          function setReply(type, buf) {
            reply.type = type;
            reply.buf = buf;
            sendReplies();
          }

          if (wantReply)
            unsentGlobalRequestsReplies.push(reply);

          if ((name === 'tcpip-forward'
               || name === 'cancel-tcpip-forward'
               || name === 'no-more-sessions@openssh.com'
               || name === 'streamlocal-forward@openssh.com'
               || name === 'cancel-streamlocal-forward@openssh.com')
              && listenerCount(this, 'request')
              && this.authenticated) {
            let accept;
            let reject;

            if (wantReply) {
              let replied = false;
              accept = (chosenPort) => {
                if (replied)
                  return;
                replied = true;
                let bufPort;
                if (name === 'tcpip-forward'
                    && data.bindPort === 0
                    && typeof chosenPort === 'number') {
                  bufPort = Buffer.allocUnsafe(4);
                  writeUInt32BE(bufPort, chosenPort, 0);
                }
                setReply('SUCCESS', bufPort);
              };
              reject = () => {
                if (replied)
                  return;
                replied = true;
                setReply('FAILURE');
              };
            }

            if (name === 'no-more-sessions@openssh.com') {
              this.noMoreSessions = true;
              accept && accept();
              return;
            }

            this.emit('request', accept, reject, name, data);
          } else if (wantReply) {
            setReply('FAILURE');
          }
        },
      },
    });

    socket.pause();
    cryptoInit.then(() => {
      proto.start();
      socket.on('data', (data) => {
        try {
          proto.parse(data, 0, data.length);
        } catch (ex) {
          this.emit('error', ex);
          try {
            if (isWritable(socket))
              socket.end();
          } catch {}
        }
      });
      socket.resume();
    }).catch((err) => {
      this.emit('error', err);
      try {
        if (isWritable(socket))
          socket.end();
      } catch {}
    });
    socket.on('error', (err) => {
      err.level = 'socket';
      this.emit('error', err);
    }).once('end', () => {
      debug && debug('Socket ended');
      proto.cleanup();
      this.emit('end');
    }).once('close', () => {
      debug && debug('Socket closed');
      proto.cleanup();
      this.emit('close');

      const err = new Error('No response from server');

      // Simulate error for pending channels and close any open channels
      this._chanMgr.cleanup(err);
    });

    const onAuthDecide = (ctx, allowed, methodsLeft, isPartial) => {
      if (authCtx === ctx && !this.authenticated) {
        if (allowed) {
          authCtx = undefined;
          this.authenticated = true;
          proto.authSuccess();
          pendingAuths = [];
          this.emit('ready');
        } else {
          proto.authFailure(methodsLeft, isPartial);
          if (pendingAuths.length) {
            authCtx = pendingAuths.pop();
            if (listenerCount(this, 'authentication'))
              this.emit('authentication', authCtx);
            else
              authCtx.reject();
          }
        }
      }
    };

    function sendReplies() {
      while (unsentGlobalRequestsReplies.length > 0
             && unsentGlobalRequestsReplies[0].type) {
        const reply = unsentGlobalRequestsReplies.shift();
        if (reply.type === 'SUCCESS')
          proto.requestSuccess(reply.buf);
        if (reply.type === 'FAILURE')
          proto.requestFailure();
      }
    }
  }

  end() {
    if (this._sock && isWritable(this._sock)) {
      this._protocol.disconnect(DISCONNECT_REASON.BY_APPLICATION);
      this._sock.end();
    }
    return this;
  }

  x11(originAddr, originPort, cb) {
    const opts = { originAddr, originPort };
    openChannel(this, 'x11', opts, cb);
    return this;
  }

  forwardOut(boundAddr, boundPort, remoteAddr, remotePort, cb) {
    const opts = { boundAddr, boundPort, remoteAddr, remotePort };
    openChannel(this, 'forwarded-tcpip', opts, cb);
    return this;
  }

  openssh_forwardOutStreamLocal(socketPath, cb) {
    const opts = { socketPath };
    openChannel(this, 'forwarded-streamlocal@openssh.com', opts, cb);
    return this;
  }

  rekey(cb) {
    let error;

    try {
      this._protocol.rekey();
    } catch (ex) {
      error = ex;
    }

    // TODO: re-throw error if no callback?

    if (typeof cb === 'function') {
      if (error)
        process.nextTick(cb, error);
      else
        this.once('rekey', cb);
    }
  }
}


function openChannel(self, type, opts, cb) {
  // Ask the client to open a channel for some purpose (e.g. a forwarded TCP
  // connection)
  const initWindow = MAX_WINDOW;
  const maxPacket = PACKET_SIZE;

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  const wrapper = (err, stream) => {
    cb(err, stream);
  };
  wrapper.type = type;

  const localChan = self._chanMgr.add(wrapper);

  if (localChan === -1) {
    cb(new Error('No free channels available'));
    return;
  }

  switch (type) {
    case 'forwarded-tcpip':
      self._protocol.forwardedTcpip(localChan, initWindow, maxPacket, opts);
      break;
    case 'x11':
      self._protocol.x11(localChan, initWindow, maxPacket, opts);
      break;
    case 'forwarded-streamlocal@openssh.com':
      self._protocol.openssh_forwardedStreamLocal(
        localChan, initWindow, maxPacket, opts
      );
      break;
    default:
      throw new Error(`Unsupported channel type: ${type}`);
  }
}

function compareNumbers(a, b) {
  return a - b;
}

module.exports = Server;
module.exports.IncomingClient = Client;


/***/ }),

/***/ 834:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { SFTP } = __nccwpck_require__(2026);

const MAX_CHANNEL = 2 ** 32 - 1;

function onChannelOpenFailure(self, recipient, info, cb) {
  self._chanMgr.remove(recipient);
  if (typeof cb !== 'function')
    return;

  let err;
  if (info instanceof Error) {
    err = info;
  } else if (typeof info === 'object' && info !== null) {
    err = new Error(`(SSH) Channel open failure: ${info.description}`);
    err.reason = info.reason;
  } else {
    err = new Error(
      '(SSH) Channel open failure: server closed channel unexpectedly'
    );
    err.reason = '';
  }

  cb(err);
}

function onCHANNEL_CLOSE(self, recipient, channel, err, dead) {
  if (typeof channel === 'function') {
    // We got CHANNEL_CLOSE instead of CHANNEL_OPEN_FAILURE when
    // requesting to open a channel
    onChannelOpenFailure(self, recipient, err, channel);
    return;
  }

  if (typeof channel !== 'object' || channel === null)
    return;

  if (channel.incoming && channel.incoming.state === 'closed')
    return;

  self._chanMgr.remove(recipient);

  if (channel.server && channel.constructor.name === 'Session')
    return;

  channel.incoming.state = 'closed';

  if (channel.readable)
    channel.push(null);
  if (channel.server) {
    if (channel.stderr.writable)
      channel.stderr.end();
  } else if (channel.stderr.readable) {
    channel.stderr.push(null);
  }

  if (channel.constructor !== SFTP
      && (channel.outgoing.state === 'open'
          || channel.outgoing.state === 'eof')
      && !dead) {
    channel.close();
  }
  if (channel.outgoing.state === 'closing')
    channel.outgoing.state = 'closed';

  const readState = channel._readableState;
  const writeState = channel._writableState;
  if (writeState && !writeState.ending && !writeState.finished && !dead)
    channel.end();

  // Take care of any outstanding channel requests
  const chanCallbacks = channel._callbacks;
  channel._callbacks = [];
  for (let i = 0; i < chanCallbacks.length; ++i)
    chanCallbacks[i](true);

  if (channel.server) {
    if (!channel.readable
        || channel.destroyed
        || (readState && readState.endEmitted)) {
      channel.emit('close');
    } else {
      channel.once('end', () => channel.emit('close'));
    }
  } else {
    let doClose;
    switch (channel.type) {
      case 'direct-streamlocal@openssh.com':
      case 'direct-tcpip':
        doClose = () => channel.emit('close');
        break;
      default: {
        // Align more with node child processes, where the close event gets
        // the same arguments as the exit event
        const exit = channel._exit;
        doClose = () => {
          if (exit.code === null)
            channel.emit('close', exit.code, exit.signal, exit.dump, exit.desc);
          else
            channel.emit('close', exit.code);
        };
      }
    }
    if (!channel.readable
        || channel.destroyed
        || (readState && readState.endEmitted)) {
      doClose();
    } else {
      channel.once('end', doClose);
    }

    const errReadState = channel.stderr._readableState;
    if (!channel.stderr.readable
        || channel.stderr.destroyed
        || (errReadState && errReadState.endEmitted)) {
      channel.stderr.emit('close');
    } else {
      channel.stderr.once('end', () => channel.stderr.emit('close'));
    }
  }
}

class ChannelManager {
  constructor(client) {
    this._client = client;
    this._channels = {};
    this._cur = -1;
    this._count = 0;
  }
  add(val) {
    // Attempt to reserve an id

    let id;
    // Optimized paths
    if (this._cur < MAX_CHANNEL) {
      id = ++this._cur;
    } else if (this._count === 0) {
      // Revert and reset back to fast path once we no longer have any channels
      // open
      this._cur = 0;
      id = 0;
    } else {
      // Slower lookup path

      // This path is triggered we have opened at least MAX_CHANNEL channels
      // while having at least one channel open at any given time, so we have
      // to search for a free id.
      const channels = this._channels;
      for (let i = 0; i < MAX_CHANNEL; ++i) {
        if (channels[i] === undefined) {
          id = i;
          break;
        }
      }
    }

    if (id === undefined)
      return -1;

    this._channels[id] = (val || true);
    ++this._count;

    return id;
  }
  update(id, val) {
    if (typeof id !== 'number' || id < 0 || id >= MAX_CHANNEL || !isFinite(id))
      throw new Error(`Invalid channel id: ${id}`);

    if (val && this._channels[id])
      this._channels[id] = val;
  }
  get(id) {
    if (typeof id !== 'number' || id < 0 || id >= MAX_CHANNEL || !isFinite(id))
      throw new Error(`Invalid channel id: ${id}`);

    return this._channels[id];
  }
  remove(id) {
    if (typeof id !== 'number' || id < 0 || id >= MAX_CHANNEL || !isFinite(id))
      throw new Error(`Invalid channel id: ${id}`);

    if (this._channels[id]) {
      delete this._channels[id];
      if (this._count)
        --this._count;
    }
  }
  cleanup(err) {
    const channels = this._channels;
    this._channels = {};
    this._cur = -1;
    this._count = 0;

    const chanIDs = Object.keys(channels);
    const client = this._client;
    for (let i = 0; i < chanIDs.length; ++i) {
      const id = +chanIDs[i];
      const channel = channels[id];
      onCHANNEL_CLOSE(client, id, channel._channel || channel, err, true);
    }
  }
}

const isRegExp = (() => {
  const toString = Object.prototype.toString;
  return (val) => toString.call(val) === '[object RegExp]';
})();

function generateAlgorithmList(algoList, defaultList, supportedList) {
  if (Array.isArray(algoList) && algoList.length > 0) {
    // Exact list
    for (let i = 0; i < algoList.length; ++i) {
      if (supportedList.indexOf(algoList[i]) === -1)
        throw new Error(`Unsupported algorithm: ${algoList[i]}`);
    }
    return algoList;
  }

  if (typeof algoList === 'object' && algoList !== null) {
    // Operations based on the default list
    const keys = Object.keys(algoList);
    let list = defaultList;
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      let val = algoList[key];
      switch (key) {
        case 'append':
          if (!Array.isArray(val))
            val = [val];
          if (Array.isArray(val)) {
            for (let j = 0; j < val.length; ++j) {
              const append = val[j];
              if (typeof append === 'string') {
                if (!append || list.indexOf(append) !== -1)
                  continue;
                if (supportedList.indexOf(append) === -1)
                  throw new Error(`Unsupported algorithm: ${append}`);
                if (list === defaultList)
                  list = list.slice();
                list.push(append);
              } else if (isRegExp(append)) {
                for (let k = 0; k < supportedList.length; ++k) {
                  const algo = supportedList[k];
                  if (append.test(algo)) {
                    if (list.indexOf(algo) !== -1)
                      continue;
                    if (list === defaultList)
                      list = list.slice();
                    list.push(algo);
                  }
                }
              }
            }
          }
          break;
        case 'prepend':
          if (!Array.isArray(val))
            val = [val];
          if (Array.isArray(val)) {
            for (let j = val.length; j >= 0; --j) {
              const prepend = val[j];
              if (typeof prepend === 'string') {
                if (!prepend || list.indexOf(prepend) !== -1)
                  continue;
                if (supportedList.indexOf(prepend) === -1)
                  throw new Error(`Unsupported algorithm: ${prepend}`);
                if (list === defaultList)
                  list = list.slice();
                list.unshift(prepend);
              } else if (isRegExp(prepend)) {
                for (let k = supportedList.length; k >= 0; --k) {
                  const algo = supportedList[k];
                  if (prepend.test(algo)) {
                    if (list.indexOf(algo) !== -1)
                      continue;
                    if (list === defaultList)
                      list = list.slice();
                    list.unshift(algo);
                  }
                }
              }
            }
          }
          break;
        case 'remove':
          if (!Array.isArray(val))
            val = [val];
          if (Array.isArray(val)) {
            for (let j = 0; j < val.length; ++j) {
              const search = val[j];
              if (typeof search === 'string') {
                if (!search)
                  continue;
                const idx = list.indexOf(search);
                if (idx === -1)
                  continue;
                if (list === defaultList)
                  list = list.slice();
                list.splice(idx, 1);
              } else if (isRegExp(search)) {
                for (let k = 0; k < list.length; ++k) {
                  if (search.test(list[k])) {
                    if (list === defaultList)
                      list = list.slice();
                    list.splice(k, 1);
                    --k;
                  }
                }
              }
            }
          }
          break;
      }
    }

    return list;
  }

  return defaultList;
}

module.exports = {
  ChannelManager,
  generateAlgorithmList,
  onChannelOpenFailure,
  onCHANNEL_CLOSE,
  isWritable: (stream) => {
    // XXX: hack to workaround regression in node
    // See: https://github.com/nodejs/node/issues/36029
    return (stream
            && stream.writable
            && stream._readableState
            && stream._readableState.ended === false);
  },
};


/***/ }),

/***/ 4841:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var Buffer = __nccwpck_require__(1867).Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.s = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1631);
var tls = __nccwpck_require__(4016);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var events = __nccwpck_require__(8614);
var assert = __nccwpck_require__(2357);
var util = __nccwpck_require__(1669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 8729:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

(function(nacl) {
'use strict';

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/

var gf = function(init) {
  var i, r = new Float64Array(16);
  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
  return r;
};

//  Pluggable, initialized in high-level API below.
var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

var _0 = new Uint8Array(16);
var _9 = new Uint8Array(32); _9[0] = 9;

var gf0 = gf(),
    gf1 = gf([1]),
    _121665 = gf([0xdb41, 1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

function ts64(x, i, h, l) {
  x[i]   = (h >> 24) & 0xff;
  x[i+1] = (h >> 16) & 0xff;
  x[i+2] = (h >>  8) & 0xff;
  x[i+3] = h & 0xff;
  x[i+4] = (l >> 24)  & 0xff;
  x[i+5] = (l >> 16)  & 0xff;
  x[i+6] = (l >>  8)  & 0xff;
  x[i+7] = l & 0xff;
}

function vn(x, xi, y, yi, n) {
  var i,d = 0;
  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
  return (1 & ((d - 1) >>> 8)) - 1;
}

function crypto_verify_16(x, xi, y, yi) {
  return vn(x,xi,y,yi,16);
}

function crypto_verify_32(x, xi, y, yi) {
  return vn(x,xi,y,yi,32);
}

function core_salsa20(o, p, k, c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }
   x0 =  x0 +  j0 | 0;
   x1 =  x1 +  j1 | 0;
   x2 =  x2 +  j2 | 0;
   x3 =  x3 +  j3 | 0;
   x4 =  x4 +  j4 | 0;
   x5 =  x5 +  j5 | 0;
   x6 =  x6 +  j6 | 0;
   x7 =  x7 +  j7 | 0;
   x8 =  x8 +  j8 | 0;
   x9 =  x9 +  j9 | 0;
  x10 = x10 + j10 | 0;
  x11 = x11 + j11 | 0;
  x12 = x12 + j12 | 0;
  x13 = x13 + j13 | 0;
  x14 = x14 + j14 | 0;
  x15 = x15 + j15 | 0;

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x1 >>>  0 & 0xff;
  o[ 5] = x1 >>>  8 & 0xff;
  o[ 6] = x1 >>> 16 & 0xff;
  o[ 7] = x1 >>> 24 & 0xff;

  o[ 8] = x2 >>>  0 & 0xff;
  o[ 9] = x2 >>>  8 & 0xff;
  o[10] = x2 >>> 16 & 0xff;
  o[11] = x2 >>> 24 & 0xff;

  o[12] = x3 >>>  0 & 0xff;
  o[13] = x3 >>>  8 & 0xff;
  o[14] = x3 >>> 16 & 0xff;
  o[15] = x3 >>> 24 & 0xff;

  o[16] = x4 >>>  0 & 0xff;
  o[17] = x4 >>>  8 & 0xff;
  o[18] = x4 >>> 16 & 0xff;
  o[19] = x4 >>> 24 & 0xff;

  o[20] = x5 >>>  0 & 0xff;
  o[21] = x5 >>>  8 & 0xff;
  o[22] = x5 >>> 16 & 0xff;
  o[23] = x5 >>> 24 & 0xff;

  o[24] = x6 >>>  0 & 0xff;
  o[25] = x6 >>>  8 & 0xff;
  o[26] = x6 >>> 16 & 0xff;
  o[27] = x6 >>> 24 & 0xff;

  o[28] = x7 >>>  0 & 0xff;
  o[29] = x7 >>>  8 & 0xff;
  o[30] = x7 >>> 16 & 0xff;
  o[31] = x7 >>> 24 & 0xff;

  o[32] = x8 >>>  0 & 0xff;
  o[33] = x8 >>>  8 & 0xff;
  o[34] = x8 >>> 16 & 0xff;
  o[35] = x8 >>> 24 & 0xff;

  o[36] = x9 >>>  0 & 0xff;
  o[37] = x9 >>>  8 & 0xff;
  o[38] = x9 >>> 16 & 0xff;
  o[39] = x9 >>> 24 & 0xff;

  o[40] = x10 >>>  0 & 0xff;
  o[41] = x10 >>>  8 & 0xff;
  o[42] = x10 >>> 16 & 0xff;
  o[43] = x10 >>> 24 & 0xff;

  o[44] = x11 >>>  0 & 0xff;
  o[45] = x11 >>>  8 & 0xff;
  o[46] = x11 >>> 16 & 0xff;
  o[47] = x11 >>> 24 & 0xff;

  o[48] = x12 >>>  0 & 0xff;
  o[49] = x12 >>>  8 & 0xff;
  o[50] = x12 >>> 16 & 0xff;
  o[51] = x12 >>> 24 & 0xff;

  o[52] = x13 >>>  0 & 0xff;
  o[53] = x13 >>>  8 & 0xff;
  o[54] = x13 >>> 16 & 0xff;
  o[55] = x13 >>> 24 & 0xff;

  o[56] = x14 >>>  0 & 0xff;
  o[57] = x14 >>>  8 & 0xff;
  o[58] = x14 >>> 16 & 0xff;
  o[59] = x14 >>> 24 & 0xff;

  o[60] = x15 >>>  0 & 0xff;
  o[61] = x15 >>>  8 & 0xff;
  o[62] = x15 >>> 16 & 0xff;
  o[63] = x15 >>> 24 & 0xff;
}

function core_hsalsa20(o,p,k,c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x5 >>>  0 & 0xff;
  o[ 5] = x5 >>>  8 & 0xff;
  o[ 6] = x5 >>> 16 & 0xff;
  o[ 7] = x5 >>> 24 & 0xff;

  o[ 8] = x10 >>>  0 & 0xff;
  o[ 9] = x10 >>>  8 & 0xff;
  o[10] = x10 >>> 16 & 0xff;
  o[11] = x10 >>> 24 & 0xff;

  o[12] = x15 >>>  0 & 0xff;
  o[13] = x15 >>>  8 & 0xff;
  o[14] = x15 >>> 16 & 0xff;
  o[15] = x15 >>> 24 & 0xff;

  o[16] = x6 >>>  0 & 0xff;
  o[17] = x6 >>>  8 & 0xff;
  o[18] = x6 >>> 16 & 0xff;
  o[19] = x6 >>> 24 & 0xff;

  o[20] = x7 >>>  0 & 0xff;
  o[21] = x7 >>>  8 & 0xff;
  o[22] = x7 >>> 16 & 0xff;
  o[23] = x7 >>> 24 & 0xff;

  o[24] = x8 >>>  0 & 0xff;
  o[25] = x8 >>>  8 & 0xff;
  o[26] = x8 >>> 16 & 0xff;
  o[27] = x8 >>> 24 & 0xff;

  o[28] = x9 >>>  0 & 0xff;
  o[29] = x9 >>>  8 & 0xff;
  o[30] = x9 >>> 16 & 0xff;
  o[31] = x9 >>> 24 & 0xff;
}

function crypto_core_salsa20(out,inp,k,c) {
  core_salsa20(out,inp,k,c);
}

function crypto_core_hsalsa20(out,inp,k,c) {
  core_hsalsa20(out,inp,k,c);
}

var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
            // "expand 32-byte k"

function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
    mpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
  }
  return 0;
}

function crypto_stream_salsa20(c,cpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = x[i];
  }
  return 0;
}

function crypto_stream(c,cpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20(c,cpos,d,sn,s);
}

function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
}

/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*/

var poly1305 = function(key) {
  this.buffer = new Uint8Array(16);
  this.r = new Uint16Array(10);
  this.h = new Uint16Array(10);
  this.pad = new Uint16Array(8);
  this.leftover = 0;
  this.fin = 0;

  var t0, t1, t2, t3, t4, t5, t6, t7;

  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
  this.r[9] = ((t7 >>>  5)) & 0x007f;

  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
};

poly1305.prototype.blocks = function(m, mpos, bytes) {
  var hibit = this.fin ? 0 : (1 << 11);
  var t0, t1, t2, t3, t4, t5, t6, t7, c;
  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

  var h0 = this.h[0],
      h1 = this.h[1],
      h2 = this.h[2],
      h3 = this.h[3],
      h4 = this.h[4],
      h5 = this.h[5],
      h6 = this.h[6],
      h7 = this.h[7],
      h8 = this.h[8],
      h9 = this.h[9];

  var r0 = this.r[0],
      r1 = this.r[1],
      r2 = this.r[2],
      r3 = this.r[3],
      r4 = this.r[4],
      r5 = this.r[5],
      r6 = this.r[6],
      r7 = this.r[7],
      r8 = this.r[8],
      r9 = this.r[9];

  while (bytes >= 16) {
    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
    h5 += ((t4 >>>  1)) & 0x1fff;
    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
    h9 += ((t7 >>> 5)) | hibit;

    c = 0;

    d0 = c;
    d0 += h0 * r0;
    d0 += h1 * (5 * r9);
    d0 += h2 * (5 * r8);
    d0 += h3 * (5 * r7);
    d0 += h4 * (5 * r6);
    c = (d0 >>> 13); d0 &= 0x1fff;
    d0 += h5 * (5 * r5);
    d0 += h6 * (5 * r4);
    d0 += h7 * (5 * r3);
    d0 += h8 * (5 * r2);
    d0 += h9 * (5 * r1);
    c += (d0 >>> 13); d0 &= 0x1fff;

    d1 = c;
    d1 += h0 * r1;
    d1 += h1 * r0;
    d1 += h2 * (5 * r9);
    d1 += h3 * (5 * r8);
    d1 += h4 * (5 * r7);
    c = (d1 >>> 13); d1 &= 0x1fff;
    d1 += h5 * (5 * r6);
    d1 += h6 * (5 * r5);
    d1 += h7 * (5 * r4);
    d1 += h8 * (5 * r3);
    d1 += h9 * (5 * r2);
    c += (d1 >>> 13); d1 &= 0x1fff;

    d2 = c;
    d2 += h0 * r2;
    d2 += h1 * r1;
    d2 += h2 * r0;
    d2 += h3 * (5 * r9);
    d2 += h4 * (5 * r8);
    c = (d2 >>> 13); d2 &= 0x1fff;
    d2 += h5 * (5 * r7);
    d2 += h6 * (5 * r6);
    d2 += h7 * (5 * r5);
    d2 += h8 * (5 * r4);
    d2 += h9 * (5 * r3);
    c += (d2 >>> 13); d2 &= 0x1fff;

    d3 = c;
    d3 += h0 * r3;
    d3 += h1 * r2;
    d3 += h2 * r1;
    d3 += h3 * r0;
    d3 += h4 * (5 * r9);
    c = (d3 >>> 13); d3 &= 0x1fff;
    d3 += h5 * (5 * r8);
    d3 += h6 * (5 * r7);
    d3 += h7 * (5 * r6);
    d3 += h8 * (5 * r5);
    d3 += h9 * (5 * r4);
    c += (d3 >>> 13); d3 &= 0x1fff;

    d4 = c;
    d4 += h0 * r4;
    d4 += h1 * r3;
    d4 += h2 * r2;
    d4 += h3 * r1;
    d4 += h4 * r0;
    c = (d4 >>> 13); d4 &= 0x1fff;
    d4 += h5 * (5 * r9);
    d4 += h6 * (5 * r8);
    d4 += h7 * (5 * r7);
    d4 += h8 * (5 * r6);
    d4 += h9 * (5 * r5);
    c += (d4 >>> 13); d4 &= 0x1fff;

    d5 = c;
    d5 += h0 * r5;
    d5 += h1 * r4;
    d5 += h2 * r3;
    d5 += h3 * r2;
    d5 += h4 * r1;
    c = (d5 >>> 13); d5 &= 0x1fff;
    d5 += h5 * r0;
    d5 += h6 * (5 * r9);
    d5 += h7 * (5 * r8);
    d5 += h8 * (5 * r7);
    d5 += h9 * (5 * r6);
    c += (d5 >>> 13); d5 &= 0x1fff;

    d6 = c;
    d6 += h0 * r6;
    d6 += h1 * r5;
    d6 += h2 * r4;
    d6 += h3 * r3;
    d6 += h4 * r2;
    c = (d6 >>> 13); d6 &= 0x1fff;
    d6 += h5 * r1;
    d6 += h6 * r0;
    d6 += h7 * (5 * r9);
    d6 += h8 * (5 * r8);
    d6 += h9 * (5 * r7);
    c += (d6 >>> 13); d6 &= 0x1fff;

    d7 = c;
    d7 += h0 * r7;
    d7 += h1 * r6;
    d7 += h2 * r5;
    d7 += h3 * r4;
    d7 += h4 * r3;
    c = (d7 >>> 13); d7 &= 0x1fff;
    d7 += h5 * r2;
    d7 += h6 * r1;
    d7 += h7 * r0;
    d7 += h8 * (5 * r9);
    d7 += h9 * (5 * r8);
    c += (d7 >>> 13); d7 &= 0x1fff;

    d8 = c;
    d8 += h0 * r8;
    d8 += h1 * r7;
    d8 += h2 * r6;
    d8 += h3 * r5;
    d8 += h4 * r4;
    c = (d8 >>> 13); d8 &= 0x1fff;
    d8 += h5 * r3;
    d8 += h6 * r2;
    d8 += h7 * r1;
    d8 += h8 * r0;
    d8 += h9 * (5 * r9);
    c += (d8 >>> 13); d8 &= 0x1fff;

    d9 = c;
    d9 += h0 * r9;
    d9 += h1 * r8;
    d9 += h2 * r7;
    d9 += h3 * r6;
    d9 += h4 * r5;
    c = (d9 >>> 13); d9 &= 0x1fff;
    d9 += h5 * r4;
    d9 += h6 * r3;
    d9 += h7 * r2;
    d9 += h8 * r1;
    d9 += h9 * r0;
    c += (d9 >>> 13); d9 &= 0x1fff;

    c = (((c << 2) + c)) | 0;
    c = (c + d0) | 0;
    d0 = c & 0x1fff;
    c = (c >>> 13);
    d1 += c;

    h0 = d0;
    h1 = d1;
    h2 = d2;
    h3 = d3;
    h4 = d4;
    h5 = d5;
    h6 = d6;
    h7 = d7;
    h8 = d8;
    h9 = d9;

    mpos += 16;
    bytes -= 16;
  }
  this.h[0] = h0;
  this.h[1] = h1;
  this.h[2] = h2;
  this.h[3] = h3;
  this.h[4] = h4;
  this.h[5] = h5;
  this.h[6] = h6;
  this.h[7] = h7;
  this.h[8] = h8;
  this.h[9] = h9;
};

poly1305.prototype.finish = function(mac, macpos) {
  var g = new Uint16Array(10);
  var c, mask, f, i;

  if (this.leftover) {
    i = this.leftover;
    this.buffer[i++] = 1;
    for (; i < 16; i++) this.buffer[i] = 0;
    this.fin = 1;
    this.blocks(this.buffer, 0, 16);
  }

  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  for (i = 2; i < 10; i++) {
    this.h[i] += c;
    c = this.h[i] >>> 13;
    this.h[i] &= 0x1fff;
  }
  this.h[0] += (c * 5);
  c = this.h[0] >>> 13;
  this.h[0] &= 0x1fff;
  this.h[1] += c;
  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  this.h[2] += c;

  g[0] = this.h[0] + 5;
  c = g[0] >>> 13;
  g[0] &= 0x1fff;
  for (i = 1; i < 10; i++) {
    g[i] = this.h[i] + c;
    c = g[i] >>> 13;
    g[i] &= 0x1fff;
  }
  g[9] -= (1 << 13);

  mask = (c ^ 1) - 1;
  for (i = 0; i < 10; i++) g[i] &= mask;
  mask = ~mask;
  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

  f = this.h[0] + this.pad[0];
  this.h[0] = f & 0xffff;
  for (i = 1; i < 8; i++) {
    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
    this.h[i] = f & 0xffff;
  }

  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
};

poly1305.prototype.update = function(m, mpos, bytes) {
  var i, want;

  if (this.leftover) {
    want = (16 - this.leftover);
    if (want > bytes)
      want = bytes;
    for (i = 0; i < want; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    bytes -= want;
    mpos += want;
    this.leftover += want;
    if (this.leftover < 16)
      return;
    this.blocks(this.buffer, 0, 16);
    this.leftover = 0;
  }

  if (bytes >= 16) {
    want = bytes - (bytes % 16);
    this.blocks(m, mpos, want);
    mpos += want;
    bytes -= want;
  }

  if (bytes) {
    for (i = 0; i < bytes; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    this.leftover += bytes;
  }
};

function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
  var s = new poly1305(k);
  s.update(m, mpos, n);
  s.finish(out, outpos);
  return 0;
}

function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
  var x = new Uint8Array(16);
  crypto_onetimeauth(x,0,m,mpos,n,k);
  return crypto_verify_16(h,hpos,x,0);
}

function crypto_secretbox(c,m,d,n,k) {
  var i;
  if (d < 32) return -1;
  crypto_stream_xor(c,0,m,0,d,n,k);
  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
  for (i = 0; i < 16; i++) c[i] = 0;
  return 0;
}

function crypto_secretbox_open(m,c,d,n,k) {
  var i;
  var x = new Uint8Array(32);
  if (d < 32) return -1;
  crypto_stream(x,0,32,n,k);
  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
  crypto_stream_xor(m,0,c,0,d,n,k);
  for (i = 0; i < 32; i++) m[i] = 0;
  return 0;
}

function set25519(r, a) {
  var i;
  for (i = 0; i < 16; i++) r[i] = a[i]|0;
}

function car25519(o) {
  var i, v, c = 1;
  for (i = 0; i < 16; i++) {
    v = o[i] + c + 65535;
    c = Math.floor(v / 65536);
    o[i] = v - c * 65536;
  }
  o[0] += c-1 + 37 * (c-1);
}

function sel25519(p, q, b) {
  var t, c = ~(b-1);
  for (var i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function pack25519(o, n) {
  var i, j, b;
  var m = gf(), t = gf();
  for (i = 0; i < 16; i++) t[i] = n[i];
  car25519(t);
  car25519(t);
  car25519(t);
  for (j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed;
    for (i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
      m[i-1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
    b = (m[15]>>16) & 1;
    m[14] &= 0xffff;
    sel25519(t, m, 1-b);
  }
  for (i = 0; i < 16; i++) {
    o[2*i] = t[i] & 0xff;
    o[2*i+1] = t[i]>>8;
  }
}

function neq25519(a, b) {
  var c = new Uint8Array(32), d = new Uint8Array(32);
  pack25519(c, a);
  pack25519(d, b);
  return crypto_verify_32(c, 0, d, 0);
}

function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

function unpack25519(o, n) {
  var i;
  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
  o[15] &= 0x7fff;
}

function A(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
}

function Z(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
}

function M(o, a, b) {
  var v, c,
     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
    b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7],
    b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11],
    b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];

  v = a[0];
  t0 += v * b0;
  t1 += v * b1;
  t2 += v * b2;
  t3 += v * b3;
  t4 += v * b4;
  t5 += v * b5;
  t6 += v * b6;
  t7 += v * b7;
  t8 += v * b8;
  t9 += v * b9;
  t10 += v * b10;
  t11 += v * b11;
  t12 += v * b12;
  t13 += v * b13;
  t14 += v * b14;
  t15 += v * b15;
  v = a[1];
  t1 += v * b0;
  t2 += v * b1;
  t3 += v * b2;
  t4 += v * b3;
  t5 += v * b4;
  t6 += v * b5;
  t7 += v * b6;
  t8 += v * b7;
  t9 += v * b8;
  t10 += v * b9;
  t11 += v * b10;
  t12 += v * b11;
  t13 += v * b12;
  t14 += v * b13;
  t15 += v * b14;
  t16 += v * b15;
  v = a[2];
  t2 += v * b0;
  t3 += v * b1;
  t4 += v * b2;
  t5 += v * b3;
  t6 += v * b4;
  t7 += v * b5;
  t8 += v * b6;
  t9 += v * b7;
  t10 += v * b8;
  t11 += v * b9;
  t12 += v * b10;
  t13 += v * b11;
  t14 += v * b12;
  t15 += v * b13;
  t16 += v * b14;
  t17 += v * b15;
  v = a[3];
  t3 += v * b0;
  t4 += v * b1;
  t5 += v * b2;
  t6 += v * b3;
  t7 += v * b4;
  t8 += v * b5;
  t9 += v * b6;
  t10 += v * b7;
  t11 += v * b8;
  t12 += v * b9;
  t13 += v * b10;
  t14 += v * b11;
  t15 += v * b12;
  t16 += v * b13;
  t17 += v * b14;
  t18 += v * b15;
  v = a[4];
  t4 += v * b0;
  t5 += v * b1;
  t6 += v * b2;
  t7 += v * b3;
  t8 += v * b4;
  t9 += v * b5;
  t10 += v * b6;
  t11 += v * b7;
  t12 += v * b8;
  t13 += v * b9;
  t14 += v * b10;
  t15 += v * b11;
  t16 += v * b12;
  t17 += v * b13;
  t18 += v * b14;
  t19 += v * b15;
  v = a[5];
  t5 += v * b0;
  t6 += v * b1;
  t7 += v * b2;
  t8 += v * b3;
  t9 += v * b4;
  t10 += v * b5;
  t11 += v * b6;
  t12 += v * b7;
  t13 += v * b8;
  t14 += v * b9;
  t15 += v * b10;
  t16 += v * b11;
  t17 += v * b12;
  t18 += v * b13;
  t19 += v * b14;
  t20 += v * b15;
  v = a[6];
  t6 += v * b0;
  t7 += v * b1;
  t8 += v * b2;
  t9 += v * b3;
  t10 += v * b4;
  t11 += v * b5;
  t12 += v * b6;
  t13 += v * b7;
  t14 += v * b8;
  t15 += v * b9;
  t16 += v * b10;
  t17 += v * b11;
  t18 += v * b12;
  t19 += v * b13;
  t20 += v * b14;
  t21 += v * b15;
  v = a[7];
  t7 += v * b0;
  t8 += v * b1;
  t9 += v * b2;
  t10 += v * b3;
  t11 += v * b4;
  t12 += v * b5;
  t13 += v * b6;
  t14 += v * b7;
  t15 += v * b8;
  t16 += v * b9;
  t17 += v * b10;
  t18 += v * b11;
  t19 += v * b12;
  t20 += v * b13;
  t21 += v * b14;
  t22 += v * b15;
  v = a[8];
  t8 += v * b0;
  t9 += v * b1;
  t10 += v * b2;
  t11 += v * b3;
  t12 += v * b4;
  t13 += v * b5;
  t14 += v * b6;
  t15 += v * b7;
  t16 += v * b8;
  t17 += v * b9;
  t18 += v * b10;
  t19 += v * b11;
  t20 += v * b12;
  t21 += v * b13;
  t22 += v * b14;
  t23 += v * b15;
  v = a[9];
  t9 += v * b0;
  t10 += v * b1;
  t11 += v * b2;
  t12 += v * b3;
  t13 += v * b4;
  t14 += v * b5;
  t15 += v * b6;
  t16 += v * b7;
  t17 += v * b8;
  t18 += v * b9;
  t19 += v * b10;
  t20 += v * b11;
  t21 += v * b12;
  t22 += v * b13;
  t23 += v * b14;
  t24 += v * b15;
  v = a[10];
  t10 += v * b0;
  t11 += v * b1;
  t12 += v * b2;
  t13 += v * b3;
  t14 += v * b4;
  t15 += v * b5;
  t16 += v * b6;
  t17 += v * b7;
  t18 += v * b8;
  t19 += v * b9;
  t20 += v * b10;
  t21 += v * b11;
  t22 += v * b12;
  t23 += v * b13;
  t24 += v * b14;
  t25 += v * b15;
  v = a[11];
  t11 += v * b0;
  t12 += v * b1;
  t13 += v * b2;
  t14 += v * b3;
  t15 += v * b4;
  t16 += v * b5;
  t17 += v * b6;
  t18 += v * b7;
  t19 += v * b8;
  t20 += v * b9;
  t21 += v * b10;
  t22 += v * b11;
  t23 += v * b12;
  t24 += v * b13;
  t25 += v * b14;
  t26 += v * b15;
  v = a[12];
  t12 += v * b0;
  t13 += v * b1;
  t14 += v * b2;
  t15 += v * b3;
  t16 += v * b4;
  t17 += v * b5;
  t18 += v * b6;
  t19 += v * b7;
  t20 += v * b8;
  t21 += v * b9;
  t22 += v * b10;
  t23 += v * b11;
  t24 += v * b12;
  t25 += v * b13;
  t26 += v * b14;
  t27 += v * b15;
  v = a[13];
  t13 += v * b0;
  t14 += v * b1;
  t15 += v * b2;
  t16 += v * b3;
  t17 += v * b4;
  t18 += v * b5;
  t19 += v * b6;
  t20 += v * b7;
  t21 += v * b8;
  t22 += v * b9;
  t23 += v * b10;
  t24 += v * b11;
  t25 += v * b12;
  t26 += v * b13;
  t27 += v * b14;
  t28 += v * b15;
  v = a[14];
  t14 += v * b0;
  t15 += v * b1;
  t16 += v * b2;
  t17 += v * b3;
  t18 += v * b4;
  t19 += v * b5;
  t20 += v * b6;
  t21 += v * b7;
  t22 += v * b8;
  t23 += v * b9;
  t24 += v * b10;
  t25 += v * b11;
  t26 += v * b12;
  t27 += v * b13;
  t28 += v * b14;
  t29 += v * b15;
  v = a[15];
  t15 += v * b0;
  t16 += v * b1;
  t17 += v * b2;
  t18 += v * b3;
  t19 += v * b4;
  t20 += v * b5;
  t21 += v * b6;
  t22 += v * b7;
  t23 += v * b8;
  t24 += v * b9;
  t25 += v * b10;
  t26 += v * b11;
  t27 += v * b12;
  t28 += v * b13;
  t29 += v * b14;
  t30 += v * b15;

  t0  += 38 * t16;
  t1  += 38 * t17;
  t2  += 38 * t18;
  t3  += 38 * t19;
  t4  += 38 * t20;
  t5  += 38 * t21;
  t6  += 38 * t22;
  t7  += 38 * t23;
  t8  += 38 * t24;
  t9  += 38 * t25;
  t10 += 38 * t26;
  t11 += 38 * t27;
  t12 += 38 * t28;
  t13 += 38 * t29;
  t14 += 38 * t30;
  // t15 left as is

  // first car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  // second car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  o[ 0] = t0;
  o[ 1] = t1;
  o[ 2] = t2;
  o[ 3] = t3;
  o[ 4] = t4;
  o[ 5] = t5;
  o[ 6] = t6;
  o[ 7] = t7;
  o[ 8] = t8;
  o[ 9] = t9;
  o[10] = t10;
  o[11] = t11;
  o[12] = t12;
  o[13] = t13;
  o[14] = t14;
  o[15] = t15;
}

function S(o, a) {
  M(o, a, a);
}

function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if(a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function pow2523(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 250; a >= 0; a--) {
      S(c, c);
      if(a !== 1) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function crypto_scalarmult(q, n, p) {
  var z = new Uint8Array(32);
  var x = new Float64Array(80), r, i;
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf();
  for (i = 0; i < 31; i++) z[i] = n[i];
  z[31]=(n[31]&127)|64;
  z[0]&=248;
  unpack25519(x,p);
  for (i = 0; i < 16; i++) {
    b[i]=x[i];
    d[i]=a[i]=c[i]=0;
  }
  a[0]=d[0]=1;
  for (i=254; i>=0; --i) {
    r=(z[i>>>3]>>>(i&7))&1;
    sel25519(a,b,r);
    sel25519(c,d,r);
    A(e,a,c);
    Z(a,a,c);
    A(c,b,d);
    Z(b,b,d);
    S(d,e);
    S(f,a);
    M(a,c,a);
    M(c,b,e);
    A(e,a,c);
    Z(a,a,c);
    S(b,a);
    Z(c,d,f);
    M(a,c,_121665);
    A(a,a,d);
    M(c,c,a);
    M(a,d,f);
    M(d,b,x);
    S(b,e);
    sel25519(a,b,r);
    sel25519(c,d,r);
  }
  for (i = 0; i < 16; i++) {
    x[i+16]=a[i];
    x[i+32]=c[i];
    x[i+48]=b[i];
    x[i+64]=d[i];
  }
  var x32 = x.subarray(32);
  var x16 = x.subarray(16);
  inv25519(x32,x32);
  M(x16,x16,x32);
  pack25519(q,x16);
  return 0;
}

function crypto_scalarmult_base(q, n) {
  return crypto_scalarmult(q, n, _9);
}

function crypto_box_keypair(y, x) {
  randombytes(x, 32);
  return crypto_scalarmult_base(y, x);
}

function crypto_box_beforenm(k, y, x) {
  var s = new Uint8Array(32);
  crypto_scalarmult(s, x, y);
  return crypto_core_hsalsa20(k, _0, s, sigma);
}

var crypto_box_afternm = crypto_secretbox;
var crypto_box_open_afternm = crypto_secretbox_open;

function crypto_box(c, m, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_afternm(c, m, d, n, k);
}

function crypto_box_open(m, c, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_open_afternm(m, c, d, n, k);
}

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function crypto_hashblocks_hl(hh, hl, m, n) {
  var wh = new Int32Array(16), wl = new Int32Array(16),
      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
      th, tl, i, j, h, l, a, b, c, d;

  var ah0 = hh[0],
      ah1 = hh[1],
      ah2 = hh[2],
      ah3 = hh[3],
      ah4 = hh[4],
      ah5 = hh[5],
      ah6 = hh[6],
      ah7 = hh[7],

      al0 = hl[0],
      al1 = hl[1],
      al2 = hl[2],
      al3 = hl[3],
      al4 = hl[4],
      al5 = hl[5],
      al6 = hl[6],
      al7 = hl[7];

  var pos = 0;
  while (n >= 128) {
    for (i = 0; i < 16; i++) {
      j = 8 * i + pos;
      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
    }
    for (i = 0; i < 80; i++) {
      bh0 = ah0;
      bh1 = ah1;
      bh2 = ah2;
      bh3 = ah3;
      bh4 = ah4;
      bh5 = ah5;
      bh6 = ah6;
      bh7 = ah7;

      bl0 = al0;
      bl1 = al1;
      bl2 = al2;
      bl3 = al3;
      bl4 = al4;
      bl5 = al5;
      bl6 = al6;
      bl7 = al7;

      // add
      h = ah7;
      l = al7;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma1
      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Ch
      h = (ah4 & ah5) ^ (~ah4 & ah6);
      l = (al4 & al5) ^ (~al4 & al6);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // K
      h = K[i*2];
      l = K[i*2+1];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // w
      h = wh[i%16];
      l = wl[i%16];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      th = c & 0xffff | d << 16;
      tl = a & 0xffff | b << 16;

      // add
      h = th;
      l = tl;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma0
      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Maj
      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh7 = (c & 0xffff) | (d << 16);
      bl7 = (a & 0xffff) | (b << 16);

      // add
      h = bh3;
      l = bl3;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      h = th;
      l = tl;

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh3 = (c & 0xffff) | (d << 16);
      bl3 = (a & 0xffff) | (b << 16);

      ah1 = bh0;
      ah2 = bh1;
      ah3 = bh2;
      ah4 = bh3;
      ah5 = bh4;
      ah6 = bh5;
      ah7 = bh6;
      ah0 = bh7;

      al1 = bl0;
      al2 = bl1;
      al3 = bl2;
      al4 = bl3;
      al5 = bl4;
      al6 = bl5;
      al7 = bl6;
      al0 = bl7;

      if (i%16 === 15) {
        for (j = 0; j < 16; j++) {
          // add
          h = wh[j];
          l = wl[j];

          a = l & 0xffff; b = l >>> 16;
          c = h & 0xffff; d = h >>> 16;

          h = wh[(j+9)%16];
          l = wl[(j+9)%16];

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma0
          th = wh[(j+1)%16];
          tl = wl[(j+1)%16];
          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma1
          th = wh[(j+14)%16];
          tl = wl[(j+14)%16];
          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;

          wh[j] = (c & 0xffff) | (d << 16);
          wl[j] = (a & 0xffff) | (b << 16);
        }
      }
    }

    // add
    h = ah0;
    l = al0;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[0];
    l = hl[0];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[0] = ah0 = (c & 0xffff) | (d << 16);
    hl[0] = al0 = (a & 0xffff) | (b << 16);

    h = ah1;
    l = al1;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[1];
    l = hl[1];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[1] = ah1 = (c & 0xffff) | (d << 16);
    hl[1] = al1 = (a & 0xffff) | (b << 16);

    h = ah2;
    l = al2;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[2];
    l = hl[2];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[2] = ah2 = (c & 0xffff) | (d << 16);
    hl[2] = al2 = (a & 0xffff) | (b << 16);

    h = ah3;
    l = al3;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[3];
    l = hl[3];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[3] = ah3 = (c & 0xffff) | (d << 16);
    hl[3] = al3 = (a & 0xffff) | (b << 16);

    h = ah4;
    l = al4;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[4];
    l = hl[4];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[4] = ah4 = (c & 0xffff) | (d << 16);
    hl[4] = al4 = (a & 0xffff) | (b << 16);

    h = ah5;
    l = al5;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[5];
    l = hl[5];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[5] = ah5 = (c & 0xffff) | (d << 16);
    hl[5] = al5 = (a & 0xffff) | (b << 16);

    h = ah6;
    l = al6;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[6];
    l = hl[6];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[6] = ah6 = (c & 0xffff) | (d << 16);
    hl[6] = al6 = (a & 0xffff) | (b << 16);

    h = ah7;
    l = al7;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[7];
    l = hl[7];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[7] = ah7 = (c & 0xffff) | (d << 16);
    hl[7] = al7 = (a & 0xffff) | (b << 16);

    pos += 128;
    n -= 128;
  }

  return n;
}

function crypto_hash(out, m, n) {
  var hh = new Int32Array(8),
      hl = new Int32Array(8),
      x = new Uint8Array(256),
      i, b = n;

  hh[0] = 0x6a09e667;
  hh[1] = 0xbb67ae85;
  hh[2] = 0x3c6ef372;
  hh[3] = 0xa54ff53a;
  hh[4] = 0x510e527f;
  hh[5] = 0x9b05688c;
  hh[6] = 0x1f83d9ab;
  hh[7] = 0x5be0cd19;

  hl[0] = 0xf3bcc908;
  hl[1] = 0x84caa73b;
  hl[2] = 0xfe94f82b;
  hl[3] = 0x5f1d36f1;
  hl[4] = 0xade682d1;
  hl[5] = 0x2b3e6c1f;
  hl[6] = 0xfb41bd6b;
  hl[7] = 0x137e2179;

  crypto_hashblocks_hl(hh, hl, m, n);
  n %= 128;

  for (i = 0; i < n; i++) x[i] = m[b-n+i];
  x[n] = 128;

  n = 256-128*(n<112?1:0);
  x[n-9] = 0;
  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
  crypto_hashblocks_hl(hh, hl, x, n);

  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

  return 0;
}

function add(p, q) {
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf(),
      g = gf(), h = gf(), t = gf();

  Z(a, p[1], p[0]);
  Z(t, q[1], q[0]);
  M(a, a, t);
  A(b, p[0], p[1]);
  A(t, q[0], q[1]);
  M(b, b, t);
  M(c, p[3], q[3]);
  M(c, c, D2);
  M(d, p[2], q[2]);
  A(d, d, d);
  Z(e, b, a);
  Z(f, d, c);
  A(g, d, c);
  A(h, b, a);

  M(p[0], e, f);
  M(p[1], h, g);
  M(p[2], g, f);
  M(p[3], e, h);
}

function cswap(p, q, b) {
  var i;
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b);
  }
}

function pack(r, p) {
  var tx = gf(), ty = gf(), zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

function scalarmult(p, q, s) {
  var b, i;
  set25519(p[0], gf0);
  set25519(p[1], gf1);
  set25519(p[2], gf1);
  set25519(p[3], gf0);
  for (i = 255; i >= 0; --i) {
    b = (s[(i/8)|0] >> (i&7)) & 1;
    cswap(p, q, b);
    add(q, p);
    add(p, p);
    cswap(p, q, b);
  }
}

function scalarbase(p, s) {
  var q = [gf(), gf(), gf(), gf()];
  set25519(q[0], X);
  set25519(q[1], Y);
  set25519(q[2], gf1);
  M(q[3], X, Y);
  scalarmult(p, q, s);
}

function crypto_sign_keypair(pk, sk, seeded) {
  var d = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()];
  var i;

  if (!seeded) randombytes(sk, 32);
  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  scalarbase(p, d);
  pack(pk, p);

  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
  return 0;
}

var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

function modL(r, x) {
  var carry, i, j, k;
  for (i = 63; i >= 32; --i) {
    carry = 0;
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
      carry = (x[j] + 128) >> 8;
      x[j] -= carry * 256;
    }
    x[j] += carry;
    x[i] = 0;
  }
  carry = 0;
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j];
    carry = x[j] >> 8;
    x[j] &= 255;
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
  for (i = 0; i < 32; i++) {
    x[i+1] += x[i] >> 8;
    r[i] = x[i] & 255;
  }
}

function reduce(r) {
  var x = new Float64Array(64), i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}

// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
  var i, j, x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

  crypto_hash(r, sm.subarray(32), n+32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 32; i < 64; i++) sm[i] = sk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i+j] += h[i] * d[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

function unpackneg(r, p) {
  var t = gf(), chk = gf(), num = gf(),
      den = gf(), den2 = gf(), den4 = gf(),
      den6 = gf();

  set25519(r[2], gf1);
  unpack25519(r[1], p);
  S(num, r[1]);
  M(den, num, D);
  Z(num, num, r[2]);
  A(den, r[2], den);

  S(den2, den);
  S(den4, den2);
  M(den6, den4, den2);
  M(t, den6, num);
  M(t, t, den);

  pow2523(t, t);
  M(t, t, num);
  M(t, t, den);
  M(t, t, den);
  M(r[0], t, den);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) M(r[0], r[0], I);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) return -1;

  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

  M(r[3], r[0], r[1]);
  return 0;
}

function crypto_sign_open(m, sm, n, pk) {
  var i, mlen;
  var t = new Uint8Array(32), h = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()],
      q = [gf(), gf(), gf(), gf()];

  mlen = -1;
  if (n < 64) return -1;

  if (unpackneg(q, pk)) return -1;

  for (i = 0; i < n; i++) m[i] = sm[i];
  for (i = 0; i < 32; i++) m[i+32] = pk[i];
  crypto_hash(h, m, n);
  reduce(h);
  scalarmult(p, q, h);

  scalarbase(q, sm.subarray(32));
  add(p, q);
  pack(t, p);

  n -= 64;
  if (crypto_verify_32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0;
    return -1;
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64];
  mlen = n;
  return mlen;
}

var crypto_secretbox_KEYBYTES = 32,
    crypto_secretbox_NONCEBYTES = 24,
    crypto_secretbox_ZEROBYTES = 32,
    crypto_secretbox_BOXZEROBYTES = 16,
    crypto_scalarmult_BYTES = 32,
    crypto_scalarmult_SCALARBYTES = 32,
    crypto_box_PUBLICKEYBYTES = 32,
    crypto_box_SECRETKEYBYTES = 32,
    crypto_box_BEFORENMBYTES = 32,
    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
    crypto_sign_BYTES = 64,
    crypto_sign_PUBLICKEYBYTES = 32,
    crypto_sign_SECRETKEYBYTES = 64,
    crypto_sign_SEEDBYTES = 32,
    crypto_hash_BYTES = 64;

nacl.lowlevel = {
  crypto_core_hsalsa20: crypto_core_hsalsa20,
  crypto_stream_xor: crypto_stream_xor,
  crypto_stream: crypto_stream,
  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
  crypto_stream_salsa20: crypto_stream_salsa20,
  crypto_onetimeauth: crypto_onetimeauth,
  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
  crypto_verify_16: crypto_verify_16,
  crypto_verify_32: crypto_verify_32,
  crypto_secretbox: crypto_secretbox,
  crypto_secretbox_open: crypto_secretbox_open,
  crypto_scalarmult: crypto_scalarmult,
  crypto_scalarmult_base: crypto_scalarmult_base,
  crypto_box_beforenm: crypto_box_beforenm,
  crypto_box_afternm: crypto_box_afternm,
  crypto_box: crypto_box,
  crypto_box_open: crypto_box_open,
  crypto_box_keypair: crypto_box_keypair,
  crypto_hash: crypto_hash,
  crypto_sign: crypto_sign,
  crypto_sign_keypair: crypto_sign_keypair,
  crypto_sign_open: crypto_sign_open,

  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
  crypto_sign_BYTES: crypto_sign_BYTES,
  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
  crypto_hash_BYTES: crypto_hash_BYTES
};

/* High-level API */

function checkLengths(k, n) {
  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

function checkBoxLengths(pk, sk) {
  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

function checkArrayTypes() {
  var t, i;
  for (i = 0; i < arguments.length; i++) {
     if ((t = Object.prototype.toString.call(arguments[i])) !== '[object Uint8Array]')
       throw new TypeError('unexpected type ' + t + ', use Uint8Array');
  }
}

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}

// TODO: Completely remove this in v0.15.
if (!nacl.util) {
  nacl.util = {};
  nacl.util.decodeUTF8 = nacl.util.encodeUTF8 = nacl.util.encodeBase64 = nacl.util.decodeBase64 = function() {
    throw new Error('nacl.util moved into separate package: https://github.com/dchest/tweetnacl-util-js');
  };
}

nacl.randomBytes = function(n) {
  var b = new Uint8Array(n);
  randombytes(b, n);
  return b;
};

nacl.secretbox = function(msg, nonce, key) {
  checkArrayTypes(msg, nonce, key);
  checkLengths(key, nonce);
  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
  var c = new Uint8Array(m.length);
  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
  crypto_secretbox(c, m, m.length, nonce, key);
  return c.subarray(crypto_secretbox_BOXZEROBYTES);
};

nacl.secretbox.open = function(box, nonce, key) {
  checkArrayTypes(box, nonce, key);
  checkLengths(key, nonce);
  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
  var m = new Uint8Array(c.length);
  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
  if (c.length < 32) return false;
  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return false;
  return m.subarray(crypto_secretbox_ZEROBYTES);
};

nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

nacl.scalarMult = function(n, p) {
  checkArrayTypes(n, p);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult(q, n, p);
  return q;
};

nacl.scalarMult.base = function(n) {
  checkArrayTypes(n);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult_base(q, n);
  return q;
};

nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

nacl.box = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox(msg, nonce, k);
};

nacl.box.before = function(publicKey, secretKey) {
  checkArrayTypes(publicKey, secretKey);
  checkBoxLengths(publicKey, secretKey);
  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
  crypto_box_beforenm(k, publicKey, secretKey);
  return k;
};

nacl.box.after = nacl.secretbox;

nacl.box.open = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox.open(msg, nonce, k);
};

nacl.box.open.after = nacl.secretbox.open;

nacl.box.keyPair = function() {
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.box.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  crypto_scalarmult_base(pk, secretKey);
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
nacl.box.nonceLength = crypto_box_NONCEBYTES;
nacl.box.overheadLength = nacl.secretbox.overheadLength;

nacl.sign = function(msg, secretKey) {
  checkArrayTypes(msg, secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
  crypto_sign(signedMsg, msg, msg.length, secretKey);
  return signedMsg;
};

nacl.sign.open = function(signedMsg, publicKey) {
  if (arguments.length !== 2)
    throw new Error('nacl.sign.open accepts 2 arguments; did you mean to use nacl.sign.detached.verify?');
  checkArrayTypes(signedMsg, publicKey);
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var tmp = new Uint8Array(signedMsg.length);
  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
  if (mlen < 0) return null;
  var m = new Uint8Array(mlen);
  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
  return m;
};

nacl.sign.detached = function(msg, secretKey) {
  var signedMsg = nacl.sign(msg, secretKey);
  var sig = new Uint8Array(crypto_sign_BYTES);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
};

nacl.sign.detached.verify = function(msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey);
  if (sig.length !== crypto_sign_BYTES)
    throw new Error('bad signature size');
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
  var i;
  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
};

nacl.sign.keyPair = function() {
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  crypto_sign_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.sign.keyPair.fromSeed = function(seed) {
  checkArrayTypes(seed);
  if (seed.length !== crypto_sign_SEEDBYTES)
    throw new Error('bad seed size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  for (var i = 0; i < 32; i++) sk[i] = seed[i];
  crypto_sign_keypair(pk, sk, true);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
nacl.sign.seedLength = crypto_sign_SEEDBYTES;
nacl.sign.signatureLength = crypto_sign_BYTES;

nacl.hash = function(msg) {
  checkArrayTypes(msg);
  var h = new Uint8Array(crypto_hash_BYTES);
  crypto_hash(h, msg, msg.length);
  return h;
};

nacl.hash.hashLength = crypto_hash_BYTES;

nacl.verify = function(x, y) {
  checkArrayTypes(x, y);
  // Zero length arguments are considered not equal.
  if (x.length === 0 || y.length === 0) return false;
  if (x.length !== y.length) return false;
  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
};

nacl.setPRNG = function(fn) {
  randombytes = fn;
};

(function() {
  // Initialize PRNG if environment provides CSPRNG.
  // If not, methods calling randombytes will throw.
  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
  if (crypto && crypto.getRandomValues) {
    // Browsers.
    var QUOTA = 65536;
    nacl.setPRNG(function(x, n) {
      var i, v = new Uint8Array(n);
      for (i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
      }
      for (i = 0; i < n; i++) x[i] = v[i];
      cleanup(v);
    });
  } else if (true) {
    // Node.js.
    crypto = __nccwpck_require__(6417);
    if (crypto && crypto.randomBytes) {
      nacl.setPRNG(function(x, n) {
        var i, v = crypto.randomBytes(n);
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
      });
    }
  }
})();

})( true && module.exports ? module.exports : (self.nacl = self.nacl || {}));


/***/ }),

/***/ 5027:
/***/ ((__unused_webpack_module, exports) => {

var undefined = (void 0); // Paranoia

// Beyond this value, index getters/setters (i.e. array[0], array[1]) are so slow to
// create, and consume so much memory, that the browser appears frozen.
var MAX_ARRAY_LENGTH = 1e5;

// Approximations of internal ECMAScript conversion functions
var ECMAScript = (function() {
  // Stash a copy in case other scripts modify these
  var opts = Object.prototype.toString,
      ophop = Object.prototype.hasOwnProperty;

  return {
    // Class returns internal [[Class]] property, used to avoid cross-frame instanceof issues:
    Class: function(v) { return opts.call(v).replace(/^\[object *|\]$/g, ''); },
    HasProperty: function(o, p) { return p in o; },
    HasOwnProperty: function(o, p) { return ophop.call(o, p); },
    IsCallable: function(o) { return typeof o === 'function'; },
    ToInt32: function(v) { return v >> 0; },
    ToUint32: function(v) { return v >>> 0; }
  };
}());

// Snapshot intrinsics
var LN2 = Math.LN2,
    abs = Math.abs,
    floor = Math.floor,
    log = Math.log,
    min = Math.min,
    pow = Math.pow,
    round = Math.round;

// ES5: lock down object properties
function configureProperties(obj) {
  if (getOwnPropNames && defineProp) {
    var props = getOwnPropNames(obj), i;
    for (i = 0; i < props.length; i += 1) {
      defineProp(obj, props[i], {
        value: obj[props[i]],
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
}

// emulate ES5 getter/setter API using legacy APIs
// http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
// (second clause tests for Object.defineProperty() in IE<9 that only supports extending DOM prototypes, but
// note that IE<9 does not support __defineGetter__ or __defineSetter__ so it just renders the method harmless)
var defineProp
if (Object.defineProperty && (function() {
      try {
        Object.defineProperty({}, 'x', {});
        return true;
      } catch (e) {
        return false;
      }
    })()) {
  defineProp = Object.defineProperty;
} else {
  defineProp = function(o, p, desc) {
    if (!o === Object(o)) throw new TypeError("Object.defineProperty called on non-object");
    if (ECMAScript.HasProperty(desc, 'get') && Object.prototype.__defineGetter__) { Object.prototype.__defineGetter__.call(o, p, desc.get); }
    if (ECMAScript.HasProperty(desc, 'set') && Object.prototype.__defineSetter__) { Object.prototype.__defineSetter__.call(o, p, desc.set); }
    if (ECMAScript.HasProperty(desc, 'value')) { o[p] = desc.value; }
    return o;
  };
}

var getOwnPropNames = Object.getOwnPropertyNames || function (o) {
  if (o !== Object(o)) throw new TypeError("Object.getOwnPropertyNames called on non-object");
  var props = [], p;
  for (p in o) {
    if (ECMAScript.HasOwnProperty(o, p)) {
      props.push(p);
    }
  }
  return props;
};

// ES5: Make obj[index] an alias for obj._getter(index)/obj._setter(index, value)
// for index in 0 ... obj.length
function makeArrayAccessors(obj) {
  if (!defineProp) { return; }

  if (obj.length > MAX_ARRAY_LENGTH) throw new RangeError("Array too large for polyfill");

  function makeArrayAccessor(index) {
    defineProp(obj, index, {
      'get': function() { return obj._getter(index); },
      'set': function(v) { obj._setter(index, v); },
      enumerable: true,
      configurable: false
    });
  }

  var i;
  for (i = 0; i < obj.length; i += 1) {
    makeArrayAccessor(i);
  }
}

// Internal conversion functions:
//    pack<Type>()   - take a number (interpreted as Type), output a byte array
//    unpack<Type>() - take a byte array, output a Type-like number

function as_signed(value, bits) { var s = 32 - bits; return (value << s) >> s; }
function as_unsigned(value, bits) { var s = 32 - bits; return (value << s) >>> s; }

function packI8(n) { return [n & 0xff]; }
function unpackI8(bytes) { return as_signed(bytes[0], 8); }

function packU8(n) { return [n & 0xff]; }
function unpackU8(bytes) { return as_unsigned(bytes[0], 8); }

function packU8Clamped(n) { n = round(Number(n)); return [n < 0 ? 0 : n > 0xff ? 0xff : n & 0xff]; }

function packI16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
function unpackI16(bytes) { return as_signed(bytes[0] << 8 | bytes[1], 16); }

function packU16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
function unpackU16(bytes) { return as_unsigned(bytes[0] << 8 | bytes[1], 16); }

function packI32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
function unpackI32(bytes) { return as_signed(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }

function packU32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
function unpackU32(bytes) { return as_unsigned(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }

function packIEEE754(v, ebits, fbits) {

  var bias = (1 << (ebits - 1)) - 1,
      s, e, f, ln,
      i, bits, str, bytes;

  function roundToEven(n) {
    var w = floor(n), f = n - w;
    if (f < 0.5)
      return w;
    if (f > 0.5)
      return w + 1;
    return w % 2 ? w + 1 : w;
  }

  // Compute sign, exponent, fraction
  if (v !== v) {
    // NaN
    // http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping
    e = (1 << ebits) - 1; f = pow(2, fbits - 1); s = 0;
  } else if (v === Infinity || v === -Infinity) {
    e = (1 << ebits) - 1; f = 0; s = (v < 0) ? 1 : 0;
  } else if (v === 0) {
    e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
  } else {
    s = v < 0;
    v = abs(v);

    if (v >= pow(2, 1 - bias)) {
      e = min(floor(log(v) / LN2), 1023);
      f = roundToEven(v / pow(2, e) * pow(2, fbits));
      if (f / pow(2, fbits) >= 2) {
        e = e + 1;
        f = 1;
      }
      if (e > bias) {
        // Overflow
        e = (1 << ebits) - 1;
        f = 0;
      } else {
        // Normalized
        e = e + bias;
        f = f - pow(2, fbits);
      }
    } else {
      // Denormalized
      e = 0;
      f = roundToEven(v / pow(2, 1 - bias - fbits));
    }
  }

  // Pack sign, exponent, fraction
  bits = [];
  for (i = fbits; i; i -= 1) { bits.push(f % 2 ? 1 : 0); f = floor(f / 2); }
  for (i = ebits; i; i -= 1) { bits.push(e % 2 ? 1 : 0); e = floor(e / 2); }
  bits.push(s ? 1 : 0);
  bits.reverse();
  str = bits.join('');

  // Bits to bytes
  bytes = [];
  while (str.length) {
    bytes.push(parseInt(str.substring(0, 8), 2));
    str = str.substring(8);
  }
  return bytes;
}

function unpackIEEE754(bytes, ebits, fbits) {

  // Bytes to bits
  var bits = [], i, j, b, str,
      bias, s, e, f;

  for (i = bytes.length; i; i -= 1) {
    b = bytes[i - 1];
    for (j = 8; j; j -= 1) {
      bits.push(b % 2 ? 1 : 0); b = b >> 1;
    }
  }
  bits.reverse();
  str = bits.join('');

  // Unpack sign, exponent, fraction
  bias = (1 << (ebits - 1)) - 1;
  s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
  e = parseInt(str.substring(1, 1 + ebits), 2);
  f = parseInt(str.substring(1 + ebits), 2);

  // Produce number
  if (e === (1 << ebits) - 1) {
    return f !== 0 ? NaN : s * Infinity;
  } else if (e > 0) {
    // Normalized
    return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
  } else if (f !== 0) {
    // Denormalized
    return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
  } else {
    return s < 0 ? -0 : 0;
  }
}

function unpackF64(b) { return unpackIEEE754(b, 11, 52); }
function packF64(v) { return packIEEE754(v, 11, 52); }
function unpackF32(b) { return unpackIEEE754(b, 8, 23); }
function packF32(v) { return packIEEE754(v, 8, 23); }


//
// 3 The ArrayBuffer Type
//

(function() {

  /** @constructor */
  var ArrayBuffer = function ArrayBuffer(length) {
    length = ECMAScript.ToInt32(length);
    if (length < 0) throw new RangeError('ArrayBuffer size is not a small enough positive integer');

    this.byteLength = length;
    this._bytes = [];
    this._bytes.length = length;

    var i;
    for (i = 0; i < this.byteLength; i += 1) {
      this._bytes[i] = 0;
    }

    configureProperties(this);
  };

  exports.eT = exports.eT || ArrayBuffer;

  //
  // 4 The ArrayBufferView Type
  //

  // NOTE: this constructor is not exported
  /** @constructor */
  var ArrayBufferView = function ArrayBufferView() {
    //this.buffer = null;
    //this.byteOffset = 0;
    //this.byteLength = 0;
  };

  //
  // 5 The Typed Array View Types
  //

  function makeConstructor(bytesPerElement, pack, unpack) {
    // Each TypedArray type requires a distinct constructor instance with
    // identical logic, which this produces.

    var ctor;
    ctor = function(buffer, byteOffset, length) {
      var array, sequence, i, s;

      if (!arguments.length || typeof arguments[0] === 'number') {
        // Constructor(unsigned long length)
        this.length = ECMAScript.ToInt32(arguments[0]);
        if (length < 0) throw new RangeError('ArrayBufferView size is not a small enough positive integer');

        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;
      } else if (typeof arguments[0] === 'object' && arguments[0].constructor === ctor) {
        // Constructor(TypedArray array)
        array = arguments[0];

        this.length = array.length;
        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;

        for (i = 0; i < this.length; i += 1) {
          this._setter(i, array._getter(i));
        }
      } else if (typeof arguments[0] === 'object' &&
                 !(arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
        // Constructor(sequence<type> array)
        sequence = arguments[0];

        this.length = ECMAScript.ToUint32(sequence.length);
        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;

        for (i = 0; i < this.length; i += 1) {
          s = sequence[i];
          this._setter(i, Number(s));
        }
      } else if (typeof arguments[0] === 'object' &&
                 (arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
        // Constructor(ArrayBuffer buffer,
        //             optional unsigned long byteOffset, optional unsigned long length)
        this.buffer = buffer;

        this.byteOffset = ECMAScript.ToUint32(byteOffset);
        if (this.byteOffset > this.buffer.byteLength) {
          throw new RangeError("byteOffset out of range");
        }

        if (this.byteOffset % this.BYTES_PER_ELEMENT) {
          // The given byteOffset must be a multiple of the element
          // size of the specific type, otherwise an exception is raised.
          throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
        }

        if (arguments.length < 3) {
          this.byteLength = this.buffer.byteLength - this.byteOffset;

          if (this.byteLength % this.BYTES_PER_ELEMENT) {
            throw new RangeError("length of buffer minus byteOffset not a multiple of the element size");
          }
          this.length = this.byteLength / this.BYTES_PER_ELEMENT;
        } else {
          this.length = ECMAScript.ToUint32(length);
          this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        }

        if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
          throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
        }
      } else {
        throw new TypeError("Unexpected argument type(s)");
      }

      this.constructor = ctor;

      configureProperties(this);
      makeArrayAccessors(this);
    };

    ctor.prototype = new ArrayBufferView();
    ctor.prototype.BYTES_PER_ELEMENT = bytesPerElement;
    ctor.prototype._pack = pack;
    ctor.prototype._unpack = unpack;
    ctor.BYTES_PER_ELEMENT = bytesPerElement;

    // getter type (unsigned long index);
    ctor.prototype._getter = function(index) {
      if (arguments.length < 1) throw new SyntaxError("Not enough arguments");

      index = ECMAScript.ToUint32(index);
      if (index >= this.length) {
        return undefined;
      }

      var bytes = [], i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        bytes.push(this.buffer._bytes[o]);
      }
      return this._unpack(bytes);
    };

    // NONSTANDARD: convenience alias for getter: type get(unsigned long index);
    ctor.prototype.get = ctor.prototype._getter;

    // setter void (unsigned long index, type value);
    ctor.prototype._setter = function(index, value) {
      if (arguments.length < 2) throw new SyntaxError("Not enough arguments");

      index = ECMAScript.ToUint32(index);
      if (index >= this.length) {
        return undefined;
      }

      var bytes = this._pack(value), i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        this.buffer._bytes[o] = bytes[i];
      }
    };

    // void set(TypedArray array, optional unsigned long offset);
    // void set(sequence<type> array, optional unsigned long offset);
    ctor.prototype.set = function(index, value) {
      if (arguments.length < 1) throw new SyntaxError("Not enough arguments");
      var array, sequence, offset, len,
          i, s, d,
          byteOffset, byteLength, tmp;

      if (typeof arguments[0] === 'object' && arguments[0].constructor === this.constructor) {
        // void set(TypedArray array, optional unsigned long offset);
        array = arguments[0];
        offset = ECMAScript.ToUint32(arguments[1]);

        if (offset + array.length > this.length) {
          throw new RangeError("Offset plus length of array is out of range");
        }

        byteOffset = this.byteOffset + offset * this.BYTES_PER_ELEMENT;
        byteLength = array.length * this.BYTES_PER_ELEMENT;

        if (array.buffer === this.buffer) {
          tmp = [];
          for (i = 0, s = array.byteOffset; i < byteLength; i += 1, s += 1) {
            tmp[i] = array.buffer._bytes[s];
          }
          for (i = 0, d = byteOffset; i < byteLength; i += 1, d += 1) {
            this.buffer._bytes[d] = tmp[i];
          }
        } else {
          for (i = 0, s = array.byteOffset, d = byteOffset;
               i < byteLength; i += 1, s += 1, d += 1) {
            this.buffer._bytes[d] = array.buffer._bytes[s];
          }
        }
      } else if (typeof arguments[0] === 'object' && typeof arguments[0].length !== 'undefined') {
        // void set(sequence<type> array, optional unsigned long offset);
        sequence = arguments[0];
        len = ECMAScript.ToUint32(sequence.length);
        offset = ECMAScript.ToUint32(arguments[1]);

        if (offset + len > this.length) {
          throw new RangeError("Offset plus length of array is out of range");
        }

        for (i = 0; i < len; i += 1) {
          s = sequence[i];
          this._setter(offset + i, Number(s));
        }
      } else {
        throw new TypeError("Unexpected argument type(s)");
      }
    };

    // TypedArray subarray(long begin, optional long end);
    ctor.prototype.subarray = function(start, end) {
      function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

      start = ECMAScript.ToInt32(start);
      end = ECMAScript.ToInt32(end);

      if (arguments.length < 1) { start = 0; }
      if (arguments.length < 2) { end = this.length; }

      if (start < 0) { start = this.length + start; }
      if (end < 0) { end = this.length + end; }

      start = clamp(start, 0, this.length);
      end = clamp(end, 0, this.length);

      var len = end - start;
      if (len < 0) {
        len = 0;
      }

      return new this.constructor(
        this.buffer, this.byteOffset + start * this.BYTES_PER_ELEMENT, len);
    };

    return ctor;
  }

  var Int8Array = makeConstructor(1, packI8, unpackI8);
  var Uint8Array = makeConstructor(1, packU8, unpackU8);
  var Uint8ClampedArray = makeConstructor(1, packU8Clamped, unpackU8);
  var Int16Array = makeConstructor(2, packI16, unpackI16);
  var Uint16Array = makeConstructor(2, packU16, unpackU16);
  var Int32Array = makeConstructor(4, packI32, unpackI32);
  var Uint32Array = makeConstructor(4, packU32, unpackU32);
  var Float32Array = makeConstructor(4, packF32, unpackF32);
  var Float64Array = makeConstructor(8, packF64, unpackF64);

  exports.iq = exports.iq || Int8Array;
  exports.U2 = exports.U2 || Uint8Array;
  exports.we = exports.we || Uint8ClampedArray;
  exports.M2 = exports.M2 || Int16Array;
  exports.HA = exports.HA || Uint16Array;
  exports.ZV = exports.ZV || Int32Array;
  exports._R = exports._R || Uint32Array;
  exports.$L = exports.$L || Float32Array;
  exports.I = exports.I || Float64Array;
}());

//
// 6 The DataView View Type
//

(function() {
  function r(array, index) {
    return ECMAScript.IsCallable(array.get) ? array.get(index) : array[index];
  }

  var IS_BIG_ENDIAN = (function() {
    var u16array = new(exports.HA)([0x1234]),
        u8array = new(exports.U2)(u16array.buffer);
    return r(u8array, 0) === 0x12;
  }());

  // Constructor(ArrayBuffer buffer,
  //             optional unsigned long byteOffset,
  //             optional unsigned long byteLength)
  /** @constructor */
  var DataView = function DataView(buffer, byteOffset, byteLength) {
    if (arguments.length === 0) {
      buffer = new exports.eT(0);
    } else if (!(buffer instanceof exports.eT || ECMAScript.Class(buffer) === 'ArrayBuffer')) {
      throw new TypeError("TypeError");
    }

    this.buffer = buffer || new exports.eT(0);

    this.byteOffset = ECMAScript.ToUint32(byteOffset);
    if (this.byteOffset > this.buffer.byteLength) {
      throw new RangeError("byteOffset out of range");
    }

    if (arguments.length < 3) {
      this.byteLength = this.buffer.byteLength - this.byteOffset;
    } else {
      this.byteLength = ECMAScript.ToUint32(byteLength);
    }

    if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
      throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
    }

    configureProperties(this);
  };

  function makeGetter(arrayType) {
    return function(byteOffset, littleEndian) {

      byteOffset = ECMAScript.ToUint32(byteOffset);

      if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
        throw new RangeError("Array index out of range");
      }
      byteOffset += this.byteOffset;

      var uint8Array = new exports.U2(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT),
          bytes = [], i;
      for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
        bytes.push(r(uint8Array, i));
      }

      if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
        bytes.reverse();
      }

      return r(new arrayType(new exports.U2(bytes).buffer), 0);
    };
  }

  DataView.prototype.getUint8 = makeGetter(exports.U2);
  DataView.prototype.getInt8 = makeGetter(exports.iq);
  DataView.prototype.getUint16 = makeGetter(exports.HA);
  DataView.prototype.getInt16 = makeGetter(exports.M2);
  DataView.prototype.getUint32 = makeGetter(exports._R);
  DataView.prototype.getInt32 = makeGetter(exports.ZV);
  DataView.prototype.getFloat32 = makeGetter(exports.$L);
  DataView.prototype.getFloat64 = makeGetter(exports.I);

  function makeSetter(arrayType) {
    return function(byteOffset, value, littleEndian) {

      byteOffset = ECMAScript.ToUint32(byteOffset);
      if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
        throw new RangeError("Array index out of range");
      }

      // Get bytes
      var typeArray = new arrayType([value]),
          byteArray = new exports.U2(typeArray.buffer),
          bytes = [], i, byteView;

      for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
        bytes.push(r(byteArray, i));
      }

      // Flip if necessary
      if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
        bytes.reverse();
      }

      // Write them
      byteView = new exports.U2(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT);
      byteView.set(bytes);
    };
  }

  DataView.prototype.setUint8 = makeSetter(exports.U2);
  DataView.prototype.setInt8 = makeSetter(exports.iq);
  DataView.prototype.setUint16 = makeSetter(exports.HA);
  DataView.prototype.setInt16 = makeSetter(exports.M2);
  DataView.prototype.setUint32 = makeSetter(exports._R);
  DataView.prototype.setInt32 = makeSetter(exports.ZV);
  DataView.prototype.setFloat32 = makeSetter(exports.$L);
  DataView.prototype.setFloat64 = makeSetter(exports.I);

  exports.VO = exports.VO || DataView;

}());


/***/ }),

/***/ 7127:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * For Node.js, simply re-export the core `util.deprecate` function.
 */

module.exports = __nccwpck_require__(1669).deprecate;


/***/ }),

/***/ 4240:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = require(__nccwpck_require__.ab + "build/Release/cpufeatures.node")

/***/ }),

/***/ 9041:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = require(__nccwpck_require__.ab + "lib/protocol/crypto/build/Release/sshcrypto.node")

/***/ }),

/***/ 6447:
/***/ ((module) => {

"use strict";
module.exports = {"i8":"1.9.0"};

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 4293:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 3129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 881:
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

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
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
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
const core = __nccwpck_require__(2186);
const fs = __nccwpck_require__(5747);
const path = __nccwpck_require__(5622);

let Client = __nccwpck_require__(7551);

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
const exclude = core.getInput('exclude')
const debug = core.getInput('debug')

console.log(debug)

const debugLog = debug === "true" ? console.log : () => { }


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

    const parsedAdditionalPaths = (() => {
        try {
            const parsedAdditionalPaths = JSON.parse(additionalPaths)
            return Object.entries(parsedAdditionalPaths)
        }
        catch (e) {
            console.log(e)
            throw "Error parsing addtionalPaths. Make sure it is a valid JSON object (key/ value pairs)."
        }
    })()

    const parsedExclude = (() => {
        try {
            return JSON.parse(exclude)
        }
        catch (e) {
            console.log(e)
            throw "Error parsing exlcude. Make sure it is a valid Array of strings."
        }
    })()

    await processPath(localPath, remotePath, parsedExclude) //TODO: Instead of localPath, remotePath use key/value to uplaod multiple files at once.

    for (const [local, remote] of parsedAdditionalPaths) {
        await processPath(local, remote, parsedExclude)
    }

}).then(() => {
    console.log("Upload finished.");
    return sftp.end();
}).catch(err => {
    core.setFailed(`Action failed with error ${err}`);
    process.exit(1);
});

async function processPath(local, remote, exclude = []) {
    console.log("Uploading: " + local + " to " + remote)

    if (fs.lstatSync(local).isDirectory()) {
        return sftp.uploadDir(local, remote, (path, isDir) => {
            const isUploaded = !exclude.includes(path)
            debugLog("Path: " + path + " dir: " + isDir + ". Uploaded: " + isUploaded)
            return isUploaded
        });
    } else {

        var directory = await sftp.realPath(path.dirname(remote));
        if (!(await sftp.exists(directory))) {
            await sftp.mkdir(directory, true);
            console.log("Created directory. " + directory);
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