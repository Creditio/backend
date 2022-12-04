import { Router } from "express";
import { ZKController } from "../controllers";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/createOffer", authMiddleware, ZKController.createOffer);

router.post("/generateJWT", ZKController.generateDiscordJWT);

router.post(
	"/verify",
	authMiddleware,
	ZKController.signTransactionForVerifiedUser
);

export default router;
