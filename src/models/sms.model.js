import oracledb from "oracledb";
import Movimiento from "./movimiento.model";
import { connectionString } from "../config/settings";

class SMS {
  constructor(id, texto, movil, estado) {
    this.idsmss = id;
    this.texsms = texto;
    this.movsms = movil;
    this.stasms = estado;
    this.iddocu = 0;
    this.refdoc = "";

    this.movi = new Movimiento();
  }

  get id() {
    return this.idsmss;
  }
  set id(value) {
    this.idsmss = value;
  }
  get texto() {
    return this.texsms;
  }
  set texto(value) {
    this.texsms = value;
  }
  get movil() {
    return this.movsms;
  }
  set movil(value) {
    this.movsms = value;
  }
  get estado() {
    return this.stasms;
  }
  set estado(value) {
    this.stasms = value;
  }

  // documento
  get idDocumento() {
    return this.iddocu;
  }
  set idDocumento(value) {
    this.iddocu = value;
  }
  get referenciaDocumento() {
    return this.refdoc;
  }
  set referenciaDocumento(value) {
    this.refdoc = value;
  }

  // movimiento
  get movimiento() {
    return this.movi;
  }
  set movimiento(value) {
    this.movi = value;
  }

  // procedimientos
  async getSms() {
    let conn;
    let ret;

    try {
      const conn = await oracledb.getConnection(connectionString);
      const result = await conn.execute(
        "SELECT ss.*,dd.refdoc FROM smss ss INNER JOIN smssdocumento sd ON sd.idsmss = ss.idsmss INNER JOIN documentos dd ON dd.iddocu = sd.iddocu WHERE ss.idsmss = :p_idsmss",
        [this.id],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      if (result) {
        this.id = result.rows[0].IDSMSS;
        this.fecha = result.rows[0].FECSMS;
        this.texto = result.rows[0].TEXSMS;
        this.movil = result.rows[0].MOVSMS;
        this.estado = result.rows[0].STASMS;
        this.referenciaDocumento = result.rows[0].REFDOC;

        ret = {
          err: undefined,
          dat: result.rows,
        };
      } else {
        ret = {
          err: 1,
          dat: "No hay registro",
        };
      }
    } catch (error) {
      ret = {
        err: error,
        dat: undefined,
      };
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (error) {
          ret = {
            err: error,
            dat: undefined,
          };
        }
      }
    }

    return ret;
  }
  async getSmss() {
    let conn;
    let ret;

    try {
      const conn = await oracledb.getConnection(connectionString);
      const result = await conn.execute(
        "SELECT ss.*,dd.*, TO_CHAR(ss.fecsms, 'DD/MM/YYYY') AS strfec FROM smss ss INNER JOIN smssdocumento sd ON sd.idsmss = ss.idsmss INNER JOIN documentos dd ON dd.iddocu = sd.iddocu ORDER BY ss.fecsms",
        [],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      ret = {
        err: undefined,
        dat: result.rows,
      };
    } catch (error) {
      ret = {
        err: error,
        dat: undefined,
      };
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (error) {
          ret = {
            err: error,
            dat: undefined,
          };
        }
      }
    }

    return ret;
  }
  async insert() {
    let conn;
    let ret;

    try {
      const conn = await oracledb.getConnection(connectionString);
      const result = await conn.execute(
        "BEGIN FORMULARIOS_PKG.INSERTSMS(:p_texsms, :p_movsms, :p_stasms, :p_iddocu, :p_usumov, :p_tipmov, :p_idsmss); END;",
        {
          // sms
          p_texsms: this.texto,
          p_movsms: this.movil,
          p_stasms: this.estado,
          // documento
          p_iddocu: this.idDocumento,
          // movimiento
          p_usumov: this.movimiento.usuario,
          p_tipmov: this.movimiento.tipo,
          // retorno
          p_idsmss: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        }
      );

      ret = {
        err: undefined,
        dat: result.outBinds,
      };
    } catch (error) {
      ret = {
        err: error,
        dat: undefined,
      };
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (error) {
          ret = {
            err: error,
            dat: undefined,
          };
        }
      }
    }

    return ret;
  }
  async update() {
    let conn;
    let ret;

    try {
      const conn = await oracledb.getConnection(connectionString);
      await conn.execute(
        "BEGIN FORMULARIOS_PKG.UPDATESMS(:p_idsmss, :p_texsms, :p_stasms, :p_usumov, :p_tipmov); END;",
        {
          // sms
          p_idsmss: this.id,
          p_texsms: this.texto,
          p_stasms: this.estado,
          // movimiento
          p_usumov: this.movimiento.usuario,
          p_tipmov: this.movimiento.tipo,
        }
      );

      ret = {
        err: undefined,
        dat: this.id,
      };
    } catch (error) {
      ret = {
        err: error,
        dat: undefined,
      };
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (error) {
          ret = {
            err: error,
            dat: undefined,
          };
        }
      }
    }

    return ret;
  }
  async delete() {
    let conn;
    let ret;

    try {
      conn = await oracledb.getConnection(connectionString);
      await conn.execute(
        "BEGIN FORMULARIOS_PKG.DELETESMS(:p_idsmss, :p_usumov, :p_tipmov); END;",
        {
          // sms
          p_idsmss: this.id,
          // movimiento
          p_usumov: this.movimiento.usuario,
          p_tipmov: this.movimiento.tipo,
        }
      );

      ret = {
        err: undefined,
        dat: this.id,
      };
    } catch (error) {
      ret = {
        err: error,
        dat: undefined,
      };
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (error) {
          ret = {
            err: error,
            dat: undefined,
          };
        }
      }
    }

    return ret;
  }
}

export default SMS;
