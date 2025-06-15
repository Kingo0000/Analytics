# API Setup Guide - All FREE APIs

## 🐦 Twitter API (FREE)
**Cost:** FREE (Basic tier)
**Limits:** 500K tweets/month, 2M tweet reads/month

### Setup Steps:
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Apply for a developer account (free, usually approved instantly)
3. Create a new app
4. Go to "Keys and Tokens" tab
5. Generate:
   - API Key
   - API Secret Key
   - Access Token
   - Access Token Secret
6. Copy these credentials to the app

### Required Permissions:
- Read tweets
- Read users
- Read engagement metrics

---

## 📘 Facebook Graph API (FREE - Limited)
**Cost:** FREE (Basic tier)
**Limits:** Personal data only, 200 calls/hour

### Setup Steps:
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a Facebook App
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs
5. Get App ID and App Secret
6. Generate User Access Token via OAuth flow
7. **Note:** Only works with your own personal data

### Required Permissions:
- public_profile
- user_posts (requires app review for others' data)

---

## 📷 Instagram Basic Display API (FREE)
**Cost:** FREE
**Limits:** Personal account data only

### Setup Steps:
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a Facebook App
3. Add "Instagram Basic Display" product
4. Configure OAuth redirect URIs
5. Add Instagram test users (yourself)
6. Generate Access Token via OAuth flow
7. **Note:** Only works with personal Instagram accounts

### Available Data:
- User profile info
- User media (photos/videos)
- Media metadata

---

## 📧 Gmail API (FREE)
**Cost:** FREE
**Limits:** 1 billion quota units/day (very generous)

### Setup Steps:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Configure OAuth consent screen
6. Add your email as test user
7. Generate refresh token via OAuth flow

### Required Scopes:
- https://www.googleapis.com/auth/gmail.readonly
- https://www.googleapis.com/auth/gmail.metadata

---

## 📺 YouTube Data API (FREE)
**Cost:** FREE
**Limits:** 10,000 quota units/day

### Setup Steps:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable YouTube Data API v3
4. Create API Key credentials
5. (Optional) Set up OAuth for private channel data

### Available Data:
- Channel statistics
- Video metadata
- Public analytics data

---

## 💼 LinkedIn API (PAID - Pro Only)
**Cost:** Requires LinkedIn Partnership ($$$$)
**Why Pro:** LinkedIn severely restricted their API access and now requires paid partnerships

---

## Backend Implementation Required

All these APIs require backend implementation for security. Never expose API keys in frontend code!

### Required Backend Endpoints:
\`\`\`
POST /api/twitter/connect
POST /api/facebook/connect  
POST /api/instagram/connect
POST /api/gmail/connect
POST /api/youtube/connect
\`\`\`

### Security Notes:
- Store API keys in environment variables
- Implement rate limiting
- Use HTTPS only
- Validate all inputs
- Handle errors gracefully

### Recommended Tech Stack:
- Node.js + Express
- Environment variables (.env)
- CORS middleware
- Rate limiting middleware
