export interface PlayerType {
  _id: string;
  user: User;
  bat: string;
  bowl: string;
  bowlingType: string;
  role: string;
  creator: string;
  __v: number;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
  verificationCode: string;
  isVerified: boolean;
  friends: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TeamType {
  _id: string;
  name: string;
  shortName: string;
  players: string[];
  captain: string;
  __v: number;
}

export interface TeamSquadType {
  _id: string;
  name: string;
  shortName: string;
  players: User[];
  captain: User;
  __v: number;
}

export interface PlayerProfileType {
  player: PlayerType;
  teams: TeamType[];
}

export interface TeamFullType {
  _id: string;
  name: string;
  shortName: string;
  players: PlayerType[];
  captain: PlayerType;
  __v: number;
}
