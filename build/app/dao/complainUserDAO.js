"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_dao_1 = require("./mysql_dao");
const DBHelper = require("../helpers/DBHelper");
const logger_1 = require("../util/logger");
const moment = require("moment");
class complainUserDAO extends mysql_dao_1.default {
    constructor() {
        super('real-mysql', 'complain_user');
    }
    getAllComplainerData() {
        return this.get();
    }
    getAllComplainerUser() {
        let query = `SELECT * FROM ${this.table} order by no desc;`;
        //logger.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecipcComplainerDataUsingRefCode(refCode) {
        const query = `SELECT * FROM ${this.table} WHERE ref_code = '${refCode}';`;
        logger_1.default.info(`query : ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecificUserAllDataSearchUsingRefCode(no, page_size, refCode) {
        let query = `SELECT * FROM ${this.table} WHERE ref_code = '${refCode}' order by no desc limit ${no}, ${page_size};`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getAllComplainerUserUseWhereClause(whereQuery) {
        let query = `SELECT * FROM ${this.table} A ${whereQuery} order by no desc;`;
        //logger.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateRef(uesrId, refCode) {
        const query = `UPDATE ${this.table} SET ref_code = '${refCode}' WHERE kakao_id = '${uesrId}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateIncomeRequest(uesrId, requestFlag) {
        const query = `UPDATE ${this.table} SET income_request = ${requestFlag} WHERE kakao_id = '${uesrId}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getRef(uesrId) {
        const query = `SELECT ref_code FROM ${this.table} WHERE kakao_id = '${uesrId}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    getIncomingUser() {
        const query = `SELECT * FROM ${this.table} WHERE income_request = 1`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecificUserAllData(no, page_size) {
        let query = `SELECT A.no, A.kakao_id, A.age, A.sex, A.job, A.ref_code, A.join_date,
    (SELECT COUNT(*) FROM complainer B WHERE B.kakao_id = A.kakao_id) AS cnt
FROM ${this.table} A order by A.no desc limit ${no}, ${page_size};`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecificUserAllDataUseWhere(no, page_size, whereClause) {
        let query = `SELECT A.no, A.kakao_id, A.age, A.sex, A.job, A.ref_code, A.join_date,
    (SELECT COUNT(*) FROM complainer B WHERE B.kakao_id = A.kakao_id) AS cnt
FROM ${this.table} A ${whereClause} order by A.no desc limit ${no}, ${page_size};`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecificUseData(kakao_id) {
        let query = `SELECT A.no, A.kakao_id, A.age, A.sex, A.job, A.ref_code, A.join_date,
      (SELECT COUNT(*) FROM complainer B WHERE B.kakao_id = A.kakao_id) AS cnt
  FROM ${this.table} A WHERE kakao_id = '${kakao_id}';`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecificUserData(no, page_size) {
        let query = `SELECT * FROM ${this.table} WHERE income_request = 1 order by last_income_request desc limit ${no}, ${page_size}`;
        const nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
        logger_1.default.info(`query: ${nowDate}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getUserPoint(userId) {
        let query = `SELECT point_total FROM ${this.table} where kakao_id = '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    getUserIdUseRefCode(refCode) {
        let query = `SELECT kakao_id FROM ${this.table} where ref_code = '${refCode}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    changePoint(uesrId, chgPoint) {
        const query = `UPDATE ${this.table} SET point_total = ${chgPoint}, income_request=0 WHERE kakao_id = '${uesrId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    changeOnlyPoint(uesrId, chgPoint) {
        const query = `UPDATE ${this.table} SET point_total = ${chgPoint} WHERE kakao_id = '${uesrId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    changePointNotIncome(uesrId, chgPoint) {
        const query = `UPDATE ${this.table} SET point_total = ${chgPoint} WHERE kakao_id = '${uesrId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getTotalComplain() {
        let query = `SELECT count(*) as cnt FROM ${this.table}`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getTodayComplain() {
        let query = `SELECT count(*) as cnt FROM ${this.table} WHERE join_date > curdate()`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getUsersAgeInfo() {
        let query = `SELECT count(age) as cnt FROM ${this.table} group by age order by age;`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getUsersSexInfo() {
        let query = `SELECT count(sex) as cnt FROM ${this.table} group by sex order by sex;`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getUsersJobInfo() {
        let query = `SELECT count(job) as cnt FROM ${this.table} group by job order by job;`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
}
exports.default = complainUserDAO;
