"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var spawn = require('child_process').spawn;
var parser = require('xml2json');
var jp = require('jsonpath');
var os = require('os');
function setHandlers(win) {
    var _this = this;
    electron_1.ipcMain.on('get-app-list', function (event, args) { return __awaiter(_this, void 0, void 0, function () {
        var platform, apps, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    platform = os.platform();
                    apps = [];
                    _a = platform;
                    switch (_a) {
                        case 'darwin': return [3 /*break*/, 1];
                        case 'linux': return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, getApplistMac()];
                case 2:
                    apps = _b.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, getApplistLinux()];
                case 4:
                    apps = _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 6];
                case 6:
                    event.reply('app-list-get', apps);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.setHandlers = setHandlers;
/**
 * Gets list of apps available in applications folder
 */
function getApplistMac() {
    return new Promise(function (resolve, reject) {
        var sp = spawn('system_profiler', ['-xml', 'SPApplicationsDataType']);
        var apps = "";
        var relApps = [];
        sp.stdout.setEncoding('utf-8');
        sp.stdout.on('data', function (data) {
            console.log("DATA------------");
            apps += data;
            console.log("DATA------------");
        });
        sp.stderr.on('data', function (data) {
            console.log("stderr: " + data);
            reject(data);
        });
        sp.on('close', function (code) {
            var result = parser.toJson(apps, { object: true });
            jp
                .query(result, 'plist.array.dict.array[1].dict')
                .map(function (res) {
                res.forEach(function (r) {
                    var name = r.string[0];
                    var path = r.string[3];
                    var relRegex = /^\/Application/;
                    if (relRegex.test(path)) {
                        relApps.push({
                            name: name, path: path
                        });
                        console.log(name, path);
                    }
                });
            });
            resolve(relApps);
        });
    });
}
function getApplistLinux() {
    return new Promise(function (resolve, reject) {
        resolve([]);
    });
}
//# sourceMappingURL=handlers.js.map