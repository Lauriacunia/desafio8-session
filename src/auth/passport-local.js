import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MongoDBUsers from "../daos/mongo/MongoDBUsers.js";
const db = new MongoDBUsers();

const localStrategy = LocalStrategy;

passport.use(
  "register",
  new localStrategy(
    {
      /**Por default espera un username y un password.
       * Pero se pueden cambiar los nombres de los campos con usernameField y passwordField
       */
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true, //Para que el callback reciba el req completo
    },
    async (req, username, password, done) => {
      // done es un callback que se ejecuta cuando termina la funcion
      const usuarioSaved = await db.getUserByUsername({ username });
      if (usuarioSaved) {
        return done(null, false, { message: "El usuario ya existe" });
      }

      await db.create({ username, password });
      return done(null, nuevoUsuario);
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true, //Para que el callback reciba el req completo
    },
    async (req, username, password, done) => {
      // done es un callback que se ejecuta cuando termina la funcion
      const usuarioSaved = await db.getUserByUsername({ username });
      if (!usuarioSaved) {
        return done(null, false, { message: "El usuario no existe" });
      }
      if (usuarioSaved.password !== password) {
        return done(null, false, { message: "El password es incorrecto" });
      }
      return done(null, usuarioSaved);
    }
  )
);

/** hay dos funciones que passport necesita para trabajar con los ids de los usuarios
 * en toda la app:
 * serializeUser: para guardar el id del usuario en la sesion
 * deserializeUser: para obtener el usuario de la base de datos por el id */
passport.serializeUser((user, done) => {
  done(null, user.id); // _id de mongo
});

passport.deserializeUser(async (id, done) => {
  const user = await db.getOne(id);
  done(null, user);
});

export { passport };
