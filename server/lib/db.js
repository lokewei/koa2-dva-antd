import mysql from 'mysql';
import config from '../config/config'
import log4js from 'log4js';

const LOG = log4js.getLogger('console');
const db = {}

const mysqlPool = mysql.createPool({
  connectionLimit : 10,
  host            : config.mysql.host,
  port            : config.mysql.port,
  user            : config.mysql.user,
  password        : config.mysql.password,
  database        : config.mysql.database
});

db.pool = mysqlPool;

db.query = async function(sql, value) {
    LOG.debug(sql, value);
    return new Promise((resolve, reject) => {
        mysqlPool.query(sql, value, function(err, results, fields) {
            if(err) {
                reject(Error(err))
            } else {
                resolve(results)
            }
        })
    })
}

db.queryAsync = function(sql, value, cb) {
    LOG.debug(sql, value);
    mysqlPool.query(sql, value, function(err, results, fields) {
        cb(err, results, fields)
    })
}

export default db;
