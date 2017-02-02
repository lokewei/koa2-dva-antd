import Router from 'koa-router'
import passport from 'koa-passport'
import UserRouter from './user'
import ContentImgsRouter from './contentImgs'

const router = new Router();

router.post('/login', async (ctx, next) => {
  return passport.authenticate('local', async(user) => {
    if (user === false || user === -1) {
      ctx.body = {
        success: false,
        message: user === -1 ? '密码错误' : '用户不存在',
        status: 400
      }
    } else {
      await ctx.login(user)
      ctx.body = {
        success: true,
        message: '登录成功',
        user
      }
    }
  })(ctx, next);
  // await middleware.call(this, ctx, next);
});

router.post('/logout', async(ctx) => {
  try {
    ctx.logout();
    ctx.body = {
      success: true,
      message: '退出成功'
    }
  } catch (error) {
    ctx.body = {
      success: false,
      message: '发生异常',
      error
    }
  }
  // ctx.redirect('/')
})

router.get('/userInfo', async(ctx) => {
  ctx.body = {
    success: ctx.isAuthenticated(),
    user: ctx.state.user
  }
})

router.get('/status', async(ctx) => {
  ctx.body = {
    isLogin: ctx.isAuthenticated()
  }
})

router.use('/user', UserRouter.routes(), UserRouter.allowedMethods());
router.use('/contentImgs', ContentImgsRouter.routes(), ContentImgsRouter.allowedMethods());

export default router;
