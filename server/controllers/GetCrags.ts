import { Request, Response } from "express";
import prisma from "../models/db";
import { Crag } from "@prisma/client";

const getCrags = async function (req: Request, res: Response) {
  try {
    const { lng, lat, distance } = req.params;
    // get the minimum and maximum distance
    const distanceSplit = distance.split(",");
    // return all the crags in the db and all the assosiated climbingTypes
    const allCrags: Crag[] = await prisma.crag.findMany({
      include: {
        climbingType: true
      }
    });

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

    // add the calculated distance to the crag database
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
        climbingType: true
      }
    });
    res.status(200).json(allCrags);
  } catch (err) {
    console.error(err, "error");
    res
      .status(500)
      .json({ data: null, error: { code: 500, msg: "An error occurred." } });
  }
}


function getDistanceFromLatLonInKm(
  latStart: number,
  lonStart: number,
  latEnd: number,
  lonEnd: number,
) {
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


const controller = {
  getCrags,
  getAll
};

export default controller;
