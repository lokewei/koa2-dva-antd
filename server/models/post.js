import db from '../lib/db';

export default {
  list: async() => {
    await db.query('select * from tv_posts');
  }
}
