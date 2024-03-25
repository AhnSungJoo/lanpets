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
exports.sendSlackWebHook = void 0;
const logger_1 = require("../util/logger");
const slackHook = require("@slack/webhook");
const slackconfig_1 = require("./slackconfig");
function sendSlackWebHook(msg, botType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = (0, slackconfig_1.returnURL)(botType); // 프로불편러 or 얼마빌렸지
            const webhook = new slackHook.IncomingWebhook(url);
            yield webhook.send({
                text: msg,
            });
        }
        catch (err) {
            logger_1.default.info(err);
        }
    });
}
exports.sendSlackWebHook = sendSlackWebHook;
