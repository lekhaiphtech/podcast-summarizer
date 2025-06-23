import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema({
  episodeId: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Summary =
  mongoose.models.Summary || mongoose.model("Summary", SummarySchema);
