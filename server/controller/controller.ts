import { Request, Response } from "express";
import { Crag, ClimbingType } from "../models/index";
import { CragType } from "../types/types";



function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const getCrags = async function (req: Request, res: Response) {
  try {
    const { lng, lat, distance } = req.params;

    // get the minimum and maximum distance
    const distanceSplit = distance.split(",");

    // return all the crags in the db and all the assosiated climbingTypes
    const allCrags: Crag[] = await Crag.findAll({ include: "climbingTypes" });

    // filter out the crags which are not within the KMs specified
    const filteredCrags = allCrags.filter((crag: Crag) => {
      if (crag && crag.osy && crag.osx) {
        const dist = getDistanceFromLatLonInKm(
          +lat,
          +lng,
          +crag.osy,
          +crag.osx,
        );
        if (+distanceSplit[1] > dist && +distanceSplit[0] < dist) {
          return true;
        } else {
          return false;
        }
      }
    });
    console.log(filteredCrags[0])

    // add the calculated distance to the crag database
    const filteredCragsAndKMDistance = filteredCrags.map((crag: Crag) => {
      if (crag.osy && crag.osx) {
        return {
          ...crag.dataValues,
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

// Function to be able to post the crag data to the database
const postCrags = async function (req: Request, res: Response) {
  try {
    const { crag }: { crag: CragType } = req.body;

    if (crag?.cragName && crag.country === "England") {
      // checks whether that crag is alread in the database
      const existingCrag = await Crag.findOne({
        where: {
          cragName: crag.cragName,
          osx: crag.osx,
          osy: crag.osy,
        },
      });

      // add crag if it is not
      if (!existingCrag) {
        const newCrag = await Crag.create({
          cragName: crag.cragName,
          location: crag.location,
          country: crag.country,
          osx: crag.osx,
          osy: crag.osy,
          ukcUrl: crag.ukcUrl,
          routes: crag.routes,
          rockType: crag.rockType,
          faces: crag.faces,
        });

        const climbingTypeID: number[] | undefined = crag.climbingTypes;
        if (climbingTypeID) {
          await newCrag.addClimbingTypes(climbingTypeID);
        }
      } else {
        res.status(204).json({ message: "Crag already exists" });
      }
      res.status(200).json({ message: "Crag added successfully" });
    } else {
      res.status(204).json({ message: "Crag undefined or not in England" });
    }
  } catch (err) {
    console.error(err, "error");
    res.status(500).json({ error: { code: 500, msg: "An error occurred." } });
  }
};

const controller = {
  getCrags,
  postCrags,
};

export default controller;
