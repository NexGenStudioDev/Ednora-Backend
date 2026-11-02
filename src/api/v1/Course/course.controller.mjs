import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import courseConstant from './course.constant.mjs';
import courseService from './course.service.mjs';
import courseUtils from './course.utils.mjs';

const Course_Controller = {
  async createCourse(req, res) {
    try {
      const allFiles = Array.isArray(req.files)
        ? req.files
        : req.file
        ? [req.file]
        : [];

      // Find banner file (1st image)
      const bannerFile =
        allFiles.find((f) =>
          ['courseThumbnail', 'image', 'banner', 'thumbnail'].includes(f.fieldname)
        ) || (allFiles.length > 0 && !allFiles[0].fieldname?.toLowerCase().includes('logo') ? allFiles[0] : null);

      // Find logo file (2nd image)
      const logoFile =
        allFiles.find((f) =>
          ['courseLogo', 'logo', 'course_logo'].includes(f.fieldname)
        ) || (allFiles.length > 1 && allFiles[1].fieldname?.toLowerCase().includes('logo') ? allFiles[1] : null);

      let thumbnailUrl = req.body.courseThumbnail || req.body.image || '';
      if (bannerFile && bannerFile.filename) {
        let uploadResult = await uploadOnCloudinary(bannerFile.filename);
        if (uploadResult?.url) {
          thumbnailUrl = uploadResult.url;
        }
      }

      let logoUrl = req.body.courseLogo || req.body.logo || null;
      if (logoFile && logoFile.filename) {
        let uploadLogoResult = await uploadOnCloudinary(logoFile.filename);
        if (uploadLogoResult?.url) {
          logoUrl = uploadLogoResult.url;
        }
      }

      if (!thumbnailUrl) {
        thumbnailUrl =
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
      }

      let payload = {
        ...req.body,
        courseThumbnail: thumbnailUrl,
        courseLogo: logoUrl || null,
      };

      if (typeof payload.AdmissionCriteria === 'string') {
        try {
          payload.AdmissionCriteria = JSON.parse(payload.AdmissionCriteria);
        } catch {
          payload.AdmissionCriteria = [payload.AdmissionCriteria];
        }
      } else if (!Array.isArray(payload.AdmissionCriteria)) {
        payload.AdmissionCriteria = ['10+2 with minimum 50% marks'];
      }

      if (payload.coursePrice !== undefined) {
        payload.coursePrice = Number(payload.coursePrice);
      }

      const newCourse = await courseService.createCourse(payload);
      if (!newCourse) {
        throw new Error(courseConstant.COURSE_NOT_CREATED);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        courseConstant.COURSE_CREATED,
        newCourse
      );
    } catch (error) {
      console.error('Error creating course:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || courseConstant.COURSE_NOT_CREATED
      );
    }
  },

  async updateCourse(req, res) {
    try {
      const courseId = req.params.id;
      let payload = { ...req.body };

      const allFiles = Array.isArray(req.files)
        ? req.files
        : req.file
        ? [req.file]
        : [];

      const bannerFile =
        allFiles.find((f) =>
          ['courseThumbnail', 'image', 'banner', 'thumbnail'].includes(f.fieldname)
        ) || (allFiles.length > 0 && !allFiles[0].fieldname?.toLowerCase().includes('logo') ? allFiles[0] : null);

      const logoFile =
        allFiles.find((f) =>
          ['courseLogo', 'logo', 'course_logo'].includes(f.fieldname)
        ) || (allFiles.length > 1 && allFiles[1].fieldname?.toLowerCase().includes('logo') ? allFiles[1] : null);

      if (bannerFile && bannerFile.filename) {
        let uploadResult = await uploadOnCloudinary(bannerFile.filename);
        if (uploadResult?.url) {
          payload.courseThumbnail = uploadResult.url;
        }
      }

      if (logoFile && logoFile.filename) {
        let uploadLogoResult = await uploadOnCloudinary(logoFile.filename);
        if (uploadLogoResult?.url) {
          payload.courseLogo = uploadLogoResult.url;
        }
      } else if (req.body.courseLogo) {
        payload.courseLogo = req.body.courseLogo;
      }

      if (typeof payload.AdmissionCriteria === 'string') {
        try {
          payload.AdmissionCriteria = JSON.parse(payload.AdmissionCriteria);
        } catch {
          payload.AdmissionCriteria = [payload.AdmissionCriteria];
        }
      }

      if (payload.coursePrice !== undefined) {
        payload.coursePrice = Number(payload.coursePrice);
      }

      const updated = await courseService.updateCourse(courseId, payload);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        courseConstant.COURSE_UPDATED,
        updated
      );
    } catch (error) {
      console.error('Error updating course:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || courseConstant.COURSE_NOT_UPDATED
      );
    }
  },

  async deleteCourse(req, res) {
    try {
      const courseId = req.params.id;
      const deleted = await courseService.deleteCourse(courseId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        courseConstant.COURSE_DELETED,
        deleted
      );
    } catch (error) {
      console.error('Error deleting course:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || 'Failed to delete course'
      );
    }
  },

  async FindAllCourses(req, res) {
    try {
      const { page, limit, search, department } = req.query;
      const result = await courseService.getAllCourses({
        page,
        limit,
        search,
        department,
      });

      const courses = Array.isArray(result) ? result : result.courses || [];
      const pagination = result.pagination;

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        courseConstant.COURSES_FOUND,
        courses,
        pagination ? { pagination, total: pagination.total } : {}
      );
    } catch (error) {
      console.error('Error fetching courses:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || courseConstant.COURSE_NOT_FOUND
      );
    }
  },

  async FindCourseById(req, res) {
    try {
      const courseId = req.params.id;
      const course = await courseUtils.FindCourseById(courseId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        courseConstant.COURSE_FOUND,
        course
      );
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || courseConstant.COURSE_NOT_FOUND
      );
    }
  },
};

export default Course_Controller;
