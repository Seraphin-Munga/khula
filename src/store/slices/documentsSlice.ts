import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Document {
  id: string;
  name: string;
  type: 'id' | 'passport' | 'drivers-license' | 'utility-bill' | 'bank-statement' | 'payslip' | 'applicant-id' | 'directors-id' | 'company-registration';
  uri: string;
  uploadedAt: string;
}

const initialState: Document[] = [];

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<Document>) => {
      state.push(action.payload);
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      return state.filter(doc => doc.id !== action.payload);
    },
    clearDocuments: (state) => {
      return [];
    },
  },
});

export const { addDocument, removeDocument, clearDocuments } = documentsSlice.actions;
export default documentsSlice.reducer; 