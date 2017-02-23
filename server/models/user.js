import db from '../lib/db'
import util from '../lib/util'
import log4js from 'log4js'
import _ from 'lodash'

const LOG = log4js.getLogger('file');

export default {
  listAll: async () => {
    return await db.query('select * from tv_users order by user_login');
  },

  findById: async (id) => {
    const results = await db.query('select * from tv_users where id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  },

  create: async (loginname, password, nicename, gender, phone, email) => {
    const fields = [];
    const now = new Date();
    const values = [loginname, password, phone, now];
    if (!_.isEmpty(nicename)) {
      fields.push('user_nicename');
      values.push(nicename);
    }
    if (!_.isEmpty(gender)) {
      fields.push('user_gender');
      values.push(nicename);
    }
    if (!_.isEmpty(email)) {
      fields.push('user_email');
      values.push(email);
    }
    const updateFields = fields.length ? `${fields.join(' , ')}, ` : ''
    await db.query(`
      insert into tv_users(user_login, user_pass, phone, user_registered, ${updateFields})
    `, values);
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
