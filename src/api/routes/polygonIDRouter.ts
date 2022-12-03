import { Router } from "express";
import { ZKController } from "../controllers";

const router = Router();

router.post("/getOffer", ZKController.createOffer);

export default router;
