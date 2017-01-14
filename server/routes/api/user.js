import Router from 'koa-router';
import UserModel from '../../models/user';

const router = new Router();

router.get('/list', async (ctx, next) => {
  const userList = await UserModel.listAll();
  ctx.body = {
    status: 'list users',
    data: userList
  }
})

export default router;
