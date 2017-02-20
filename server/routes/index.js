'use strict';

import compose from 'koa-compose';
import Router from 'koa-router';


import RouterMain from './main';
import RouterApi from './api'
import RouterAuth from './auth';
import RouterOpen from './open';
import RouterMock from './mock';

const router = process.env.NODE_ENV === 'production'
                ? new Router({ prefix: '/tv-admin' })
                : new Router();


router.get('/', async (ctx, next) => {
    // ctx.type = 'html'
    // ctx.body = require('fs').createReadStream(__dirname + '/../public/main.html')

    await ctx.render('./main')
})


router.use('/api', RouterApi.routes(), RouterApi.allowedMethods())
router.use('/auth', RouterAuth.routes(), RouterAuth.allowedMethods())
router.use('/open', RouterOpen.routes(), RouterOpen.allowedMethods())
router.use('/mock', RouterMock.routes(), RouterMock.allowedMethods())

router.get('*', async (ctx, next) => {
    ctx.body = { status : 404 }
})

export default function routes() {
    return compose(
        [
            router.routes(),
            router.allowedMethods()
        ]
    )
}
