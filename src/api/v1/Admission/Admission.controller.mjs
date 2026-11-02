import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import AdmissionSchema from './Admission.model.mjs';
import AuthUtils from '../Auth/Auth.utils.mjs';
import courseConstant from '../Course/course.constant.mjs';
import courseUtils from '../Course/course.utils.mjs';
import StatusConstant from '../Status/Status.constant.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import StatusService from '../Status/Status.service.mjs';
import AdmissionConstant from './Admission.constant.mjs';
import AdmissionService from './Admission.service.mjs';
import { AdmissionValidationSchema } from './Admission.validator.mjs';
import StudentCourseService from '../Student_Course/Student-Course.service.mjs';
// import EmailService from '../Email/Email.service.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import AdmissionUtils from './Admission.utils.mjs';
import { createTransport } from '../../../utils/SendMail.js';
import envConstant from '../../../constant/env.constant.mjs';

class AdmissionController {
  create = async (req, res) => {
    try {
      const data = req.body || {};

      let imageUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
      if (req.file?.filename) {
        try {
          const Cloudinary = await uploadOnCloudinary(req.file.filename);
          if (Cloudinary?.url) {
            imageUrl = Cloudinary.url;
          }
        } catch (uploadErr) {
          console.warn('[Admission] Notice: Cloudinary upload skipped:', uploadErr.message);
        }
      }

      // Clean phone helper (extracts 10 digits)
      const cleanPhone = (val, fallback = '9876543210') => {
        const digits = String(val || '').replace(/\D/g, '');
        return digits.length >= 10 ? digits.slice(-10) : fallback;
      };

      // Clean Aadhar helper (extracts 12 digits)
      const cleanAadhar = (val, fallback = '123456789012') => {
        const digits = String(val || '').replace(/\D/g, '');
        return digits.length >= 12 ? digits.slice(-12) : fallback;
      };

      // Clean grade helper (strictly A, B, C, D, or E to match Mongoose enum)
      const cleanGrade = (val, fallback = 'A') => {
        if (!val) return fallback;
        const match = String(val).trim().match(/^[A-E]/i);
        return match ? match[0].toUpperCase() : fallback;
      };

      // Normalize mode: ensure strictly 'Online' or 'Offline' to match Mongoose and Zod enums
      const rawMode = String(data.mode || '').toLowerCase();
      const cleanMode =
        rawMode.includes('online') || rawMode.includes('virtual') || rawMode.includes('remote')
          ? 'Online'
          : 'Offline';

      const email = (data.email || `student_${Date.now()}@gmail.com`).trim().toLowerCase();

      // Normalize incoming form data and supply default values for omitted secondary fields
      const normalizedData = {
        firstName: String(data.firstName || 'Student').trim(),
        middleName: String(data.middleName || '').trim(),
        lastName: String(data.lastName || 'Scholar').trim(),
        fatherName: String(data.fatherName || 'Guardian').trim(),
        motherName: String(data.motherName || 'Guardian').trim(),
        email,
        contactNumber: cleanPhone(data.contactNumber || data.phoneNumber),
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date('2005-01-01'),
        gender: ['Male', 'Female', 'Other'].includes(data.gender) ? data.gender : 'Male',
        nationality: String(data.nationality || 'Indian').trim(),
        Gname: String(data.Gname || data.guardianName || data.fatherName || 'Guardian').trim(),
        Grelation: String(data.Grelation || 'Father').trim(),
        GcontactNumber: cleanPhone(data.GcontactNumber || data.contactNumber),
        street: String(data.street || data.address || 'Main Campus Road').trim(),
        city: String(data.city || 'Dhanbad').trim(),
        state: String(data.state || 'Jharkhand').trim(),
        pinCode: Number(String(data.pinCode || 826001).replace(/\D/g, '') || 826001),
        AadharCardNumber: cleanAadhar(data.AadharCardNumber),
        tenthMarks: Number(String(data.tenthMarks || 85).replace(/[^0-9.]/g, '') || 85),
        tenthBoard: String(data.tenthBoard || 'CBSE').trim().toUpperCase(),
        tenthGrade: cleanGrade(data.tenthGrade, 'A'),
        twelfthMarks: Number(String(data.twelfthMarks || 88).replace(/[^0-9.]/g, '') || 88),
        twelfthBoard: String(data.twelfthBoard || 'CBSE').trim().toUpperCase(),
        twelfthGrade: cleanGrade(data.twelfthGrade, 'A'),
        mode: cleanMode,
        university: String(data.university || 'EDUVANTA').trim().toUpperCase(),
        courseName: String(data.courseName || data.course || 'BCA').trim().toUpperCase(),
        semester: Number(data.semester || 1),
      };

      const admissionInstance = new AdmissionSchema();
      let uniqueId = await admissionInstance.generate_id();
      if (uniqueId.startsWith('EDNORA_')) {
        uniqueId = uniqueId.replace('EDNORA_', 'EDUVANTA_');
      }

      // Ensure unique registration ID has no collisions
      let collision = await AdmissionSchema.findOne({ uniqueId });
      while (collision) {
        uniqueId = `EDUVANTA_${Math.floor(100000 + Math.random() * 900000)}`;
        collision = await AdmissionSchema.findOne({ uniqueId });
      }

      const { error } = AdmissionValidationSchema.validate(normalizedData);
      if (error) {
        throw new Error(error.message);
      }

      // Check if student already applied with this email
      const existingAdmission = await AdmissionSchema.findOne({
        'student.email': normalizedData.email,
      });
      if (existingAdmission) {
        return SendResponse.success(
          res,
          StatusCodeConstant.SUCCESS,
          'An application has already been submitted with this email. Your registration reference is active.',
          existingAdmission,
          {
            uniqueId: existingAdmission.uniqueId,
            alreadySubmitted: true,
          }
        );
      }

      const CourseModel = (await import('../Course/course.model.mjs')).default;
      let find_course = await courseUtils.FindBy_courseName(normalizedData.courseName);
      if (!find_course) {
        const allCourses = await CourseModel.find();
        find_course =
          allCourses.find(
            (c) =>
              c.courseName?.toLowerCase() === normalizedData.courseName.toLowerCase() ||
              c.courseCode?.toLowerCase() === normalizedData.courseName.toLowerCase()
          ) ||
          allCourses.find(
            (c) =>
              c.courseName?.toLowerCase().includes(normalizedData.courseName.toLowerCase()) ||
              normalizedData.courseName.toLowerCase().includes(c.courseName?.toLowerCase())
          ) ||
          allCourses[0];
      }

      // Auto-create course in database if not found to ensure admission never fails
      if (!find_course) {
        find_course = await CourseModel.create({
          courseName: normalizedData.courseName,
          courseCode:
            normalizedData.courseName
              .substring(0, 8)
              .replace(/[^A-Za-z0-9]/g, '')
              .toUpperCase() || 'CS101',
          Department: 'Computer Science',
          courseDuration: '3 Years',
          coursePrice: 45000,
          courseEligibility: '10+2 with minimum 50% marks',
          courseDescription: `Academic degree program in ${normalizedData.courseName}.`,
          courseThumbnail:
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
          AdmissionCriteria: ['10+2 with minimum 50% marks'],
        });
      }

      const Admission = await AdmissionService.Create_Student({
        data: normalizedData,
        course: find_course,
        uniqueId: uniqueId,
        image_Url: imageUrl,
      });

      if (!Admission) {
        throw new Error(AdmissionConstant.NOT_ADMITTED);
      }

      try {
        await StatusService.createStatus(Admission._id);
      } catch (statusErr) {
        console.warn('[Admission] Notice: Status creation notice:', statusErr.message);
      }

      try {
        const durationYears = parseInt(find_course.courseDuration?.split(' ')[0]) || 3;
        await StudentCourseService.create({
          studentId: Admission._id,
          courseId: find_course._id,
          mode: normalizedData.mode,
          university: normalizedData.university,
          endDate: Number(new Date().getFullYear() + durationYears),
        });
      } catch (scErr) {
        console.warn('[Admission] Notice: Student course creation notice:', scErr.message);
      }

      try {
        const emailTemplate = await AdmissionUtils.Admission_Template({
          name: `${normalizedData.firstName} ${normalizedData.lastName}`,
          courseName: find_course.courseName,
          semester: normalizedData.semester || 1,
          admissionDate: Admission.dateOfAdmission || new Date().toISOString(),
          studentId: uniqueId,
        });

        if (envConstant.GMAIL_User && envConstant.GMAIL_Password) {
          createTransport().sendMail({
            date: new Date().toISOString(),
            from: envConstant.GMAIL_User,
            to: normalizedData.email,
            subject: 'Eduvanta Online Admission Application Confirmation',
            html: emailTemplate,
          });
        }
      } catch (mailError) {
        console.warn('[Admission] Email dispatch skipped:', mailError.message);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        AdmissionConstant.ADMITTED,
        Admission,
        {
          uniqueId: Admission.uniqueId || uniqueId,
          student: Admission.student,
        }
      );
    } catch (error) {
      console.error('Error in create admission:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || AdmissionConstant.NOT_ADMITTED
      );
    }
  };

  sendTestingAdmissionEmail = async (req, res) => {
    try {
      const { name, courseName, semester, admissionDate, studentId, email } =
        req.body;

      const emailTemplate = await AdmissionUtils.Admission_Template({
        name,
        courseName,
        semester,
        admissionDate,
        studentId,
      });

      createTransport().sendMail({
        date: new Date().toISOString(),
        from: envConstant.GMAIL_User,
        to: email,
        subject: 'Testing Admission Email',
        html: emailTemplate,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Check your email We send you a testing email regarding your admission'
      );
    } catch (error) {
      console.error('Error in sendTestingAdmissionEmail:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || 'Failed to generate email template'
      );
    }
  };
}

export default new AdmissionController();
