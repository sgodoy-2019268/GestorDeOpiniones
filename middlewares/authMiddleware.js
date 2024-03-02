import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
      return res.status(401).json({ message: 'Token de autenticación no proporcionado.' });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
  } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token de autenticación inválido.' });
  }
};


