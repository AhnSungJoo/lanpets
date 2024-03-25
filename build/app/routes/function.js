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
const moment = require("moment");
const cron = require("node-cron");
// import * as emoji from 'telegram-emoji-map';
const logger_1 = require("../util/logger");
// dao
const signalDAO_1 = require("../dao/signalDAO");
const complainUserDAO_1 = require("../dao/complainUserDAO");
const complainLogDAO_1 = require("../dao/complainLogDAO");
// condition
const condition_1 = require("../module/condition");
const slackbot_1 = require("../util/slackbot");
const kakaobot_1 = require("../util/kakaobot");
const router = new Router();
router.use(function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const ipFlag = yield (0, condition_1.ipAllowedCheck)(ctx);
        if (ipFlag) {
            return next();
        }
        else {
            logger_1.default.info(`not allowed user access ip: ${ctx.ip}`);
            return ctx.render('error', { message: "Not Allowed User" });
        }
    });
});
router.get('/sendmsg', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const forum = 'test';
    return ctx.render('sendmsg', { forum });
}));
router.get('/sendKakaomsg', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const forum = 'test';
    return ctx.render('sendKakaomsg', { forum });
}));
// 특정 고객 포인트 변경(불편사항 퀄리티에 따라 변경)
router.post('/changePoint', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const targetNo = ctx.request.body.no; // 변경할 불편사항 접수번호 
    const userId = ctx.request.body.kakaoId; // 사용자 id
    const afterPoint = ctx.request.body.pointVal; // 변경할 포인트 
    const beforePoint = ctx.request.body.beforePoint; // 변경전 포인트
    let pointTotal = 0;
    pointTotal = afterPoint - beforePoint;
    let curPoint = 0;
    const complainerDAO = new complainUserDAO_1.default();
    const prevPoint = yield complainerDAO.getUserPoint(userId);
    const complainDAO = new signalDAO_1.default('complainer');
    yield complainDAO.updateComplainPoint(targetNo, userId, afterPoint); // 포인트를 변경할 불편사항 업데이트
    curPoint = prevPoint['point_total'] + pointTotal;
    yield complainerDAO.changePointNotIncome(userId, curPoint); // 사용자의 총 포인트 변경
    return ctx.body = { result: true, msg: `포인트가 변경되었습니다. 사용자의 누적포인트: ${prevPoint['point_total']} -> ${curPoint}` };
}));
// 특정 고객 포인트 차감(출금신청 후 포인트 차감)
router.post('/minusPoint', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.kakaoId;
    const pointVal = ctx.request.body.pointVal;
    const pointFlag = ctx.request.body.pointFlag;
    let curPoint = 0;
    let msg = '';
    const complainerDAO = new complainUserDAO_1.default();
    const prevPoint = yield complainerDAO.getUserPoint(userId);
    if (pointVal > prevPoint['point_total']) {
        return ctx.body = { result: false, msg: "차감할 포인트가 사용자의 포인트보다 많습니다." };
    }
    curPoint = prevPoint['point_total'] - pointVal;
    if (pointFlag == 'both') {
        // 포인트 차감 및 출금신청 1->0으로 초기화 
        yield complainerDAO.changePoint(userId, curPoint);
        msg = `${userId}의 포인트가 ${pointVal}만큼 차감되어 현재 포인트는 ${curPoint}입니다. / 출금신청 초기화 완료됐습니다.`;
    }
    else {
        yield complainerDAO.changeOnlyPoint(userId, curPoint);
        msg = `${userId}의 포인트가 ${pointVal}만큼 차감되어 현재 포인트는 ${curPoint}입니다. / 출금신청 값은 변경되지 않습니다.`;
    }
    return ctx.body = { result: true, msg };
}));
// 특정 고객 포인트 추가(접수된 불편 확인 후 포인트 추가)
router.post('/plusPoint', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.kakaoId;
    const pointVal = ctx.request.body.pointVal;
    logger_1.default.info(`point : ${pointVal}`);
    let curPoint = 0;
    const complainerDAO = new complainUserDAO_1.default();
    const prevPoint = yield complainerDAO.getUserPoint(userId);
    curPoint = Number(prevPoint['point_total']) + Number(pointVal);
    logger_1.default.info(`point2 : ${prevPoint}`);
    yield complainerDAO.changePoint(userId, curPoint);
    return ctx.body = { result: true, msg: `${userId}의 포인트가 ${pointVal}만큼 추가되어 현재 포인트는 ${curPoint}입니다. / 출금신청 초기화 완료됐습니다.` };
}));
// /overview/outcome.ejs => 출금신청 완료
router.post('/changeflag', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const kakaoId = ctx.request.body.kakaoId;
    const complainerDAO = new complainUserDAO_1.default();
    const userId = yield complainerDAO.updateIncomeRequest(kakaoId, 0);
    return ctx.redirect('/overview/outcome');
}));
router.post('/serachKakaoId', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refCode = ctx.request.body.data;
    const complainerDAO = new complainUserDAO_1.default();
    const userId = yield complainerDAO.getUserIdUseRefCode(refCode);
    return ctx.body = { status: 'success', userId };
}));
router.post('/sendKakaoMsgComplainer', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.kakaoId;
    const msg = ctx.request.body.msg;
    yield (0, kakaobot_1.sendKaKaoEventAPI)("event_test", userId, msg, "complainer");
    return ctx.redirect('/function/sendKakaomsg');
}));
router.post('/sendKakaoMsgKookmin', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.kakaoId;
    let msg = ctx.request.body.msg;
    yield (0, kakaobot_1.sendKaKaoEventAPI)("kookmin_event", userId, msg, "kookmin");
    return ctx.redirect('/function/sendKakaomsg');
}));
router.post('/devtest', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    const testVal = 'is it okay ?'
    await sendKaKaoEventAPI("event_test", "fdc236a66636a5f21bcdf3b4589ac2318b3373528cbdcb5c2362f3cc7a4c3f05c9", "33");
    */
    //await sendSlackWebHook('👩🏻 “프로불편러”에 프로필 정보 등록 완료!','complain');
    let today = moment().format('YYYY-MM-DD');
    const logsDAO = new complainLogDAO_1.default();
    const complainDAO = new signalDAO_1.default('complainer');
    const usersDAO = new complainUserDAO_1.default();
    const todayLog = yield logsDAO.getTodayAllData(today);
    const todayComlains = yield complainDAO.getTodayComplain();
    const todayUsers = yield usersDAO.getTodayComplain();
    let msg = `오늘의 불편 작성 📝 : ${todayComlains[0]['cnt']}
오늘의 프로필등록 👩🏻: ${todayUsers[0]['cnt']}
오늘 메뉴클릭 수 => 출금신청: ${todayLog[0]['request_income']}, 불편작성: ${todayLog[0]['register_complain']}, 추천인코드 등록: ${todayLog[0]['register_refCode']},
                이번달 인기키워드: ${todayLog[0]['monthly_keywords']}, 친구초대 이벤트: ${todayLog[0]['invite_friend']}`;
    // logger.info(`${msg}`);
    return ctx.body = { status: 'success' };
}));
// 스케줄 봇 
const job = cron.schedule('55 59 23 * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info('job 실행');
        let today = moment().format('YYYY-MM-DD');
        const logsDAO = new complainLogDAO_1.default();
        const complainDAO = new signalDAO_1.default('complainer');
        const usersDAO = new complainUserDAO_1.default();
        const todayLog = yield logsDAO.getTodayAllData(today);
        const todayComlains = yield complainDAO.getTodayComplain();
        const todayUsers = yield usersDAO.getTodayComplain();
        let msg = `오늘의 불편 작성 📝 : ${todayComlains[0]['cnt']}
오늘의 프로필등록 👩🏻: ${todayUsers[0]['cnt']}
오늘 메뉴클릭 수 => 출금신청: ${todayLog[0]['request_income']}, 불편작성: ${todayLog[0]['register_complain']}, 추천인코드 등록: ${todayLog[0]['register_refCode']},
                이번달 인기키워드: ${todayLog[0]['monthly_keywords']}, 친구초대 이벤트: ${todayLog[0]['invite_friend']}`;
        try {
            yield (0, slackbot_1.sendSlackWebHook)(msg, 'complain');
        }
        catch (err) {
            logger_1.default.info(`chat err : ${err}`);
        }
    });
});
exports.default = router;
