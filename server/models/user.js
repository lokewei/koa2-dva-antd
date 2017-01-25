import db from '../lib/db';
import util from '../lib/util'
import log4js from 'log4js';

const LOG = log4js.getLogger('file');

export default {
  listAll: async () => {
    return await db.query('select * from tv_users order by user_login');
  },

  findById: async (id) => {
    const results = await db.query('select * from tv_users where id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  },

  verify: async (username, password) => {
    try {
      const user = await db.query('select * from tv_users where user_login = ?', [username]);

      LOG.warn(JSON.stringify({
        username,
        password
      }));

      if (user == null || user.length === 0) {
        return null;
      } else {
        if (util.verifySync(password, user[0].user_pass)) {
          return { user: user[0], code: 0 };
        } else {
          return { user: false, code: -1 };
        }
      }
    } catch (error) {
      LOG.error(error);
      return null
    }
    // return null;
  }
}
