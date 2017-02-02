import db from '../lib/db';
// import log4js from 'log4js';

// const LOG = log4js.getLogger('file');

export default {
  query: async () => {
    return await db.query('select * from tv_attachs')
  },
  groupList: async () => {
    const sql = `
    SELECT 0 as ID, '全部图片' as group_name, 0 as cb_del, ( SELECT count(ID) FROM tv_attachs ) AS count
    UNION ALL 
    SELECT -1 as ID, '未分组' as group_name, 0 as cb_del, ( SELECT count(ID) FROM tv_attachs where group_id is null ) AS count
    UNION ALL 
    SELECT t.*, ( SELECT count(ID) FROM tv_attachs WHERE t.group_id = group_id ) AS count 
    FROM tv_attach_group t
    `;
    return await db.query(sql);
  }
}
