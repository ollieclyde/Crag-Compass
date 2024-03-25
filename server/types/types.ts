export interface Crag {
  cragName: string;
  country: string;
  faces: string;
  location: string;
  osx: string;
  osy: string;
  rockType: string;
  routeCount: number;
  ukcURL: string;
  climbingTypes: number[];
};

export interface CragInfo {
  cragID: number;
  img: string;
  features: string;
  approach: string;
  accessType: number;
  accessNote: string;
}

export interface Route {
  cragID: number;
  name: string;
  grade: string;
  climbingType: number;
  stars: number;
  logs: number;
}


