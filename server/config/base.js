'use strict';

import compose from 'koa-compose';
import convert from 'koa-convert';
import cors from 'kcors';
import Serve from 'koa-static';
import Logger from 'koa-logger';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import mysqlStore from 'koa-mysql-session';
import views from 'koa-views';
import proxy from 'koa-proxy';
import config from './config'

import './passport';
import passport from 'koa-passport';

import log4js from 'log4js';

export default function middleware(app) {

    app.proxy = true;

    log4js.configure({
        appenders: [
            { type: 'console' },
            { type: 'dateFile', filename: __dirname + '/../tmp/server.log' , "pattern":"-yyyy-MM-dd-hh.log","alwaysIncludePattern":false, category: 'file' }
        ],
        replaceConsole: true
    });

    app.use(cors({ credentials: true }));
    app.use(convert(Logger()))
    if (process.env.NODE_ENV === 'development') {
      app.use(convert(proxy({
        host: 'http://localhost:8000',
        match: /.+\.(js|css)/
      })));
    }
    app.use(bodyParser())
    app.use(mount("/", convert(Serve(__dirname + '/../public/'))));

    app.keys = ['tailv-session-key'];
    app.use(convert(session({
        store: new mysqlStore({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database
        }),
        rolling: true,
        cookie: {
            maxage: 30 * 60 * 1000
        }
    })));

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(views(__dirname + '/../views', {extension: 'swig'}))

}
