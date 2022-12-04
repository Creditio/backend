import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import discordModel from "../models/discordModel";
import { PolygonIDService } from "../services";
const Web3 = require("web3");

const web3 = new Web3(
	new Web3.providers.HttpProvider(
		"https://polygon-mumbai.g.alchemy.com/v2/9a03hkBKaug4B1BlYj-V6UFXb6XOlQC_"
	)
);

export default class ZKController {
	public static async createOffer(
		req: any,
		res: Response,
		next: NextFunction
	) {
		const userRepData = await discordModel.findOne({
			userName: req.user.userName,
		});

		const expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		return PolygonIDService.post(
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
						data: {
							qrcode: qrCode.data.qrcode,
							reputation: userRepData,
						},
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	public static async claimReputation(
		req: any,
		res: Response,
		next: NextFunction
	) {
		let polygonCallQRCode = {
			id: "c811849d-6bfb-4d85-936e-3d9759c7f105",
			typ: "application/iden3comm-plain-json",
			type: "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
			body: {
				transaction_data: {
					contract_address: process.env.CONTRACT_ADDRESS, //replace it with your contract address
					method_id: "b68967e2",
					chain_id: 80001,
					network: "polygon-mumbai",
				},
				reason: "verification for reputation metrics",
				scope: [
					{
						id: 1,
						circuit_id: "credentialAtomicQuerySig",
						rules: {
							query: {
								allowed_issuers: ["*"],
								req: {
									Verified: {
										$eq: 1,
									},
								},
								schema: {
									url: "https://s3.eu-west-1.amazonaws.com/polygonid-schemas/d42446d0-d85a-4965-8369-b66be603e968.json-ld",
									type: "DiscordMember",
								},
							},
						},
					},
				],
			},
		};
	}

	public static async generateDiscordJWT(
		req: any,
		res: Response,
		next: NextFunction
	) {
		if (!req.body.username) {
			return res.status(400).json({
				success: false,
				message: "Please provide discord userId",
			});
		}

		return discordModel
			.findOne({ userName: req.body.username })
			.then((docs) => {
				if (!docs) {
					return res.status(404).json({
						success: false,
						message: "User not found on our system",
					});
				}

				let payload = {
					userName: docs.userName,
					currentRep: docs.currentRep,
				};

				let token = sign(
					payload,
					process.env.JWT_SECRET || "TestSecret"
				);

				res.json({
					success: true,
					message: "Successfully created link for you",
					data: {
						url: "Sample/?token=" + token,
					},
				});
			});
	}

	public static async signTransactionForVerifiedUser(
		req: any,
		res: Response
	) {
		const userRepData = await discordModel.findOne({
			userName: req.user.userName,
		});

		if (req.body.amount != userRepData?.currentRep) {
			res.status(400).json({
				success: true,
				message: "The amount you're claiming is not correct.",
			});
		}

		let blockNumber = await web3.eth.getBlockNumber();
		let timeStamp = await web3.eth.getBlock(blockNumber);
		let message: any = {
			application: 1,
			amount: web3.utils.toWei(req.body.amount.toString(), "ether"),
			deadline: timeStamp.timestamp + 5 * 60,
		};
		let encoded = web3.eth.abi.encodeParameters(
			["uint256", "uint256", "uint256"],
			[message.application, message.amount, message.deadline]
		);
		let hash = web3.utils.keccak256(encoded);
		let signature = await web3.eth.accounts.sign(
			hash,
			process.env.PRIVATE_KEY
		);

		res.json({
			success: true,
			message: "Please create transaction on the chain",
			data: {
				application: 1,
				amount: userRepData?.currentRep,
				signature: signature.signature,
			},
		});
	}
}
