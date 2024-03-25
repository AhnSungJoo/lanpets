"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_dao_1 = require("./mysql_dao");
const DBHelper = require("../helpers/DBHelper");
const logger_1 = require("../util/logger");
class complainUserDAO extends mysql_dao_1.default {
    constructor() {
        super('real-mysql', 'adsreward_user');
    }
    getAllKookminAlarmData() {
        return this.get();
    }
    checkExistUser(useId) {
        let query = `SELECT count(*) as cnt FROM ${this.table} where kakao_id = '${useId}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    getUserPoint(userId) {
        let query = `SELECT point_total FROM ${this.table} where kakao_id = '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    getUserBeforeAnswer(userId) {
        let query = `SELECT before_answer FROM ${this.table} where kakao_id = '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    getUserAnswerCnt(userId) {
        let query = `SELECT answer_cnt FROM ${this.table} where kakao_id = '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    getUserPointDate(userId) {
        let query = `SELECT point_update_date FROM ${this.table} where kakao_id = '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    updateAdsUserPoint(userId, point, answer_cnt) {
        const query = `UPDATE ${this.table} SET point_total=${point}, answer_cnt=${answer_cnt} WHERE kakao_id= '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateAdsUserOnlyPoint(userId, point) {
        const query = `UPDATE ${this.table} SET point_total=${point} WHERE kakao_id= '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateAdsUserAnswer(userId, now_answer) {
        const query = `UPDATE ${this.table} SET before_answer='${now_answer}' WHERE kakao_id= '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    insertRewardUserAge(userId, age) {
        const query = `insert into ${this.table} (kakao_id, age) values ('${userId}', ${age})`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateRewardUserAge(userId, age) {
        const query = `UPDATE ${this.table} SET age=${age} WHERE kakao_id= '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    insertRewardUserSex(userId, sex) {
        const query = `insert into ${this.table} (kakao_id, sex) values ('${userId}', ${sex})`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateRewardUserSex(userId, sex) {
        const query = `UPDATE ${this.table} SET sex=${sex} WHERE kakao_id= '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    insertRewardUserJob(userId, job) {
        const query = `insert into ${this.table} (kakao_id, job) values ('${userId}', '${job}')`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateRewardUserJob(userId, job) {
        const query = `UPDATE ${this.table} SET job='${job}' WHERE kakao_id= '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    insertRewardUserkeywords(userId, keywords) {
        const query = `insert into ${this.table} (kakao_id, input_keywords) values ('${userId}', '${keywords}')`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateRewardUserkeywords(userId, keywords) {
        const query = `UPDATE ${this.table} SET input_keywords='${keywords}' WHERE kakao_id= '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    insertRewardUserTelno(userId, telno) {
        const query = `insert into ${this.table} (kakao_id, telno) values ('${userId}', '${telno}')`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateRewardUserTelno(userId, telno) {
        const query = `UPDATE ${this.table} SET telno='${telno}' WHERE kakao_id= '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getRewardUserTelno(userId) {
        const query = `SELECT telno from ${this.table} WHERE kakao_id= '${userId}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
}
exports.default = complainUserDAO;
