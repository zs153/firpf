import { simpleExecute } from "../services/database.js";

const baseQuery = `SELECT 
  idusua, userid, rolusu, ofiusu, pwdusu FROM usuarios
WHERE userid = :userid
`
const olvidoSql = `BEGIN OPORRAK_PKG.FORGOTPASSWORD(
  :emausu,
  :pwdusu, 
  :tipmov,
  :saltus
); END;
`

export const find = async (context) => {
  const result = await simpleExecute(baseQuery, context);

  return result.rows;
}
export const forgot = async (context) => {
  let result;
  const binds = {
    userid: context.USERID,
  }

  try {
    await simpleExecute(olvidoSql, binds);

    result = context;
  } catch (error) {
    throw (error)
  }

  return result;
};