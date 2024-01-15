export type Crag = {
  cragName: string;
  routes: string;
  location: string;
  country: string;
  href: string;
  rockType: string;
  altitude: string;
  faces: string;
  googleUrl: string;
  osx: string;
  osy: string;
  climbingTypes: ClimbingType[];
};

export type ClimbingType = {
  id: number;
  climbingType: string;
}

export type SearchValues = {
  location: number[];
  depatureDate: string;
  climbingType: any;
  rockType: string;
  gradeRange: string[];
  driveLength: number[];
}

export type Coords = {
  lng: string;
  lat: string;
}


