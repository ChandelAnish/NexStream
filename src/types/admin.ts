export interface Admin {
  id: string;
  managementType: string;
  submittedAt: Date;

  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  designation: string;

  // Profile Picture
  profilePicture?: string | null; // URL or base64 string

  // Clinic Info
  clinicName: string;
  clinicType: string;
  registrationNumber: string;
  establishmentYear: string;
  address: string;

  // Documents Info
  departments: string;
  doctorsCount: string;
  communicationMode: string;

  // File Paths
  governmentIdPath?: string | null;
  governmentIdOriginalName?: string | null;
  registrationCertificatePath?: string | null;
  registrationCertificateOriginalName?: string | null;
  accreditationPath?: string | null;
  accreditationOriginalName?: string | null;

  createdAt: Date;
  updatedAt: Date;
}
// Compare this snippet from src/store/adminSlice.ts:
//   success: false,
export interface AdminState {
  managementType: 'admin' | 'doctor' | null;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    designation: string;
  };
  clinicInfo: {
    clinicName: string;
    clinicType: string;
    registrationNumber: string;
    establishmentYear: string;
    address: string;
  };
  documents: {
    governmentIdPath?: string | null;
    governmentIdOriginalName?: string | null;
    registrationCertificatePath?: string | null;
    registrationCertificateOriginalName?: string | null;
    accreditationPath?: string | null;
    accreditationOriginalName?: string | null;
    departments: string;
    doctorsCount: string;
    communicationMode: string;
  };
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  currentStep: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}