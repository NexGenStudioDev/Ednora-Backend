import dotenv from 'dotenv';
dotenv.config();
import { Schema, model } from 'mongoose';

import otpGenerator from 'otp-generation';

import courseModel from '../Course/course.model.mjs';
import Student_Course from '../Student_Course/Student-Course.model.mjs';

const AdmissionSchema = new Schema({
  uniqueId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },

  student: {
    firstName: {
      required: true,
      type: String,
      trim: true,
      uppercase: true,
    },

    middleName: {
      type: String,
      trim: true,
      uppercase: true,
    },
    lastName: {
      required: true,
      type: String,
      trim: true,
      uppercase: true,
    },
    fatherName: {
      required: true,
      type: String,
      trim: true,
      uppercase: true,
    },
    motherName: {
      required: true,
      type: String,
      trim: true,
      uppercase: true,
    },
    email: {
      required: [true, 'Email is required'],
      type: [String, 'Email must be a string'],
      trim: true,
      lowercase: true,
      unique: [true, 'Email already exists'],
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String, // Changed to String to accommodate formats
      required: true,
      trim: true,
      match: [/^\d{10}$/, 'Contact number must be exactly 10 digits'],
      maxlength: [10, 'Maximum number is 10 digits'],
      minlength: [10, 'Minimum number is 10 digits'],
    },

    avtar: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
    },
  },

  guardian: {
    Gname: {
      type: String,
      required: true,
    },
    Grelation: {
      type: String,
      required: true,
    },
    GcontactNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: [10, 'Maximum number is 10 digits'],
      minlength: [10, 'Minimum number is 10 digits'],
    },
  },

  address: {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
  },

  AadharCard: {
    AadharCardNumber: {
      type: String, // Changed to String to avoid issues with large numbers
      required: true,
      match: [/^\d{12}$/, 'Aadhar number must be exactly 12 digits'],
    },
  },

  tenth: {
    tenthMarks: {
      type: Number,
      required: true,
    },

    tenthBoard: {
      type: String,
      required: true,
      uppercase: true,
    },

    tenthGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E'],
    },
  },

  twelfth: {
    twelfthMarks: {
      type: Number,
      required: true,
    },

    twelfthBoard: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    twelfthGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E'],
    },
  },

  semester: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    default: 1,
    required: true,
  },

  dateOfAdmission: {
    type: Date,
    default: Date.now,
  },

  course_Id: {
    type: Schema.ObjectId,
    ref: 'Student_Course',
    required: [true, 'The Course id Is Required'],
  },

  mode: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true,
  },

  university: {
    type: String,
    required: true,
    trim: true,
  },

  fee: {
    amount_paid: {
      type: Number,
      default: 0,
    },

    late_Fine: {
      type: Number,
      default: 0,
    },

    amount_due: {
      type: Number,
      default: 0,
    },

    course_Fee: {
      type: Number,
      default: 0,
    },
  },

  status: {
    type: Schema.ObjectId,
    ref: 'Status',
  },

  isAdmitted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

AdmissionSchema.index({ status: 1, createdAt: -1 });
AdmissionSchema.index({ 'student.email': 1 });
AdmissionSchema.index({ createdAt: -1 });

AdmissionSchema.methods.generate_id = async function () {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const uniqueId = `EDUVANTA_${otp}`;
  return uniqueId;
};

AdmissionSchema.methods.createStudentCourse = async function ({
  studentId,
  courseName,
  endDate,
  mode,
  university,
}) {
  try {
    const foundCourse = await courseModel.findOne({
      courseName: courseName,
    });

    if (!foundCourse) {
      throw new Error('Course not found');
    }

    const newStudentCourse = await Student_Course.create({
      studentId,
      endDate,

      courseName,
      mode,
      university,
      courseId: foundCourse._id.toString(),
    });

    if (!newStudentCourse) {
      throw new Error('Failed to create student course');
    }

    const updatedAdmission = await this.model('Admission').findByIdAndUpdate(
      studentId,
      {
        course_Id: newStudentCourse._id,
        'fee.courseFee': foundCourse.CPrice,
      },
      { new: true }
    );

    if (!updatedAdmission) {
      throw new Error('Failed to update admission with course');
    }

    return newStudentCourse;
  } catch (error) {
    throw new Error(error.message || 'Failed to create student course');
  }
};

AdmissionSchema.statics.findStudent = async function (uniqueId) {
  try {
    const Find_Student = await this.findOne({ uniqueId });
    if (!Find_Student) throw new Error('Student not found');
    return Find_Student;
  } catch (error) {
    throw new Error(error);
  }
};

AdmissionSchema.query.isAdmitted = function (Boolean) {
  return this.where({ isAdmitted: Boolean });
};

AdmissionSchema.pre('save', async function (next) {
  try {
    if (!this.fee) {
      this.fee = { amount_paid: 0, late_Fine: 0, amount_due: 0, course_Fee: 0 };
    }
    if (this.course_Id) {
      const Course_detail = await courseModel.findOne({ _id: this.course_Id });
      if (Course_detail && Course_detail.coursePrice !== undefined) {
        this.fee.course_Fee = Course_detail.coursePrice;
        this.fee.amount_due = Course_detail.coursePrice;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

let Admission = model('Admission', AdmissionSchema);

export default Admission;
