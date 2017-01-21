import db from '../lib/db';
import util from '../lib/util'
import log4js from 'log4js';

const LOG = log4js.getLogger('file');

export default {
  listAll: async () => {
    return await db.query('select * from tv_user order by username');
  },

  findById: async (id) => {
    return await db.query('select * from tv_user where id = ?', [id]);
  },

  verify: async (username, password) => {
    try {
      const user = await db.query('select * from tv_user where username = ?', [username]);

      LOG.warn(JSON.stringify({
        username,
        password
      }));

      if (user == null || user.length === 0 || util.verifySync(password, user[0].password)) {
        return null;
      } else {
        if ((user[0].password === password) && (user[0].username === username)) {
          return user[0];
        } else {
          return null;
        }
      }
    } catch (error) {
      LOG.error(error);
      return null
    }
    // return null;
  }
}
