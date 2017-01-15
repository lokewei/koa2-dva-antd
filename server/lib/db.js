import mysql from 'mysql';
import config from '../config/config'

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
    mysqlPool.query(sql, value, function(err, results, fields) {
        cb(err, results, fields)
    })
}

export default db;
