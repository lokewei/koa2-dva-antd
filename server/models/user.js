import db from '../lib/db';
import log4js from 'log4js';

const LOG = log4js.getLogger('file');

export default {
  listAll: async () => {
    return await db.query('select * from tv_user order by username');
  }
}
