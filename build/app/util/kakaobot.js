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
exports.sendKaKaoEventAPI = void 0;
const logger_1 = require("./logger");
const kconfig = require("./kakaoconfig");
const request = require("request");
function sendKaKaoEventAPI(eventName, userId, msg, flag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiUrl = kconfig.returnbase(flag);
            const apiKey = kconfig.returnApiKey(flag);
            logger_1.default.info(`apiUrl : ${apiUrl}`);
            logger_1.default.info(`apiKey : ${apiKey}`);
            let eventReq = {
                "name": eventName,
                "data": {
                    "msg": msg // ${msg} 말풍선 : {{#current.event.data.paramName}} => {{#current.event.data.msg}} => 파라미터 동일하게 설정
                }
            };
            // ${userId}, ex) {"type": "botUserKey", "id": "fdc236a66636a5f21bcdf3b4589ac2318b3373528cbdcb5c2362f3cc7a4c3f05c9"} 
            /* two more values
              [
                {"type": "botUserKey", "id": "fdc236a66636a5f21bcdf3b4589ac2318b3373528cbdcb5c2362f3cc7a4c3f05c9"},
                {"type": "botUserKey", "id": "fdc236a66636a5f21bcdf3b4589ac2318b3373528cbdcb5c2362f3cc7a4c3f05c9"}
              ]
        
            */
            let userReq = [
                { "type": "botUserKey", "id": userId }
            ];
            let paramReq = {
                "foo": "bar"
            };
            const data = {
                event: eventReq,
                user: userReq,
                params: paramReq
            };
            const options = {
                url: apiUrl,
                method: 'POST',
                headers: {
                    Authorization: 'KakaoAK ' + apiKey,
                    'Content-type': 'application/json',
                },
                body: data,
                json: true
            };
            //console.log('fullUrl:', fullUrl)
            return new Promise((resolve, reject) => {
                request(options, (err, res, body) => {
                    if (err) {
                        logger_1.default.info(err);
                        resolve({ ok: false, err });
                    }
                    else {
                        logger_1.default.info('status: ', res);
                        resolve({ ok: true, err: null });
                    }
                });
            })
                .catch((err) => {
                return { ok: false, err };
            });
        }
        catch (err) {
            logger_1.default.info(err);
        }
    });
}
exports.sendKaKaoEventAPI = sendKaKaoEventAPI;
