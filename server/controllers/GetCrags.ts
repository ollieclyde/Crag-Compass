import { Request, Response } from "express";
import prisma from "../models/db";
import { Crag } from "@prisma/client";
import { getDistanceFromLatLonInKm } from "../utils/functions";

const getCrags = async function (req: Request, res: Response) {
  try {
    const { lng, lat, distance } = req.params;
    const distanceSplit = distance.split(",");

    const allCrags: Crag[] = await prisma.crag.findMany({
      include: {
        climbingType: true,
        cragInfo: true,
        routes: true,
        cragStats: true,
      },
    });

    const filteredCrags = allCrags.filter((crag: Crag) => {
      if (!crag || !crag.osy || !crag.osx) return false;

      const dist = getDistanceFromLatLonInKm(+lat, +lng, +crag.osy, +crag.osx);
      return +distanceSplit[0] < dist && dist < +distanceSplit[1];
    });

    const filteredCragsAndKMDistance = filteredCrags.map((crag: Crag) => {
      if (crag.osy && crag.osx) {
        return {
          ...crag,
          distance: Math.ceil(
            getDistanceFromLatLonInKm(+lat, +lng, +crag.osy, +crag.osx),
          ),
        };
      }
    });

    res.status(200).json(filteredCragsAndKMDistance);
  } catch (err) {
    console.error(err, "error");
    res
      .status(500)
      .json({ data: null, error: { code: 500, msg: "An error occurred." } });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const allCrags: Crag[] = await prisma.crag.findMany({
      include: {
        climbingType: true,
      },
    });
    res.status(200).json(allCrags);
  } catch (err) {
    console.error(err, "error");
    res
      .status(500)
      .json({ data: null, error: { code: 500, msg: "An error occurred." } });
  }
};

const cragInfoExists = async (req: Request, res: Response) => {
  try {
    const cragID = parseInt(req.params.cragID);

    const existingCragInfo = await prisma.cragInfo.findFirst({
      where: {
        cragID: cragID,
      },
    });
    if (existingCragInfo) {
      res.status(201).json({ message: "CragInfo exists" });
    } else {
      res.status(200).json({ message: "CragInfo does not exist" });
    }
  } catch (err) {
    console.error(err, "error");
    res.status(500).json({ error: { code: 500, msg: "An error occurred." } });
  }
};

const cragRoutesExists = async (req: Request, res: Response) => {
  try {
    const cragID = parseInt(req.params.cragID);
    const existingCragRoutes = await prisma.route.findFirst({
      where: {
        cragID: cragID,
      },
    });
    if (existingCragRoutes) {
      res.status(201).json({ message: "CragRoutes exists" });
    } else {
      res.status(200).json({ message: "CragRoutes does not exist" });
    }
  } catch (err) {
    console.error(err, "error");
    res.status(500).json({ error: { code: 500, msg: "An error occurred." } });
  }
};

const controller = {
  getCrags,
  getAll,
  cragRoutesExists,
  cragInfoExists,
};

export default controller;
