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

  if (!_.isEmpty(params.post_class)) {
    conditions.push('post_class = ?');
    values.push(params.post_class);
  }

  if (!_.isEmpty(params.post_type)) {
    conditions.push('post_type = ?');
    values.push(params.post_type);
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
    const data = await db.query(`
    select * from tv_posts
    left join (
      select r.from_post_id as from_id, p.ID as dest_id, p.post_title as dest_name
      from tv_posts as p right join tv_post_relationships as r
      on p.ID = r.ref_post_id
      where p.ID = ID
    ) as pr
    on ID = pr.from_id
    where ${conditions.where} order by post_date desc LIMIT ${limit}`, conditions.values);
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
  queryDests: async() => {
    const data = await db.query('select * from tv_posts where post_class = \'destination\' and post_status = \'publish\'');
    return data;
  },
  queryDestPoints: async(destId, className, pagination) => {
    let conditionWhere = ['post_status = \'publish\''];
    const conditionValues = [];
    if (destId) {
      conditionWhere.push('dest_id = ?');
      conditionValues.push(destId);
    }
    if (className) {
      conditionWhere.push('post_class = ?');
      conditionValues.push(className);
    } else {
      conditionWhere.push('post_class <> \'article\' and post_class <> \'destination\'');
    }
    conditionWhere = conditionWhere.length > 1 ? conditionWhere.join(' AND ') : conditionWhere[0];
    const page = pagination.page;
    const pageSize = pagination.pageSize;
    const skip = (page - 1) * pageSize;
    const limit = `${skip}, ${skip + pageSize}`;
    const totalResult = await db.query(`select count(1) as total from tv_posts
    left join (
      select r.from_post_id as from_id, p.ID as dest_id, p.post_title as dest_name
      from tv_posts as p right join tv_post_relationships as r
      on p.ID = r.ref_post_id
      where p.ID = ID
    ) as pr
    on ID = pr.from_id
    where ${conditionWhere}`, conditionValues);
    const total = totalResult[0].total;
    const pageNum = Math.ceil(total / pageSize);
    const data = await db.query(`
    select * from tv_posts
    left join (
      select r.from_post_id as from_id, p.ID as dest_id, p.post_title as dest_name
      from tv_posts as p right join tv_post_relationships as r
      on p.ID = r.ref_post_id
      where p.ID = ID
    ) as pr
    on ID = pr.from_id
    where ${conditionWhere} order by post_date desc LIMIT ${limit}`, conditionValues);
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
  getById: async(id) => {
    return await db.query('select * from tv_posts where ID = ?', [id]);
  },
  /**
   * 查询头部轮播
   */
  getHomeTop: async() => {
    return await db.query(`
      select t2.ID as post_id, t2.post_title, t2.post_cover
      from tv_post_types t1 left join tv_posts t2
      on
      t1.type_id = t2.post_type
      where
      t2.post_status = 'publish'
      and
      t1.type_id = 5
    `);
  },
  /**
   * 查各组最新的一条组成中部内容
   */
  getHomeMiddle: async() => {
    return await db.query(`
      select
        t.ID as post_id,
        t.post_title,
        t.post_excerpt,
        t.post_cover,
        t.post_date,
        t.post_type,
        t1.name as type_name
      from
      (select * from tv_posts
        where post_status='publish'
        and post_type not in(4,5)
        order by post_date desc
      ) t
      left join tv_post_types t1
      on t.post_type = t1.type_id
      group by t.post_type
    `);
  },
  /**
   * 查询底部新闻
   */
  getHomeBottom: async() => {
    return await db.query(`
      select
        t2.ID as post_id,
        t2.post_title,
        t2.post_cover,
        DATE_FORMAT(t2.post_date,'%Y-%m-%d') as post_date
      from tv_post_types t1 left join tv_posts t2
      on
      t1.type_id = t2.post_type
      where
      t2.post_status = 'publish'
      and
      t1.type_id = 4
    `);
  },
  create: async (title, excerpt, type, content, cover, cls, destId) => {
    const now = new Date();
    const values = [title, excerpt, type, content]
    if (!!cover) {
      values.push(cover);
    }
    values.push(cls);
    values.push(now);
    values.push(now);
    const rest = await db.query(`
    insert into
    tv_posts(post_title, post_excerpt, post_type, post_content,
    ${!!cover ? 'post_cover, ' : ''} post_class, post_date, post_modified)
    values(?, ?, ?, ?, ${!!cover ? '?, ' : ''} ?, ?, ?)`
    , values);
    const { insertId } = rest;
    if (insertId && destId) {
      await db.query('insert into tv_post_relationships values(?, ?, ?)', [insertId, destId, `${cls}-dest`]);
    }
  },
  update: async (id, title, excerpt, type, content, cover) => {
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
    if (!_.isEmpty(cover)) {
      conditions.push('post_cover = ?');
      values.push(cover);
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
