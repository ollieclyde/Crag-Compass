import express from "express";
import GetCrags from "./controllers/GetCrags";
import PostCrags from "./controllers/PostCrags";

const router = express.Router();

router.get("/crags/lng/:lng/lat/:lat/dist/:distance", GetCrags.getCrags);

router.post("/crags", PostCrags.postCrags);

export default router;
