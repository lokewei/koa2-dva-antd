import Router from 'koa-router'
import PostModel from '../../models/post';
import PostTypesModel from '../../models/postTypes';

const router = new Router();
const postClasses = [
  'article',
  'destination',
  'scenic',
  'restaurant',
  'hotel',
  'shopping',
  'feature',
  'other'
];

router.get('/list', async (ctx) => {
  const { page = 1, pageSize = 10, ...params } = ctx.query;
  const pagination = {
    page: parseInt(page, 10) || 1,
    pageSize: parseInt(pageSize, 10) || 10
  }
  const data = await PostModel.list(params, pagination);
  ctx.body = {
    success: !!data,
    ...data
  }
});

router.post('/create', async (ctx) => {
  const { post_title, post_excerpt, post_type, post_content } = ctx.req.body;
  const cls = ctx.req.body.class || 'article';
  let postCover = parseInt(ctx.req.body.pose_cover, 10);
  postCover = isNaN(postCover) ? null : postCover;
  try {
    if (postClasses.indexOf(cls) > -1) {
      await PostModel.create(post_title, post_excerpt, post_type, post_content, postCover, cls);
      ctx.body = {
        success: true
      }
    } else {
      ctx.body = {
        success: false,
        message: 'class invalid!'
      }
    }
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false
    }
  }
});

router.post('/update', async (ctx) => {
  const { post_title, post_excerpt, post_type, post_content, post_cover } = ctx.req.body;
  let id = parseInt(ctx.req.body.id, 10);
  id = isNaN(id) ? null : id;
  try {
    await PostModel.update(id, post_title, post_excerpt, post_type, post_content, post_cover);
    ctx.body = {
      success: true
    }
  } catch (error) {
    ctx.body = {
      success: false
    }
  }
});

router.post('/changeStatus', async (ctx) => {
  const { status } = ctx.req.body;
  let id = parseInt(ctx.req.body.id, 10);
  id = isNaN(id) ? null : id;
  try {
    await PostModel.changeStatus(id, status);
    ctx.body = {
      success: true
    }
  } catch (error) {
    ctx.body = {
      success: false
    }
  }
});

router.post('/delete', async (ctx) => {
  const id = parseInt(ctx.req.body.id, 10);
  try {
    if (isNaN(id)) {
      throw new Error('id is NaN');
    }
    await PostModel.delete(id);
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
  let id = parseInt(ctx.req.body.type_id, 10);
  id = isNaN(id) ? null : id;
  try {
    await PostTypesModel.update(id, name, summary);
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

export default router;
