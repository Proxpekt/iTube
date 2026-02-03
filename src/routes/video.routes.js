import { Router } from "express";
import { watchVideo } from "../controllers/video.controllers.js";

const router = Router();

router.route("/watch").get(watchVideo);

export default router;
