export interface Crag {
  cragName: string;
  country: string;
  faces: string;
  location: string;
  osx: string;
  osy: string;
  rockType: string;
  routeCount: number;
  ukcUrl: string;
  climbingTypes: number[];
};

export interface CragInfo {
  crag_id: number;
  img: string;
  features: string;
  approach: string;
  accessType: string;
  accessNotes: string;
}

export interface Route {
  crag_id: number;
  name: string;
  grade: string;
  climbingType: number;
  stars: number;
  logs: number;
}


