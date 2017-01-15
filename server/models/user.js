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
    const user = await db.query('select * from tv_user where username = ?', [username]);

    LOG.warn(JSON.stringify({
      username,
      password,
      user
    }))

    if (user == null || util.verifySync(password, user.password)) {
      return null;
    } else {
      /*if((account[0].password == password) && (account[0].username == username)) {
        return account[0];
      } else {
        return null;
      }*/
      return {
        name: 'test'
      }
    }
  }
}
