import express from 'express';
const { request, response } = express;

import Authentication from '../api/v1/Auth/Auth.model.mjs';
import AuthUtils from '../api/v1/Auth/Auth.utils.mjs';

class Auth_Middleware {
  Admin = async (req = request, res = response, next) => {
    try {
      const token = AuthUtils.extractRawToken(req);

      if (!token) {
        return res.status(401).json({
          message: 'Unauthorized: Authentication token not provided',
          admin: false,
          Unauthorized: true,
          error: true,
        });
      }

      let email = await AuthUtils.DecodeToken(token);

      if (!email) {
        return res.status(401).json({
          message: 'Unauthorized: Missing email in token',
          admin: false,
          Unauthorized: true,
          error: true,
        });
      }

      let findRole = null;
      try {
        findRole = await Authentication.checkRole(email);
      } catch (roleError) {
        console.warn('Role verification failed:', roleError.message);
        return res.status(403).json({
          message: 'Access denied: User account not found or unverified',
          Unauthorized: true,
          admin: false,
          error: true,
        });
      }

      const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
      const isSuper =
        email.toLowerCase() === defaultEmail ||
        findRole === 'super admin' ||
        findRole === 'super_admin';
      const isAdmin = findRole === 'admin' || isSuper;

      if (!isAdmin) {
        return res.status(403).json({
          message: 'Access denied: You are not a verified administrator',
          Unauthorized: true,
          admin: false,
          error: true,
        });
      }

      // Attach user details to request object for downstream controllers
      req.user = { email, role: isSuper ? 'super admin' : 'admin' };
      req.email = email;
      req.token = token;
      req.isSuperAdmin = isSuper;

      next();
    } catch (error) {
      console.error('Error in Admin Middleware:', error.message);
      const statusCode = error.status || error.statusCode || 401;
      return res.status(statusCode).json({
        message: error.message || 'Unauthorized User',
        admin: false,
        Unauthorized: true,
        error: true,
      });
    }
  };

  SuperAdmin = async (req = request, res = response, next) => {
    try {
      const token = AuthUtils.extractRawToken(req);

      if (!token) {
        return res.status(401).json({
          message: 'Unauthorized: Authentication token not provided',
          admin: false,
          superAdmin: false,
          Unauthorized: true,
          error: true,
        });
      }

      let email = await AuthUtils.DecodeToken(token);

      if (!email) {
        return res.status(401).json({
          message: 'Unauthorized: Missing email in token',
          admin: false,
          superAdmin: false,
          Unauthorized: true,
          error: true,
        });
      }

      const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
      let findRole = null;
      try {
        findRole = await Authentication.checkRole(email);
      } catch (roleError) {
        console.warn('SuperAdmin role check failed:', roleError.message);
      }

      const isSuper =
        email.toLowerCase() === defaultEmail ||
        findRole === 'super admin' ||
        findRole === 'super_admin';

      if (!isSuper) {
        return res.status(403).json({
          message:
            'Access denied: Only Super Administrator can add, edit, or delete administrators',
          Unauthorized: true,
          admin: false,
          superAdmin: false,
          error: true,
        });
      }

      req.user = { email, role: 'super admin' };
      req.email = email;
      req.token = token;
      req.isSuperAdmin = true;

      next();
    } catch (error) {
      console.error('Error in SuperAdmin Middleware:', error.message);
      const statusCode = error.status || error.statusCode || 401;
      return res.status(statusCode).json({
        message: error.message || 'Unauthorized Super Administrator',
        admin: false,
        superAdmin: false,
        Unauthorized: true,
        error: true,
      });
    }
  };

  Student = async (req = request, res = response, next) => {
    try {
      const token = AuthUtils.extractRawToken(req);

      if (!token) {
        return res.status(401).json({
          message: 'Unauthorized: Authentication token not provided',
          student: false,
          Unauthorized: true,
          error: true,
        });
      }

      let email = await AuthUtils.DecodeToken(token);

      if (!email) {
        return res.status(401).json({
          message: 'Unauthorized: Missing email in token',
          student: false,
          Unauthorized: true,
          error: true,
        });
      }

      let findRole = null;
      try {
        findRole = await Authentication.checkRole(email);
      } catch (roleError) {
        console.warn('Role verification failed:', roleError.message);
        return res.status(403).json({
          message: 'Access denied: Student account not found or unverified',
          Unauthorized: true,
          student: false,
          error: true,
        });
      }

      if (findRole !== 'student') {
        return res.status(403).json({
          message: 'Access denied: You are not a verified student',
          Unauthorized: true,
          student: false,
          error: true,
        });
      }

      // Attach user details to request object for downstream controllers
      req.user = { email, role: findRole };
      req.email = email;
      req.token = token;

      next();
    } catch (error) {
      console.error('Error in Student Middleware:', error.message);
      const statusCode = error.status || error.statusCode || 401;
      return res.status(statusCode).json({
        message: error.message || 'Unauthorized User',
        student: false,
        Unauthorized: true,
        error: true,
      });
    }
  };
}

export default new Auth_Middleware();
