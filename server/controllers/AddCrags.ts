import { Request, Response } from "express";
import prisma from "../models/db";

import { Crag, CragInfo, Route } from "../types/types";


const addCrag = async function (req: Request, res: Response) {
  try {
    const { crag }: { crag: Crag } = req.body;
    if (crag?.name && crag.country === "England") {
      // checks whether that crag is already in the database
      const existingCrag = await prisma.crag.findFirst({
        where: {
          name: crag.name,
          osx: crag.osx,
          osy: crag.osy,
        },
      });

      // add crag if it is not
      if (!existingCrag) {
        await prisma.crag.create({
          data: {
            name: crag.name,
            location: crag.location,
            country: crag.country,
            osx: crag.osx,
            osy: crag.osy,
            ukcURL: crag.ukcURL,
            routeCount: crag.routeCount,
            rockType: crag.rockType,
            faces: crag.faces,
            climbingType: {
              connect: crag.climbingTypes.map((id) => ({ climbingTypeID: id })),
            },
          },
        });

        res.status(200).json({ message: "Crag added successfully" });
      } else {
        res.status(204).json({ message: "Crag already exists" });
      }
    } else {
      res.status(204).json({ message: "Crag undefined or not in England" });
    }
  } catch (err) {
    console.error(err, "error");
    res.status(500).json({ error: { code: 500, msg: "An error occurred." } });
  }
};


const addCragInfo = async (req: Request, res: Response) => {
  try {
    const { cragInfoData }: { cragInfoData: CragInfo } = req.body;
    const existingCragInfo = await prisma.cragInfo.findFirst({
      where: {
        img: cragInfoData.img,
        features: cragInfoData.features,
        approach: cragInfoData.approach,
        accessType: cragInfoData.accessType,
        accessNote: cragInfoData.accessNote,
        cragID: cragInfoData.cragID,
      },
    });
    if (!existingCragInfo) {
      await prisma.cragInfo.create({
        data: {
          img: cragInfoData.img,
          features: cragInfoData.features,
          approach: cragInfoData.approach,
          accessType: cragInfoData.accessType,
          accessNote: cragInfoData.accessNote,
          crag: {
            connect: {
              cragID: cragInfoData.cragID,
            },
          },
        },
      });

      res.status(200).json({ message: "Crag info added successfully" });

    } else {
      res.status(204).json({ message: "Crag info already exists" });
    }
  } catch (err) {
    console.error(err, "error");
    res.status(500).json({ error: { code: 500, msg: "An error occurred." } });
  }

};

const addRoute = async (req: Request, res: Response) => {
  try {
    const { routeData }: { routeData: Route } = req.body;
    const existingRoute = await prisma.route.findFirst({
      where: {
        name: routeData.name,
        grade: routeData.grade,
        stars: routeData.stars,
        logs: routeData.logs,
        cragID: routeData.cragID,
        climbingTypeID: routeData.climbingTypeID,
      },
    });
    console.log(routeData, "routeData")
    if (!existingRoute) {
      await prisma.route.create({
        data: {
          name: routeData.name,
          grade: routeData.grade,
          stars: routeData.stars,
          logs: routeData.logs,
          climbingType: {
            connect: {
              climbingTypeID: routeData.climbingTypeID,
            },
          },
          crag: {
            connect: {
              cragID: routeData.cragID,
            },
          },
        },
      })
      res.status(200).json({ message: "route succesffully added" });
    } else {
      res.status(204).json({ message: "Crag info already exists" });
    }
  } catch (err) {
    console.error(err, "error");
    res.status(500).json({ error: { code: 500, msg: "An error occurred." } });
  }
};

interface Grades {
  grades: string[];
  thresholds: number[];
  range: number[];
}

interface GradeSystems {
  [gradeSystem: string]: Grades;
}
interface TypeCount {
  boulderingFont: number;
  boulderingV: number;
  trad: number;
  sport: number;
}


const addCragStats = async (req: Request, res: Response) => {
  const { cragID }: { cragID: number } = req.body;

  const existingCragStats = await prisma.cragStats.findFirst({
    where: {
      cragID: cragID,
    },
  });
  if (existingCragStats) {
    res.status(204).json({ message: "Crag stats already exists" });
    return;
  }

  const routes = await prisma.route.findMany({
    where: {
      cragID: cragID,
    }
  })

  if (routes.length === 0) {
    res.status(204).json({ message: "No routes found for this crag" });
    return;
  }

  // Implement the climbingTypes with detailed structure
  const gradeSystems: GradeSystems = {
    boulderingFont: {
      grades: ['f3', 'f3+', 'f4', 'f4+', 'f5', 'f5+', 'f6a', 'f6a+', 'f6b', 'f6b+', 'f6c', 'f6c+', 'f7a', 'f7a+', 'f7b', 'f7b+', 'f7c', 'f7c+', 'f8a', 'f8a+', 'f8b', 'f8b+', 'f8c', 'f8c+', 'f9a'],
      thresholds: [3, 6, 12, 18],
      range: []
    },
    boulderingV: {
      grades: ['VB', 'V0-', 'V0', 'V0+', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15'],
      thresholds: [3, 6, 9, 13],
      range: []
    },
    trad: {
      grades: ['m', 'd', 'vd', 'hvd', 's', 'hs', 'vs', 'hvs', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11'],
      thresholds: [5, 8, 11, 14],
      range: []
    },
    sport: {
      grades: ['1', '2', '2+', '3a', '3b', '3c', '4a', '4b', '4c', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+', '9b', '9b+'],
      thresholds: [9, 14, 19, 24],
      range: []
    }
  }

  // Counts
  let beginner = 0;
  let experienced = 0;
  let advanced = 0;
  let expert = 0;
  let elite = 0;

  const typeCount: TypeCount = {
    boulderingV: 0,
    boulderingFont: 0,
    sport: 0,
    trad: 0
  }

  let stars = 0;

  routes.forEach(route => {
    const grade = route.grade.toUpperCase();
    const climbingTypeID = route.climbingTypeID
    stars += route.stars;

    let gradeSystem: Grades | undefined;
    let index: string | undefined;

    if (climbingTypeID === 2) {
      if (grade.startsWith('F')) {
        gradeSystem = gradeSystems.boulderingFont;
        index = 'boulderingFont';
        typeCount.boulderingFont++;
      } else if (grade.startsWith('V')) {
        gradeSystem = gradeSystems.boulderingV;
        index = 'boulderingV';
        typeCount.boulderingV++;
      }
    } else if (climbingTypeID === 3) {
      gradeSystem = gradeSystems.trad;
      index = 'trad';
      typeCount.trad++;
    } else if (climbingTypeID === 4) {
      gradeSystem = gradeSystems.sport;
      index = 'sport';
      typeCount.sport++;
    }

    if (gradeSystem && index) {
      const gradeIndex = gradeSystem.grades.findIndex(g => g.toUpperCase() === grade);

      if (gradeIndex !== -1) {
        gradeSystems[index].range = [Math.min(gradeIndex, gradeSystems[index].range[0] || gradeIndex), Math.max(gradeIndex, gradeSystems[index].range[1] || gradeIndex)];

        const thresholds = gradeSystem.thresholds;
        if (gradeIndex <= thresholds[0]) beginner++;
        else if (gradeIndex <= thresholds[1]) experienced++;
        else if (gradeIndex <= thresholds[2]) advanced++;
        else if (gradeIndex <= thresholds[3]) expert++;
        else elite++;
      }
    } else {
      console.log(`Climbing type ID ${climbingTypeID} not supported.`);
    }
  })

  let mainClimbingType: string | null = null;
  let mainClimbingTypeCount = 0;
  const avgStars = stars / routes.length;

  for (let [key, value] of Object.entries(typeCount)) {
    if (value > mainClimbingTypeCount) {
      mainClimbingType = key;
      mainClimbingTypeCount = value;
    }
  }

  if (mainClimbingType) {
    const rangeIndex = gradeSystems[mainClimbingType].range;
    const rangeArr = rangeIndex[0] !== rangeIndex[1] ? gradeSystems[mainClimbingType].grades.slice(rangeIndex[0], rangeIndex[1] + 1) : [gradeSystems[mainClimbingType].grades[rangeIndex[0]], gradeSystems[mainClimbingType].grades[rangeIndex[0]]]
    const range = rangeArr.every(grade => grade !== undefined) ? `${rangeArr[0]},${rangeArr[rangeArr.length - 1]}` : '';

    await prisma.cragStats.create({
      data: {
        mainClimbingType,
        beginner,
        experienced,
        advanced,
        expert,
        elite,
        avgStars,
        range,
        crag: {
          connect: {
            cragID: cragID,
          },
        },
      },
    });
  }
  res.status(200).json({ message: "Crag stats added successfully" });
};

export default { addCrag, addCragInfo, addRoute, addCragStats };
