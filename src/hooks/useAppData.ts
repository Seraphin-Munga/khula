import { useMemo } from 'react';
import AppDataService from '../services/appDataService';

export const useAppData = () => {
  const appDataService = useMemo(() => AppDataService.getInstance(), []);

  return {
    // User methods
    getCurrentUser: () => appDataService.getCurrentUser(),
    getCurrentUserProfile: () => appDataService.getCurrentUserProfile(),
    updateCurrentUserProfile: (updates: any) => appDataService.updateCurrentUserProfile(updates),
    isUserLoggedIn: () => appDataService.isUserLoggedIn(),
    getCurrentToken: () => appDataService.getCurrentToken(),

    // Document methods
    getUserDocuments: () => appDataService.getUserDocuments(),
    addUserDocument: (document: any) => appDataService.addUserDocument(document),
    updateDocumentStatus: (documentId: string, status: any, notes?: string) => 
      appDataService.updateDocumentStatus(documentId, status, notes),
    removeUserDocument: (documentId: string) => appDataService.removeUserDocument(documentId),
    getDocumentByType: (type: string) => appDataService.getDocumentByType(type),
    hasDocumentOfType: (type: string) => appDataService.hasDocumentOfType(type),

    // Application methods
    getUserApplication: () => appDataService.getUserApplication(),
    createUserApplication: () => appDataService.createUserApplication(),
    updateApplicationStatus: (status: any, notes?: string) => 
      appDataService.updateApplicationStatus(status, notes),

    // Status methods
    isProfileComplete: () => appDataService.isProfileComplete(),
    getProfileCompletionPercentage: () => appDataService.getProfileCompletionPercentage(),
    getDocumentUploadStatus: () => appDataService.getDocumentUploadStatus(),
    getDocumentUploadPercentage: () => appDataService.getDocumentUploadPercentage(),
    getApplicationStatus: () => appDataService.getApplicationStatus(),
    isApplicationComplete: () => appDataService.isApplicationComplete(),

    // Summary methods
    getDataSummary: () => appDataService.getDataSummary(),
    getMockDataSummary: () => appDataService.getMockDataSummary(),

    // Utility methods
    clearAllData: () => appDataService.clearAllData(),
  };
}; 