import db from '../lib/db';

const buildConditions = (params = {}) => {
  const conditions = [];
  const values = [];

  if (typeof params.field !== 'undefined'
      && typeof params.keyword !== 'undefined') {
    conditions.push(`${params.field} like ?`);
    values.push(`%${params.keyword}%`);
  }

  return {
    where: conditions.length ?
             conditions.join(' AND ') : '1=1',
    values
  };
}


export default {
  list: async(params, pagination) => {
    const conditions = buildConditions(params);
    const page = pagination.page;
    const pageSize = pagination.pageSize;
    const skip = (page - 1) * pageSize;
    const limit = `${skip}, ${skip + pageSize}`;
    const totalResult = await db.query(`select count(1) as total from tv_posts where ${conditions.where}`, conditions.values);
    const total = totalResult[0].total;
    const pageNum = Math.ceil(total / pageSize);
    const data = await db.query(`select * from tv_posts where ${conditions.where} LIMIT ${limit}`, conditions.values);
    if (page > pageNum) {
      return null;
    }
    return {
      data,
      page: {
        current: page,
        pageSize,
        total
      }
    }
  },
  create: async (name, summary) => {
    await db.query(`
    insert into 
    tv_posts(title, content, sort) 
    select ?, ?, max(sort)+1 from tv_posts`
    , [name, summary]);
  },
  update: async (id, title, content) => {
    await db.query(`
      update tv_posts
      set title = ? , content = ?
      where type_id = ?
    `, [name, content, id]);
  },
  delete: async (id) => {
    if (!id) {
      return null;
    }
    await db.query(`
      delete from tv_posts where ID = ?
    `, [id]);
  }
}
