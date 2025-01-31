import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    urlId: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true },
    
    totalClicks: { type: Number, default: 0 },
    uniqueUsers: { type: [String], default: [] }, // Array of unique user identifiers (e.g., cookies, IPs)

    clicksByDate: [
        {
            date: { type: Date, required: true },
            clickCount: { type: Number, default: 0 }
        }
    ],

    osType: [
        {
            osName: { type: String, required: true },
            uniqueClicks: { type: Number, default: 0 },
            uniqueUsers: { type: [String], default: [] }
        }
    ],

    deviceType: [
        {
            deviceName: { type: String, required: true },
            uniqueClicks: { type: Number, default: 0 },
            uniqueUsers: { type: [String], default: [] }
        }
    ]
}, { timestamps: true });

export default mongoose.model("Analytics", analyticsSchema);
