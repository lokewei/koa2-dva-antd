import Router from 'koa-router'
import TravelModel from '../../models/travel';

const router = new Router();

router.get('/list', async (ctx) => {
  const { page = 1, pageSize = 10, ...params } = ctx.query;
  const pagination = {
    page: parseInt(page, 10) || 1,
    pageSize: parseInt(pageSize, 10) || 10
  }
  const data = await TravelModel.list(params, pagination);
  ctx.body = {
    success: !!data,
    ...data
  }
});

router.get('/get', async (ctx) => {
  let id = parseInt(ctx.query.id, 10);
  id = isNaN(id) ? null : id;
  const data = await TravelModel.getById(id);
  ctx.body = {
    success: !!data,
    data: data[0]
  }
});


router.post('/create', async (ctx) => {
  const {
    dest,
    travel_date,
    travel_days,
    adult_no,
    children_no,
    name,
    phone_number,
    remarks,
    travel_status
  } = ctx.req.body;
  try {
    await TravelModel.create(
      dest,
      travel_date,
      travel_days,
      adult_no,
      children_no,
      name,
      phone_number,
      remarks,
      travel_status
    );
    ctx.body = {
      success: true
    }
  } catch (error) {
    ctx.body = {
      success: false
    }
  }
});

router.post('/submit', async (ctx) => {
  const {
    destination,
    appDate,
    days,
    adult,
    child,
    name,
    phone,
    comment
  } = ctx.req.body;
  let success = false;
  try {
    await TravelModel.create(
      destination,
      appDate,
      days,
      adult,
      child,
      name,
      phone,
      comment,
      'draft'
    );
    success = true;
  } catch (error) {
    console.error(error);
  }
  ctx.status = 302;
  if (process.env.NODE_ENV === 'production') {
    ctx.redirect(`/submit_result.html?success=${success}`);
  } else {
    ctx.redirect(`/m/submit_result.html?success=${success}`);
  }
});

router.post('/update', async (ctx) => {
  let id = parseInt(ctx.req.body.id, 10);
  id = isNaN(id) ? null : id;
  try {
    await TravelModel.update(id, ctx.req.body);
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
    await TravelModel.changeStatus(id, status);
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
    await TravelModel.delete(id);
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
