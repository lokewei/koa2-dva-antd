import Router from 'koa-router'
import passport from 'koa-passport';
import UserRouter from './user'

const router = new Router();

/*router.post('/login', async (ctx, next) => {
  const middleware = passport.authenticate('local', async(user) => {
    if (user === false) {
      ctx.body = {
        status: 400
      }
    } else {
      await ctx.login(user)
      ctx.body = {
        user
      }
    }
  })
  await middleware.call(this, ctx, next);
});*/

router.post('/login', passport.authenticate('local', {
  successRedirect: '/secretBankAccount',
  failureRedirect: '/login'
}));

router.get('/logout', async(ctx) => {
  ctx.logout()
  ctx.redirect('/')
})

router.get('/status', async(ctx) => {
  ctx.body = {
    isLogin: ctx.isAuthenticated()
  }
})

router.use('/user', UserRouter.routes(), UserRouter.allowedMethods());

export default router;
