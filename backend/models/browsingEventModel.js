import mongoose from "mongoose";

const browsingEventSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true, maxlength: 120 },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    type: {
      type: String,
      enum: ["view", "wishlist", "cart"],
      default: "view",
    },
  },
  { timestamps: true }
);

browsingEventSchema.index({ sessionId: 1, createdAt: -1 });

export default mongoose.model("BrowsingEvent", browsingEventSchema);
