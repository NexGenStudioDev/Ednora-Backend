import courseConstant from './course.constant.mjs';
import courseModel from './course.model.mjs';
import courseUtils from './course.utils.mjs';
import { courseValidationSchema } from './course.validator.mjs';

class courseService {
  async createCourse(courseData) {
    try {
      let { error } = courseValidationSchema.validate(courseData);

      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }

      const existingCourse = await courseModel.findOne({
        courseCode: courseData.courseCode,
      });

      if (existingCourse) {
        throw new Error(courseConstant.ALREADY_Created);
      }

      let CreatedCourse = await courseModel.create(courseData);
      return CreatedCourse;
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  async getAllCourses(options = {}) {
    try {
      return await courseUtils.FindAllCourses(options);
    } catch (error) {
      throw new Error(`Error fetching courses: ${error.message}`);
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      return await courseUtils.updateCourse(courseId, courseData);
    } catch (error) {
      throw new Error(`Error updating course: ${error.message}`);
    }
  }

  async deleteCourse(courseId) {
    try {
      return await courseUtils.deleteCourse(courseId);
    } catch (error) {
      throw new Error(`Error deleting course: ${error.message}`);
    }
  }
}

export default new courseService();
