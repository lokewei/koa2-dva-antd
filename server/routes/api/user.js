import Router from 'koa-router';
import UserModel from '../../models/user';

const router = new Router();

router.get('/list', async (ctx, next) => {
  const userList = await UserModel.listAll();
  ctx.body = {
    status: 'list users',
    data: userList
  }
});

router.get('/findById', async (ctx, next) => {
  const { id } = ctx.query;
  const user = await UserModel.findById(id);
  ctx.body = {
    status: 'list users',
    data: {
      id,
      user
    }
  }
});

export default router;
