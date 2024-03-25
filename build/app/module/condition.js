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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipAllowedCheck = void 0;
const logger_1 = require("../util/logger");
function ipAllowedCheck(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`ip check`);
        //const trustedIps: Array<String> = config.get('ip-allowed');
        //test 용
        const trustedIps = [
            "124.53.181.155",
            "121.133.22.1",
            "39.7.230.144",
            "175.113.222.237",
            "121.134.203.253",
            "127.0.0.1",
            "112.148.58.7",
            "59.13.41.118",
            "208.59.113.218",
            "119.196.236.36",
            "122.202.248.232",
            "210.222.5.249",
            "23.20.108.250",
            "219.254.222.213"
        ];
        logger_1.default.info(`ip: ${trustedIps}`);
        var requestIP = ctx.ip;
        logger_1.default.info(`ip-req: ${requestIP}`);
        if (trustedIps.indexOf(requestIP) >= 0) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.ipAllowedCheck = ipAllowedCheck;
