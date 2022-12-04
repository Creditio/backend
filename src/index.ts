import express from "express";
const socket = require("socket.io");
import next from "next";
import https from "https";
import fs from "fs";
import APIRoutes from "./api/routes";
import cors from "cors";
import "./config/databaseConfig";
import "dotenv/config";
import "./api/services/polygonIdService";

// Setting up express basics
const app = express();
const PORT = process.env.PORT || 3000;
const PORTS = process.env.PORTS || 3443;

// Basics for express application
app.use(cors());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// Location for let's encrypt SSL certificate
// let location = "";
// if (process.env.NODE_ENV === "production") {
// 	location = "/etc/letsencrypt/live/gravitysoftware.in/";
// }

// // Importing files of SSL certificate
// var privateKey = fs.readFileSync(location + "privkey.pem", "utf8");
// var certificate = fs.readFileSync(location + "fullchain.pem", "utf8");

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
// };

// Setting up routes
app.use("/api", APIRoutes);

app.get('/hello', (req, res) => {
	res.send('hello world!');
});

// Starting secured server with all loaded certificates
// const server: any = https.createServer(credentials, app);
// const server: any = https.createServer(app);

// Initializing Socket Server
// const io = socket(server);

// Adding io as request parameter so we can use easily in further routes
app.use((req: any, res, next) => {
	// req.io = io;
	next();
});

// Creating new HTTP server
// var server = express();
// http.get("*", function (req, res) {
// 	res.redirect("https://" + req.headers.host + req.url);
// });
// var listen: any = http.listen(PORT, () => {
// 	console.log("HTTP Server Started On Port " + listen.address().port);
// });

// Creating router to host mobile version
// This router is under subdomain "m"

if (process.env.NODE_ENV === "production") {
	// Next App
	const nextApp = next({
		dev: false,
		hostname: "localhost",
		port: 443,
		dir: "../frontend",
	});
	const handle = nextApp.getRequestHandler();

	nextApp.prepare().then(() => {
		app.all("*", (req, res) => {
			return handle(req, res);
		});

		app.listen(PORT, () => {
			console.log("HTTPS Server started on PORT " + PORT);
		});
	});
} else {
	app.listen(PORT, () => {
		console.log("HTTPS Server started on PORT " + PORT);
	});
}
