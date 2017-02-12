import db from '../lib/db';
import _ from 'lodash'

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
  create: async (title, excerpt, type, content) => {
    const now = new Date();
    await db.query(`
    insert into 
    tv_posts(post_title, post_excerpt, post_type, post_content, post_date, post_modified) 
    values(?, ?, ?, ?, ?, ?)`
    , [title, excerpt, type, content, now, now]);
  },
  update: async (id, title, excerpt, type, content) => {
    const conditions = [];
    const values = [];
    if (!_.isEmpty(title)) {
      conditions.push('post_title = ?');
      values.push(title);
    }
    if (!_.isEmpty(excerpt)) {
      conditions.push('post_excerpt = ?');
      values.push(excerpt);
    }
    if (!_.isEmpty(type)) {
      conditions.push('post_type = ?');
      values.push(type);
    }
    if (!_.isEmpty(content)) {
      conditions.push('post_content = ?');
      values.push(content);
    }
    const updateFields = conditions.length ? `${conditions.join(' , ')}, ` : ''
    const now = new Date();
    values.push(now);
    values.push(id);
    await db.query(`
      update tv_posts
      set ${updateFields} post_modified = ?
      where ID = ?
    `, values);
  },
  changeStatus: async (id, status) => {
    await db.query(`
      update tv_posts
      set post_status = ?
      where ID = ?
    `, [status, id]);
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
