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

describe("Post /api/shorten", () => {
  it('should Create Shortern Url', async () => {
    const data={
      longUrl:"https://redis.io/docs/latest/"
    }
    const res =  await request(app).post(`/api/shorten`)
    .set("Authorization", `Bearer ${token}`).send(data);
    expect(res.status).to.equal(200);
  
    const body = res.body.data;
    // Validate that the response body contains the correct fields
    expect(body).to.have.property('shortUrl').that.is.a('string');
    expect(body).to.have.property('createdAt').that.is.a('string');
});

it('should Give Error if not login', async () => {
  const data={
    longUrl:"https://redis.io/docs/latest/"
  }
  const res =  await request(app).post(`/api/shorten`).send(data);

   expect(res.status).to.equal(401);
   expect(res.body).to.have.property('error');
   expect(res.body.error).to.equal(`Unauthorized - login first`);
});

});

  it('should Return error if pass invalid url', async () => {
    const data={
      longUrl:"://redis.io/docs/latest/"
    }
    const res =  await request(app).post(`/api/shorten`)
    .set("Authorization", `Bearer ${token}`).send(data);
    expect(res.status).to.equal(400);


    // Validate that the response body contains the correct fields
   expect(res.body).to.have.property('error');
   expect(res.body.error).to.equal(`Invalid URL format`);
});


