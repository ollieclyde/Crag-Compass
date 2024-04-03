import express from "express";
import GetCrags from "./controllers/GetCrags";
import AddCrags from "./controllers/AddCrags";
const router = express.Router();

router.get("/crags/lng/:lng/lat/:lat/dist/:distance", GetCrags.getCrags);
router.get("/crags/cragInfoExists/cragID/:cragID", GetCrags.cragInfoExists);
router.get("/crags/cragRoutesExist/cragID/:cragID", GetCrags.cragRoutesExists);
router.get("/getAll", GetCrags.getAll);

router.post("/addCrag", AddCrags.addCrag);
router.post("/addCragInfo", AddCrags.addCragInfo);
router.post("/addRoute", AddCrags.addRoute);
router.post("/addCragStats", AddCrags.addCragStats);

export default router;
