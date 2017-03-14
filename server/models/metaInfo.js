import db from '../lib/db';

export default {
  getHomeToasts: async() => {
    const data = await db.query('select * from tv_meta_info where type = ?', ['home_toast']);
    return data;
  },
  createHomeToast: async(text) => {
    return await db.query('insert into tv_meta_info values(?, ?)', [text, 'home_toast']);
  },
  updateHomeToast: async(id, text) => {
    return await db.query('update tv_meta_info set text = ? where ID = ?', [text, id]);
  },
  deleteHomeToast: async(id) => {
    return await db.query('delete from tv_meta_info where ID = ?', [id]);
  }
}
