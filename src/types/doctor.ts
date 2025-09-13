// Types
export interface PersonalInfo {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  profilePhoto?: FileData | null;
}

export interface ProfessionalDetails {
  medicalLicenseNumber: string;
  specialization: string;
  yearsOfExperience: string;
  associatedClinicHospitalName: string;
  consultationType: string;
}

// New type to store file data in a serializable format
export interface FileData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  base64: string; // Base64 encoded file content
}
export interface VerificationDocument {
  governmentIssuedId?: FileData | null;
  medicalDegreeCertificate?: FileData | null;
  medicalCouncilRegistrationCertificate?: FileData | null;
  experienceCertificate?: FileData | null;
}

export interface WorkSchedulePreferences {
  availableConsultationHours: string;
  preferredModeOfConsultation: string;
  languageSpoken: string;
  additionalInformation: string;
  emergencyContactDetails: string;
  personalBio: string;
}

// Type for a complete doctor record
export interface Doctor {
  id?: string;
  personalInfo: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    profilePhoto?: string | null;
  };
  professionalDetails: {
    medicalLicenseNumber: string;
    specialization: string;
    yearsOfExperience: string;
    associatedClinicHospitalName: string;
    consultationType: string;
  };
  educationDetails: {
    medicalSchoolName?: string | null;
    medicalSchoolGraduationYear?: string | null;
    medicalSchoolDegree?: string | null;
  };
  verificationDocument: {
    governmentIssuedId?: string | null;
    medicalDegreeCertificate?: string | null;
    medicalCouncilRegistrationCertificate?: string | null;
    experienceCertificate?: string | null;
  };
  workSchedulePreferences: {
    availableConsultationHours: string;
    preferredModeOfConsultation: string;
    languageSpoken: string;
    additionalInformation?: string | null;
    emergencyContactDetails: string | null;
    personalBio?: string | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DoctorDB {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // Personal Information
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  profilePhoto?: string | null;

  // Professional Details
  medicalLicenseNumber: string;
  specialization: string;
  yearsOfExperience: string;
  associatedClinicHospitalName: string;
  consultationType: string;

  // Education Details
  medicalSchoolName?: string | null;
  medicalSchoolGraduationYear?: string | null;
  medicalSchoolDegree?: string | null;

  // Verification Documents
  governmentIssuedId?: string | null;
  medicalDegreeCertificate?: string | null;
  medicalCouncilRegistrationCertificate?: string | null;
  experienceCertificate?: string | null;

  // Work Schedule Preferences
  availableConsultationHours: string;
  preferredModeOfConsultation: string;
  languageSpoken: string;
  additionalInformation?: string | null;
  emergencyContactDetails: string;
  personalBio?: string | null;

  // Status and Verification (commented in schema, but included optionally)
  // isVerified?: boolean;
  // isActive?: boolean;
}

export interface DoctorOnboardingState {
  currentStep: number;
  personalInfo: PersonalInfo;
  professionalDetails: ProfessionalDetails;
  verificationDocument: VerificationDocument;
  workSchedulePreferences: WorkSchedulePreferences;
  isLoading: boolean;
  error: string | null;
  isSubmitted: boolean;
  doctors: Doctor[];
  isLoadingDoctors: boolean;
}

// Initial state
export const initialState: DoctorOnboardingState = {
  currentStep: 1,
  personalInfo: {
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "Male",
    profilePhoto: null,
  },
  professionalDetails: {
    medicalLicenseNumber: "",
    specialization: "",
    yearsOfExperience: "",
    associatedClinicHospitalName: "",
    consultationType: "In-Person",
  },
  verificationDocument: {
    governmentIssuedId: null,
    medicalDegreeCertificate: null,
    medicalCouncilRegistrationCertificate: null,
    experienceCertificate: null,
  },
  workSchedulePreferences: {
    availableConsultationHours: "",
    preferredModeOfConsultation: "",
    languageSpoken: "",
    additionalInformation: "",
    emergencyContactDetails: "",
    personalBio: "",
  },
  isLoading: false,
  error: null,
  isSubmitted: false,
  doctors: [],
  isLoadingDoctors: false,
};
