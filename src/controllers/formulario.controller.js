import axios from "axios";
import {
  estadosDocumento,
  estadosSms,
  tiposMovimiento,
  tiposRol,
} from "../public/js/enumeraciones";
import { serverAPI } from "../config/settings";

// pages formulario
export const mainPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    LIQDOC: user.userID,
    STADOC: estadosDocumento.pendiente + estadosDocumento.asignado,
  };

  try {
    const result = await axios.post(`http://${serverAPI}:8000/api/formularios`, {
      formulario,
    })
    const datos = {
      formularios: result.data,
      estadosDocumento: estadosDocumento,
      verTodo: false,
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
    EJEDOC: fecha.getFullYear() - 1,
    OFIDOC: user.oficina,
    FUNDOC: user.userID,
  };
  const oficina = user.rol === tiposRol.admin ? {} : { IDOFIC: user.oficina }
  const tipo = {}

  try {
    const tipos = await axios.post(`http://${serverAPI}:8000/api/tipos`, {
      tipo,
    })
    const oficinas = await axios.post(`http://${serverAPI}:8000/api/oficinas`, {
      oficina,
    })
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
  const tipo = {}
  const oficina = user.rol === tiposRol.admin ? {} : { IDOFIC: user.oficina }

  try {
    const tipos = await axios.post(`http://${serverAPI}:8000/api/tipos`, {
      tipo,
    })
    const oficinas = await axios.post(`http://${serverAPI}:8000/api/oficinas`, {
      oficina,
    })
    const result = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
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

// pages referencia
export const referenciasPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.params.iddoc,
  };

  try {
    const ret = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
      formulario,
    })
    const referencias = await axios.post(`http://${serverAPI}:8000/api/formularios/referencias`, {
      formulario,
    })

    const formularioData = {
      NIFCON: ret.data.NIFCON,
      NOMCON: ret.data.NOMCON,
      EJEDOC: ret.data.EJEDOC,
    }
    const datos = {
      formulario,
      formularioData,
      referencias: referencias.data,
    }

    res.render("admin/formularios/referencias", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const referenciasAddPage = async (req, res) => {
  const user = req.user;
  let formulario = {
    IDDOCU: req.params.iddoc,
  };
  const tipo = {}

  try {
    const tipos = await axios.post(`http://${serverAPI}:8000/api/tipos`, {
      tipo,
    })
    const result = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
      formulario,
    });
    const referencia = {
      DESREF: result.data.REFDOC,
      TIPREF: result.data.TIPDOC,
    }
    const datos = {
      formulario,
      referencia,
      tipos: tipos.data,
    };

    res.render("admin/formularios/referencias/add", { user, datos });
  } catch (error) {
    const msg =
      "No se ha podido acceder a los datos de la aplicación. Si persiste el error solicite asistencia.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const referenciasEditPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.params.iddoc
  }
  const tipo = {}
  let referencia = {
    IDREFE: req.params.idref,
  };

  try {
    const tipos = await axios.post(`http://${serverAPI}:8000/api/tipos`, {
      tipo,
    })
    const result = await axios.post(`http://${serverAPI}:8000/api/formularios/referencia`, {
      referencia,
    });
    const datos = {
      formulario,
      referencia: result.data,
      tipos: tipos.data,
    };

    res.render("admin/formularios/referencias/edit", { user, datos });
  } catch (error) {
    const msg =
      "No se ha podido acceder a los datos de la aplicación. Si persiste el error solicite asistencia.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}

// pages sms
export const smssPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.params.iddoc,
  };

  try {
    const result = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
      formulario,
    })
    const smss = await axios.post(`http://${serverAPI}:8000/api/formularios/smss`, {
      formulario,
    })

    const formularioData = {
      NIFCON: result.data.NIFCON,
      NOMCON: result.data.NOMCON,
      EJEDOC: result.data.EJEDOC,
    }
    const datos = {
      formulario,
      formularioData,
      smss: smss.data,
      estadosSms,
    }

    res.render("admin/formularios/smss", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const smssAddPage = async (req, res) => {
  const user = req.user;
  let formulario = {
    IDDOCU: req.params.iddoc,
  };

  try {
    const result = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
      formulario,
    });
    const sms = {
      MOVSMS: result.data.MOVCON,
    }
    const datos = {
      formulario,
      sms,
    };

    res.render("admin/formularios/smss/add", { user, datos });
  } catch (error) {
    const msg =
      "No se ha podido acceder a los datos de la aplicación. Si persiste el error solicite asistencia.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const smssEditPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.params.iddoc
  }
  let sms = {
    IDSMSS: req.params.idsms,
  };

  try {
    const result = await axios.post(`http://${serverAPI}:8000/api/formularios/sms`, {
      sms,
    });
    const datos = {
      formulario,
      sms: result.data,
    };

    res.render("admin/formularios/smss/edit", { user, datos });
  } catch (error) {
    const msg =
      "No se ha podido acceder a los datos de la aplicación. Si persiste el error solicite asistencia.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const smssReadonlyPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.params.iddoc,
  };

  try {
    const ret = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
      formulario,
    })
    const smss = await axios.post(`http://${serverAPI}:8000/api/formularios/smss`, {
      formulario,
    })

    const formularioData = {
      NIFCON: ret.data.NIFCON,
      NOMCON: ret.data.NOMCON,
      EJEDOC: ret.data.EJEDOC,
    }
    const datos = {
      formulario,
      formularioData,
      smss: smss.data,
      estadosSms,
    }

    res.render("admin/formularios/smss/readonly", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}

// otras pages
export const ejercicioPage = async (req, res) => {
  const user = req.user;
  const fecha = new Date();
  const tipo = {}
  let formulario = {
    IDDOCU: req.params.id,
  };

  try {
    const tipos = await axios.post(`http://${serverAPI}:8000/api/tipos`, {
      tipo,
    })
    const result = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
      formulario,
    })

    formulario = result.data
    formulario.EJEDOC = fecha.getFullYear()

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

// procs formulario
export const insert = async (req, res) => {
  const user = req.user;
  const referencia = "F" + randomString(10, "1234567890YMGS");
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
    LIQDOC: user.userID,
    STADOC: estadosDocumento.asignado,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearFormulario,
  };

  try {
    await axios.post(`http://${serverAPI}:8000/api/formularios/insert`, {
      formulario,
      movimiento,
    });

    if (req.body.verall === 's') {
      res.redirect("/admin/formularios/vertodo");
    } else {
      res.redirect("/admin/formularios");
    }
  } catch (error) {
    let msg = "No se ha podido crear el documento.";

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
    await axios.post(`http://${serverAPI}:8000/api/formularios/update`, {
      formulario,
      movimiento,
    });

    if (req.body.verall === 's') {
      res.redirect("/admin/formularios/vertodo");
    } else {
      res.redirect("/admin/formularios");
    }
  } catch (error) {
    let msg = "No se ha podido actualizar el documento.";

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
    await axios.post(`http://${serverAPI}:8000/api/formularios/delete`, {
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
    const result = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
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
      await axios.post(`http://${serverAPI}:8000/api/formularios/cambio`, {
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
  const sms = {
    MOVSMS: req.body.movsms,
    TEXSMS: req.body.texsms,
    STASMS: estadosSms.pendiente,
    CHKENV: req.body.chkenv ? true : false
  }

  try {
    const result = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
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

      await axios.post(`http://${serverAPI}:8000/api/formularios/resolver`, {
        formulario,
        sms,
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
    const result = await axios.post(`http://${serverAPI}:8000/api/formulario`, {
      formulario,
    });

    if (result.data.STADOC === estadosDocumento.asignado) {
      formulario = {
        IDDOCU: result.data.IDDOCU,
        LIQDOC: "PEND",
        STADOC: estadosDocumento.pendiente,
      };
      const movimiento = {
        USUMOV: user.id,
        TIPMOV: tiposMovimiento.desasignarFormulario,
      };

      await axios.post(`http://${serverAPI}:8000/api/formularios/unasign`, {
        formulario,
        movimiento,
      });
    }

    if (req.body.verall === 's') {
      res.redirect("/admin/formularios/vertodo");
    } else {
      res.redirect("/admin/formularios");
    }
  } catch (error) {
    const msg = "No se ha podido desasignar el documento.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const ejercicio = async (req, res) => {
  const user = req.user;
  //const referencia = "R" + randomString(10, "1234567890YMGS");
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
    TIPMOV: tiposMovimiento.crearEjercicio,
  };

  try {
    await axios.post(`http://${serverAPI}:8000/api/formularios/insert`, {
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

// referencias
export const insertReferencia = async (req, res) => {
  const user = req.user;
  const fecha = new Date()
  const formulario = {
    IDDOCU: req.body.iddocu
  }
  const referencia = {
    FECREF: fecha.toISOString().slice(0, 10),
    NIFREF: req.body.nifref.toUpperCase(),
    DESREF: req.body.desref,
    TIPREF: req.body.tipref,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearRelacionado,
  };

  try {
    await axios.post(`http://${serverAPI}:8000/api/formularios/referencias/insert`, {
      formulario,
      referencia,
      movimiento,
    });

    res.redirect(`/admin/formularios/referencias/${formulario.IDDOCU}`);
  } catch (error) {
    const msg = "No se ha podido insertar el relacionado.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const updateReferencia = async (req, res) => {
  const user = req.user;
  const fecha = new Date()
  const formulario = {
    IDDOCU: req.body.iddocu,
  };
  const referencia = {
    IDREFE: req.body.idrefe,
    FECREF: fecha.toISOString().slice(0, 10),
    NIFREF: req.body.nifref.toUpperCase(),
    DESREF: req.body.desref,
    TIPREF: req.body.tipref,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarRelacionado,
  };

  try {
    await axios.post(`http://${serverAPI}:8000/api/formularios/referencias/update`, {
      referencia,
      movimiento,
    });

    res.redirect(`/admin/formularios/referencias/${formulario.IDDOCU}`);
  } catch (error) {
    const msg = "No se ha podido actualizar el relacionado.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const removeReferencia = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.body.iddocu,
  };
  const referencia = {
    IDREFE: req.body.idrefe,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarRelacionado,
  };

  try {
    await axios.post(`http://${serverAPI}:8000/api/formularios/referencias/delete`, {
      formulario,
      referencia,
      movimiento,
    });

    res.redirect(`/admin/formularios/referencias/${formulario.IDDOCU}`);
  } catch (error) {
    const msg = "No se ha podido borrar el relacionado.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}

// sms
export const insertSms = async (req, res) => {
  const user = req.user;
  const fecha = new Date()
  const formulario = {
    IDDOCU: req.body.iddocu,
  };
  const sms = {
    FECSMS: fecha.toISOString().substring(0, 10),
    TEXSMS: req.body.texsms,
    MOVSMS: req.body.movsms,
    STASMS: estadosSms.pendiente,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearSms,
  };

  try {
    await axios.post(`http://${serverAPI}:8000/api/formularios/smss/insert`, {
      formulario,
      sms,
      movimiento,
    });

    res.redirect(`/admin/formularios/smss/${formulario.IDDOCU}`);
  } catch (error) {
    const msg = "No se ha podido enviar el sms.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const updateSms = async (req, res) => {
  const user = req.user;
  const fecha = new Date()
  const formulario = {
    IDDOCU: req.body.iddocu,
  }
  const sms = {
    IDSMSS: req.body.idsmss,
    FECSMS: fecha.toISOString().substring(0, 10),
    TEXSMS: req.body.texsms,
    MOVSMS: req.body.movsms,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarSms,
  };

  try {
    await axios.post(`http://${serverAPI}:8000/api/formularios/smss/update`, {
      sms,
      movimiento,
    });

    res.redirect(`/admin/formularios/smss/${formulario.IDDOCU}`);
  } catch (error) {
    const msg = "No se ha podido enviar el sms.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}
export const removeSms = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDDOCU: req.body.iddocu,
  }
  const sms = {
    IDSMSS: req.body.idsmss,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarSms,
  };

  try {
    await axios.post(`http://${serverAPI}:8000/api/formularios/smss/delete`, {
      formulario,
      sms,
      movimiento,
    });

    res.redirect(`/admin/formularios/smss/${formulario.IDDOCU}`);
  } catch (error) {
    const msg = "No se ha podido enviar el sms.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}

// otros
export const verTodo = async (req, res) => {
  const user = req.user;
  const formulario = {
    LIQDOC: user.userID,
    STADOC: estadosDocumento.resuelto,
  };

  try {
    const result = await axios.post(`http://${serverAPI}:8000/api/formularios`, {
      formulario,
    });
    const datos = {
      formularios: result.data,
      estadosDocumento,
      verTodo: true,
    };

    res.render("admin/formularios", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
}

// helpers
const randomString = (long, chars) => {
  let result = "";

  for (let i = long; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}
