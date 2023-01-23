import { createPrivateKey } from 'crypto'
import bcrypt from "bcrypt";
import { V4 } from 'paseto'
import { privateKey, secreto, serverWEB } from '../config/settings'
import * as DAL from "../models/autoriza.model";

// pages
export const loginPage = async (req, res) => {
  const datos = {
    url: req.query.valid
  }

  res.render("sign-in", {
    datos,
    alerts: undefined,
  });
};
export const olvidoPage = async (req, res) => {
  res.render("forgot", { datos: {}, alerts: undefined });
};

// procs
export const autorizar = async (req, res) => {
  const context = {
    USERID: req.body.userid,
  }
  const url = req.body.url

  try {
    const rows = await DAL.find(context);

    if (rows.length === 1) {
      const usuario = rows[0];

      // password
      const pwdusu = req.body.pwdusu

      // verifica contaseña
      bcrypt.compare(pwdusu, usuario.PWDUSU, async (err, ret) => {
        if (err) {
          res.render('sign-in', {
            datos: req.body,
            alerts: [{ msg: 'No se ha podido verificar la identidad del usuario' }]
          })
        }
        if (ret) {
          // payload
          const payload = {
            id: usuario.IDUSUA,
            userid: usuario.USERID,
            rol: usuario.ROLUSU,
            oficina: usuario.OFIUSU,
          }

          // const { publicKey, privateKey } = generateKeyPairSync('ed25519', {
          //   modulus: 4096,
          //   publicKeyEncoding: {
          //     type: 'spki',
          //     format: 'pem',
          //   },
          //   privateKeyEncoding: {
          //     type: 'pkcs8',
          //     format: 'pem',
          //     cipher: 'aes-256-cbc',
          //     passphrase: secreto,
          //   },
          // })
          const key = createPrivateKey({
            'key': privateKey,
            'format': 'pem',
            'type': 'pkcs8',
            'cipher': 'aes-256-cbc',
            'passphrase': secreto,
          })
          await V4.sign(payload, key, {
            audience: 'urn:client:claim',
            issuer: 'http://localhost:4600',
            expiresIn: '6 hours',
          }).then(token => {
            const options = {
              path: "/",
              sameSite: true,
              maxAge: 1000 * 60 * 60 * 6, // 6 horas
              httpOnly: true,
            };
            res.cookie('auth', token, options)
            res.writeHead(302, {
              'Location': `http://${url}/admin`,
              'Content-Type': 'text/plain',
            })
            res.end()
          })
        } else {
          res.render('sign-in', {
            datos: req.body,
            alerts: [{ msg: 'La contraseña no es correcta' }]
          })
        }
      });

      return
    } else {
      res.render('sign-in', {
        datos: req.body,
        alerts: [{ msg: 'El usuario no existe' }]
      })
    }
  } catch (err) {
    res.render('sign-in', {
      datos: req.body,
      alerts: [{ msg: 'No se ha podido conectar con la base de datos' }]
    })
  }
};
export const olvido = async (req, res) => {
  const randomString = Math.random().toString(36).substring(2, 10);
  const salt = await bcrypt.genSalt(10);
  const passHash = await bcrypt.hash(randomString, salt);
  const tiposMovimiento = {
    olvidoPassword: 61,
  }
  const usuario = {
    emausu: req.body.emausu,
    pwdusu: passHash,
  };
  const movimiento = {
    tipmov: tiposMovimiento.olvidoPassword,
  };
  const saltus = {
    saltus: randomString,
  }
  const context = Object.assign(usuario, movimiento, saltus)

  try {
    await DAL.forgot(context);

    res.render("okForgot", {
      alerts: undefined,
    });
  } catch (error) {
    let msg

    if (error.errorNum === 20100) {
      msg = 'El correo electrónico no existe'
    } else if (error.errorNum === 20101) {
      msg = 'No se puede enviar el correo electrónico'
    } else if (error.errorNum === 20102) {
      msg = 'No se pueden actualizar los datos'
    }

    res.render("sign-in", {
      datos: req.body,
      alerts: [{ msg }],
    });
  }
};
