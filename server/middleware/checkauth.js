'use strict';

export default function checkauth() {
    return async function (ctx, next) {

         if (ctx.isAuthenticated()
         || ctx.path === '/'
         || /^\/tv-admin(\/)?$/.test(ctx.path)
         || /^\/(tv-admin\/)?auth\//.test(ctx.path)
         || /^\/(tv-admin\/)?api\//.test(ctx.path)
         || /^\/(tv-admin\/)?open\//.test(ctx.path)
         || /^\/(tv-admin\/)?chunks\//.test(ctx.path)
         || ctx.path.indexOf('.html') >= 0) {
            await next()
        } else {
            ctx.body = {
                "status" : 401
            }
        }
    }
}
