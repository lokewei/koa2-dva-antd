import bcrypt from 'bcryptjs';

export default {

  crypt_salt: bcrypt.genSaltSync(10),

  cryptSync: (plain) => {
    return bcrypt.hashSync(plain, this.crypt_salt);
  },

  crypt: async (plain) => {
    return await bcrypt.hash(plain, this.crypt_salt);
  },

  verifySync: (plain, hash) => {
    return bcrypt.compareSync(plain, hash);
  }
}
