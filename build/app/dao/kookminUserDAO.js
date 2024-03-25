"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_dao_1 = require("./mysql_dao");
const DBHelper = require("../helpers/DBHelper");
const logger_1 = require("../util/logger");
class complainUserDAO extends mysql_dao_1.default {
    constructor() {
        super('real-mysql', 'kookmin_user');
    }
    getAllKookminAlarmData() {
        return this.get();
    }
    checkKookminUser(userId) {
        let query = `SELECT * FROM ${this.table} where kakao_id = '${userId}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    deleteAlarmData(no) {
        const query = `DELETE FROM ${this.table} WHERE no = '${no}'`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getOtherKaKaoId(phoneNumber) {
        let query = `SELECT kakao_id FROM ${this.table} where user_phone_number like '%${phoneNumber}%'`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    insertKookminMoney(userId, userName, phoneNumber) {
        const query = `insert into ${this.table} (kakao_id, user_name, user_phone_number) values ('${userId}', '${userName}', '${phoneNumber}')`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
}
exports.default = complainUserDAO;
