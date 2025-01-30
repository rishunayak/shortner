import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    longUrl: { type: String, required: true },
    customAlias:{ type: String, unique: true },
    topic: { type: String },
    createdAt: { type: Date, default: Date.now },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  
        required: true 
      },
  },
  { timestamps: true }
);

export default mongoose.model("Url", urlSchema);
