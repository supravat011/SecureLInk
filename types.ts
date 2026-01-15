export interface MessageData {
  id: string;
  originalText: string;
  encryptedText: string;
  decryptedText: string;
  timestamp: number;
  algorithm: string;
  keySize: number;
  integrityVerified: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

export enum EncryptionStatus {
  IDLE = 'IDLE',
  ENCRYPTING = 'ENCRYPTING',
  TRANSMITTING = 'TRANSMITTING',
  DECRYPTING = 'DECRYPTING',
  COMPLETED = 'COMPLETED'
}

export interface NavItem {
  label: string;
  path: string;
  requiresAuth?: boolean;
}