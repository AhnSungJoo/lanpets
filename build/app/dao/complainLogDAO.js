"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_dao_1 = require("./mysql_dao");
const DBHelper = require("../helpers/DBHelper");
const logger_1 = require("../util/logger");
class complainUserDAO extends mysql_dao_1.default {
    constructor() {
        super('real-mysql', 'complainer_log');
    }
    getAllComplainerData() {
        return this.get();
    }
    updateReqIncome(today) {
        const query = `UPDATE ${this.table} SET request_income = request_income + 1 WHERE log_date = '${today}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateRegComplain(today) {
        const query = `UPDATE ${this.table} SET register_complain = register_complain + 1 WHERE log_date = '${today}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateRegRefCode(today) {
        const query = `UPDATE ${this.table} SET register_refCode = register_refCode + 1 WHERE log_date = '${today}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateMonthlyKeywords(today) {
        const query = `UPDATE ${this.table} SET monthly_keywords = monthly_keywords + 1 WHERE log_date = '${today}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateInviteFriend(today) {
        const query = `UPDATE ${this.table} SET invite_friend = invite_friend + 1 WHERE log_date = '${today}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    insertNewData(today) {
        const query = `insert into ${this.table} (log_date) values ('${today}')`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getTodayComplainlog(today) {
        let query = `SELECT count(*) as cnt FROM ${this.table} WHERE log_date = '${today}'`;
        //logger.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getTodayAllData(today) {
        let query = `SELECT * FROM ${this.table} WHERE log_date = '${today}'`;
        logger_1.default.info(`query: ${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
}
exports.default = complainUserDAO;
