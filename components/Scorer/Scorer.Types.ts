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

export interface Scorer {
  match: Match;
  innings: Inning[];
}

interface Inning {
  _id: string;
  match: Match;
  batting: Batting;
  bowling: Batting;
  striker: Striker;
  nonStriker: Striker;
  bowler: Striker;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Striker {
  _id: string;
  user: string;
  bat: string;
  bowl: string;
  bowlingType: string;
  role: string;
  creator: string;
  __v: number;
}

interface Batting {
  _id: string;
  squad: Squad[];
  captain: string;
  match: string;
  team: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Squad {
  _id: string;
  user: UserName;
  bat: string;
  bowl: string;
  bowlingType: string;
  role: string;
  creator: string;
  __v: number;
}

interface Match {
  _id: string;
  home: Home;
  away: Home;
  toss: string;
  choosen: string;
  overs: number;
  city: string;
  user: UserName;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserName {
  _id: string;
  name: string;
}

interface Home {
  _id: string;
  name: string;
  shortName: string;
  captain: string;
  user: string;
  __v: number;
}
