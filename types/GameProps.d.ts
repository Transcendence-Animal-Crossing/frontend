import { UserData } from './UserData';

export interface GameProps {
  id: number;
  winnerScore: number;
  loserScore: number;
  playTime: number;
  loser: UserData;
  winner: UserData;
}
