import oracledb from "oracledb";
import { simpleExecute } from "../services/database.js";

const baseQuery = `SELECT 
    idusua,
    nomusu,
    ofiusu,
    rolusu,
    userid,
    emausu,
    perusu,
    telusu,
    pwdusu,
    stausu
  FROM usuarios
`;
const largeQuery = `SELECT 
    uu.idusua,
    uu.nomusu,
    uu.userid,
    uu.telusu,
    uu.stausu,
    uu.ofiusu,
    oo.desofi
  FROM usuarios uu
  INNER JOIN oficinas oo ON oo.idofic = ofiusu
`;
const insertSql = `BEGIN FORMULARIOS_PKG.INSERTUSUARIO(
    :nomusu,
    :ofiusu,
    :rolusu,
    :userid,
    :emausu,
    :perusu,
    :telusu,
    :pwdusu,
    :stausu,
    :usumov,
    :tipmov,
    :idusua
  ); END;
`;
const updateSql = `BEGIN FORMULARIOS_PKG.UPDATEUSUARIO(
    :idusua,
    :nomusu, 
    :ofiusu, 
    :rolusu, 
    :userid, 
    :emausu, 
    :perusu, 
    :telusu, 
    :stausu, 
    :usumov, 
    :tipmov
  ); END;
`;
const removeSql = `BEGIN FORMULARIOS_PKG.DELETEUSUARIO(
  :idusua,
  :usumov,
  :tipmov 
); END;
`;
const registroSql = `BEGIN FORMULARIOS_PKG.REGISTROUSUARIO(
  :nomusu, 
  :ofiusu, 
  :rolusu, 
  :userid, 
  :emausu, 
  :perusu, 
  :telusu, 
  :pwdusu, 
  :stausu, 
  :tipmov,
  :saltus, 
  :idusua
); END;
`;
const cambioSql = `BEGIN FORMULARIOS_PKG.CHANGEPASSWORD(
  :idusua,
  :pwdusu, 
  :usumov,
  :tipmov
); END;
`;
const olvidoSql = `BEGIN FORMULARIOS_PKG.FORGOTPASSWORD(
  :emausu,
  :pwdusu, 
  :tipmov,
  :saltus
); END;
`;
const perfilSql = `BEGIN FORMULARIOS_PKG.UPDATEPERFILUSUARIO(
  :idusua,
  :nomusu,
  :ofiusu,
  :emausu,
  :telusu, 
  :usumov,
  :tipmov
); END;
`;

export const find = async (context) => {
  let query = baseQuery;
  let binds = {};
  if (context.IDUSUA) {
    binds.idusua = context.IDUSUA;
    query += "WHERE idusua = :idusua";
  }
  if (context.USERID) {
    binds.userid = context.USERID;
    query += "WHERE userid = :userid";
  }
  if (context.EMAUSU) {
    binds.emausu = context.EMAUSU;
    query += "WHERE emausu = :emausu";
  }
  
  console.log(query,binds)
  const result = await simpleExecute(query, binds);
  return result.rows;
};
export const findAll = async () => {
  let query = largeQuery;
  let binds = {}

  const result = await simpleExecute(query, binds);
  return result.rows;
};

export const insert = async (bind) => {
  bind.idusua = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER,
  };

  try {
    const result = await simpleExecute(insertSql, bind);

    bind.idusua = await result.outBinds.idusua;
  } catch (error) {
    bind = null;
  }

  return bind;
};
export const update = async (bind) => {
  let result;

  try {
    await simpleExecute(updateSql, bind);

    result = bind;
  } catch (error) {
    result = null;
  }

  return result;
};
export const remove = async (bind) => {
  let result;

  try {
    await simpleExecute(removeSql, bind);

    result = bind;
  } catch (error) {
    result = null;
  }

  return result;
};
export const register = async (bind) => {
  bind.idusua = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER,
  };
  try {
    const result = await simpleExecute(registroSql, bind);

    bind.idusua = await result.outBinds.idusua;
  } catch (error) {
    bind = null;
  }

  return bind;
};
export const change = async (bind) => {
  let result;

  try {
    await simpleExecute(cambioSql, bind);

    result = bind;
  } catch (error) {
    result = null;
  }

  return result;
};
export const forgot = async (bind) => {
  let result;

  try {
    await simpleExecute(olvidoSql, bind);

    result = bind;
  } catch (error) {
    result = null;
  }

  return result;
};
export const profile = async (bind) => {
  let result;

  try {
    await simpleExecute(perfilSql, bind);

    result = bind;
  } catch (error) {
    result = null;
  }

  return result;
}