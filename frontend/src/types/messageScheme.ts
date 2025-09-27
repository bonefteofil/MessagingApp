export default interface MessageScheme {
  id?: number;
  text: string;
  groupId: number;
  createdAt?: string;
  createdTime?: string;
  edited?: boolean;
  username?: string;
}