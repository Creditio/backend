export default function encodeQueryData(data: any) {
	let ret = [];
	for (let d in data)
		ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
	return ret.join("&");
}
