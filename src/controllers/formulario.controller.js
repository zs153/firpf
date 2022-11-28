import axios from "axios";
import {
  estadosDocumento,
  estadosSms,
  tiposMovimiento,
  tiposRol,
} from "../public/js/enumeraciones";

export const mainPage = async (req, res) => {
  const user = req.user;
  const verTodo = false
  const formulario = {
    LIQDOC: user.userID,
    TIPVIS: estadosDocumento.pendiente + estadosDocumento.asignado,
  };

  try {
    const result = await axios.post("http://localhost:8000/api/formularios", {
      formulario,
    })
    const datos = {
      formularios: JSON.stringify(result.data),
      estadosDocumento,
      tiposRol,
      verTodo,
    }

    res.render("admin/formularios", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const addPage = async (req, res) => {
  const user = req.user;
  const fecha = new Date();
  const formulario = {
    ISOFEC: fecha.toISOString().slice(0, 10),
    EJEFRA: fecha.getFullYear() - 1,
    OFIDOC: user.oficina,
    FUNDOC: user.userID,
    STADOC: estadosDocumento.pendiente,
  };

  try {
    const tipos = await axios.post("http://localhost:8000/api/tipos")
    const oficinas = await axios.post("http://localhost:8000/api/oficinas")
    const datos = {
      formulario,
      tipos: tipos.data,
      oficinas: oficinas.data,
    }

    res.render("admin/formularios/add", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const editPage = async (req, res) => {
  const user = req.user;
  let formulario = {
    IDDOCU: req.params.id,
  };

  try {
    const tipos = await axios.post("http://localhost:8000/api/tipos", {})
    const oficinas = await axios.post("http://localhost:8000/api/oficinas", {})
    const result = await axios.post("http://localhost:8000/api/formulario", {
      formulario,
    });

    formulario = result.data
    formulario.ISOFEC = formulario.FECDOC.slice(0, 10)
    const datos = {
      formulario,
      tipos: tipos.data,
      oficinas: oficinas.data,
      tiposRol,
    };

    res.render("admin/formularios/edit", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}

// otros
export const ejercicioPage = async (req, res) => {
  const user = req.user;
  const fecha = new Date();
  let formulario = {
    IDDOCU: req.params.id,
  };

  try {
    const tipos = await axios.post("http://localhost:8000/api/tipos", {})
    const result = await axios.post("http://localhost:8000/api/formulario", {
      formulario,
    })

    formulario = result.data
    formulario.FECISO = fecha.toISOString().substring(0, 10)
    formulario.EJEDOC = fecha.getFullYear()
    formulario.FUNDOC = user.userID
    formulario.LIQDOC = user.userID
    formulario.STADOC = estadosDocumento.asignado

    const datos = {
      formulario,
      tipos: tipos.data,
    };

    res.render("admin/formularios/ejercicio", { user, datos });
  } catch (error) {
    const msg =
      "No se ha podido acceder a los datos de la aplicación. Si persiste el error solicite asistencia.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const relacionPage = async (req, res) => {
  const user = req.user;
  const fecha = new Date();
  let formulario = {
    IDDOCU: req.params.iddocu,
  };

  try {
    // formulario
    const result = await axios.post("http://localhost:8000/api/formulario", {
      documento,
    });

    formulario = result.data
    formulario.NIFCON = ''
    formulario.NOMCON = ''
    formulario.EMACON = ''
    formulario.TELCON = ''
    formulario.MOVCON = ''
    formulario.OBSDOC = ''
    formulario.EJEDOC = fecha.getFullYear()
    formulario.FUNDOC = user.userID
    formulario.LIQDOC = user.userID
    formulario.STADOC = estadosDocumento.asignado

    const datos = {
      formulario,
    };

    res.render("admin/formularios/relacion", { user, datos });
  } catch (error) {
    const msg =
      "No se ha podido acceder a los datos de la aplicación. Si persiste el error solicite asistencia.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}

// procs formulario
export const insert = async (req, res) => {
  const user = req.user;
  const referencia = "Z" + randomString(10, "1234567890YMGS");
  const formulario = {
    FECDOC: req.body.fecdoc,
    NIFCON: req.body.nifcon.toUpperCase(),
    NOMCON: req.body.nomcon.toUpperCase(),
    EMACON: req.body.emacon,
    TELCON: req.body.telcon,
    MOVCON: req.body.movcon,
    REFDOC: referencia,
    TIPDOC: req.body.tipdoc,
    EJEDOC: req.body.ejedoc,
    OFIDOC: req.body.ofidoc,
    OBSDOC: req.body.obsdoc,
    FUNDOC: req.body.fundoc,
    LIQDOC: "PEND",
    STADOC: estadosDocumento.pendiente,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearFormulario,
  };

  try {
    await axios.post("http://localhost:8000/api/formularios/insert", {
      formulario,
      movimiento,
    });

    res.redirect("/admin/formularios");
  } catch (error) {
    let msg = "No se ha podido crear el documento.";

    if (error.response.data.errorNum === 20100) {
      msg = "El documento ya existe.";
    }

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const update = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.body.iddocu,
    FECDOC: req.body.fecdoc,
    NIFCON: req.body.nifcon.toUpperCase(),
    NOMCON: req.body.nomcon.toUpperCase(),
    EMACON: req.body.emacon,
    TELCON: req.body.telcon,
    MOVCON: req.body.movcon,
    TIPDOC: req.body.tipdoc,
    EJEDOC: req.body.ejedoc,
    OFIDOC: req.body.ofidoc,
    OBSDOC: req.body.obsdoc,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarFormulario,
  };

  try {
    await axios.post("http://localhost:8000/api/formularios/update", {
      formulario,
      movimiento,
    });

    res.redirect("/admin/formularios");
  } catch (error) {
    let msg = "No se ha podido actualizar el documento.";

    if (error.response.data.errorNum === 20100) {
      msg = "El documento ya existe. Verifique los datos introducidos";
    }

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const remove = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.body.iddocu,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarFormulario,
  };

  try {
    await axios.post("http://localhost:8000/api/formularios/delete", {
      formulario,
      movimiento,
    });

    res.redirect("/admin/formularios");
  } catch (error) {
    const msg = "No se ha podido elminar el documento.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const asignar = async (req, res) => {
  const user = req.user;
  let formulario = {
    IDDOCU: req.body.iddocu,
  };

  try {
    const result = await axios.post("http://localhost:8000/api/formulario", {
      formulario,
    });

    formulario = {
      IDDOCU: result.data.IDDOCU,
      LIQDOC: user.userID,
      STADOC: estadosDocumento.asignado,
    };
    const movimiento = {
      USUMOV: user.id,
      TIPMOV: tiposMovimiento.asignarFormulario,
    };

    if (result.data.STADOC === estadosDocumento.pendiente) {
      await axios.post("http://localhost:8000/api/formularios/cambio", {
        formulario,
        movimiento,
      });

      res.redirect("/admin/formularios");
    }
  } catch (error) {
    const msg = "No se ha podido asignar el documento.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const resolver = async (req, res) => {
  const user = req.user;
  let formulario = {
    IDDOCU: req.body.iddocu,
  };

  try {
    const result = await axios.post("http://localhost:8000/api/formulario", {
      formulario,
    });

    if (result.data.STADOC === estadosDocumento.asignado) {
      formulario = {
        IDDOCU: result.data.IDDOCU,
        LIQDOC: user.userID,
        STADOC: estadosDocumento.resuelto,
      };
      const movimiento = {
        USUMOV: user.id,
        TIPMOV: tiposMovimiento.resolverFormulario,
      };

      await axios.post("http://localhost:8000/api/formularios/resolver", {
        formulario,
        movimiento,
      });
    }

    res.redirect("/admin/formularios");
  } catch (error) {
    const msg = "No se ha podido resolver el documento.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const desasignar = async (req, res) => {
  const user = req.user;
  let formulario = {
    IDDOCU: req.body.iddocu,
  };

  try {
    const result = await axios.post("http://localhost:8000/api/formulario", {
      formulario,
    });

    if (result.data.STADOC === estadosDocumento.asignado ||
      result.data.STADOC === estadosDocumento.resuelto) {
      formulario = {
        IDDOCU: result.data.IDDOCU,
        LIQDOC: "PEND",
        STADOC: estadosDocumento.pendiente,
      };
      const movimiento = {
        USUMOV: user.id,
        TIPMOV: tiposMovimiento.desasignarFormulario,
      };

      await axios.post("http://localhost:8000/api/formularios/unasign", {
        formulario,
        movimiento,
      });
    }

    res.redirect("/admin/formularios");
  } catch (error) {
    const msg = "No se ha podido desasignar el documento.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const verTodo = async (req, res) => {
  const user = req.user;
  const verTodo = true;
  const formulario = {
    LIQDOC: user.userID,
    TIPVIS: estadosDocumento.resuelto,
  };

  try {
    const result = await axios.post("http://localhost:8000/api/formularios", {
      formulario,
    });
    const datos = {
      formularios: JSON.stringify(result.data),
      estadosDocumento,
      tiposRol,
      verTodo,
    };

    res.render("admin/formularios", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const sms = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.body.iddocu,
  };
  const sms = {
    TEXSMS: req.body.texsms,
    MOVSMS: req.body.movsms,
    STASMS: estadosSms.pendiente,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearSms,
  };

  try {
    await axios.post("http://localhost:8000/api/sms/insert", {
      formulario,
      sms,
      movimiento,
    });

    res.redirect("/admin/formularios");
  } catch (error) {
    const msg = "No se ha podido enviar el sms.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}

// procs otros
export const ejercicio = async (req, res) => {
  const user = req.user;
  const referencia = "R" + randomString(10, "1234567890YMGS");
  const fecha = new Date()
  const formulario = {
    FECDOC: fecha.toISOString().slice(0, 10),
    NIFCON: req.body.nifcon,
    NOMCON: req.body.nomcon,
    EMACON: req.body.emacon,
    TELCON: req.body.telcon,
    MOVCON: req.body.movcon,
    REFDOC: referencia,
    TIPDOC: req.body.tipdoc,
    EJEDOC: req.body.ejedoc,
    OFIDOC: user.oficina,
    OBSDOC: req.body.obsdoc,
    FUNDOC: user.userID,
    LIQDOC: user.userID,
    STADOC: estadosDocumento.asignado,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.nuevoEjercicioFormularios,
  };

  try {
    await axios.post("http://localhost:8000/api/formularios/insert", {
      formulario,
      movimiento,
    });

    res.redirect("/admin/formularios");
  } catch (error) {
    const msg = "No se ha podido insertar el nuevo ejercicio.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const relacion = async (req, res) => {
  const user = req.user;
  const fecha = new Date()
  const formulario = {
    FECDOC: fecha.toISOString().slice(0, 10),
    NIFCON: req.body.nifcon,
    NOMCON: req.body.nomcon,
    EMACON: req.body.emacon,
    TELCON: req.body.telcon,
    MOVCON: req.body.movcon,
    REFDOC: req.body.refdoc,
    TIPDOC: req.body.tipdoc,
    EJEDOC: req.body.ejedoc,
    OFIDOC: user.oficina,
    OBSDOC: req.body.obsdoc,
    FUNDOC: user.userID,
    LIQDOC: user.userID,
    STADOC: estadosDocumento.asignado,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.nuevoRelacionadoFormularios,
  };

  try {
    await axios.post("http://localhost:8000/api/formularios/insert", {
      formulario,
      movimiento,
    });

    res.redirect("/admin/formularios");
  } catch (error) {
    const msg = "No se ha podido insertar el relacionado.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}

// helpers
function randomString(long, chars) {
  let result = "";

  for (let i = long; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}
