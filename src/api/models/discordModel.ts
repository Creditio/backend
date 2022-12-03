import { Schema, model } from "mongoose";

const DiscordSchema = new Schema({
	userName: String,
	claimId: String,
	currentRep: Number,
});

export default model("discordData", DiscordSchema);
