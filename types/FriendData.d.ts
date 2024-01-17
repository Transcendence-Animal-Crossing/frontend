import DmData from './DmData';

export interface FriendData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
  status: string;
  unReadMessages: DmData[];
}
