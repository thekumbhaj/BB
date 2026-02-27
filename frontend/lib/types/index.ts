export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Bug {
  _id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  userId: string;
  message: string;
  role: 'user' | 'assistant';
  createdAt: string;
}
