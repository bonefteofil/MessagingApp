export interface InboxGroupScheme {
  id?: number;
  name: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt?: string;
  public: boolean;
}

export interface GroupScheme {
  id?: number;
  name: string;
  createdAt?: string;
  ownerId?: number;
  owner?: string;
  public: boolean;
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
  public: boolean;
  membersIds?: number[];
}