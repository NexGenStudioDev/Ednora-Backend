import {
  validateLogin,
  validateCreateAdmin,
  validateUpdateAdmin,
} from '../Auth.validator.mjs';

describe('Auth Admin & Login Zod Validation Suite', () => {
  describe('Login Validation', () => {
    it('should validate correct login credentials', () => {
      const valid = validateLogin({
        email: 'admin@gmail.com',
        password: 'Admin@123',
      });
      expect(valid.email).toBe('admin@gmail.com');
      expect(valid.password).toBe('Admin@123');
    });

    it('should normalize uppercase email during login', () => {
      const valid = validateLogin({
        email: 'ADMIN@GMAIL.COM',
        password: 'Admin@123',
      });
      expect(valid.email).toBe('admin@gmail.com');
    });

    it('should reject invalid email format in login', () => {
      expect(() => {
        validateLogin({
          email: 'not-an-email',
          password: 'Admin@123',
        });
      }).toThrow(/Invalid email address format/);
    });

    it('should reject empty password in login', () => {
      expect(() => {
        validateLogin({
          email: 'admin@gmail.com',
          password: '',
        });
      }).toThrow(/Password cannot be empty/);
    });
  });

  describe('Admin Creation Validation (Strictly Admin & Super Admin)', () => {
    it('should accept administrator creation with role "admin"', () => {
      const payload = {
        name: 'Dr. Sunita Mehra',
        email: 'sunita@ednora.edu',
        role: 'admin',
        designation: 'Admissions Director',
      };
      const validated = validateCreateAdmin(payload);
      expect(validated.name).toBe('Dr. Sunita Mehra');
      expect(validated.email).toBe('sunita@ednora.edu');
      expect(validated.role).toBe('admin');
      expect(validated.password).toBe('Admin@123');
    });

    it('should accept administrator creation with role "super admin"', () => {
      const payload = {
        name: 'Vice Chancellor',
        email: 'vc@ednora.edu',
        role: 'super admin',
        designation: 'Chief Administrative Officer',
      };
      const validated = validateCreateAdmin(payload);
      expect(validated.role).toBe('super admin');
    });

    it('should reject non-admin roles (only admin and super admin allowed)', () => {
      expect(() => {
        validateCreateAdmin({
          name: 'Student Leader',
          email: 'leader@ednora.edu',
          role: 'student',
        });
      }).toThrow(/Role must be either "admin" or "super admin"/);

      expect(() => {
        validateCreateAdmin({
          name: 'Teacher',
          email: 'teacher@ednora.edu',
          role: 'teacher',
        });
      }).toThrow(/Role must be either "admin" or "super admin"/);
    });
  });

  describe('Admin Update Validation', () => {
    it('should allow updating admin designation, role, and active status', () => {
      const updateData = {
        name: 'Dr. Sunita M.',
        role: 'super admin',
        designation: 'Senior Registrar',
        isActive: false,
      };
      const validated = validateUpdateAdmin(updateData);
      expect(validated.name).toBe('Dr. Sunita M.');
      expect(validated.role).toBe('super admin');
      expect(validated.isActive).toBe(false);
    });

    it('should reject invalid role in update', () => {
      expect(() => {
        validateUpdateAdmin({
          role: 'moderator',
        });
      }).toThrow(/Role must be either "admin" or "super admin"/);
    });
  });
});

