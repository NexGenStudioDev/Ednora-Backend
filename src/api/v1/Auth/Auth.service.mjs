import AuthenticationSchema from './Auth.model.mjs';
import AuthConstant from './Auth.constant.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConstant from '../../../constant/env.constant.mjs';

class AuthService {
  async CreateUser({ name, email, password, role, picture }) {
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const Authentication_Instance = new AuthenticationSchema();
      let HashPassword = null;
      try {
        HashPassword = await Authentication_Instance.hashPassword(password);
      } catch {
        HashPassword = await bcrypt.hash(password, 10);
      }

      let HashEmail = null;
      try {
        HashEmail = await Authentication_Instance.hashEmail(cleanEmail);
      } catch {
        const secret = envConstant.JWT_SECRET || process.env.JWT_SECRET;
        HashEmail = jwt.sign(
          { email: cleanEmail, role: role || 'student' },
          secret,
          { expiresIn: envConstant.JWT_EXPIRES_IN || '7d' }
        );
      }

      if (!HashEmail && !HashPassword) {
        throw new Error(AuthConstant.HASH_FAILED);
      }

      const CreatedUser = await AuthenticationSchema.create({
        provider_Name: name,
        name: name,
        email: cleanEmail,
        email_verified: true,
        ...(picture ? { picture } : {}),
        password: HashPassword,
        role: role || 'student',
      });

      if (!CreatedUser) {
        throw new Error(AuthConstant.USER_NOT_CREATED);
      }

      return { CreatedUser, HashEmail };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createAdmin({ name, email, password, role, designation }) {
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail) {
        throw new Error('Email is required');
      }

      const existingUser = await AuthenticationSchema.findOne({ email: cleanEmail });
      if (existingUser) {
        if (
          existingUser.role === 'admin' ||
          existingUser.role === 'super admin' ||
          existingUser.role === 'super_admin'
        ) {
          throw new Error('An administrator with this email address already exists');
        }
      }

      const rawRole = (role || 'admin').trim().toLowerCase();
      const normalizedRole =
        rawRole === 'super admin' || rawRole === 'super_admin' ? 'super admin' : 'admin';

      const adminPassword = password && password.trim() ? password.trim() : 'Admin@123';
      const HashPassword = await bcrypt.hash(adminPassword, 10);
      const adminName = name && name.trim() ? name.trim() : cleanEmail.split('@')[0];

      let adminUser;
      if (existingUser) {
        existingUser.name = adminName;
        existingUser.password = HashPassword;
        existingUser.role = normalizedRole;
        existingUser.provider_Name = designation || 'Campus Administrator';
        existingUser.isActive = true;
        existingUser.email_verified = true;
        await existingUser.save();
        adminUser = existingUser;
      } else {
        adminUser = await AuthenticationSchema.create({
          provider_Name: designation || 'Campus Administrator',
          name: adminName,
          email: cleanEmail,
          email_verified: true,
          password: HashPassword,
          role: normalizedRole,
          isActive: true,
        });
      }

      return {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        designation: adminUser.provider_Name || designation || 'Campus Administrator',
        isActive: adminUser.isActive,
        createdAt: adminUser.createdAt,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to create administrator');
    }
  }

  async getAllAdmins() {
    try {
      const defaultEmail = (envConstant.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();

      const adminsFromDb = await AuthenticationSchema.find(
        { role: { $in: ['admin', 'super admin', 'super_admin'] } },
        '-password'
      ).lean();

      const adminMap = new Map();

      // Ensure root super admin is always in directory
      adminMap.set(defaultEmail, {
        _id: 'root-admin',
        name: 'Super Administrator',
        email: defaultEmail,
        role: 'super admin',
        designation: 'Chief Administrative Officer',
        isActive: true,
        createdAt: new Date('2025-01-01'),
      });

      for (const a of adminsFromDb) {
        if (a?.email) {
          const emailKey = a.email.toLowerCase();
          const isRoot = emailKey === defaultEmail;
          const normRole =
            isRoot || a.role === 'super admin' || a.role === 'super_admin'
              ? 'super admin'
              : 'admin';

          adminMap.set(emailKey, {
            _id: a._id ? a._id.toString() : `auth-${a.email}`,
            name: a.name || a.email.split('@')[0],
            email: a.email,
            role: normRole,
            designation:
              a.provider_Name ||
              (normRole === 'super admin'
                ? 'Chief Administrative Officer'
                : 'Campus Administrator'),
            isActive: a.isActive !== false,
            createdAt: a.createdAt || new Date(),
          });
        }
      }

      return Array.from(adminMap.values());
    } catch (error) {
      throw new Error(error.message || 'Failed to retrieve administrators');
    }
  }

  async updateAdmin(identifier, data) {
    try {
      const defaultEmail = (envConstant.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
      const target = (identifier || '').toString().trim().toLowerCase();

      const isObjectId = Boolean(identifier && identifier.match(/^[0-9a-fA-F]{24}$/));

      const adminUser = await AuthenticationSchema.findOne({
        $or: [
          { email: target },
          ...(isObjectId ? [{ _id: identifier }] : []),
        ],
      });

      const effectiveEmail = (adminUser?.email || target).toLowerCase();
      const isRoot = effectiveEmail === defaultEmail || target === 'root-admin';

      if (!adminUser && !isRoot) {
        throw new Error('Administrator account not found');
      }

      let updateRole = adminUser?.role || 'admin';
      if (data.role !== undefined) {
        const rawRole = data.role.toString().trim().toLowerCase();
        updateRole = rawRole === 'super admin' || rawRole === 'super_admin' ? 'super admin' : 'admin';
      }
      if (isRoot) {
        updateRole = 'super admin'; // root admin cannot be demoted
      }

      let updateActive = adminUser?.isActive !== false;
      if (data.isActive !== undefined) {
        updateActive = Boolean(data.isActive);
      }
      if (isRoot) {
        updateActive = true; // root admin cannot be deactivated
      }

      const updateName = data.name !== undefined ? data.name.trim() : adminUser?.name;
      const updateDesignation = data.designation !== undefined ? data.designation.trim() : adminUser?.provider_Name;

      if (adminUser) {
        if (updateName) adminUser.name = updateName;
        adminUser.role = updateRole;
        adminUser.isActive = updateActive;
        if (updateDesignation) adminUser.provider_Name = updateDesignation;

        if (data.password && data.password.trim()) {
          adminUser.password = await bcrypt.hash(data.password.trim(), 10);
        }
        await adminUser.save();
      }

      return {
        _id: adminUser?._id ? adminUser._id.toString() : identifier,
        name: updateName || 'Super Administrator',
        email: effectiveEmail,
        role: updateRole,
        designation: updateDesignation || 'Campus Administrator',
        isActive: updateActive,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to update administrator');
    }
  }

  async deleteAdmin(identifier) {
    try {
      const defaultEmail = (envConstant.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
      const target = (identifier || '').toString().trim().toLowerCase();

      if (target === defaultEmail || target === 'root-admin') {
        throw new Error('Root super administrator account cannot be deleted');
      }

      const isObjectId = Boolean(identifier && identifier.match(/^[0-9a-fA-F]{24}$/));

      const deleteRes = await AuthenticationSchema.deleteMany({
        $or: [
          { email: target },
          ...(isObjectId ? [{ _id: identifier }] : []),
        ],
      });

      if (deleteRes.deletedCount === 0) {
        throw new Error('Administrator account not found or already deleted');
      }

      return { success: true, message: 'Administrator revoked successfully' };
    } catch (error) {
      throw new Error(error.message || 'Failed to revoke administrator');
    }
  }
}

export default new AuthService();
