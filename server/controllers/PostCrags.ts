import { Request, Response } from "express";
import prisma from "../models/db";

import { Crag } from "../types/types";





const postCrags = async function (req: Request, res: Response) {
  try {
    const { crag }: { crag: Crag } = req.body;

    if (crag?.cragName && crag.country === "England") {
      // checks whether that crag is alread in the database
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
            ukc_url: crag.ukcUrl,
            route_count: crag.routeCount,
            rock_type: crag.rockType,
            faces: crag.faces,
            climbing_type: {
              connect: crag.climbingTypes.map((id) => ({ climbing_type_id: id })),
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
