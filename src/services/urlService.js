import client from "../config/redis.js";
import Url from "../models/urlModel.js";
import Analytics from "../models/analyticsModel.js"; // Analytics Model
import DeviceDetector from "device-detector-js";
import crypto from "crypto"
// import moment from "moment";

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0]; // "2025-02-02"
}

export const urlShortnerService = async (longUrl, customAlias, topic, user) => {
  try {
    const userId = user._id;

    // If customAlias is not provided, generate a random alias
    if (!customAlias || customAlias.trim() === "") {
      let isUnique = false;
      while (!isUnique) {
        customAlias = crypto.randomBytes(3).toString("hex"); // Generates a 6-character alias
        const existingAlias = await Url.findOne({ customAlias });
        if (!existingAlias) isUnique = true; // Ensure uniqueness
      }
    } else {
      // Check if the provided customAlias already exists
      const existingAlias = await Url.findOne({ customAlias });
      if (existingAlias) {
        throw new Error("Custom alias already exists");
      }
    }
    
    await client.set(customAlias, longUrl);

    const shortnerUrl = await Url.create({
      longUrl,
      customAlias,
      topic,
      userId,
    });
    return {
      shortUrl: `${process.env.BASE_URL}${customAlias}`,
      createdAt: shortnerUrl.createdAt,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getShortenUrlService = async (
  customAlias,
  userAgentString,
  userIp
) => {
  try {
    const deviceDetector = new DeviceDetector();
    let longUrl = await client.get(customAlias);

    let urlData;
    if (!longUrl) {
      urlData = await Url.findOne({ customAlias });
      if (!urlData) {
        throw new Error("URL does not exist");
      }
      longUrl = urlData.longUrl;
      await client.set(customAlias, longUrl);
    } else {
      urlData = await Url.findOne({ customAlias });
    }

    // Fetch analytics entry or create if doesn't exist
    let analytics = await Analytics.findOneAndUpdate(
      { alias: customAlias },
      { $inc: { totalClicks: 1 } }, // Increment total clicks
      { new: true, upsert: true } // Create if not exists, return updated
    );

    const todayDate = getTodayDate();

    const existingDay = analytics.clicksByDate.find((item) => {
      const dbDate = item.date.toISOString().split("T")[0];
      return dbDate === todayDate; //
    });

    if (existingDay) {
      existingDay.clickCount += 1;
    } else {
      analytics.clicksByDate.push({ date: todayDate, clickCount: 1 });
    }
    analytics.clicksByDate.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort in descending order
    if (analytics.clicksByDate.length > 7) {
      analytics.clicksByDate.pop(); // Remove the oldest entry if more than 7 days
    }

    const device = deviceDetector.parse(userAgentString);

    await updateOsTypeAnalytics(analytics, device, userIp);
    await updateDeviceTypeAnalytics(analytics, device, userIp);

    const exists = await client.sIsMember(userIp, customAlias);
    if (!exists) {
      await client.sAdd(userIp, customAlias);
      analytics.uniqueUsers += 1;
    }

    await analytics.save();

    return longUrl;
  } catch (error) {
    throw new Error(error.message);
  }
};



const updateOsTypeAnalytics = async (analytics, device, userIp) => {
  const osIndex = analytics.osType.findIndex(
    (item) =>
      item.osName.toLocaleLowerCase() === device.os.name.toLocaleLowerCase()
  );

  if (osIndex !== -1) {
    analytics.osType[osIndex].uniqueClicks += 1;
  } else {
    analytics.osType.push({
      osName: device.os.name,
      uniqueClicks: 1,
      uniqueUsers: 1,
    });
  }

  const existsOsUser = await client.sIsMember(
    userIp,
    device.os.name.toLocaleLowerCase()
  );
  if (!existsOsUser) {
    if (osIndex !== -1) {
      analytics.osType[osIndex].uniqueUsers += 1;
    }
    await client.sAdd(userIp, device.os.name.toLocaleLowerCase());
  }
};

const updateDeviceTypeAnalytics = async (analytics, device, userIp) => {
  const deviceIndex = analytics.deviceType.findIndex(
    (item) =>
      item.deviceName.toLocaleLowerCase() ===
      device.device.type.toLocaleLowerCase()
  );

  if (deviceIndex !== -1) {
    analytics.deviceType[deviceIndex].uniqueClicks += 1;
  } else {
    analytics.deviceType.push({
      deviceName: device.device.type,
      uniqueClicks: 1,
      uniqueUsers: 1,
    });
  }

  const existsDeviceUser = await client.sIsMember(
    userIp,
    device.device.type.toLocaleLowerCase()
  );
  if (!existsDeviceUser) {
    if (deviceIndex !== -1) {
      analytics.deviceType[deviceIndex].uniqueUsers += 1;
    }
    await client.sAdd(userIp, device.device.type.toLocaleLowerCase());
  }
};
