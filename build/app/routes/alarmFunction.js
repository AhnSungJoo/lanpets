'use strict';
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
const Router = require("koa-router");
// dao
const kookminAlarmDAO_1 = require("../dao/kookminAlarmDAO");
const router = new Router();
// 알림 삭제하기
router.post('/deleteAlarm', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const targetNo = ctx.request.body.no; // 변경할 불편사항 접수번호 
    let resutlJson;
    let koominDAO = new kookminAlarmDAO_1.default();
    let userResult = yield koominDAO.deleteAlarmData(targetNo);
    return ctx.redirect('/overview/kookminAlarm');
}));
// 양식 및 괄호 제거
function refineMsg(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        msg = msg.trim();
        if (msg.indexOf('양식:') != -1) {
            msg = msg.replace("양식:", "");
        }
        if (msg.indexOf(',') != -1) {
            msg = msg.replace(/,/gi, "");
        }
        if (msg.indexOf('(') != -1) {
            msg = msg.replace("(", "");
        }
        if (msg.indexOf(')') != -1) {
            msg = msg.replace(")", "");
        }
        if (msg.indexOf('내정보') != -1) {
            msg = msg.replace("내정보", "");
        }
        if (msg.indexOf('상대정보') != -1) {
            msg = msg.replace("상대정보", "");
        }
        if (msg.indexOf('정보등록') != -1) {
            msg = msg.replace("정보등록", "");
        }
        if (msg.indexOf('번호') != -1) {
            msg = msg.replace("번호", "");
        }
        if (msg.indexOf(':') != -1) {
            msg = msg.replace(":", "");
        }
        return msg;
    });
}
exports.default = router;
