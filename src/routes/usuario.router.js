import express from 'express'
import authRoutes, { verifyTokenAndAdmin } from '../middleware/auth'
import {
  mainPage,
  addPage,
  editPage,
  insertUsuario,
  updateUsuario,
  deleteUsuario,
  restablecerPassword,
  changePassword,
  updatePerfil,
  enviarNotificacion,
} from '../controllers/usuario.controller'
import { validationRules, validate } from '../middleware/usuarioValidator'

const usuarioRouter = express.Router()

// pages
usuarioRouter.get('/usuarios', verifyTokenAndAdmin, mainPage)
usuarioRouter.get('/usuarios/add', verifyTokenAndAdmin, addPage)
usuarioRouter.get('/usuarios/edit/:userid', verifyTokenAndAdmin, editPage)

// procedures
usuarioRouter.post(
  '/usuarios/insert',
  verifyTokenAndAdmin,
  validationRules,
  validate,
  insertUsuario
)
usuarioRouter.post(
  '/usuarios/update',
  verifyTokenAndAdmin,
  validationRules,
  validate,
  updateUsuario
)
usuarioRouter.post('/usuarios/delete', verifyTokenAndAdmin, deleteUsuario)
usuarioRouter.post(
  '/usuarios/restablecer',
  verifyTokenAndAdmin,
  restablecerPassword
)
usuarioRouter.post('/usuarios/notificacion', authRoutes, enviarNotificacion)
usuarioRouter.post('/usuarios/change', authRoutes, changePassword)
usuarioRouter.post('/usuarios/updatePerfil', authRoutes, updatePerfil)

export default usuarioRouter
