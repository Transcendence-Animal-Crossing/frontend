import { UserData } from './UserData';

export interface RoomListData {
  id: string;
  title: string;
  owner: UserData;
  headCount: number;
  mode: string;
}
