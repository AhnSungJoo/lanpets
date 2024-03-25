"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_dao_1 = require("./mysql_dao");
const DBHelper = require("../helpers/DBHelper");
const logger_1 = require("../util/logger");
class complainUserDAO extends mysql_dao_1.default {
    constructor() {
        super('real-mysql', 'alba_review');
    }
    insertAlbaReview(userId, address) {
        const query = `insert into ${this.table} (kakao_id, alba_address) values ('${userId}', '${address}')`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateAlbaCompany(userId, companyName) {
        const query = `INSERT INTO ${this.table} (kakao_id, alba_company) VALUES ('${userId}', '${companyName}')`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateAlbaReview(userId, review_content) {
        const query = `UPDATE ${this.table} SET alba_review_content = '${review_content}', register_complete = 1 WHERE kakao_id = '${userId}' and register_complete = 0`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getAlbaReview(userId) {
        const query = `SELECT * FROM ${this.table} WHERE kakao_id = '${userId}' and delete_request = 0`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    checkAlbaReview(userId) {
        const query = `SELECT COUNT(*) as cnt  FROM ${this.table} WHERE kakao_id = '${userId}' and delete_request = 0`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    updateAlbaDelete(userId, content) {
        const query = `UPDATE ${this.table} SET delete_request = 1 WHERE kakao_id = '${userId}' and alba_review_content like '%${content}%'`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    deleteAlbaReview(userId, content) {
        const query = `DELETE FROM ${this.table} WHERE kakao_id = '${userId}' and alba_review_content like '%${content}%'`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
}
exports.default = complainUserDAO;
