import bcrypt from 'bcryptjs';

const cryptSalt = bcrypt.genSaltSync(10);

export default {

  cryptSync: (plain) => {
    return bcrypt.hashSync(plain, cryptSalt);
  },

  crypt: async (plain) => {
    return await bcrypt.hash(plain, cryptSalt);
  },

  verifySync: (plain, hash) => {
    return bcrypt.compareSync(plain, hash);
  }
}
