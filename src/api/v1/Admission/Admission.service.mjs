import AdmissionConstant from './Admission.constant.mjs';
import Admission from './Admission.model.mjs';

class Admission_Service {
  async Create_Student({ data, uniqueId, course, image_Url }) {
    try {
      const admission = await Admission.create({
        uniqueId: uniqueId,

        student: {
          firstName: data.firstName,
          middleName: data.middleName || '',
          lastName: data.lastName,
          fatherName: data.fatherName,
          motherName: data.motherName,
          email: data.email,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          nationality: data.nationality,
          contactNumber: String(data.contactNumber),
          avtar: image_Url,
        },

        guardian: {
          Gname: data.Gname,
          Grelation: data.Grelation,
          GcontactNumber: String(data.GcontactNumber),
        },

        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          pinCode: Number(data.pinCode),
        },

        AadharCard: {
          AadharCardNumber: String(data.AadharCardNumber),
        },

        tenth: {
          tenthMarks: Number(data.tenthMarks),
          tenthBoard: data.tenthBoard,
          tenthGrade: data.tenthGrade,
        },

        twelfth: {
          twelfthMarks: Number(data.twelfthMarks),
          twelfthBoard: data.twelfthBoard,
          twelfthGrade: data.twelfthGrade,
        },

        fee: {
          amount_paid: 0,
          late_Fine: 0,
          amount_due: course?.coursePrice || 0,
          course_Fee: course?.coursePrice || 0,
        },

        course_Id: course._id,
        mode: data.mode,
        university: data.university,
      });

      if (!admission) {
        throw Error(AdmissionConstant.NOT_ADMITTED);
      }

      return admission;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new Admission_Service();
