import { Crag, ClimbingType } from '../models/index'
const typeIDs = {
  sport: 3,
  bouldering: 1,
  trad: 2,
  unknown: 4
}

function maxMilesCalc(driveLength: number) {
  const milesPerMin = 112.654 / 60;
  return Math.ceil(milesPerMin * driveLength)
}

// TODO CHANGE TO MILES AND MAKE SURE NAMES MATCH IT AND EVERYTHING BUT CURRENTLY JUST IN KM
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km

  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}


const getCrags = async function (req: any, res: any) {
  try {
    const { lng, lat, driveLength } = req.params;
    // const maxMiles = maxMilesCalc(+driveLength)
    // include in finall the function to then only go through the db once.
    const driveLengthSplit = driveLength.split(',')
    const allCrags: any = await Crag.findAll({ include: 'climbingTypes' });
    const filteredCrags = allCrags.filter((crag: any) => {
      if (crag && crag.osy && crag.osx) {
        const dist = getDistanceFromLatLonInKm(+lat, +lng, +crag.osy, +crag.osx)
        if (driveLengthSplit[1] > dist && driveLengthSplit[0] < dist) {
          return true;
        } else {
          return false;
        }
      }
    })

    const filteredCragsAndKMDistance = filteredCrags.map((crag: any) => {
      return {
        ...crag.dataValues,
        distance: Math.ceil(getDistanceFromLatLonInKm(+lat, +lng, +crag.osy, +crag.osx))
      }
    })

    res.status(200).json(filteredCragsAndKMDistance);
  } catch (err) {
    console.error(err, "error");
    res.status(500).json({ data: null, error: { code: 500, msg: "An error occurred." } });
  }
}
const postCrags = async function (req: any, res: any) {
  try {
    const { crag } = req.body;
    // TODO CREATE TYPE FOR THIS TO ENSURE YOU ARE GETTING EXPECTED DATA
    if (crag?.cragName && crag.country === 'England') {

      const existingCrag = await Crag.findOne({
        where: {
          cragName: crag.cragName,
          osx: crag.osx,
          osy: crag.osy,
        }
      });

      if (!existingCrag) {
        const newCrag = await Crag.create({
          cragName: crag.cragName,
          location: crag.location,
          country: crag.country,
          osx: crag.osx,
          osy: crag.osy,
          ukcUrl: crag.ukcURL,
          routes: crag.routes,
          rockType: crag.rocktype,
          faces: crag.faces
        });

        // Assuming you have a method to add climbing types
        const climbingTypeID = crag.climbingTypes;
        await newCrag.addClimbingTypes(climbingTypeID);
      } else {
        res.status(204).json({ message: "Crag already exists" });
      }
      console.log('worked')
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
}

export default controller