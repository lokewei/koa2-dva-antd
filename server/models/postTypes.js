import db from '../lib/db';

export default {
  list: async () => {
    return await db.query('select * from tv_post_types');
  },
  create: async (name, summary) => {
    await db.query(`
    insert into 
    tv_post_types(name, summary, sort) 
    select ?, ?, max(sort)+1 from tv_post_types`
    , [name, summary]);
  },
  update: async (id, name, summary) => {
    await db.query(`
      update tv_post_types
      set name = ? ${typeof(summary) === 'string' ? ', summary = ?' : ''}
      where type_id = ?
    `, typeof(summary) === 'string' ? [name, summary, id] : [name, summary]);
  },
  delete: async (id) => {
    if (!id) {
      return null;
    }
    await db.query(`
      delete from tv_post_types where id = ?
    `, [id]);
  }
}
