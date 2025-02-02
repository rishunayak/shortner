import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    alias: { type: String, required: true },
    
    totalClicks: { type: Number, default: 0 },
    uniqueUsers: { type: Number, default: 0 }, // Array of unique user identifiers (e.g., cookies, IPs)

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
            uniqueUsers: { type: Number, default: 0 }
        }
    ],

    deviceType: [
        {
            deviceName: { type: String, required: true },
            uniqueClicks: { type: Number, default: 0 },
            uniqueUsers: { type: Number, default: 0 }
        }
    ]
}, { timestamps: true });

export default mongoose.model("Analytics", analyticsSchema);
