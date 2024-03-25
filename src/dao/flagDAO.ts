import * as DBHelper from '../helpers/DBHelper';
import MySqlDAO from './mysql_dao';

export default class c extends MySqlDAO {
  constructor() {
    const TARGET_DB: string = 'dev-mysql';
    const TARGET_TABLE: string = 'flag_set';
    super(TARGET_DB, TARGET_TABLE);
  }
  changeFlag(flag, flagType) {
    let column;
    if (flagType === 'last') {
      column = 'last_2_min';
    } else if (flagType === 'cqs') {
      column = 'CQS_flag';
    } else if (flagType === 'iq') {
      column = 'IQ_flag';
    }
    let query = `UPDATE ${this.table} SET ${column} = '${flag}' where id = 1`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  changeSymbolFlag(flag, symbol) {
    let query = `UPDATE ${this.table} SET ${symbol} = '${flag}' where id = 1`;
    console.log(query)

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }


  getFlag(flagType) {
    let column;
    if (flagType === 'last') {
      column = 'last_2_min';
    } else if(flagType === 'alpha') {
      column = 'IQ_flag';
    } else if(flagType === 'real') {
      column = 'CQS_flag';
    }
    let query = `SELECT ${column} as flag FROM ${this.table} where id = 1`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getSymbolFlag(symbol) {
    let query = `SELECT ${symbol} as flag FROM ${this.table} where id = 1`;
    console.log(query)
    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }

  getAllFlag() {
    let query = `SELECT * FROM ${this.table} where id = 1`;

    return DBHelper.query(this.targetDB, query)
    .then((data: any) => data.result);
  }
}    