import Router from 'koa-router'
import PostModel from '../../models/post';
import PostTypesModel from '../../models/postTypes';

const router = new Router();

router.get('/list', async (ctx) => {
  const data = await PostModel.list();
  ctx.body = {
    success: true,
    data
  }
});

router.get('/types', async (ctx) => {
  const { page = 1, pageSize = 10, ...params } = ctx.query;
  const pagination = {
    page: parseInt(page, 10) || 1,
    pageSize: parseInt(pageSize, 10) || 10
  }
  const data = await PostTypesModel.list(params, pagination);
  ctx.body = {
    success: !!data,
    ...data
  }
});

router.post('/types/create', async (ctx) => {
  const { name, summary } = ctx.req.body;
  try {
    await PostTypesModel.create(name, summary);
    ctx.body = {
      success: true
    }
  } catch (error) {
    ctx.body = {
      success: false
    }
  }
});

router.post('/types/update', async (ctx) => {
  const { name, summary } = ctx.req.body;
  try {
    await PostTypesModel.update(name, summary);
    ctx.body = {
      success: true
    }
  } catch (error) {
    ctx.body = {
      success: false
    }
  }
});

router.post('/types/delete', async (ctx) => {
  const id = parseInt(ctx.req.body.id, 10);
  try {
    if (isNaN(id)) {
      throw new Error('id is NaN');
    }
    await PostTypesModel.delete(id);
    ctx.body = {
      success: true
    }
  } catch (error) {
    ctx.body = {
      success: false,
      message: 'delete error'
    }
  }
});

router.post('/create', (ctx) => {
  const {name, summary} = ctx.req.body;

});

export default router;
