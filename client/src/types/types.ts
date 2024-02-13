export type ClimbingType = {
  id: number;
  climbingType: string;
};

export type SearchValues = {
  location: number[];
  depatureDate: string;
  climbingType: any;
  rockType: string;
  gradeRange: string[];
  driveLength: number[];
};

export type Coords = {
  lng: string;
  lat: string;
};

export type Crag = {
  country: string;
  cragName: string;
  createdAt: string;
  distance: number;
  faces: string;
  id: number;
  location: string;
  osx: string;
  osy: string;
  rockType: string;
  routes: string;
  ukcUrl: string;
  updatedAt: string;
  climbingTypes: ClimbingType[];
};

