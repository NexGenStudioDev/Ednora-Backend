import AdmissionValidationSchema from '../api/v1/Admission/Admission.validator.mjs';
import courseValidationSchema from '../api/v1/Course/course.validator.mjs';
import Teacher_validation from '../api/v1/Teacher/Teacher.validator.mjs';
import TestimonialValidator from '../api/v1/Testimonial/Testimonial.validator.mjs';
import Create_Album_Validator from '../api/v1/Album/Album.validator.mjs';
import {
  ForgotPasswordRequestValidator,
  ValidatePasswordResetValidator,
} from '../api/v1/forget-password/ForgotPassword.validator.mjs';
import { SignUp_Validator } from '../api/v1/Auth/Auth.validator.mjs';

describe('Migrated Zod Validators Suite', () => {
  describe('AdmissionValidationSchema', () => {
    it('validates a correct admission payload', () => {
      const payload = {
        firstName: 'Aarav',
        middleName: 'Kumar',
        lastName: 'Sharma',
        fatherName: 'Rajesh Sharma',
        motherName: 'Sunita Sharma',
        email: 'aarav@gmail.com',
        contactNumber: '9876543210',
        dateOfBirth: '2004-05-15',
        gender: 'Male',
        nationality: 'Indian',
        Gname: 'Rajesh Sharma',
        Grelation: 'Father',
        GcontactNumber: '9876543210',
        street: '123 Main Road',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110001',
        AadharCardNumber: '123456789012',
        tenthMarks: 85,
        tenthBoard: 'CBSE',
        tenthGrade: 'A',
        twelfthMarks: 88,
        twelfthBoard: 'CBSE',
        twelfthGrade: 'A',
        mode: 'Online',
        university: 'DU',
        courseName: 'BCA',
      };
      const result = AdmissionValidationSchema.validate(payload);
      expect(result.error).toBeNull();
      expect(result.value.firstName).toBe('Aarav');
    });

    it('rejects invalid email or missing fields', () => {
      const result = AdmissionValidationSchema.validate({
        firstName: 'Aa',
      });
      expect(result.error).toBeTruthy();
      expect(result.error.details.length).toBeGreaterThan(0);
    });
  });

  describe('courseValidationSchema', () => {
    it('validates valid course data', () => {
      const payload = {
        courseName: 'Full Stack Web Development',
        AdmissionCriteria: ['10+2 passed with 50%'],
        courseCode: 'CS101',
        courseDescription: 'Comprehensive full stack course',
        courseDuration: '6 Months',
        courseEligibility: '12th Pass',
        courseThumbnail: 'https://example.com/thumbnail.jpg',
        coursePrice: 15000,
        Department: 'Computer Science',
      };
      const result = courseValidationSchema.validate(payload);
      expect(result.error).toBeNull();
    });

    it('rejects invalid Department', () => {
      const payload = {
        courseName: 'Invalid Department Course',
        AdmissionCriteria: ['10+2'],
        courseCode: 'CS102',
        courseDescription: 'Description',
        courseDuration: '3 Months',
        courseEligibility: '10th',
        courseThumbnail: 'https://example.com/thumb.jpg',
        coursePrice: 5000,
        Department: 'InvalidDeptXYZ',
      };
      const result = courseValidationSchema.validate(payload);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Teacher_validation', () => {
    it('validates valid teacher data', () => {
      const payload = {
        name: 'Dr. Jane Doe',
        email: 'jane.doe@university.edu',
        role: 'Professor',
        department: 'Computer Science',
      };
      const result = Teacher_validation.validate(payload);
      expect(result.error).toBeNull();
    });

    it('rejects invalid email', () => {
      const payload = {
        name: 'Dr. Jane Doe',
        email: 'not-an-email',
      };
      const result = Teacher_validation.validate(payload);
      expect(result.error).toBeTruthy();
    });
  });

  describe('TestimonialValidator', () => {
    it('validates valid testimonial', () => {
      const payload = {
        name: 'Rohan Verma',
        email: 'rohan@example.com',
        message: 'Great learning experience at Eduvanta!',
        job_Role: 'Software Engineer',
        star: 5,
      };
      const result = TestimonialValidator.validate(payload);
      expect(result.error).toBeNull();
    });

    it('rejects star rating above 5', () => {
      const payload = {
        name: 'Rohan Verma',
        email: 'rohan@example.com',
        message: 'Great',
        job_Role: 'SE',
        star: 10,
      };
      const result = TestimonialValidator.validate(payload);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Create_Album_Validator', () => {
    it('validates valid album', () => {
      const payload = {
        albumName: 'Convocation 2026',
        albumImageUrl: 'https://example.com/convocation.jpg',
        albumDescription: 'Annual convocation ceremony photos.',
      };
      const result = Create_Album_Validator.validate(payload);
      expect(result.error).toBeNull();
    });
  });

  describe('ForgotPassword Validators', () => {
    it('validates request with valid email', () => {
      const result = ForgotPasswordRequestValidator.validate({
        email: 'student@example.com',
      });
      expect(result.error).toBeNull();
    });

    it('validates password reset with 6-digit OTP', () => {
      const result = ValidatePasswordResetValidator.validate({
        email: 'student@example.com',
        otp: '123456',
        newPassword: 'newSecretPassword123',
      });
      expect(result.error).toBeNull();
    });

    it('rejects non-6-digit OTP', () => {
      const result = ValidatePasswordResetValidator.validate({
        email: 'student@example.com',
        otp: '123',
        newPassword: 'newSecretPassword123',
      });
      expect(result.error).toBeTruthy();
    });
  });

  describe('SignUp_Validator', () => {
    it('validates matching password and confirm_Password', () => {
      const result = SignUp_Validator.validate({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirm_Password: 'Password123!',
      });
      expect(result.error).toBeNull();
    });

    it('rejects mismatching passwords', () => {
      const result = SignUp_Validator.validate({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirm_Password: 'WrongPassword!',
      });
      expect(result.error).toBeTruthy();
    });
  });
});
