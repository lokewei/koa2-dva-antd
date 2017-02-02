import Router from 'koa-router';
import ContentImgsModel from '../../models/contentImgs';

const router = new Router();

router.get('/query', async (ctx, next) => {
  const contentImgs = await ContentImgsModel.query();
  ctx.body = {
    status: 'query contentImgs',
    data: contentImgs
  }
});

router.get('/groupList', async (ctx, next) => {
  const groupList = await ContentImgsModel.groupList();
  ctx.body = {
    status: 'list contentImgs group',
    data: groupList
  }
});

export default router;
