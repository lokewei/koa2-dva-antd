'use strict' ;
const co = require('co')
    , mysql = require('co-mysql');

const CREATE_STATEMENT = 'CREATE  TABLE IF NOT EXISTS `_mysql_session_store` (`id` VARCHAR(255) NOT NULL, `expires` BIGINT NULL, `data` TEXT NULL, PRIMARY KEY (`id`));'
    , GET_STATEMENT = 'SELECT * FROM `_mysql_session_store` WHERE id  = ?'
    , SET_STATEMENT ='INSERT INTO _mysql_session_store(id, expires, data) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE expires=?, data =?'
    , DELETE_STATEMENT = 'DELETE FROM `_mysql_session_store` WHERE id  = ?'
    , CLEANUP_STATEMENT = 'DELETE FROM `_mysql_session_store` WHERE expires  < ?' ;

const FORTY_FIVE_MINUTES = 45 * 60 * 1000 ;

let getExpiresOn = function(session, ttl){
    let expiresOn = null ;
    ttl = ttl || FORTY_FIVE_MINUTES

    if(session && session.cookie && session.cookie.expires) {
        if (session.cookie.expires instanceof Date) {
            expiresOn = session.cookie.expires
        } else {
            expiresOn = new Date(session.cookie.expires)
        }
    } else {
        let now = new Date() ;
        expiresOn = new Date(now.getTime() + ttl) ;
    }
    return expiresOn
}

var MysqlStore = function (options) {
    let pool = null
    this.getConnection = function(){
        if(!pool) {
            pool = mysql.createPool(options) ;
        }
        return pool ;
    }

    this.cleanup = function() {
        let now = (new Date()).valueOf() ;
        let connection = this.getConnection() ;
        let results = connection.query(CLEANUP_STATEMENT, [now])() ;
    };


    co(function*() {
        let connection = this.getConnection()
        let result = yield connection.query(CREATE_STATEMENT)
        this.cleanup()
    }).call(this)

    setInterval( this.cleanup.bind(this), 30 * 60 * 1000 );
};

MysqlStore.prototype.get = function *(sid) {
    let connection = this.getConnection()
    let results = yield connection.query(GET_STATEMENT, [sid])
    let session = null ;
    if(results && results[0] && results[0][0] && results[0][0].data){
        session = JSON.parse(results[0][0].data);
    }
    return session
};

MysqlStore.prototype.set = function *(sid, session, ttl) {
    let expires = getExpiresOn(session, ttl).valueOf()
    let data = JSON.stringify(session);
    let connection = this.getConnection()
    let results = yield connection.query(SET_STATEMENT, [sid, expires, data, expires, data])
    return results
};

MysqlStore.prototype.destroy = function *(sid) {
    let connection = this.getConnection()
    let results = yield connection.query(DELETE_STATEMENT, [sid])
};

module.exports = MysqlStore;