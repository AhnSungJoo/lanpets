import * as DBHelper from '../helpers/DBHelper';
import MySqlDAO from './mysql_dao';
import logger from '../util/logger';
import * as moment from 'moment'

export default class signalDAO extends MySqlDAO {
  constructor(tableType) {
    const TARGET_DB: string = 'real-mysql';
    let TARGET_TABLE: string
    if (tableType === 'complainer') {
      TARGET_TABLE = 'complainer'
    } 

    super(TARGET_DB, TARGET_TABLE);
  }
  upsertSignalData(values) {
    return this.upsert(values);
  }

  getAllComplainData() {
    return this.get();
  }

  updateComplainPoint(no, userId, point) {
    const query: string = `UPDATE ${this.table} SET send_point=${point} WHERE kakao_id= '${userId}' and no=${no}`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSpecipcComplainerData(uesrId: string) {
    const query: string = `SELECT * FROM ${this.table} WHERE kakao_id = '${uesrId}'`;
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  // 나이, 성별, 직업 필터링 + 날짜 추가
  getSpecipcAllComplaineData(whereQuery: string) {
    let query = `SELECT A.no, A.kakao_id, A.complain_context, A.send_point, A.complain_date, B.age, B.sex, B.job
    FROM complainer.complainer A Inner join complainer.complain_user B on A.kakao_id=B.kakao_id ` + whereQuery;
    // logger.info(`${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  // 나이, 성별, 직업 필터링 + 날자 추가
  getSpecipcAllComplaineDataUsePaging(whereQuery: string, no, page_size) {
    let query = `SELECT A.no, A.kakao_id, A.complain_context, A.send_point, A.complain_date, B.age, B.sex, B.job
    FROM complainer.complainer A Inner join complainer.complain_user B on A.kakao_id=B.kakao_id ` + whereQuery + ` order by no desc limit ${no}, ${page_size}`;
    // logger.info(`${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSpecipcKeywordsData(keywords: string) {
    const query: string = `SELECT * FROM ${this.table} WHERE complain_context like '%${keywords}%'`;
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSpecipcComplainerCount(uesrId: string) {
    const query: string = `SELECT count(*) as cnt FROM ${this.table} WHERE kakao_id = '${uesrId}'`;
    logger.info(`${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSpecificUserAllDataSearch(no, page_size, uesrId) {
    let query = `SELECT * FROM ${this.table} WHERE kakao_id = '${uesrId}' order by no desc limit ${no}, ${page_size}`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }


  getSpecificKeywordsAllDataSearch(no, page_size, keywords) {
    let query = `SELECT * FROM ${this.table} WHERE complain_context like '%${keywords}%' order by no desc limit ${no}, ${page_size}`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSpecificComplainData(no, page_size) {
    let query = `SELECT A.no, A.kakao_id, A.complain_context, A.send_point, A.complain_date, B.age, B.sex, B.job
    FROM complainer.complainer A Inner join complainer.complain_user B on A.kakao_id=B.kakao_id order by A.no desc limit ${no}, ${page_size}`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  insertComplainContext(complain_text, userId, point) {
    const query: string = `insert into complainer (kakao_id, complain_context, send_point) values ('${userId}', '${complain_text}', ${point})`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getUserPoint(userId){
    let query = `SELECT point_total FROM complain_user where kakao_id = '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]);
  }

  getfriUserId(refCode){
    let query = `SELECT kakao_id FROM complain_user where ref_code = '${refCode}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]);
  }

  getUserinfo(userId) {
    let query = `SELECT age, sex FROM complain_user where kakao_id = '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]); 
  }

  checkExistUser(userId) {
    let query = `SELECT count(*) as cnt FROM complain_user where kakao_id = '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]); 
  }

  checkExistUserInfo(userId) {
    let query = `SELECT count(*) as cnt FROM complain_user where kakao_id = '${userId}' and (age is null or job is null or sex is null)`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]); 
  }

  checkExistRefUser(userId) {
    let query = `SELECT ref_user_is FROM complain_user where kakao_id = '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]); 
  }

  checkIncomeStatus(userId) {
    let query = `SELECT income_request as status FROM complain_user where kakao_id = '${userId}'`;
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]); 
  }

  insertComplainUserData(userId, point) {
    const query: string = `insert into complain_user (kakao_id, point_total) values ('${userId}', ${point})`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  updateComplainUserData(userId, point) {
    const query: string = `UPDATE complain_user SET point_total=${point} WHERE kakao_id= '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  updateComplainUserRefCodeData(userId, point, ref_code) {
    const query: string = `UPDATE complain_user SET point_total=${point}, ref_user_is=1, ref_user_code='${ref_code}' WHERE kakao_id= '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  insertComplainUserAge(userId, age) {
    const query: string = `insert into complain_user (kakao_id, age) values ('${userId}', ${age})`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  updateComplainUserAge(userId, age) {
    const query: string = `UPDATE complain_user SET age=${age} WHERE kakao_id= '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  insertComplainUserSex(userId, sex) {
    const query: string = `insert into complain_user (kakao_id, sex) values ('${userId}', ${sex})`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  updateComplainUserSex(userId, sex) {
    const query: string = `UPDATE complain_user SET sex=${sex} WHERE kakao_id= '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  insertComplainUserJob(userId, job) {
    const query: string = `insert into complain_user (kakao_id, job) values ('${userId}', '${job}')`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  updateComplainUserJob(userId, job) {
    const query: string = `UPDATE complain_user SET job='${job}' WHERE kakao_id= '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  updateComplainUserIncome(userId) {
    const nowDate: string = moment().format('YYYY-MM-DD HH:mm:ss')
    const query: string = `UPDATE complain_user SET income_request=1, last_income_request='${nowDate}' WHERE kakao_id= '${userId}'`;
    logger.info(`query: ${query}`);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getDataUseUpdate(start, end, symbol) {
    let query = `SELECT * FROM ${this.table} where order_date >= '${start}' and order_date <= '${end}' and valid_type = 0 and symbol = '${symbol}' order by order_date`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }
  updateDataOrdTotalScoreBuyList(total_score, ord, buy_list, order_date, side, algorithm_id) {
    
    let query = `UPDATE ${this.table} SET total_score = ${total_score}, ord = ${ord}, buy_list = '${buy_list}' 
    WHERE algorithm_id = '${algorithm_id}' and side ='${side}' and order_date = '${order_date}'`

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSpecifitSignalData(no, page_size) {
    let query = `SELECT * FROM ${this.table} order by ord desc limit ${no}, ${page_size}`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getDateSignalData(start, end) {
    let query = `SELECT * FROM ${this.table} where order_date >= '${start}' and order_date <= '${end}' and valid_type = 0 order by ord`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSpecificTotalScore(symbol: string) {
    let query = `SELECT total_score, ord FROM ${this.table} WHERE symbol='${symbol}' and valid_type = 0 order by ord desc limit 1`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSendDateIsNull(symbol: string) {
    let query = `SELECT count(*) as cnt FROM ${this.table} WHERE symbol='${symbol}' and send_date is null and valid_type = 0`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]);
  }

  getMaxOrd() {
    let query = `SELECT max(ord) as ord FROM ${this.table}`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]);
}

  getAllSymbol() {
    let query = `SELECT distinct(symbol) FROM ${this.table}`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }
  
  checkColumn(algorithmId, orderDate, side, symbol) {
    let query = `SELECT count(*) as cnt FROM ${this.table} 
    WHERE algorithm_id = '${algorithmId}' and order_date = '${orderDate}' and side = '${side}' and symbol = '${symbol}'`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result[0]);
  }

  getLastSideEachAlgorithm(algorithmId, symbol) {
    let query = `SELECT side FROM ${this.table} where algorithm_id = '${algorithmId}' and symbol = '${symbol}' order by ord desc limit 1;`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getLastBuyListEachSymbol(symbol) {
    let query = `SELECT buy_list FROM ${this.table} where symbol = '${symbol}' order by ord desc limit 1;`;
    console.log(query);
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSpecificSignalColumn(ord, symbol) {
    let query = `SELECT * FROM ${this.table} where ord = '${ord}' and symbol = '${symbol}'`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getTodayComplain() {
    let query = `SELECT count(*) as cnt FROM ${this.table} WHERE complain_date > curdate()`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }
  getTotalComplain() {
    let query = `SELECT count(*) as cnt FROM ${this.table}`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getTotalComplainWriter() {
    let query = `SELECT count(distinct(kakao_id)) as cnt FROM ${this.table}`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }
}
