import { Router } from 'express';
const router = Router();
import AuthController from './Auth.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';

// Authentication
router.post('/v1/auth/login', AuthController.Login);

router.post(
  '/v1/auth/Admin/SignUp',
  upload.single('profileImage'),
  AuthMiddleware.SuperAdmin,
  AuthController.SignUP_Admin
);

// Administrator Management (One route per operation)
router.post(
  '/v1/admin/create',
  AuthMiddleware.SuperAdmin,
  AuthController.Create_Admin
);

router.get(
  '/v1/admin/list',
  AuthMiddleware.Admin,
  AuthController.Get_All_Admins
);

router.put(
  '/v1/admin/update/:id',
  AuthMiddleware.SuperAdmin,
  AuthController.Update_Admin
);

router.delete(
  '/v1/admin/delete/:id',
  AuthMiddleware.SuperAdmin,
  AuthController.Delete_Admin
);

export { router as AuthRouter };
