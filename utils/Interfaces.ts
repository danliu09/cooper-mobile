export enum Role {
  User = 0,
  Bot = 1,
}

export interface Message {
  role: Role;
  content: string;
  imageUrl?: string;
  prompt?: string;
  loading?: boolean;
}

export interface Chat {
  id: number;
  title: string;
}
