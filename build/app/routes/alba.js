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
// import * as emoji from 'telegram-emoji-map';
const logger_1 = require("../util/logger");
// dao
const albaReviewDAO_1 = require("../dao/albaReviewDAO");
const router = new Router();
// 후기등록
router.post('/registerReview', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('alba');
    let toUserMsg = `근무하셨던 업체의 상호와 지점을 알려주세요. (형식: OO편의점 ㅇㅇ점 근무)`;
    let resutlJson = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": toUserMsg
                    }
                }
            ]
        }
    };
    ctx.body = resutlJson;
}));
// 후기삭제
router.post('/deleteReview', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('alba');
    const userId = ctx.request.body.userRequest.user.id;
    let fromUserMsg = ctx.request.body.userRequest.utterance;
    ;
    let toUserMsg = '';
    const alDAO = new albaReviewDAO_1.default();
    const cnt = yield alDAO.checkAlbaReview(userId);
    if (cnt['cnt'] == 0) {
        toUserMsg = '등록하신 알바후기가 없습니다.';
    }
    else {
        const resultData = yield alDAO.getAlbaReview(userId);
        toUserMsg = '아래의 후기 중 삭제하실 후기를 선택해주세요. (형식: 후기삭제, 1)\n';
        for (let i = 0; i < resultData.length; i++) {
            let tempData = resultData[i];
            toUserMsg += `${i + 1}번째 후기 ${tempData['alba_review_content']}\n`;
        }
    }
    let resutlJson = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": toUserMsg
                    }
                }
            ]
        }
    };
    ctx.body = resutlJson;
}));
// 신청서 작성
router.post('/writeReview', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('alba222');
    const userId = ctx.request.body.userRequest.user.id;
    let fromUserMsg = ctx.request.body.userRequest.utterance;
    ;
    let toUserMsg = '';
    let resutlJson;
    if (fromUserMsg.trim().indexOf('시') != -1 && fromUserMsg.trim().indexOf('구') != -1 && fromUserMsg.trim().indexOf('동') != -1) {
        try {
            const alDAO = new albaReviewDAO_1.default();
            yield alDAO.insertAlbaReview(userId, fromUserMsg);
            toUserMsg = `근무하셨던 업체의 상호명 및 지점명을 알려주세요. (형식: OO편의점 역삼점 근무)`;
            resutlJson = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": toUserMsg
                            }
                        }
                    ]
                }
            };
        }
        catch (err) {
            toUserMsg = `후기 작성 중 오류가 발생했습니다.\n형식에 맞게 다시 작성해주세요.`;
            resutlJson = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": toUserMsg
                            }
                        }
                    ]
                }
            };
        }
    }
    else if (fromUserMsg.trim().indexOf('근무') != -1) {
        try {
            const alDAO = new albaReviewDAO_1.default();
            yield alDAO.updateAlbaCompany(userId, fromUserMsg);
            toUserMsg = `알바 후기를 작성해주세요.(형식: 후기작성, 이곳은 어땟어요!) `;
            resutlJson = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": toUserMsg
                            }
                        }
                    ]
                }
            };
        }
        catch (err) {
            toUserMsg = `후기 작성 중 오류가 발생했습니다.\n형식에 맞게 다시 작성해주세요.`;
            resutlJson = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": toUserMsg
                            }
                        }
                    ]
                }
            };
        }
    }
    else if (fromUserMsg.trim().indexOf('후기작성') != -1) {
        try {
            let startIdx = fromUserMsg.indexOf(',');
            let endIdx = fromUserMsg.length;
            let review = fromUserMsg.substring(startIdx + 1, endIdx);
            review = review.trim();
            const alDAO = new albaReviewDAO_1.default();
            yield alDAO.updateAlbaReview(userId, review);
            toUserMsg = `후기작성이 완료됐습니다.\n근무경력 인증을 위해 하단의 인증하기 버튼을 눌러 인증을 진행해주셔야 정상적으로 등록이 완료됩니다.`;
            resutlJson = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "basicCard": {
                                "title": "",
                                "description": toUserMsg,
                                "buttons": [
                                    {
                                        "action": "webLink",
                                        "label": "인증하기",
                                        "webLinkUrl": "https://forms.gle/1fg6t11eYWnr39GU6"
                                    }
                                ]
                            }
                        }
                    ]
                }
            };
        }
        catch (err) {
            toUserMsg = `후기 작성 중 오류가 발생했습니다.\n형식에 맞게 다시 작성해주세요.`;
            resutlJson = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": toUserMsg
                            }
                        }
                    ]
                }
            };
        }
    }
    else if (fromUserMsg.trim().indexOf('후기삭제') != -1) {
        try {
            let startIdx = fromUserMsg.indexOf(',');
            let endIdx = fromUserMsg.length;
            let idx = fromUserMsg.substring(startIdx + 1, endIdx);
            idx = idx.trim();
            logger_1.default.info(idx);
            const alDAO = new albaReviewDAO_1.default();
            const cnt = yield alDAO.checkAlbaReview(userId);
            if (cnt['cnt'] == 0) {
                toUserMsg = '등록하신 알바후기가 없습니다.';
            }
            else {
                const resultData = yield alDAO.getAlbaReview(userId);
                const review = resultData[idx - 1]['alba_review_content'];
                yield alDAO.updateAlbaDelete(userId, review);
                toUserMsg = `후기삭제 요청이 완료됐습니다. 관리자 확인 후 3영업일내에 리뷰가 삭제됩니다.`;
            }
            resutlJson = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": toUserMsg
                            }
                        }
                    ]
                }
            };
        }
        catch (err) {
            toUserMsg = `후기 삭제 중 오류가 발생했습니다.\n형식에 맞게 다시 작성해주세요.`;
            resutlJson = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": toUserMsg
                            }
                        }
                    ]
                }
            };
        }
    }
    else {
        toUserMsg = `후기 작성 중 오류가 발생했습니다.\n형식에 맞게 다시 작성해주세요.`;
        resutlJson = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": toUserMsg
                        }
                    }
                ]
            }
        };
    }
    ctx.body = resutlJson;
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
