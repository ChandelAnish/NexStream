import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define interface for file metadata
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

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
    // Store serializable metadata instead of File objects
    governmentId: FileMetadata | null;
    registrationCertificate: FileMetadata | null;
    accreditation: FileMetadata | null;
    departments: string;
    doctorsCount: string;
    communicationMode: string;
  };
  createdAt?: string;
  updatedAt?: string;
  currentStep: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AdminState = {
  managementType: null,
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    designation: '',
  },
  clinicInfo: {
    clinicName: '',
    clinicType: '',
    registrationNumber: '',
    establishmentYear: '',
    address: '',
  },
  documents: {
    governmentId: null,
    registrationCertificate: null,
    accreditation: null,
    departments: '',
    doctorsCount: '',
    communicationMode: '',
  },
  currentStep: 0,
  loading: false,
  error: null,
  success: false,
};

// This thunk needs an additional parameter to receive the actual files
export const submitAdminData = createAsyncThunk(
  'admin/submitData',
  async (
    files: {
      governmentId?: File;
      registrationCertificate?: File;
      accreditation?: File;
    } = {}, 
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { admin: AdminState };

      const formData = new FormData();
      
      // Add management type
      formData.append('managementType', state.admin.managementType || '');
      
      // Add personal info
      Object.entries(state.admin.personalInfo).forEach(([key, value]) => {
        formData.append(`personalInfo.${key}`, value);
      });
      
      // Add clinic info
      Object.entries(state.admin.clinicInfo).forEach(([key, value]) => {
        formData.append(`clinicInfo.${key}`, value);
      });
      
      // Add actual files from the files parameter
      if (files.governmentId) {
        formData.append('documents.governmentId', files.governmentId);
      }
      
      if (files.registrationCertificate) {
        formData.append('documents.registrationCertificate', files.registrationCertificate);
      }
      
      if (files.accreditation) {
        formData.append('documents.accreditation', files.accreditation);
      }
      
      // Add other document data
      formData.append('documents.departments', state.admin.documents.departments);
      formData.append('documents.doctorsCount', state.admin.documents.doctorsCount);
      formData.append('documents.communicationMode', state.admin.documents.communicationMode);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log(response.data)
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'An error occurred');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setManagementType: (state, action: PayloadAction<'admin' | 'doctor'>) => {
      state.managementType = action.payload;
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<AdminState['personalInfo']>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    updateClinicInfo: (state, action: PayloadAction<Partial<AdminState['clinicInfo']>>) => {
      state.clinicInfo = { ...state.clinicInfo, ...action.payload };
    },
    updateDocuments: (state, action: PayloadAction<Partial<AdminState['documents']>>) => {
      state.documents = { ...state.documents, ...action.payload };
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    // resetForm: (state) => {
    resetForm: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAdminData.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setManagementType, 
  updatePersonalInfo, 
  updateClinicInfo, 
  updateDocuments, 
  setCurrentStep, 
  resetForm 
} = adminSlice.actions;

export default adminSlice.reducer;