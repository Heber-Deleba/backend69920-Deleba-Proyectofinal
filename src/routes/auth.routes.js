import { Router } from 'express';
import { userModel } from '../daos/mongodb/models/user.model.js';
import { validate } from '../middlewares/validation.middleware.js';
import { authDto } from '../dtos/auth.dto.js';
import { generateToken } from '../utils/jwt.js';
import passport from 'passport';
import { userDto } from '../dtos/user.dto.js';
import { createUserDto, updateUserDto } from '../dtos/user.dto.js';

const router = Router();

router.post(
  '/login',
  validate(authDto),
  passport.authenticate('login', { session: false }), 
  async (req, res) => {
    try {
      const payload = {
        email: req.user.email,
        role: req.user.role,
      };
      const token = generateToken(payload);
      res.cookie('token', token, {
        maxAge: 100000,
        httpOnly: true,
      });
      res.status(200).json({
        message: 'Sesión iniciada',
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
    }
  }
);

router.post(
  '/register',
  validate(userDto),
  passport.authenticate('register', { session: false }), 
  async (req, res) => {
    try {
      res.status(201).json({
        message: 'Usuario registrado',
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar', details: error.message });
    }
  }
);

router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario', details: error.message });
  }
});

export default router;

