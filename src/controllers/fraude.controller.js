import axios from "axios";
import jwt from "jsonwebtoken";
import {
  estadosDocumento,
  estadosSms,
  origenTipo,
  tiposMovimiento,
  tiposVisualizacion,
} from "../public/js/enumeraciones";

export const mainPageFraude = async (req, res) => {
  const user = req.user;
  const documento = {
    stafra: tiposVisualizacion.resueltos,
  };

  try {
    const result = await axios.post("http://localhost:8000/api/fraudes", {
      documento,
    });

    const datos = { documentos: result.data.dat };
    res.render("admin/fraudes", { user, datos });
  } catch (error) {
    res.redirect("/");
  }
};
export const addPageFraude = async (req, res) => {
  const user = req.user;
  const fecha = new Date();

  try {
    // tipos
    const resultTipos = await axios.post(
      "http://localhost:8000/api/tipos/origen",
      {
        origen: origenTipo.fraude,
      }
    );
    const arrTipos = resultTipos.data;

    // oficinas
    const resultOficinas = await axios.get(
      "http://localhost:8000/api/oficinas"
    );
    const arrOficinas = resultOficinas.data.dat;

    const documento = {
      idfrau: 0,
      fecfra: fecha.toISOString().substring(0, 10),
      nifcon: "",
      nomcon: "",
      emAcon: "",
      telcon: "",
      movcon: "",
      reffra: "",
      tipfra: 0,
      ejefra: fecha.getFullYear(),
      ofifra: 0,
      obsfra: "",
      funfra: user.userID,
      liqfra: "",
      stafra: estadosDocumento.pendiente,
    };
    const datos = {
      documento,
      arrTipos,
      arrOficinas,
    };

    res.render("admin/fraudes/add", { user, datos });
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const editPageFraude = async (req, res) => {
  const user = req.user;

  try {
    // tipos
    const resultTipos = await axios.post(
      "http://localhost:8000/api/tipos/origen",
      {
        origen: origenTipo.formulario,
      }
    );
    const arrTipos = resultTipos.data;

    // oficinas
    const resultOficinas = await axios.get(
      "http://localhost:8000/api/oficinas"
    );
    const arrOficinas = resultOficinas.data.dat;

    // fraudes
    const result = await axios.post("http://localhost:8000/api/fraude", {
      id: req.params.id,
    });

    const documento = {
      idfrau: result.data.idfrau,
      fecfra: result.data.fecfra,
      nifcon: result.data.nifcon,
      nomcon: result.data.nomcon,
      emacon: result.data.emacon,
      telcon: result.data.telcon,
      movcon: result.data.movcon,
      reffra: result.data.reffra,
      tipfra: result.data.tipfra,
      ejefra: result.data.ejefra,
      ofifra: result.data.ofifra,
      obsfra: result.data.obsfra,
      funfra: result.data.funfra,
      liqdoc: result.data.liqdoc,
    };
    const datos = {
      documento,
      arrTipos,
      arrOficinas,
    };

    res.render("admin/fraudes/edit", { user, datos });
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const insertFraude = async (req, res) => {
  const user = req.user;

  const documento = {
    fecfra: req.body.fecfra.toISOString().slice(0, 10),
    nifcon: req.body.nifcon,
    nomcon: req.body.nomcon,
    emacon: req.body.emacon,
    telcon: req.body.telcon,
    movcon: req.body.movcon,
    reffra: "",
    tipfra: req.body.tipfra,
    ejefra: req.body.ejefra,
    ofifra: req.body.ofifra,
    obsfra: req.body.obsfra,
    funfra: req.body.funfra,
    liqfra: "PEND",
    stafra: estadosDocumento.pendiente,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.crearDocumento,
  };

  try {
    const result = await axios.post(
      "http://localhost:8000/api/fraudes/insert",
      {
        documento,
        movimiento,
      }
    );

    res.redirect("/admin/fraudes");
  } catch (error) {
    console.log(req.alerts);
    let msg =
      "No se ha podido crear el fraude. Verifique los datos introducidos";

    // tipos
    const resultTipos = await axios.post(
      "http://localhost:8000/api/tipos/origen",
      {
        origen: origenTipo.fraude,
      }
    );
    const arrTipos = resultTipos.data;

    // oficinas
    const resultOficinas = await axios.get(
      "http://localhost:8000/api/oficinas"
    );
    const arrOficinas = resultOficinas.data.dat;

    if (error.response.data.errorNum === 20100) {
      msg = "El fraude ya existe. Verifique la referencia";
    }

    const datos = {
      documento,
      arrTipos,
      arrOficinas,
    };

    res.render("admin/fraudes/add", { user, datos, alerts: [{ msg }] });
  }
};
export const updateFraude = async (req, res) => {
  const user = req.user;

  const documento = {
    id: req.body.idfrau,
    fecha: req.body.fecfra,
    nif: req.body.nifcon,
    nombre: req.body.nomcon,
    email: req.body.emacon,
    telefono: req.body.telcon,
    movil: req.body.movcon,
    referencia: req.body.reffra,
    tipo: req.body.tipfra,
    ejercicio: req.body.ejefra,
    oficina: req.body.ofifra,
    observaciones: req.body.obsfra,
    funcionario: req.body.funfra,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.modificarDocumento,
  };

  try {
    const result = await axios.post(
      "http://localhost:8000/api/fraudes/update",
      {
        documento,
        movimiento,
      }
    );

    res.redirect("/admin/fraudes");
  } catch (error) {
    let msg =
      "No se ha podido actualizar el fraude. Verifique los datos introducidos";

    if (error.response.data.errorNum === 20100) {
      msg = "El fraude ya existe. Verifique la referencia";
    }

    try {
      // tipos
      const resultTipos = await axios.get("http://localhost:8000/api/tipos");
      const arrTipos = resultTipos.data.dat;

      // oficinas
      const resultOficinas = await axios.get(
        "http://localhost:8000/api/oficinas"
      );
      const arrOficinas = resultOficinas.data.dat;

      const datos = {
        documento,
        arrTipos,
        arrOficinas,
      };

      res.render("admin/fraudes/edit", { user, datos, alerts: [{ msg }] });
    } catch (error) {
      res.redirect("/admin/fraudes");
    }
  }
};
export const deleteFraude = async (req, res) => {
  const user = req.user;
  const documento = {
    id: req.body.idfrau,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.borrarDocumento,
  };

  try {
    const result = await axios.post(
      "http://localhost:8000/api/fraudes/delete",
      {
        documento,
        movimiento,
      }
    );

    res.redirect("/admin/fraudes");
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const asignarFraude = async (req, res) => {
  const user = req.user;
  const documento = {
    id: req.body.idfrau,
    liquidador: user.userID,
    estado: estadosDocumento.asignado,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.asignarfraude,
  };

  try {
    // estado fraude
    const resul = await axios.post("http://localhost:8000/api/fraude", {
      id: req.body.idfrau,
    });

    if (resul.data.stafra === estadosDocumento.pendiente) {
      const result = await axios.post(
        "http://localhost:8000/api/fraudes/cambioEstado",
        {
          documento,
          movimiento,
        }
      );

      res.redirect("/admin/fraudes");
    } else {
      res.redirect("/admin/fraudes");
    }
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const resolverFraude = async (req, res) => {
  const user = req.user;

  if (req.body.chkenv) {
  }
  const documento = {
    id: req.body.idfrau,
    liquidador: user.userID,
    estado: estadosDocumento.resuelto,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.resolverfraude,
  };

  try {
    // estado fraude
    const resul = await axios.post("http://localhost:8000/api/fraude", {
      id: req.body.idfrau,
    });
    // cambiar estado
    if (resul.data.stafra === estadosDocumento.asignado) {
      const result = await axios.post(
        "http://localhost:8000/api/fraudes/cambioEstado",
        {
          documento,
          movimiento,
        }
      );

      /// envio sms
      if (req.body.chkenv) {
        const sms = {
          texto: req.body.texsms,
          movil: req.body.movcon,
          estado: estadosSms.pendiente,
          idfraumento: req.body.idfrau,
        };
        const movimiento = {
          usuarioMov: user.id,
          tipoMov: tiposMovimiento.crearSms,
        };
        const result = await axios.post(
          "http://localhost:8000/api/fraudes/sms",
          {
            sms,
            movimiento,
          }
        );
      }

      res.redirect("/admin/fraudes");
    } else {
      res.redirect("/admin/fraudes");
    }
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const remitirFraude = async (req, res) => {
  const user = req.user;
  const documento = {
    id: req.body.idfrau,
    liquidador: user.userID,
    estado: estadosDocumento.remitido,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.remitirfraude,
  };

  try {
    // estado fraude
    const resul = await axios.post("http://localhost:8000/api/fraude", {
      id: req.body.idfrau,
    });

    if (resul.data.stafra === estadosDocumento.asignado) {
      const result = await axios.post(
        "http://localhost:8000/api/fraudes/cambioEstado",
        {
          documento,
          movimiento,
        }
      );

      res.redirect("/admin/fraudes");
    } else {
      res.redirect("/admin/fraudes");
    }
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const desadjudicarFraude = async (req, res) => {
  const user = req.user;
  const documento = {
    id: req.body.idfrau,
    liquidador: "PEND",
    estado: estadosDocumento.pendiente,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.desasignarfraude,
  };

  try {
    // estado fraude
    const resul = await axios.post("http://localhost:8000/api/fraude", {
      id: req.body.idfrau,
    });

    if (
      resul.data.stafra === estadosDocumento.asignado ||
      resul.data.stafra === estadosDocumento.resuelto ||
      resul.data.stafra === estadosDocumento.remitido
    ) {
      const result = await axios.post(
        "http://localhost:8000/api/fraudes/cambioEstado",
        {
          documento,
          movimiento,
        }
      );

      res.redirect("/admin/fraudes");
    } else {
      // TODO mensaje
      res.redirect("/admin/fraudes");
    }
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const verTodoFraude = async (req, res) => {
  const user = req.user;
  const documento = {
    stafra: tiposVisualizacion.todos,
  };

  try {
    const result = await axios.post("http://localhost:8000/api/fraudes", {
      documento,
    });

    const datos = { documentos: result.data.dat };
    res.render("admin/fraudes", { user, datos });
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const smsFraude = async (req, res) => {
  const user = req.user;
  const sms = {
    idfraumento: req.body.docsms,
    texto: req.body.texsms,
    movil: req.body.movsms,
    estado: estadosDocumento.pendiente,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.crearSms,
  };

  try {
    const result = await axios.post("http://localhost:8000/api/fraudes/sms", {
      sms,
      movimiento,
    });

    res.redirect("/admin/fraudes");
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const updatePerfilFraude = async (req, res) => {
  const user = req.user;
  const usuario = {
    id: user.id,
    userid: req.body.userid,
    nombre: req.body.nomusu,
    email: req.body.emausu,
    rol: user.rol,
    oficina: user.oficina,
    telefono: req.body.telusu,
    usuarioMov: user.id,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.crearDocumento,
  };

  try {
    const result = await axios.post(
      "http://localhost:8000/api/fraudes/updatePerfil",
      {
        usuario,
        movimiento,
      }
    );

    const accessToken = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        userID: usuario.userid,
        email: usuario.email,
        rol: usuario.rol,
        oficina: usuario.oficina,
        telefono: usuario.telefono,
      },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: "8h" }
    );
    const options = {
      path: "/",
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 8, // 8 horas
      httpOnly: true,
    };

    res.cookie("auth", accessToken, options);
    res.redirect("/admin/fraudes");
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
export const changePasswordFraude = async (req, res) => {
  const user = req.user;

  const usuario = {
    id: user.id,
    password: req.body.pwdusu,
  };
  const movimiento = {
    usuarioMov: user.id,
    tipoMov: tiposMovimiento.crearDocumento,
  };

  try {
    const result = await axios.post(
      "http://localhost:8000/api/fraudes/cambio",
      {
        usuario,
        movimiento,
      }
    );

    res.redirect("/admin/fraudes");
  } catch (error) {
    res.redirect("/admin/fraudes");
  }
};
