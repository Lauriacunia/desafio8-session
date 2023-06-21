import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  try {
    /**
     Setear una cookie
     res.cookie('cookie-test', 'informacion muy poderosa', { maxAge: 10000 });
       
     Obtener una cookie
     req.cookies['cookie-test']

     Obtener todas las cookies
     req.cookies

     Borrar una cookie
     res.clearCookie('cookie-test');

     Para firmar la cookie agregar el atributo signed en true.
      res.cookie('cookie-test', 'informacion muy poderosa', { signed: true });
    */
    res.cookie("cookie-test", "guardando cookie", {
      maxAge: 900000,
      httpOnly: true,
    });
    /** Ejemplo de session. Contador de visitas */
    if (req.session.cont) {
      //🗨 a la session se le agrega una propiedad cont que guarda ese dato
      req.session.cont++;
    } else {
      req.session.cont = 1;
    }
    /**🗨 en el navegador se inyecta UNA SOLA COOKIE con el
     * id de la session que se llama connect.sid
     */
    // con req.session se accede a la session y a sus propiedades (keys y values)
    console.log("Visitas: " + req.session.cont);
    /** Si quisiera borrar la session en un logout:
     * req.session.destroy((err) => {
     * if (!err) console.log("Session eliminada");
     * });
     *
     */

    //response
    res.render("home");
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default router;
