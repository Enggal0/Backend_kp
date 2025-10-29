import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

const secret = process.env.ACCESS_TOKEN;

const accessToken = (userData) => jwt.sign(userData, secret, { expiresIn: '1h' });

const authMiddleware = async (req, res, next) => {
  const token = req.get('Authorization');
  if (!token) {
    res.status(401).json({
      error: true,
      message: 'Token is required',
    }).end();
  } else {
    const user = await prisma.user.findFirst({
      where: {
        token,
      },
    });
    if (!user) {
      res.status(401).json({
        error: true,
        message: 'Unauthorized',
      }).end();
    } else {
      req.user = user;
      next();
    }
  }
};

const roleMiddleware = (roles) => async (req, res, next) => {
  const token = req.get('Authorization');

  if (!token) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized',
    });
  }

  const user = await prisma.user.findFirst({
    where: { token },
  });

  if (!user) {
    return res.status(401).json({
      error: true,
      message: 'Invalid token',
    });
  }

  // Normalisasi: kalau roles string → jadikan array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({
      error: true,
      message: 'Forbidden',
    });
  }

  req.user = user;
  next();
};

export {
  accessToken,
  roleMiddleware,
  authMiddleware,
};
