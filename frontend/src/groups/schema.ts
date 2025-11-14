export interface InboxGroupScheme {
  id?: number;
  name: string;
  lastMessage?: string
  lastMessageAt?: string
  createdAt?: string;
}

export interface GroupScheme {
  id?: number;
  name: string;
  createdAt?: string;
}

export interface GroupMemberScheme {
  id?: number;
  groupId: number;
  userId: number;
  username: string;
  createdAt: string;
}