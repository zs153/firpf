import dotenv from "dotenv";

dotenv.config();

export const dbPool = {
  user: process.env.NODE_ORACLEDB_USER,
  password: process.env.NODE_ORACLEDB_PASSWORD,
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
  poolMin: 0,
  poolMax: 4,
  poolIncrement: 1,
}
export const puerto = process.env.PORT;
export const secreto = process.env.SECRETO
export const publicKey = process.env.PUBLIC_KEY
export const privateKey = process.env.PRIVATE_KEY