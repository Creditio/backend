import Axios from "axios";
import config from "../../config/config";
import encodeQueryData from "../helpers/urlEncoder";

export default class GSTAPIService {
	private static baseURL = "https://api.mastergst.com";

	public static instance = Axios.create({
		headers: {
			ip_address: "143.110.255.1",
			state_cd: "24",
			client_id: config.client_id || "",
			client_secret: config.client_secret || "",
		},
	});

	public static async get(
		userName: string,
		url: string,
		parameters: any,
		txn: any = false
	) {
		let headerAditional: any = {
			gst_username: userName,
		};

		if (txn != false) headerAditional.txn = txn;

		this.instance.get(this.baseURL + url + encodeQueryData(parameters), {
			headers: headerAditional,
		});
	}

	public static async post(
		userName: string,
		url: string,
		parameters: any,
		data: any,
		txn: any = false
	) {
		let headerAditional: any = {
			gst_username: userName,
		};

		if (txn != false) headerAditional.txn = txn;

		this.instance.post(
			this.baseURL + url + encodeQueryData(parameters),
			data,
			{
				headers: headerAditional,
			}
		);
	}
}
