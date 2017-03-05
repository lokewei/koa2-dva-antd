import db from '../lib/db';
// import log4js from 'log4js';

// const LOG = log4js.getLogger('file');

export default {
  query: async (groupId) => {
    let sql = 'select * from tv_attachs';
    const conditionValues = [];
    if (groupId && groupId !== 0) {
      if (groupId === -1) {
        sql += ' where group_id is null or group_id = 0';
      } else {
        sql += ' where group_id = ?'
        conditionValues.push(groupId);
      }
    }
    return await db.query(sql, conditionValues);
  },
  getById: async (id) => {
    if (id) {
      return await db.query('select * from tv_attachs where ID = ?', [id]);
    } else {
      return null;
    }
  },
  create: async (fileName, fileOriginName, path, groupId, mimeType) => {
    return await db.query(`
      insert into 
      tv_attachs(file_name, file_origin_name, path, group_id, mime_type) 
      values (?, ?, ?, ?, ?)`,
      [fileName, fileOriginName, path, groupId, mimeType]);
  },
  delete: async (id) => {
    return await db.query('delete from tv_attachs where ID = ?', [id]);
  },
  changeOriginName: async (id, name) => {
    return await db.query('update tv_attachs set file_origin_name = ?', [name]);
  },
  changeGroup: async (ids, groupId) => {
    return await db.query('update tv_attachs set group_id = ? where id in (?)', [groupId, ids]);
  },
  groupList: async () => {
    const sql = `
    SELECT 0 as ID, '全部图片' as group_name, 0 as cb_del, ( SELECT count(ID) FROM tv_attachs ) AS count
    UNION ALL
    SELECT -1 as ID, '未分组' as group_name, 0 as cb_del,
    ( SELECT count(ID) FROM tv_attachs where group_id is null || group_id = 0 ) AS count
    UNION ALL
    SELECT t.*, ( SELECT count(ID) FROM tv_attachs WHERE t.group_id = group_id ) AS count
    FROM tv_attach_group t
    `;
    return await db.query(sql);
  },
  createGroup: async (name) => {
    const sql = `
      insert into
      tv_attach_group(group_name, cb_del)
      values(?, 1)
    `;
    return await db.query(sql, [name]);
  }
}
