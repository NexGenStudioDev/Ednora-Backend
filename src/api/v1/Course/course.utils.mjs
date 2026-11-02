import mongoose from 'mongoose';
import courseModel from './course.model.mjs';
import { Delete_From_Cloudinary } from '../../../utils/Cloudinary.mjs';

class Course_Utils {
  FindBy_courseName = async (courseName) => {
    return await courseModel.findOne({ courseName: courseName });
  };

  TOTAL_NUMBER_OF_COURSES = async () => {
    try {
      let NUMBER_OF_COURSES = (await courseModel.find({})).length;
      return NUMBER_OF_COURSES;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindAllCourses = async (options = {}) => {
    try {
      const { page, limit, search, department } = options;
      const filter = {};

      if (department && department !== 'All' && department !== 'all') {
        filter.Department = department;
      }

      if (search && typeof search === 'string' && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { courseName: regex },
          { courseCode: regex },
          { courseDescription: regex },
        ];
      }

      const total = await courseModel.countDocuments(filter);
      let query = courseModel.find(filter).sort({ createdAt: -1 });

      if (page && limit) {
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.max(1, parseInt(limit, 10));
        query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
        const courses = await query;
        return {
          courses,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum) || 1,
            hasNextPage: pageNum * limitNum < total,
            hasPrevPage: pageNum > 1,
          },
        };
      }

      const courses = await query;
      return {
        courses,
        pagination: {
          page: 1,
          limit: total || courses.length,
          total: total || courses.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindAllCoursesName = async () => {
    try {
      const courses = await courseModel
        .find({}, { courseName: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();

      return courses;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindCourseById = async (courseId) => {
    try {
      let course = null;
      if (courseId && mongoose.Types.ObjectId.isValid(courseId) && courseId.length === 24) {
        course = await courseModel.findById(courseId);
      }
      if (!course && courseId && courseId !== 'undefined' && courseId !== 'null') {
        const clean = decodeURIComponent(courseId).trim();
        course = await courseModel.findOne({
          $or: [
            { courseCode: clean },
            { courseName: clean },
            { courseCode: new RegExp(`^${clean}$`, 'i') },
            { courseName: new RegExp(`^${clean}$`, 'i') },
          ],
        });
      }
      if (!course) {
        throw new Error('Course not found');
      }
      return course;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateCourse = async (courseId, updateData) => {
    try {
      let course = null;
      if (courseId && mongoose.Types.ObjectId.isValid(courseId) && courseId.length === 24) {
        course = await courseModel.findById(courseId);
      }
      if (!course && courseId && courseId !== 'undefined' && courseId !== 'null') {
        course = await courseModel.findOne({
          $or: [{ courseCode: courseId }, { courseName: courseId }],
        });
      }
      if (!course && updateData.courseCode) {
        course = await courseModel.findOne({ courseCode: updateData.courseCode });
      }
      if (!course && updateData.courseName) {
        course = await courseModel.findOne({ courseName: updateData.courseName });
      }

      if (!course) {
        throw new Error('Course not found');
      }

      // Update fields if provided
      if (updateData.courseName) course.courseName = updateData.courseName;
      if (updateData.courseCode) course.courseCode = updateData.courseCode;
      if (updateData.Department) course.Department = updateData.Department;
      if (updateData.courseDuration || updateData.duration) {
        course.courseDuration = updateData.courseDuration || updateData.duration;
      }
      if (updateData.courseEligibility || updateData.eligibility) {
        course.courseEligibility = updateData.courseEligibility || updateData.eligibility;
      }
      if (updateData.courseDescription || updateData.description) {
        course.courseDescription = updateData.courseDescription || updateData.description;
      }
      if (updateData.coursePrice !== undefined) {
        course.coursePrice = Number(updateData.coursePrice);
      } else if (updateData.fee !== undefined) {
        course.coursePrice = Number(updateData.fee);
      }
      if (updateData.courseThumbnail) {
        if (course.courseThumbnail && course.courseThumbnail !== updateData.courseThumbnail) {
          try {
            await Delete_From_Cloudinary(course.courseThumbnail);
          } catch (err) {
            console.warn('[Course] Notice: Old thumbnail deletion error:', err.message);
          }
        }
        course.courseThumbnail = updateData.courseThumbnail;
      }
      if (updateData.courseLogo !== undefined) {
        if (course.courseLogo && updateData.courseLogo && course.courseLogo !== updateData.courseLogo) {
          try {
            await Delete_From_Cloudinary(course.courseLogo);
          } catch (err) {
            console.warn('[Course] Notice: Old logo deletion error:', err.message);
          }
        }
        course.courseLogo = updateData.courseLogo;
      }
      if (updateData.AdmissionCriteria) {
        if (Array.isArray(updateData.AdmissionCriteria) && updateData.AdmissionCriteria.length > 0) {
          course.AdmissionCriteria = updateData.AdmissionCriteria;
        } else if (typeof updateData.AdmissionCriteria === 'string') {
          try {
            course.AdmissionCriteria = JSON.parse(updateData.AdmissionCriteria);
          } catch {
            course.AdmissionCriteria = [updateData.AdmissionCriteria];
          }
        }
      }

      await course.save();
      return course;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteCourse = async (courseId) => {
    try {
      let query;
      if (courseId && mongoose.Types.ObjectId.isValid(courseId) && courseId.length === 24) {
        query = { _id: courseId };
      } else if (courseId && courseId !== 'undefined' && courseId !== 'null') {
        query = {
          $or: [{ courseCode: courseId }, { courseName: courseId }],
        };
      } else {
        throw new Error('Course ID or code required');
      }

      let deletedCourse = await courseModel.findOneAndDelete(query);
      if (!deletedCourse) {
        throw new Error('Course not found');
      }
      if (deletedCourse.courseThumbnail) {
        try {
          await Delete_From_Cloudinary(deletedCourse.courseThumbnail);
        } catch (err) {
          console.warn('[Course] Notice: Thumbnail deletion error:', err.message);
        }
      }
      if (deletedCourse.courseLogo) {
        try {
          await Delete_From_Cloudinary(deletedCourse.courseLogo);
        } catch (err) {
          console.warn('[Course] Notice: Logo deletion error:', err.message);
        }
      }
      return deletedCourse;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Course_Utils();
