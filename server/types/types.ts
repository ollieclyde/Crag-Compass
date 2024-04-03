export interface Crag {
  name: string;
  country: string;
  faces: string;
  location: string;
  osx: string;
  osy: string;
  rockType: string;
  routeCount: number;
  ukcURL: string;
  climbingTypes: number[];
  cragInfo?: CragInfo;
  routes?: Route[];
}

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
  climbingTypeID: number;
  stars: number;
  logs: number;
}
