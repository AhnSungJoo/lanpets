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
// import * as emoji from 'telegram-emoji-map';
const logger_1 = require("../util/logger");
// dao
const adsRewardDAO_1 = require("../dao/adsRewardDAO");
// module 
const kakaobot_1 = require("../util/kakaobot");
const router = new Router();
// 키워드 등록 시작
router.post('/registerKeyword', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('start to register keyword');
    const userId = ctx.request.body.userRequest.user.id;
    let fromUserMsg = ctx.request.body.userRequest.utterance;
    ;
    let toUserMsg = ``;
    const adsRewardDAO = new adsRewardDAO_1.default();
    const existUser = yield adsRewardDAO.checkExistUser(userId);
    logger_1.default.info(`userid: ${fromUserMsg}`);
    let userMsg = `💁🏻‍♂️ 관심 키워드 번호를 아래 채팅창에 모두 입력해주세요:)
✓ 숫자 2개 이상 입력    
✓ 숫자간 구별 부호 필수 : 쉼표(,)
▶︎ 예시 - 1, 2, 5`;
    ctx.body = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "basicCard": {
                        "description": userMsg,
                        "thumbnail": {
                            "imageUrl": "https://i.ibb.co/Qdrnz6b/001-1.png"
                        }
                    }
                }
            ]
        }
    };
}));
// 기본정보입력 - 나이
router.post('/inputAge', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('inputInfo AGe');
    const userId = ctx.request.body.userRequest.user.id;
    let fromUserMsg = ctx.request.body.userRequest.utterance;
    ;
    let toUserMsg = ``;
    const adsRewardDAO = new adsRewardDAO_1.default();
    const existUser = yield adsRewardDAO.checkExistUser(userId);
    logger_1.default.info(`userid: ${fromUserMsg}`);
    if (fromUserMsg.trim().indexOf('프로필 등록') != -1) {
        logger_1.default.info('here');
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": '연령대를 선택해주세요. (등록 1/4)'
                        }
                    }
                ],
                "quickReplies": [
                    {
                        "messageText": "10대",
                        "action": "message",
                        "label": "10대"
                    },
                    {
                        "messageText": "20대",
                        "action": "message",
                        "label": "20대"
                    },
                    {
                        "messageText": "30대",
                        "action": "message",
                        "label": "30대"
                    },
                    {
                        "messageText": "40대 이상",
                        "action": "message",
                        "label": "40대 이상"
                    }
                ]
            }
        };
    }
    else if (fromUserMsg.trim().indexOf('대') != -1) {
        let age = fromUserMsg.substring(0, 2);
        logger_1.default.info(`age right? ${age}`);
        if (existUser['cnt'] == 0) {
            yield adsRewardDAO.insertRewardUserAge(userId, age);
        }
        else {
            yield adsRewardDAO.updateRewardUserAge(userId, age);
        }
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": '💁🏻‍♂️ 성별을 선택해주세요. (등록 2/4)'
                        }
                    }
                ],
                "quickReplies": [
                    {
                        "messageText": "남자",
                        "action": "message",
                        "label": "남자"
                    },
                    {
                        "messageText": "여자",
                        "action": "message",
                        "label": "여자"
                    }
                ]
            }
        };
    }
}));
// 기본정보입력 - 성별
router.post('/inputSex', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('inputInfo Sex');
    const userId = ctx.request.body.userRequest.user.id;
    let fromUserMsg = ctx.request.body.userRequest.utterance;
    ;
    let toUserMsg = ``;
    const adsRewardDAO = new adsRewardDAO_1.default();
    // 불편테이블 추가
    const existUser = yield adsRewardDAO.checkExistUser(userId);
    logger_1.default.info(`userid: ${userId}`);
    if (fromUserMsg.trim().indexOf('성별') != -1) {
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": '💁🏻‍♂️ 성별을 선택해주세요. (등록 2/4)'
                        }
                    }
                ],
                "quickReplies": [
                    {
                        "messageText": "남자",
                        "action": "message",
                        "label": "남자"
                    },
                    {
                        "messageText": "여자",
                        "action": "message",
                        "label": "여자"
                    }
                ]
            }
        };
    }
    else if (fromUserMsg.trim().indexOf('자') != -1) {
        let sex = fromUserMsg.substring(0, 1);
        logger_1.default.info(`sex right? ${sex}`);
        if (sex == '남') {
            sex = 1;
        }
        else {
            sex = 0;
        }
        logger_1.default.info(`sex value right? ${sex}`);
        if (existUser['cnt'] == 0) {
            yield adsRewardDAO.insertRewardUserSex(userId, sex);
        }
        else {
            yield adsRewardDAO.updateRewardUserSex(userId, sex);
        }
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": '💁🏻‍♂️ 직업을 선택해주세요. (등록 3/4)'
                        }
                    }
                ],
                "quickReplies": [
                    {
                        "messageText": "직장인",
                        "action": "message",
                        "label": "직장인"
                    },
                    {
                        "messageText": "사업가",
                        "action": "message",
                        "label": "사업가"
                    },
                    {
                        "messageText": "학생",
                        "action": "message",
                        "label": "학생"
                    },
                    {
                        "messageText": "주부",
                        "action": "message",
                        "label": "주부"
                    },
                    {
                        "messageText": "무직",
                        "action": "message",
                        "label": "무직"
                    },
                    {
                        "messageText": "기타",
                        "action": "message",
                        "label": "기타"
                    }
                ]
            }
        };
    }
}));
// 기본정보입력 - 직업
router.post('/inputJob', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('inputInfo Job');
    const userId = ctx.request.body.userRequest.user.id;
    let fromUserMsg = ctx.request.body.userRequest.utterance;
    ;
    let toUserMsg = ``;
    const adsRewardDAO = new adsRewardDAO_1.default();
    // 불편테이블 추가
    const existUser = yield adsRewardDAO.checkExistUser(userId);
    logger_1.default.info(`userid: ${userId}`);
    if (fromUserMsg.trim().indexOf('직업') != -1) {
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": '💁🏻‍♂️ 직업을 선택해주세요. (등록 3/4)'
                        }
                    }
                ],
                "quickReplies": [
                    {
                        "messageText": "직장인",
                        "action": "message",
                        "label": "직장인"
                    },
                    {
                        "messageText": "사업가",
                        "action": "message",
                        "label": "사업가"
                    },
                    {
                        "messageText": "학생",
                        "action": "message",
                        "label": "학생"
                    },
                    {
                        "messageText": "주부",
                        "action": "message",
                        "label": "주부"
                    },
                    {
                        "messageText": "무직",
                        "action": "message",
                        "label": "무직"
                    },
                    {
                        "messageText": "기타",
                        "action": "message",
                        "label": "기타"
                    }
                ]
            }
        };
    }
    else if (fromUserMsg.trim().indexOf('직장인') != -1 || fromUserMsg.trim().indexOf('사업가') != -1 ||
        fromUserMsg.trim().indexOf('학생') != -1 || fromUserMsg.trim().indexOf('주부') != -1 ||
        fromUserMsg.trim().indexOf('무직') != -1 || fromUserMsg.trim().indexOf('기타') != -1) {
        const job = fromUserMsg.trim();
        logger_1.default.info(`job right? ${job}`);
        if (existUser['cnt'] == 0) {
            yield adsRewardDAO.insertRewardUserJob(userId, job);
        }
        else {
            yield adsRewardDAO.updateRewardUserJob(userId, job);
        }
        let userMsg = `💁🏻‍♂️ 입력한 키워드와 관련된 광고 소식을 받아 보길 원하시면, 핸드폰 번호를 입력해주세요.(4/4)`;
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": userMsg
                        }
                    }
                ]
            }
        };
    }
}));
// 풀백함수를 이용 키워드, 번호 입력받기 
router.post('/fullback', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('inputInfo Job');
    const userId = ctx.request.body.userRequest.user.id;
    let fromUserMsg = ctx.request.body.userRequest.utterance;
    ;
    let toUserMsg = ``;
    const adsRewardDAO = new adsRewardDAO_1.default();
    // 불편테이블 추가
    const existUser = yield adsRewardDAO.checkExistUser(userId);
    if (fromUserMsg.trim().indexOf(',') != -1) {
        // 키워드 입력
        if (existUser['cnt'] == 0) {
            yield adsRewardDAO.insertRewardUserkeywords(userId, fromUserMsg);
            ctx.body = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": '💁🏻‍♂️ 연령대를 선택해주세요. (등록 1/4)'
                            }
                        }
                    ],
                    "quickReplies": [
                        {
                            "messageText": "10대",
                            "action": "message",
                            "label": "10대"
                        },
                        {
                            "messageText": "20대",
                            "action": "message",
                            "label": "20대"
                        },
                        {
                            "messageText": "30대",
                            "action": "message",
                            "label": "30대"
                        },
                        {
                            "messageText": "40대 이상",
                            "action": "message",
                            "label": "40대 이상"
                        }
                    ]
                }
            };
        }
        else {
            yield adsRewardDAO.updateRewardUserkeywords(userId, fromUserMsg);
            let userMsg = `✅ 고객님의 관심 키워드 등록이 완료 되었습니다.
(현재 ‘스타트업 서비스’ 관련 광고 소식만 받아볼 수 있으며, 향후 다양한 키워드로 늘려나갈 예정입니다)`;
            ctx.body = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": userMsg
                            }
                        }
                    ]
                }
            };
        }
    }
    else if (fromUserMsg.trim().indexOf('01') != -1) {
        let userMsg = '';
        if (fromUserMsg.trim().length >= 11) {
            // 키워드 입력
            if (existUser['cnt'] == 0) {
                yield adsRewardDAO.insertRewardUserTelno(userId, fromUserMsg);
            }
            else {
                const telno = yield adsRewardDAO.getRewardUserTelno(userId);
                if (!telno[0]['telno']) {
                    // 키워드 등록시 3000포인트 적립
                    const prevPoint = yield adsRewardDAO.getUserPoint(userId);
                    let tempTotalPoint = prevPoint['point_total'] + 3000;
                    yield adsRewardDAO.updateAdsUserOnlyPoint(userId, tempTotalPoint);
                    userMsg = `✅ 고객님의 관심 키워드 등록이 완료 되었습니다.
  (현재 ‘스타트업 서비스’ 관련 광고 소식만 받아볼 수 있으며, 향후 다양한 키워드로 늘려나갈 예정입니다)

  첫 캐시 적립(3,000P)을 축하드립니다!
  (단, 현금 출금 신청시 보유하신 캐시는 100P당 10원으로 전환된다는 점 안내드립니다.)`;
                }
                else {
                    userMsg = `✅ 고객님의 관심 키워드 등록이 완료 되었습니다.
(현재 ‘스타트업 서비스’ 관련 광고 소식만 받아볼 수 있으며, 향후 다양한 키워드로 늘려나갈 예정입니다)`;
                }
                yield adsRewardDAO.updateRewardUserTelno(userId, fromUserMsg);
            }
        }
        else {
            userMsg = `⚠️핸드폰 번호를 모두 입력해주셔야 키워드 등록이 정상적으로 가능합니다.`;
        }
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": userMsg
                        }
                    }
                ]
            }
        };
    }
    else if (fromUserMsg.trim().indexOf('모음') != -1) {
        const userId = ctx.request.body.userRequest.user.id;
        const adsRewardDAO = new adsRewardDAO_1.default();
        let fromUserMsg = ctx.request.body.userRequest.utterance;
        let toUserMsg = ``;
        const prevPoint = yield adsRewardDAO.getUserPoint(userId);
        const prevAnsCnt = yield adsRewardDAO.getUserAnswerCnt(userId);
        const prevUpdate = yield adsRewardDAO.getUserPointDate(userId);
        let today = moment().format('YYYY-MM-DD');
        let pointDate = moment(prevUpdate['point_update_date']).format('YYYY-MM-DD');
        const flag = prevPoint['point_total'] == 0 && prevAnsCnt['answer_cnt'] == 0;
        logger_1.default.info(`${today == pointDate}, ${flag}`);
        const prevAns = yield adsRewardDAO.getUserBeforeAnswer(userId);
        const prevAnswer = prevAns['before_answer'];
        logger_1.default.info(`${prevAnswer.trim()}, ${fromUserMsg.trim()}`);
        if (fromUserMsg.trim() == prevAnswer.trim()) {
            toUserMsg = `이미 참여하신 퀴즈입니다. 다음 광고를 기대해주세요🤗`;
        }
        else {
            let tempTotalPoint = prevPoint['point_total'] + 1000;
            yield adsRewardDAO.updateAdsUserPoint(userId, tempTotalPoint, prevAnsCnt['answer_cnt'] + 1);
            yield adsRewardDAO.updateAdsUserAnswer(userId, fromUserMsg.trim());
            toUserMsg = `👏🏻 정답입니다! 1000포인트 적립되었습니다.`;
        }
        ctx.body = {
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
    else {
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "basicCard": {
                            "description": '',
                            "thumbnail": {
                                "imageUrl": "https://i.ibb.co/ZG48Hhc/002-12.png"
                            }
                        }
                    }
                ]
            }
        };
    }
}));
// 오늘의 광고 보기
router.post('/viewAds', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('start to register keyword');
    const userId = ctx.request.body.userRequest.user.id;
    let fromUserMsg = ctx.request.body.userRequest.utterance;
    ;
    let toUserMsg = ``;
    const adsRewardDAO = new adsRewardDAO_1.default();
    const existUser = yield adsRewardDAO.checkExistUser(userId);
    logger_1.default.info(`userid: ${fromUserMsg}`);
    // 키워드 등록 대상 
    if (existUser['cnt'] == 0) {
        toUserMsg = `🙋🏻‍♀️고객님의 관심 키워드를 등록해주세요
키워드를 등록하신 후, 서비스를 이용하실 수 있습니다:)
💚지금 등록시 첫 캐시 3,000P 바로 적립!`;
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": toUserMsg
                        }
                    }
                ],
                "quickReplies": [
                    {
                        "messageText": "키워드 등록하기",
                        "action": "message",
                        "label": "키워드 등록하기"
                    }
                ]
            }
        };
    }
    else {
        toUserMsg = `😍나랑 취향이 비슷하네..? 
알아가보고 싶다..만나볼까?!
매번 시간 낭비였던 소개팅 말고
다양한 취미로 만나보는 #ㅁㅇ
        
👥 남녀가 함께 즐기는 취미활동
🥳 지루할 틈 없는 프로그램 진행
🌱현재까지 시그널 성공률 70%
💘 시그널기능으로 호감표현까지!`;
        quizAnswer(userId);
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "basicCard": {
                            "description": toUserMsg,
                            "thumbnail": {
                                "imageUrl": "https://i.ibb.co/RjtVtxB/1.jpg"
                            },
                            "buttons": [
                                {
                                    "action": "webLink",
                                    "label": "ㅁㅇ 더보기",
                                    "webLinkUrl": "https://moum.day/class-list?utm_source=kakao&utm_medium=adsmoney&utm_campaign=adsmoney_beta"
                                }
                            ]
                        }
                    }
                ]
            }
        };
    }
}));
// 오늘의 광고 보기
router.post('/quizAnswer', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.userRequest.user.id;
    const adsRewardDAO = new adsRewardDAO_1.default();
    let fromUserMsg = ctx.request.body.userRequest.utterance;
    let toUserMsg = ``;
    const prevPoint = yield adsRewardDAO.getUserPoint(userId);
    const prevAnsCnt = yield adsRewardDAO.getUserAnswerCnt(userId);
    const prevUpdate = yield adsRewardDAO.getUserPointDate(userId);
    let today = moment().format('YYYY-MM-DD');
    let pointDate = moment(prevUpdate['point_update_date']).format('YYYY-MM-DD');
    const flag = prevPoint['point_total'] == 0 && prevAnsCnt['answer_cnt'] == 0;
    logger_1.default.info(`${today == pointDate}, ${flag}`);
    const prevAns = yield adsRewardDAO.getUserBeforeAnswer(userId);
    const prevAnswer = prevAns['before_answer'];
    logger_1.default.info(`${prevAnswer.trim()}, ${fromUserMsg.trim()}`);
    if (fromUserMsg.trim() == prevAnswer.trim()) {
        toUserMsg = `이미 참여하신 퀴즈입니다. 다음 광고를 기대해주세요🤗`;
    }
    else {
        let tempTotalPoint = prevPoint['point_total'] + 1000;
        yield adsRewardDAO.updateAdsUserPoint(userId, tempTotalPoint, prevAnsCnt['answer_cnt'] + 1);
        yield adsRewardDAO.updateAdsUserAnswer(userId, fromUserMsg.trim());
        toUserMsg = `👏🏻 정답입니다! 1000포인트 적립되었습니다.`;
    }
    ctx.body = {
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
}));
// 포인트 조회 및 적립금 출금 
router.post('/getPoint', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.userRequest.user.id;
    const adsRewardDAO = new adsRewardDAO_1.default();
    let toUserMsg = ``;
    const prevPoint = yield adsRewardDAO.getUserPoint(userId);
    const existUser = yield adsRewardDAO.checkExistUser(userId);
    // 키워드 등록 대상 
    if (existUser['cnt'] == 0) {
        toUserMsg = `🙋🏻‍♀️고객님의 관심 키워드를 등록해주세요
키워드를 등록하신 후, 서비스를 이용하실 수 있습니다:)
💚지금 등록시 첫 캐시 3,000P 바로 적립!`;
        ctx.body = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": toUserMsg
                        }
                    }
                ],
                "quickReplies": [
                    {
                        "messageText": "키워드 등록하기",
                        "action": "message",
                        "label": "키워드 등록하기"
                    }
                ]
            }
        };
    }
    else {
        if (prevPoint['point_total'] < 10000) {
            toUserMsg = `💲누적 적립 캐시 : ${prevPoint['point_total']}P
10,000P 부터 현금출금이 가능합니다:)`;
            ctx.body = {
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
        else {
            toUserMsg = `💲누적 적립 캐시 : ${prevPoint['point_total']}포인트
출금을 원하시면, 아래 "지금 출금신청" 버튼을 클릭해주세요.`;
            ctx.body = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": toUserMsg
                            }
                        }
                    ],
                    "quickReplies": [
                        {
                            "messageText": "지금 출금신청",
                            "action": "message",
                            "label": "지금 출금신청"
                        }
                    ]
                }
            };
        }
    }
}));
// 적립금 출금
router.post('/requestIncome', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.userRequest.user.id;
    const adsRewardDAO = new adsRewardDAO_1.default();
    let toUserMsg = `출금신청이 완료됐습니다.
상담직원 연결로 전환 후 출금 받기를 원하시는 계좌의 "은행명, 계좌번호, 예금주명"을 보내주세요.😀
3영업일 이내에 입금이 완료됩니다.`;
    ctx.body = {
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
}));
function quizAnswer(userId) {
    let msg = `Quiz) 오늘의 광고 속 브랜드 이름은 무엇일까요?`;
    setTimeout(function () {
        (0, kakaobot_1.sendKaKaoEventAPI)("adsmoney_quiz", userId, msg, "adsmoney");
    }, 30000);
}
exports.default = router;
