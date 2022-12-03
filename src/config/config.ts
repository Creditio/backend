const dev = {
	JWT_SECRET: "1234",
};

const prod = {
	JWT_SECRET: "newdeploykey",
};

let config: any = {
	client_id: "",
	client_secret: "",
};

if (process.env.NODE_ENV != "production") config = { ...config, ...dev };
else config = { ...config, ...prod };

export default config;
