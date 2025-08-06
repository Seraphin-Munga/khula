import MockDataService, { MockUser, MockDocument, MockApplication } from './mockDataService';
import { UserProfile } from '../models/user';
import { Document } from '../store/slices/documentsSlice';

class AppDataService {
  private static instance: AppDataService;
  private mockDataService: MockDataService;

  private constructor() {
    this.mockDataService = MockDataService.getInstance();
  }

  public static getInstance(): AppDataService {
    if (!AppDataService.instance) {
      AppDataService.instance = new AppDataService();
    }
    return AppDataService.instance;
  }

  // User Management
  public getCurrentUser(): MockUser | null {
    return this.mockDataService.getCurrentUser();
  }

  public getCurrentUserProfile(): UserProfile | null {
    const currentUser = this.mockDataService.getCurrentUser();
    return currentUser ? currentUser.user : null;
  }

  public updateCurrentUserProfile(updates: Partial<UserProfile>): boolean {
    const currentUser = this.mockDataService.getCurrentUser();
    if (!currentUser) return false;
    
    return this.mockDataService.updateUser(currentUser.email, updates);
  }

  public isUserLoggedIn(): boolean {
    return this.mockDataService.getCurrentUser() !== null;
  }

  public getCurrentToken(): string | null {
    return this.mockDataService.getCurrentToken();
  }

  // Document Management
  public getUserDocuments(): MockDocument[] {
    const currentUser = this.mockDataService.getCurrentUser();
    if (!currentUser) return [];
    
    return this.mockDataService.getDocumentsByUserId(currentUser.email);
  }

  public addUserDocument(document: Omit<MockDocument, 'userId' | 'status'>): MockDocument {
    const currentUser = this.mockDataService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user session found');
    }

    const newDocument: MockDocument = {
      ...document,
      userId: currentUser.email,
      status: 'pending',
    };

    this.mockDataService.addDocument(newDocument);
    return newDocument;
  }

  public updateDocumentStatus(documentId: string, status: 'pending' | 'approved' | 'rejected', notes?: string): boolean {
    return this.mockDataService.updateDocumentStatus(documentId, status, notes);
  }

  public removeUserDocument(documentId: string): boolean {
    return this.mockDataService.removeDocument(documentId);
  }

  public getDocumentByType(type: string): MockDocument | undefined {
    const currentUser = this.mockDataService.getCurrentUser();
    if (!currentUser) return undefined;
    
    const userDocuments = this.mockDataService.getDocumentsByUserId(currentUser.email);
    return userDocuments.find(doc => doc.type === type);
  }

  public hasDocumentOfType(type: string): boolean {
    return this.getDocumentByType(type) !== undefined;
  }

  // Application Management
  public getUserApplication(): MockApplication | undefined {
    const currentUser = this.mockDataService.getCurrentUser();
    if (!currentUser) return undefined;
    
    return this.mockDataService.getApplicationByUserId(currentUser.email);
  }

  public createUserApplication(): MockApplication {
    const currentUser = this.mockDataService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user session found');
    }

    return this.mockDataService.createApplication(currentUser.email);
  }

  public updateApplicationStatus(status: MockApplication['status'], notes?: string): boolean {
    const currentUser = this.mockDataService.getCurrentUser();
    if (!currentUser) return false;

    const application = this.mockDataService.getApplicationByUserId(currentUser.email);
    if (!application) return false;

    return this.mockDataService.updateApplicationStatus(application.id, status, notes);
  }

  // Profile Completion Status
  public isProfileComplete(): boolean {
    const profile = this.getCurrentUserProfile();
    if (!profile) return false;

    return !!(profile.firstName?.trim() && profile.lastName?.trim());
  }

  public getProfileCompletionPercentage(): number {
    const profile = this.getCurrentUserProfile();
    if (!profile) return 0;

    let completedFields = 0;
    const totalFields = 6; // firstName, lastName, email, phone, address, dateOfBirth

    if (profile.firstName?.trim()) completedFields++;
    if (profile.lastName?.trim()) completedFields++;
    if (profile.email?.trim()) completedFields++;
    if (profile.phone?.trim()) completedFields++;
    if (profile.address?.trim()) completedFields++;
    if (profile.dateOfBirth?.trim()) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  // Document Upload Status
  public getDocumentUploadStatus(): {
    applicantId: boolean;
    directorsId: boolean;
    companyRegistration: boolean;
    totalUploaded: number;
    totalRequired: number;
  } {
    const userDocuments = this.getUserDocuments();
    
    const applicantId = userDocuments.some(doc => doc.type === 'applicant-id');
    const directorsId = userDocuments.some(doc => doc.type === 'directors-id');
    const companyRegistration = userDocuments.some(doc => doc.type === 'company-registration');
    
    const totalUploaded = [applicantId, directorsId, companyRegistration].filter(Boolean).length;
    const totalRequired = 3;

    return {
      applicantId,
      directorsId,
      companyRegistration,
      totalUploaded,
      totalRequired,
    };
  }

  public getDocumentUploadPercentage(): number {
    const status = this.getDocumentUploadStatus();
    return Math.round((status.totalUploaded / status.totalRequired) * 100);
  }

  // Application Status
  public getApplicationStatus(): MockApplication['status'] | 'not_started' {
    const application = this.getUserApplication();
    return application ? application.status : 'not_started';
  }

  public isApplicationComplete(): boolean {
    const application = this.getUserApplication();
    return application ? ['approved', 'rejected'].includes(application.status) : false;
  }

  // Data Summary
  public getDataSummary(): {
    user: {
      isLoggedIn: boolean;
      profileComplete: boolean;
      profileCompletionPercentage: number;
    };
    documents: {
      totalUploaded: number;
      totalRequired: number;
      uploadPercentage: number;
      status: {
        applicantId: boolean;
        directorsId: boolean;
        companyRegistration: boolean;
      };
    };
    application: {
      status: MockApplication['status'] | 'not_started';
      isComplete: boolean;
    };
  } {
    return {
      user: {
        isLoggedIn: this.isUserLoggedIn(),
        profileComplete: this.isProfileComplete(),
        profileCompletionPercentage: this.getProfileCompletionPercentage(),
      },
      documents: {
        ...this.getDocumentUploadStatus(),
        uploadPercentage: this.getDocumentUploadPercentage(),
        status: {
          applicantId: this.getDocumentUploadStatus().applicantId,
          directorsId: this.getDocumentUploadStatus().directorsId,
          companyRegistration: this.getDocumentUploadStatus().companyRegistration,
        },
      },
      application: {
        status: this.getApplicationStatus(),
        isComplete: this.isApplicationComplete(),
      },
    };
  }

  // Utility Methods
  public clearAllData(): void {
    this.mockDataService.resetAllData();
  }

  public getMockDataSummary(): any {
    return this.mockDataService.getMockDataSummary();
  }
}

export default AppDataService; 