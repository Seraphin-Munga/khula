import { UserProfile } from '../models/user';
import { Document } from '../store/slices/documentsSlice';

export interface MockUser {
  email: string;
  password: string;
  user: UserProfile;
}

export interface MockDocument extends Document {
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
}

export interface MockApplication {
  id: string;
  userId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

class MockDataService {
  private static instance: MockDataService;
  
  // Mock users data
  private mockUsers: MockUser[] = [
    {
      email: 'demo@khula.com',
      password: 'Demo123!',
      user: {
        firstName: '',
        lastName: '',
        email: 'demo@khula.com',
        phone: '',
        address: '',
        dateOfBirth: '',
        isLoggedIn: true,
      }
    },
    {
      email: 'john@example.com',
      password: 'Password123!',
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1987654321',
        address: '456 Oak Avenue, Springfield, IL 62701',
        dateOfBirth: '1985-06-20',
        isLoggedIn: true,
      }
    },
    {
      email: 'jane@example.com',
      password: 'SecurePass456!',
      user: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1555123456',
        address: '789 Pine Road, Portland, OR 97201',
        dateOfBirth: '1992-12-10',
        isLoggedIn: true,
      }
    }
  ];

  // Mock documents data
  private mockDocuments: MockDocument[] = [
    {
      id: 'doc_1',
      userId: 'demo@khula.com',
      name: 'john_doe_id.pdf',
      type: 'applicant-id',
      uri: 'file://mock/path/john_doe_id.pdf',
      uploadedAt: '2024-01-15T10:30:00Z',
      status: 'approved',
      reviewNotes: 'Document verified successfully'
    },
    {
      id: 'doc_2',
      userId: 'demo@khula.com',
      name: 'directors_id_1.jpg',
      type: 'directors-id',
      uri: 'file://mock/path/directors_id_1.jpg',
      uploadedAt: '2024-01-15T11:15:00Z',
      status: 'pending'
    },
    {
      id: 'doc_3',
      userId: 'demo@khula.com',
      name: 'company_registration.pdf',
      type: 'company-registration',
      uri: 'file://mock/path/company_registration.pdf',
      uploadedAt: '2024-01-15T12:00:00Z',
      status: 'approved',
      reviewNotes: 'Registration documents are valid'
    }
  ];

  // Mock applications data
  private mockApplications: MockApplication[] = [
    {
      id: 'app_1',
      userId: 'demo@khula.com',
      status: 'submitted',
      submittedAt: '2024-01-15T14:30:00Z',
      reviewedAt: '2024-01-16T09:15:00Z',
      reviewNotes: 'Application approved pending final document verification'
    },
    {
      id: 'app_2',
      userId: 'john@example.com',
      status: 'approved',
      submittedAt: '2024-01-10T16:45:00Z',
      reviewedAt: '2024-01-12T11:20:00Z',
      reviewNotes: 'All documents verified and application approved'
    }
  ];

  // Current session data
  private currentUser: MockUser | null = null;
  private currentToken: string | null = null;

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  // User management methods
  public getMockUsers(): MockUser[] {
    return [...this.mockUsers];
  }

  public findUserByEmail(email: string): MockUser | undefined {
    return this.mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  public addUser(user: MockUser): void {
    this.mockUsers.push(user);
  }

  public updateUser(email: string, updates: Partial<UserProfile>): boolean {
    const userIndex = this.mockUsers.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
      this.mockUsers[userIndex].user = { ...this.mockUsers[userIndex].user, ...updates };
      return true;
    }
    return false;
  }

  // Session management
  public setCurrentUser(user: MockUser, token: string): void {
    this.currentUser = user;
    this.currentToken = token;
  }

  public getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  public getCurrentToken(): string | null {
    return this.currentToken;
  }

  public clearSession(): void {
    this.currentUser = null;
    this.currentToken = null;
  }

  // Document management methods
  public getDocumentsByUserId(userId: string): MockDocument[] {
    return this.mockDocuments.filter(doc => doc.userId === userId);
  }

  public addDocument(document: MockDocument): void {
    this.mockDocuments.push(document);
  }

  public updateDocumentStatus(documentId: string, status: 'pending' | 'approved' | 'rejected', notes?: string): boolean {
    const docIndex = this.mockDocuments.findIndex(doc => doc.id === documentId);
    if (docIndex !== -1) {
      this.mockDocuments[docIndex].status = status;
      if (notes) {
        this.mockDocuments[docIndex].reviewNotes = notes;
      }
      return true;
    }
    return false;
  }

  public removeDocument(documentId: string): boolean {
    const docIndex = this.mockDocuments.findIndex(doc => doc.id === documentId);
    if (docIndex !== -1) {
      this.mockDocuments.splice(docIndex, 1);
      return true;
    }
    return false;
  }

  // Application management methods
  public getApplicationByUserId(userId: string): MockApplication | undefined {
    return this.mockApplications.find(app => app.userId === userId);
  }

  public createApplication(userId: string): MockApplication {
    const newApplication: MockApplication = {
      id: `app_${Date.now()}`,
      userId,
      status: 'draft',
    };
    this.mockApplications.push(newApplication);
    return newApplication;
  }

  public updateApplicationStatus(applicationId: string, status: MockApplication['status'], notes?: string): boolean {
    const appIndex = this.mockApplications.findIndex(app => app.id === applicationId);
    if (appIndex !== -1) {
      this.mockApplications[appIndex].status = status;
      if (status === 'submitted') {
        this.mockApplications[appIndex].submittedAt = new Date().toISOString();
      } else if (['approved', 'rejected', 'under_review'].includes(status)) {
        this.mockApplications[appIndex].reviewedAt = new Date().toISOString();
      }
      if (notes) {
        this.mockApplications[appIndex].reviewNotes = notes;
      }
      return true;
    }
    return false;
  }

  // Utility methods
  public generateMockToken(): string {
    return `mock_jwt_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getMockDataSummary(): any {
    return {
      totalUsers: this.mockUsers.length,
      totalDocuments: this.mockDocuments.length,
      totalApplications: this.mockApplications.length,
      currentUser: this.currentUser?.email || null,
      hasActiveSession: !!this.currentToken,
    };
  }

  // Reset all data (for testing)
  public resetAllData(): void {
    this.mockUsers = [];
    this.mockDocuments = [];
    this.mockApplications = [];
    this.currentUser = null;
    this.currentToken = null;
  }
}

export default MockDataService; 