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
router.get('/', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainDAO = new signalDAO_1.default('complainer');
    const userResult = yield complainDAO.getAllComplainData();
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainDAO.getSpecificComplainData(paging.no, paging.page_size);
    const tableType = 'real';
    const forum = 'dashboard';
    const pageType = 'normal';
    // console.log(pageSignalResult);
    return ctx.render('newApp', { forum });
}));
router.get('/contents', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainDAO = new signalDAO_1.default('complainer');
    const userResult = yield complainDAO.getAllComplainData();
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainDAO.getSpecificComplainData(paging.no, paging.page_size);
    const tableType = 'real';
    const forum = 'contents';
    const pageType = 'normal';
    // console.log(pageSignalResult);
    return ctx.render('contents', { pageSignalResult, paging, forum, tableType, moment, pageType });
}));
router.get('/userInfo', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainerDAO = new complainUserDAO_1.default();
    const userResult = yield complainerDAO.getAllComplainerUser();
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainerDAO.getSpecificUserAllData(paging.no, paging.page_size);
    const tableType = 'real';
    const forum = 'userInfo';
    const pageType = 'normal';
    return ctx.render('userInfo', { pageSignalResult, paging, forum, tableType, moment, pageType });
}));
router.get('/userSearch', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.request.body.userId || ctx.request.query.userId;
    let curPage = ctx.request.query.page;
    if (!curPage)
        curPage = 1;
    const complainDAO = new signalDAO_1.default('complainer');
    const userResult = yield complainDAO.getSpecipcComplainerData(userId);
    const paging = yield (0, paging_1.getPaging)(curPage, userResult.length);
    const pageSignalResult = yield complainDAO.getSpecificUserAllDataSearch(paging.no, paging.page_size, userId);
    const tableType = 'real';
    const forum = 'contents';
    const pageType = 'search';
    return ctx.render('contents', { pageSignalResult, paging, forum, tableType, moment, pageType, userId });
}));
router.get('/function', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tableType = 'real';
    const forum = 'function';
    const pageType = 'normal';
    return ctx.render('function', { forum });
}));
exports.default = router;
