export interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
  size: string;
  uploadDate: string;
  sections: Section[];
}

export interface EditDocumentDTO {
  id: string;
  sections: Section[];
}

export interface Section {
  id: number;
  tag: string;
  name: string;
  permissionSubject: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: string;
}

export interface User {
  id: string;
  data: {
    name: string;
    email: string;
    password: string;
    roleId: string;
    vacationDays: string;
  };
}

export interface Message {
  id: string;
  content: string;
  type: string;
}

export interface MessageState {
  items: Message[];
}
