import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

export default function authMiddleware(
	req: any,
	res: Response,
	next: NextFunction
) {
	if (!req.headers.authorization) {
		return res.status(400).json({
			success: false,
			message: "Authentication Failed",
		});
	}

	try {
		let user = verify(req.headers.authorization, process.env.JWT_SECRET || "TestSecret");
		req.user = user;
		return next();
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			success: true,
			message: "Authorization Failed",
		});
	}
}
