const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, "Please add an email subject"],
    },
    body: {
      type: String, // Can store HTML content
      required: [true, "Please add email content"],
    },
    status: {
      type: String,
      enum: ["Draft", "Sent"],
      default: "Draft",
    },
    sentAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", CampaignSchema);
