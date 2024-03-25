'use strict';

import * as Router from 'koa-router';
import * as moment from 'moment';
import * as settingConfig from 'config';
// import * as emoji from 'telegram-emoji-map';

import logger from '../util/logger';
import {sendInternalMSG, sendInternalErrorMSG} from '../module/internalMSG';
import {sendExternalMSG} from '../module/externalMSG';
import {sendErrorMSG} from '../module/errorMSG';

import {upsertData} from '../module/insertDB';
import {getPaging} from '../util/paging';

import { config } from 'winston';
import * as koaIpFilter from 'koa-ip-filter'

// dao
import singnalDAO from '../dao/signalDAO';
import userDAO from '../dao/complainUserDAO';
import kookminDAO from '../dao/kookminAlarmDAO';

// condition
import {ipAllowedCheck} from '../module/condition';
import complainUserDAO from '../dao/kookminUserDAO';
import { start } from 'repl';

const db_modules = [upsertData]
const msg_modules = [sendExternalMSG]  // 텔레그램 알림 모음 (내부 / 외부)
const router: Router = new Router();

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
router.get('/', async (ctx, next) => {
  let curPage = ctx.request.query.page;
  if (!curPage) curPage = 1;

  const complainDAO = new singnalDAO('complainer');
  const userResult = await complainDAO.getAllComplainData();

  const paging = await getPaging(curPage, userResult.length);
  const pageSignalResult = await complainDAO.getSpecificComplainData(paging.no, paging.page_size);
  const tableType = 'real';
  const forum = 'dashboard'
  const pageType = 'normal';
  // console.log(pageSignalResult);
  return ctx.render('newApp', {forum});
})

router.get('/contents', async (ctx, next) => {
  let curPage = ctx.request.query.page;
  if (!curPage) curPage = 1;

  const complainDAO = new singnalDAO('complainer');
  const userResult = await complainDAO.getAllComplainData();

  const paging = await getPaging(curPage, userResult.length);
  const pageSignalResult = await complainDAO.getSpecificComplainData(paging.no, paging.page_size);
  const tableType = 'real';
  const forum = 'contents'
  const pageType = 'normal';
  // console.log(pageSignalResult);
  return ctx.render('contents', {pageSignalResult, paging, forum, tableType, moment, pageType});
})

router.get('/userInfo', async (ctx, next) => {
  let curPage = ctx.request.query.page;
  if (!curPage) curPage = 1;

  const complainerDAO = new userDAO();
  const userResult = await complainerDAO.getAllComplainerUser();

  const paging = await getPaging(curPage, userResult.length);
  const pageSignalResult = await complainerDAO.getSpecificUserAllData(paging.no, paging.page_size);
  const tableType = 'real';
  const forum = 'userInfo';
  const pageType = 'normal';

  return ctx.render('userInfo', {pageSignalResult, paging, forum, tableType, moment, pageType});
})

router.get('/userSearch', async (ctx, next) => {
  const userId = ctx.request.body.userId || ctx.request.query.userId;
  let curPage = ctx.request.query.page;
  if (!curPage) curPage = 1;
  const complainDAO = new singnalDAO('complainer');
  const userResult = await complainDAO.getSpecipcComplainerData(userId);

  const paging = await getPaging(curPage, userResult.length);
  const pageSignalResult = await complainDAO.getSpecificUserAllDataSearch(paging.no, paging.page_size, userId);
  const tableType = 'real';
  const forum = 'contents'
  const pageType = 'search';

  return ctx.render('contents', {pageSignalResult, paging, forum, tableType, moment, pageType, userId});
})

router.get('/function', async (ctx, next) => {
  const tableType = 'real';
  const forum = 'function';
  const pageType = 'normal';

  return ctx.render('function', {forum});
})
export default router;   