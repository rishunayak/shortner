import { expect } from "chai";
import request from "supertest";
import app from "../src/server.js";

let testServer;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzlhYmU5N2I3MGVkNGZmMWJhMWI0MjUiLCJlbWFpbCI6Im1haGFrYWFsMDEyMkBnbWFpbC5jb20iLCJpYXQiOjE3Mzg0Mzc4NjksImV4cCI6MTczOTA0MjY2OX0.GDCseGS2Rmxjw7k2C2AOAniJV1-JXTSWUPPGZu46jM4";

before(() => {
  testServer = app.listen(3000); // Start the server on port 5001 before the tests
});

after(() => {
  testServer.close(); // Close the server after the tests are complete
});

describe("GET /api/analytics/${customAlias}", () => {
  it('should return a shortened URL with alias', async () => {
    const customAlias = "myTube";
    const res =  await request(app).get(`/api/analytics/${customAlias}`);
    expect(res.status).to.equal(200);
    const body = res.body.data;
    // Validate that the response body contains the correct fields
    expect(body).to.have.property('alias').that.equals(customAlias);
    expect(body).to.have.property('clicksByDate').that.is.an('array');
    expect(body).to.have.property('createdAt').that.is.a('string');
    expect(body).to.have.property('deviceType').that.is.an('array');
    expect(body).to.have.property('osType').that.is.an('array');
    expect(body).to.have.property('totalClicks').that.is.a('number');
    expect(body).to.have.property('uniqueUsers').that.is.a('number');
    expect(body).to.have.property('updatedAt').that.is.a('string');
    // Validate clicksByDate array has the expected structure
    expect(body.clicksByDate).to.have.lengthOf.above(0);
    body.clicksByDate.forEach(click => {
      expect(click).to.have.property('date').that.is.a('string');
      expect(click).to.have.property('clickCount').that.is.a('number');
    });
    // Validate deviceType array has the expected structure
    expect(body.deviceType).to.have.lengthOf.above(0);
    body.deviceType.forEach(device => {
      expect(device).to.have.property('deviceName').that.is.a('string');
      expect(device).to.have.property('uniqueClicks').that.is.a('number');
      expect(device).to.have.property('uniqueUsers').that.is.a('number');
    });
    // Validate osType array has the expected structure
    expect(body.osType).to.have.lengthOf.above(0);
    body.osType.forEach(os => {
      expect(os).to.have.property('osName').that.is.a('string');
      expect(os).to.have.property('uniqueClicks').that.is.a('number');
      expect(os).to.have.property('uniqueUsers').that.is.a('number');
    });
  });
  it('should return 404 when alias is not found', async () => {
    const wrongAlias = "invalids";
    const res = await request(app).get(`/api/analytics/${wrongAlias}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.equal(`The specified short URL alias does not exist`);
  });
  it('should return 400 when alias length is less then 5', async () => {
    const alias = 'a';
    const res = await request(app).get(`/api/analytics/${alias}`);
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.equal("Alias must be at least 5 characters long");
  });
});

describe("GET /api/analytics/topic/${topic}", () => {
  it('should return a shortened URL with topic', async () => {
    const topic = "masti";
    const res =  await request(app).get(`/api/analytics/topic/${topic}`);
    expect(res.status).to.equal(200);
    const body = res.body.data;
    // Validate that the response body contains the correct fields
    expect(body).to.have.property('clicksByDate').that.is.an('array');
    expect(body).to.have.property('totalClicks').that.is.a('number');
    expect(body).to.have.property('uniqueUsers').that.is.a('number');
    // Validate clicksByDate array has the expected structure
    expect(body.clicksByDate).to.have.lengthOf.above(0);
    body.clicksByDate.forEach(click => {
      expect(click).to.have.property('date').that.is.a('string');
      expect(click).to.have.property('clickCount').that.is.a('number');
    });
    // Validate url array has the expected structure
    expect(body.urls).to.have.lengthOf.above(0);
    body.urls.forEach(urls => {
      expect(urls).to.have.property('shortUrl').that.is.a('string');
      expect(urls).to.have.property('totalClicks').that.is.a('number');
      expect(urls).to.have.property('uniqueUsers').that.is.a('number');
    });
  });
  it('should return 404 when topic is not found', async () => {
    const topic = "abcde";
    const res = await request(app).get(`/api/analytics/topic/${topic}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.equal(`No URLs found for this topic.`);
  });
  it('should return 400 when topic length is less then 4', async () => {
    const topic = 'a21';
    const res = await request(app).get(`/api/analytics/topic/${topic}`);
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.equal("Topic must be at least 4 characters long");
  });
});

describe("GET /api/analytics/overall/url", () => {
  it("should return a shortened URL with topic", async () => {
    const res = await request(app)
      .get(`/api/analytics/overall/url`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);

    const body = res.body.data;

    // Validate that the response body contains the correct fields
    expect(body).to.have.property("clicksByDate").that.is.an("array");
    expect(body).to.have.property("totalClicks").that.is.a("number");
    expect(body).to.have.property("uniqueUsers").that.is.a("number");

    // Validate clicksByDate array has the expected structure
    expect(body.clicksByDate).to.have.lengthOf.above(0);
    body.clicksByDate.forEach((click) => {
      expect(click).to.have.property("date").that.is.a("string");
      expect(click).to.have.property("clickCount").that.is.a("number");
    });

    // Validate deviceType array has the expected structure
    expect(body.deviceType).to.have.lengthOf.above(0);
    body.deviceType.forEach((device) => {
      expect(device).to.have.property("deviceName").that.is.a("string");
      expect(device).to.have.property("uniqueClicks").that.is.a("number");
      expect(device).to.have.property("uniqueUsers").that.is.a("number");
    });

    // Validate osType array has the expected structure
    expect(body.osType).to.have.lengthOf.above(0);
    body.osType.forEach((os) => {
      expect(os).to.have.property("osName").that.is.a("string");
      expect(os).to.have.property("uniqueClicks").that.is.a("number");
      expect(os).to.have.property("uniqueUsers").that.is.a("number");
    });
  });
});
