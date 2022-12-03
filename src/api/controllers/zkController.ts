import { NextFunction, Request, Response } from "express";
import { PolygonIDService } from "../services";

export default class ZKController {
	public static async createOffer(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		const resp = await PolygonIDService.post(
			"issuers/75d44fc7-d840-4770-b6bf-20b250659443/schemas/062307bc-d5ae-43f8-a450-12bad3bb3ee5/offers",
			{},
			{
				attributes: [
					{
						attributeKey: "Verified",
						attributeValue: 1,
					},
				],
				limitedClaims: 1,
				expirationDate: `${expiry.getFullYear()}/${String(
					expiry.getMonth() + 1
				).padStart(2, "0")}/${String(expiry.getDate()).padStart(
					2,
					"0"
				)}`,
			}
		)
			.then((docs) => {
				return PolygonIDService.post(
					"offers-qrcode/" + docs.data.id,
					{},
					{}
				).then((qrCode) => {
					return res.json({
						success: true,
						message: "QR code for Claim",
						data: { qrcode: qrCode.data.qrcode },
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
