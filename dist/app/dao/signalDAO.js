"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBHelper = require("../helpers/DBHelper");
const mysql_dao_1 = require("./mysql_dao");
class singnalDAO extends mysql_dao_1.default {
    constructor(tableType) {
        const TARGET_DB = 'dev-mysql';
        let TARGET_TABLE;
        if (tableType === 'alpha') {
            TARGET_TABLE = 'signal_history_alpha';
        }
        else if (tableType === 'real') {
            TARGET_TABLE = 'signal_history';
        }
        super(TARGET_DB, TARGET_TABLE);
    }
    upsertSignalData(values) {
        return this.upsert(values);
    }
    getAllSignalData() {
        return this.get();
    }
    getDataUseUpdate(start, end, symbol) {
        let query = `SELECT * FROM ${this.table} where order_date >= '${start}' and order_date <= '${end}' and valid_type = 0 and symbol = '${symbol}' order by order_date`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    updateDataOrdTotalScoreBuyList(total_score, ord, buy_list, order_date, side, algorithm_id) {
        let query = `UPDATE ${this.table} SET total_score = ${total_score}, ord = ${ord}, buy_list = '${buy_list}' 
    WHERE algorithm_id = '${algorithm_id}' and side ='${side}' and order_date = '${order_date}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecifitSignalData(no, page_size) {
        let query = `SELECT * FROM ${this.table} order by ord desc limit ${no}, ${page_size}`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getDateSignalData(start, end) {
        let query = `SELECT * FROM ${this.table} where order_date >= '${start}' and order_date <= '${end}' and valid_type = 0 order by ord`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecificTotalScore(symbol) {
        let query = `SELECT total_score, ord FROM ${this.table} WHERE symbol='${symbol}' and valid_type = 0 order by ord desc limit 1`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSendDateIsNull(symbol) {
        let query = `SELECT count(*) as cnt FROM ${this.table} WHERE symbol='${symbol}' and send_date is null and valid_type = 0`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    getMaxOrd() {
        let query = `SELECT max(ord) as ord FROM ${this.table}`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    getAllSymbol() {
        let query = `SELECT distinct(symbol) FROM ${this.table}`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    checkColumn(algorithmId, orderDate, side, symbol) {
        let query = `SELECT count(*) as cnt FROM ${this.table} 
    WHERE algorithm_id = '${algorithmId}' and order_date = '${orderDate}' and side = '${side}' and symbol = '${symbol}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result[0]);
    }
    getLastSideEachAlgorithm(algorithmId, symbol) {
        let query = `SELECT side FROM ${this.table} where algorithm_id = '${algorithmId}' and symbol = '${symbol}' order by ord desc limit 1;`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getLastBuyListEachSymbol(symbol) {
        let query = `SELECT buy_list FROM ${this.table} where symbol = '${symbol}' order by ord desc limit 1;`;
        console.log(query);
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
    getSpecificSignalColumn(ord, symbol) {
        let query = `SELECT * FROM ${this.table} where ord = '${ord}' and symbol = '${symbol}'`;
        return DBHelper.query(this.targetDB, query)
            .then((data) => data.result);
    }
}
exports.default = singnalDAO;
