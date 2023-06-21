import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MongoDBUsers from "../daos/mongo/MongoDBUsers.js";
import { encryptPassword, comparePassword } from "../config/bcrypt.js";
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
      passReqToCallback: true, //Para que el callback reciba el req completo,
    },
    async (req, username, password, done) => {
      // done es un callback que se ejecuta cuando termina la funcion
      const usuarioSaved = await db.getUserByUsername({ username });
      if (usuarioSaved) {
        req.flash(
          "errorMessage",
          "El usuario ya existe en nuestra Base de datos. Por favor, elija otro nombre de usuario."
        );
        return done(null, false);
      } else {
        const hashPass = await encryptPassword(password);
        const newUser = {
          username: username,
          password: hashPass,
        };
        const response = await db.create(newUser);
        console.log("Nuevo usuario registrado: ", response);
        return done(null, response);
      }
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
      // aunque no se use el req, hay que ponerlo para que funcione
      // done es un callback que se ejecuta cuando termina la funcion

      const usuarioSaved = await db.getUserByUsername({ username });
      if (!usuarioSaved) {
        req.flash(
          "errorMessage",
          "El usuario ingresado no existe. Por favor, regístrese."
        );
        return done(null, false);
      }
      const isTruePassword = await comparePassword(
        password,
        usuarioSaved.password
      );
      if (!isTruePassword) {
        req.flash(
          "errorMessage",
          "La contraseña ingresada es incorrecta. Por favor, intente nuevamente."
        );
        return done(null, false);
      }
      // Guardamos el usuario en la session
      req.session.username = usuarioSaved.username;

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

// middleware para proteger rutas
function isAuth(req, res, next) {
  /**
   * req.isAuthenticated() es una función propia de passport que
   * verifica que el usuario este autenticado.
   */
  if (req.isAuthenticated()) {
    // Si esta autenticado sigue con la ejecucion que queremos
    return next();
  }
  res.redirect("/auth/login");
}

export { passport, isAuth };
