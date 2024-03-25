"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_dao_1 = require("./mysql_dao");
const DBHelper = require("../helpers/DBHelper");
const logger_1 = require("../util/logger");
class complainUserDAO extends mysql_dao_1.default {
    constructor() {
        super('real-mysql', 'kookmin_alarm');
    }
    getAllKookminAlarmData() {
        return this.get();
    }
    deleteAlarmData(no) {
        const query = `DELETE FROM ${this.table} WHERE no = '${no}'`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getAllKookminAlarmDataDate() {
        let query = `SELECT * FROM ${this.table} order by register_date desc`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    insertKookminMoney(userId, money) {
        const query = `insert into ${this.table} (kakao_id, money_amount, alarm_agree) values ('${userId}', '${money}', 0)`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateKookminDate(userId, receive_date) {
        const query = `UPDATE ${this.table} SET receive_date = '${receive_date}' WHERE kakao_id = '${userId}' and alarm_agree = 0 and receive_date is NULL`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateKookminReceive(userId, name) {
        const query = `UPDATE ${this.table} SET user_name = '${name}' WHERE kakao_id = '${userId}' and alarm_agree = 0 and user_name is NULL`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateKookminBorrow(userId, phoneNumber) {
        const query = `UPDATE ${this.table} SET other_phone_number='${phoneNumber}' WHERE kakao_id = '${userId}' and alarm_agree = 0 and other_user_name is NULL`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateKaKaoUserId(userId, kakaoId) {
        const query = `UPDATE ${this.table} SET kakao_user_id = '${kakaoId}' WHERE kakao_id = '${userId}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateOtherKaKaoId(userId, phoneNumber) {
        const query = `UPDATE ${this.table} SET other_kakao_id = '${userId}' WHERE other_phone_number like '%${phoneNumber}%'`;
        logger_1.default.info(`${query}`);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getBorrowInfo(userId) {
        let query = `SELECT other_user_name, receive_date, money_amount, other_phone_number FROM ${this.table} where kakao_id = '${userId}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getBorrowPersonData(userId) {
        let query = `SELECT user_name, receive_date, money_amount FROM ${this.table} where other_kakao_id = '${userId}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecificKookminAlarmData(no, page_size) {
        let query = `SELECT * FROM ${this.table} order by register_date desc limit ${no}, ${page_size}`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getBorrowInfoId(phoneNumber) {
        let query = `SELECT * FROM ${this.table} where other_phone_number like '%${phoneNumber}%'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
}
exports.default = complainUserDAO;
