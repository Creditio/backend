import Axios from "axios";
import config from "../../config/config";
import encodeQueryData from "../helpers/urlEncoder";

class PolygonIDService {
	private static baseURL = "https://api-staging.polygonid.com/v1/";

	public static instance = Axios.create();

	public static token: string;

	public static async get(url: string, parameters: any) {
		return this.instance.get(
			this.baseURL + url + encodeQueryData(parameters),
			{
				headers: this.token
					? {
							Authorization: "Bearer " + this.token,
					  }
					: {},
			}
		);
	}

	public static async post(url: string, parameters: any, data: any) {
		console.log(this.token);
		return this.instance.post(
			this.baseURL + url + encodeQueryData(parameters),
			data,
			{
				headers: this.token
					? {
							Authorization: "Bearer " + this.token,
					  }
					: {},
			}
		);
	}
}

PolygonIDService.post(
	"orgs/sign-in",
	{},
	{
		email: "parshwa.surat@gmail.com",
		password: "ETHIndia@1222",
	}
).then((doc: any) => {
	PolygonIDService.token = doc.data.token;
	console.log("Done!", doc.data.token);
});

export default PolygonIDService;
