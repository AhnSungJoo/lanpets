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
const externalMSG_1 = require("../module/externalMSG");
const insertDB_1 = require("../module/insertDB");
const paging_1 = require("../util/paging");
// dao
const signalDAO_1 = require("../dao/signalDAO");
const complainUserDAO_1 = require("../dao/complainUserDAO");
const kookminAlarmDAO_1 = require("../dao/kookminAlarmDAO");
const db_modules = [insertDB_1.upsertData];
const msg_modules = [externalMSG_1.sendExternalMSG]; // 텔레그램 알림 모음 (내부 / 외부)
const router = new Router();
/*
router.use( async function (ctx, next) {
  const ipFlag = await ipAllowedCheck(ctx);

  if(ipFlag) {
    return next();
  }
  else {
    logger.info(`not allowed user access ip: ${ctx.ip}`);
    return ctx.render('error', {message: "Not Allowed User"});
  }
})
*/
router.get('/complain', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainDAO = new signalDAO_1.default('complainer');
    const userResult = yield complainDAO.getAllComplainData();
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainDAO.getSpecificComplainData(paging.no, paging.page_size);
    const tableType = 'real';
    const forum = 'overview';
    const pageType = 'normal';
    // console.log(pageSignalResult);
    return ctx.render('complain', { pageSignalResult, paging, forum, tableType, moment, pageType });
}));
router.get('/complainer', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainerDAO = new complainUserDAO_1.default();
    const userResult = yield complainerDAO.getAllComplainerUser();
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainerDAO.getSpecificUserAllData(paging.no, paging.page_size);
    const tableType = 'real';
    const forum = 'overview';
    const pageType = 'normal';
    return ctx.render('complainer', { pageSignalResult, paging, forum, tableType, moment, pageType });
}));
router.get('/complainerSearch', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.userId || ctx.request.query.userId;
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainDAO = new signalDAO_1.default('complainer');
    const userResult = yield complainDAO.getSpecipcComplainerData(userId);
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainDAO.getSpecificUserAllDataSearch(paging.no, paging.page_size, userId);
    const tableType = 'real';
    const forum = 'overview';
    const pageType = 'search';
    return ctx.render('complain', { pageSignalResult, paging, forum, tableType, moment, pageType, userId });
}));
router.get('/complainUserSearchUsingRefCode', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refCode = ctx.request.body.refCode || ctx.request.query.refCode;
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainDAO = new complainUserDAO_1.default();
    const userResult = yield complainDAO.getSpecipcComplainerDataUsingRefCode(refCode);
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainDAO.getSpecificUserAllDataSearchUsingRefCode(paging.no, paging.page_size, refCode);
    const tableType = 'real';
    const forum = 'overview';
    const pageType = 'search';
    return ctx.render('complain', { pageSignalResult, paging, forum, tableType, moment, pageType, refCode });
}));
router.get('/specificComplainerSearch', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let curPage = ctx.request.query.page;
    let age = ctx.request.query.age;
    let sex = ctx.request.query.sex;
    let job = ctx.request.query.job;
    let startDate = ctx.request.query.startDate;
    let endDate = ctx.request.query.endDate;
    let whereQuery = `WHERE`;
    let queryCnt = 0;
    if (!curPage)
        curPage = 1;
    if (age != -1) {
        if (age == 40) {
            whereQuery += ` B.age>='${age}'`;
        }
        else {
            whereQuery += ` B.age='${age}'`;
        }
        queryCnt++;
    }
    if (sex != -1) {
        if (queryCnt == 0) {
            whereQuery += ` B.sex='${sex}'`;
        }
        else {
            whereQuery += ` and B.sex='${sex}'`;
        }
        queryCnt++;
    }
    if (job != -1) {
        if (queryCnt == 0) {
            whereQuery += ` B.job='${job}'`;
        }
        else {
            whereQuery += ` and B.job='${job}'`;
        }
        queryCnt++;
    }
    if (startDate) {
        if (queryCnt == 0) {
            whereQuery += ` A.complain_date>='${startDate}'`;
        }
        else {
            whereQuery += ` and A.complain_date>='${startDate}'`;
        }
        queryCnt++;
    }
    if (endDate) {
        if (queryCnt == 0) {
            whereQuery += ` A.complain_date<='${endDate}'`;
        }
        else {
            whereQuery += ` and A.complain_date<='${endDate}'`;
        }
        queryCnt++;
    }
    if (queryCnt == 0) {
        whereQuery = '';
    }
    const complainDAO = new signalDAO_1.default('complainer');
    const userResult = yield complainDAO.getSpecipcAllComplaineData(whereQuery);
    let cnt = userResult.length;
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainDAO.getSpecipcAllComplaineDataUsePaging(whereQuery, paging.no, paging.page_size);
    const tableType = 'real';
    const forum = 'overview';
    const pageType = 'specific';
    return ctx.render('complain', { pageSignalResult, paging, forum, tableType, moment, pageType, age, sex, job, startDate, endDate, cnt });
}));
router.get('/complainUserSearch', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.userId || ctx.request.query.userId;
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainDAO = new complainUserDAO_1.default();
    const userResult = yield complainDAO.getSpecificUseData(userId);
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = userResult;
    const tableType = 'real';
    const forum = 'overview';
    const pageType = 'search';
    return ctx.render('complainer', { pageSignalResult, paging, forum, tableType, moment, pageType, userId });
}));
router.get('/specificComplainUserSearch', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = '';
    let curPage = ctx.request.query.page;
    let age = ctx.request.query.age;
    let sex = ctx.request.query.sex;
    let job = ctx.request.query.job;
    let startDate = ctx.request.query.startDate;
    let endDate = ctx.request.query.endDate;
    let whereQuery = `WHERE`;
    let queryCnt = 0;
    if (!curPage)
        curPage = 1;
    if (age != -1) {
        if (age == 40) {
            whereQuery += ` A.age>='${age}'`;
        }
        else {
            whereQuery += ` A.age='${age}'`;
        }
        queryCnt++;
    }
    if (sex != -1) {
        if (queryCnt == 0) {
            whereQuery += ` A.sex='${sex}'`;
        }
        else {
            whereQuery += ` and A.sex='${sex}'`;
        }
        queryCnt++;
    }
    if (job != -1) {
        if (queryCnt == 0) {
            whereQuery += ` A.job='${job}'`;
        }
        else {
            whereQuery += ` and A.job='${job}'`;
        }
        queryCnt++;
    }
    if (startDate) {
        if (queryCnt == 0) {
            whereQuery += ` A.join_date>='${startDate}'`;
        }
        else {
            whereQuery += ` and A.join_date>='${startDate}'`;
        }
        queryCnt++;
    }
    if (endDate) {
        if (queryCnt == 0) {
            whereQuery += ` A.join_date<='${endDate}'`;
        }
        else {
            whereQuery += ` and A.join_date<='${endDate}'`;
        }
        queryCnt++;
    }
    if (queryCnt == 0) {
        whereQuery = '';
    }
    const complainerDAO = new complainUserDAO_1.default();
    const userResult = yield complainerDAO.getAllComplainerUserUseWhereClause(whereQuery);
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainerDAO.getSpecificUserAllDataUseWhere(paging.no, paging.page_size, whereQuery);
    const tableType = 'real';
    const forum = 'overview';
    const pageType = 'specific';
    return ctx.render('complainer', { pageSignalResult, paging, forum, tableType, moment, age, sex, job, startDate, endDate, pageType });
}));
router.get('/contextSearch', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const keywords = ctx.request.body.keywords || ctx.request.query.keywords;
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainDAO = new signalDAO_1.default('complainer');
    const keywordsResult = yield complainDAO.getSpecipcKeywordsData(keywords);
    const paging = yield (0, paging_1.getPaging)(curPage, keywordsResult.length);
    const pageSignalResult = yield complainDAO.getSpecificKeywordsAllDataSearch(paging.no, paging.page_size, keywords);
    const tableType = 'real';
    const forum = 'overview';
    const pageType = 'keywords';
    return ctx.render('complain', { pageSignalResult, paging, forum, tableType, moment, pageType, keywords });
}));
router.get('/outcome', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainerDAO = new complainUserDAO_1.default();
    const userResult = yield complainerDAO.getIncomingUser();
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainerDAO.getSpecificUserData(paging.no, paging.page_size);
    const tableType = 'real';
    const forum = 'overview';
    // console.log(pageSignalResult);
    return ctx.render('outcome', { pageSignalResult, paging, forum, tableType, moment });
}));
router.get('/kookminAlarm', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const kookDAO = new kookminAlarmDAO_1.default();
    const userResult = yield kookDAO.getAllKookminAlarmDataDate();
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield kookDAO.getSpecificKookminAlarmData(paging.no, paging.page_size);
    const tableType = 'real';
    const forum = 'overview';
    const pageType = 'normal';
    return ctx.render('kookminAlarm', { pageSignalResult, paging, forum, tableType, moment, pageType });
}));
exports.default = router;
