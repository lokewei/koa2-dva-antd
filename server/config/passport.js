import passport from 'koa-passport';
// import AccountModel from '../models/account';
import UserModel from '../models/user'

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user)
  } catch (err) {
    done(err, null);
  }
})

const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy((username, password, done) => {
  UserModel.verify(username, password)
    .then((result) => {
      if (result != null) {
        done(null, result)
      } else {
        done(null, false)
      }
    })
}))
