import { Route } from "@prisma/client";
import { GradeSystems, Grades, TypeCount } from "../types/types";

export const getDistanceFromLatLonInKm = (
  latStart: number,
  lonStart: number,
  latEnd: number,
  lonEnd: number,
) => {
  var R = 6371;
  var dLat = deg2rad(latEnd - latStart);
  var dLon = deg2rad(lonEnd - lonStart);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latStart)) *
    Math.cos(deg2rad(latEnd)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}


export const findRangeIndex = (mainClimbingType: string, gradeSystems: GradeSystems) => {
  const rangeIndex = gradeSystems[mainClimbingType].range;
  const rangeArr =
    rangeIndex[0] !== rangeIndex[1]
      ? gradeSystems[mainClimbingType].grades.slice(
        rangeIndex[0],
        rangeIndex[1] + 1,
      )
      : [
        gradeSystems[mainClimbingType].grades[rangeIndex[0]],
        gradeSystems[mainClimbingType].grades[rangeIndex[0]],
      ];

  return rangeArr.every((grade) => grade !== undefined)
    ? `${rangeArr[0]},${rangeArr[rangeArr.length - 1]}`
    : "";
}

export const determineMainClimbingType = (typeCount: TypeCount) => {
  let mainClimbingTypeCount = 0;
  let mainClimbingType: string | null = null;
  for (let [key, value] of Object.entries(typeCount)) {
    if (value > mainClimbingTypeCount) {
      mainClimbingType = key;
      mainClimbingTypeCount = value;
    }
  }
  return mainClimbingType
};

export const calculateStatsForRoutes = (routes: Route[], gradeSystems: GradeSystems) => {
  const stats = { beginner: 0, experienced: 0, advanced: 0, expert: 0, elite: 0, stars: 0, typeCount: { boulderingV: 0, boulderingFont: 0, sport: 0, trad: 0 } };

  routes.forEach((route) => {
    const grade = route.grade.toUpperCase();
    const climbingTypeID = route.climbingTypeID;
    stats.stars += route.stars;

    let gradeSystem: Grades | undefined;
    let index: string | undefined;

    if (climbingTypeID === 2) {
      if (grade.startsWith("F")) {
        gradeSystem = gradeSystems.boulderingFont;
        index = "boulderingFont";
        stats.typeCount.boulderingFont++;
      } else if (grade.startsWith("V")) {
        gradeSystem = gradeSystems.boulderingV;
        index = "boulderingV";
        stats.typeCount.boulderingV++;
      }
    } else if (climbingTypeID === 3) {
      gradeSystem = gradeSystems.trad;
      index = "trad";
      stats.typeCount.trad++;
    } else if (climbingTypeID === 4) {
      gradeSystem = gradeSystems.sport;
      index = "sport";
      stats.typeCount.sport++;
    }

    if (gradeSystem && index) {
      const gradeIndex = gradeSystem.grades.findIndex(
        (g) => g.toUpperCase() === grade,
      );

      if (gradeIndex !== -1) {
        gradeSystems[index].range = [
          Math.min(gradeIndex, gradeSystems[index].range[0] || gradeIndex),
          Math.max(gradeIndex, gradeSystems[index].range[1] || gradeIndex),
        ];

        const thresholds = gradeSystem.thresholds;
        if (gradeIndex <= thresholds[0]) stats.beginner++;
        else if (gradeIndex <= thresholds[1]) stats.experienced++;
        else if (gradeIndex <= thresholds[2]) stats.advanced++;
        else if (gradeIndex <= thresholds[3]) stats.expert++;
        else stats.elite++;
      }
    } else {
      console.log(`Climbing type ID ${climbingTypeID} not supported.`);
    }
  });

  return stats;
};
