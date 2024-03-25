import { Request, Response } from "express";
import prisma from "../models/db";

import { Crag, CragInfo, Route } from "../types/types";



const addCrag = async function (req: Request, res: Response) {
  try {
    const { crag }: { crag: Crag } = req.body;
    if (crag?.cragName && crag.country === "England") {
      // checks whether that crag is already in the database
      const existingCrag = await prisma.crag.findFirst({
        where: {
          name: crag.cragName,
          osx: crag.osx,
          osy: crag.osy,
        },
      });

      // add crag if it is not
      if (!existingCrag) {
        await prisma.crag.create({
          data: {
            name: crag.cragName,
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
        climbingTypeID: routeData.climbingType,
      },
    });
    if (!existingRoute) {
      await prisma.route.create({
        data: {
          name: routeData.name,
          grade: routeData.grade,
          stars: routeData.stars,
          logs: routeData.logs,
          climbingType: {
            connect: {
              climbingTypeID: routeData.climbingType,
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



export default { addCrag, addCragInfo, addRoute };
