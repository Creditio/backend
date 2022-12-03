import { Router } from "express";
import polygonRouter from "./polygonIDRouter";

const router = Router();

router.use("/polygonId", polygonRouter);

export default router;
