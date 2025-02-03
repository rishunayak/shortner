# URL Shortener Platform

## Overview
This project is a URL shortener platform that allows multiple users to create short URLs and track analytics, including individual and overall statistics for their created links.

## Features
- **Shorten URLs**: Users can generate short links for any given URL.
- **Analytics Tracking**: Tracks the number of clicks per link and the number of unique users.
- **Click Tracking by Date**: Stores click counts for the last 7 days.
- **User Uniqueness Detection**: Uses Redis to track unique visitors based on IP addresses.
- **Authorization Support**: Uses token-based authentication for secured endpoints.

## Prerequisites
Ensure you have the following installed:
- **Node.js** (>= 14.x)
- **Redis Server** 
- **MongoDB** 
- **Postman** 

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory and add:
     ```env
     PORT=5000
     MONGO_URI=mongoBdUrl
     JWT_SECRET=your_jwt_secret
     BASE_URL=Base url
     R_Password=Redis password
     R_Host=Redis host
     R_Port=Redis port
     FIREBASE_PROJECT_ID=projectId
     FIREBASE_CLIENT_EMAIL=keyConfig
     FIREBASE_PRIVATE_KEY=key
     ```

## Running the Project
2. **Start the backend server**:
   ```sh
   npm start
   ```
   The server should now be running at `http://localhost:5001`.

## API Endpoints
### 1. Shorten a URL
**Endpoint:** `POST /api/shorten`

**Request Body:**
```json
{
  "longUrl": "https://example.com"
}
```

**Response:**
```json
{
  "shortUrl": "http://short.ly/abc123",
  "longUrl": "https://example.com"
}
```

### 1. Redirect to Long Url
**Endpoint:** `POST /api/shorten/:customAlias`

**Response:**
```json
{
  Redirect To Long Url
}
```


### 2. Get URL Analytics
**Endpoint:** `GET /api/analytics/:alias`

**Response:**
```json
{
  "totalClicks": 0,
  "uniqueUsers": 0,
  "clicksByDate": [
    {
      "date": "2025-02-03",
      "clickCount": 0
    }
  ],
  "osType": [
    {
      "osName": "string",
      "uniqueClicks": 0,
      "uniqueUsers": 0
    }
  ],
  "deviceType": [
    {
      "deviceName": "string",
      "uniqueClicks": 0,
      "uniqueUsers": 0
    }
  ]
}
```

### 2. Retrieve analytics for all short URLs grouped under a specific topic
**Endpoint:** `GET /api/analytics/topic/:topic`

**Response:**
```json
{
  "totalClicks": 0,
  "uniqueUsers": 0,
  "clicksByDate": [
    {
      "date": "2025-02-03",
      "clickCount": 0
    }
  ],
  "urls": [
    {
      "shortUrl": "string",
      "totalClicks": 0,
      "uniqueUsers": 0
    }
  ]
}
```

### 2. Retrieve analytics for all short URLs grouped under a specific topic
**Endpoint:** `GET /api/analytics/overall/url`

**Response:**
```json
{
  "totalUrls": 0,
  "totalClicks": 0,
  "uniqueUsers": 0,
  "clicksByDate": [
    {
      "date": "2025-02-03",
      "clickCount": 0
    }
  ],
  "osType": [
    {
      "osName": "string",
      "uniqueClicks": 0,
      "uniqueUsers": 0
    }
  ],
  "deviceType": [
    {
      "deviceName": "string",
      "uniqueClicks": 0,
      "uniqueUsers": 0
    }
  ]
}
```

## Challenges Faced & Solutions
### 1. **Tracking Unique Users Without Login**
- **Problem:** Users do not need to log in, making uniqueness tracking difficult.
- **Solution:** Used Redis to store unique IPs and to check if a user has already visited.

### 2. **Efficiently Storing Clicks for the Last 7 Days**
- **Problem:** Old records needed to be removed, and new ones added dynamically.
- **Solution:** Implemented an array-based approach where the oldest date is removed if the array exceeds 7 entries.



