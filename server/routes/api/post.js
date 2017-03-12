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

router.get('/queryDestPoints', async (ctx) => {
  const { page = 1, pageSize = 10, className } = ctx.query;
  let { destId } = ctx.query;
  const pagination = {
    page: parseInt(page, 10) || 1,
    pageSize: parseInt(pageSize, 10) || 10
  }
  destId = isNaN(parseInt(destId, 10)) ? null : parseInt(destId, 10)
  const data = await PostModel.queryDestPoints(destId, className, pagination);
  ctx.body = {
    success: !!data,
    ...data
  }
});

router.get('/get', async (ctx) => {
  let id = parseInt(ctx.query.id, 10);
  id = isNaN(id) ? null : id;
  const data = await PostModel.getById(id);
  ctx.body = {
    success: !!data,
    data: data[0]
  }
});

router.get('/queryDests', async (ctx) => {
  const data = await PostModel.queryDests();
  ctx.body = {
    success: !!data,
    data
  }
});

router.post('/create', async (ctx) => {
  const { post_title, post_excerpt, post_type, post_content } = ctx.req.body;
  const cls = ctx.req.body.post_class || 'article';
  let postCover = parseInt(ctx.req.body.post_cover, 10);
  postCover = isNaN(postCover) ? null : postCover;
  let destId = parseInt(ctx.req.body.dest_id, 10);
  destId = isNaN(destId) ? null : destId;
  try {
    if (postClasses.indexOf(cls) > -1) {
      await PostModel.create(post_title, post_excerpt, post_type, post_content, postCover, cls, destId);
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

router.get('/getHome', async (ctx) => {
  try {
    const top = await PostModel.getHomeTop();
    const middle = await PostModel.getHomeMiddle();
    const bottom = await PostModel.getHomeBottom();
    ctx.body = {
      success: true,
      data: {
        top,
        middle,
        bottom
      }
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

router.post('/types/changeShowType', async (ctx) => {
  try {
    const typeId = parseInt(ctx.req.body.typeId, 10);
    if (isNaN(typeId)) {
      throw new Error('typeId is NaN');
    }
    const showType = parseInt(ctx.req.body.showType, 10);
    if (isNaN(showType)) {
      throw new Error('showType is NaN');
    }
    await PostTypesModel.changeShowType(typeId, showType);
    ctx.body = {
      success: true
    }
  } catch (error) {
    ctx.body = {
      success: false,
      message: error
    }
  }
});

export default router;
