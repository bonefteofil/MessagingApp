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
  ownerId?: number;
  owner?: string;
}

export interface GroupMemberScheme {
  id?: number;
  groupId: number;
  userId: number;
  username: string;
  createdAt: string;
}

export interface GroupFormScheme {
  name: string;
  membersIds?: number[];
}