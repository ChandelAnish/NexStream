// lib/transformers.ts
import { DoctorDB, Doctor } from '@/types/doctor';

export function transformDoctorDBToDoctor(db: DoctorDB): Doctor {
  return {
    id: db.id,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
    personalInfo: {
      fullName: db.fullName,
      emailAddress: db.emailAddress,
      phoneNumber: db.phoneNumber,
      dateOfBirth: db.dateOfBirth,
      gender: db.gender,
      profilePhoto: db.profilePhoto ?? null,
    },
    professionalDetails: {
      medicalLicenseNumber: db.medicalLicenseNumber,
      specialization: db.specialization,
      yearsOfExperience: db.yearsOfExperience,
      associatedClinicHospitalName: db.associatedClinicHospitalName,
      consultationType: db.consultationType,
    },
    educationDetails: {
      medicalSchoolName: db.medicalSchoolName ?? null,
      medicalSchoolGraduationYear: db.medicalSchoolGraduationYear ?? null,
      medicalSchoolDegree: db.medicalSchoolDegree ?? null,
    },
    verificationDocument: {
      governmentIssuedId: db.governmentIssuedId ?? null,
      medicalDegreeCertificate: db.medicalDegreeCertificate ?? null,
      medicalCouncilRegistrationCertificate: db.medicalCouncilRegistrationCertificate ?? null,
      experienceCertificate: db.experienceCertificate ?? null,
    },
    workSchedulePreferences: {
      availableConsultationHours: db.availableConsultationHours,
      preferredModeOfConsultation: db.preferredModeOfConsultation,
      languageSpoken: db.languageSpoken,
      additionalInformation: db.additionalInformation ?? null,
      emergencyContactDetails: db.emergencyContactDetails,
      personalBio: db.personalBio ?? null,
    },
  };
}
