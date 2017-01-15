import passport from 'koa-passport';
// import AccountModel from '../models/account';
import UserModel from '../models/user'

passport.serializeUser((user, done) => {
  console.log(2);
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    console.log(1)
    done(null, user)
  } catch (err) {
    done(err, null);
  }
})

const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy((username, password, done) => {
  console.log(`username: ${username}`);
  UserModel.verify(username, password)
    .then((result) => {
      if (result != null) {
        done(null, result)
      } else {
        done(null, false)
      }
    })
}))
