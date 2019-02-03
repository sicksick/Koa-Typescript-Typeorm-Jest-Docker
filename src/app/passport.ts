import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import * as passport from 'koa-passport';
import { User } from '../entity/user';
import { getRepository } from 'typeorm';

passport.serializeUser(function (user, done) {
  done(undefined, user);
});

passport.deserializeUser(async function (user, done) {
  try {
    done(undefined, user);
  } catch (err) {
    done(err);
  }
});

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async function (jwtPayload, cb) {
    const user = await getRepository(User).findOne({
      where: {
        email: jwtPayload.user.email
      },
      relations: ['groups']
    });

    if (!user) {
      cb(undefined);
    }

    return cb(undefined, user);
  }
));

module.exports = passport;
