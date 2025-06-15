// Backend API service implementations
// You'll need to create these endpoints on your server

export class ApiServices {
  static async callBackendApi(endpoint, data) {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API call failed: ${endpoint}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to call ${endpoint}: ${error.message}`);
    }
  }
}

// Example backend implementations you need to create:

/*
// 1. Twitter API Backend (Node.js/Express)
const { TwitterApi } = require('twitter-api-v2');

app.post('/api/twitter/connect', async (req, res) => {
  try {
    const { apiKey, apiSecret, accessToken, accessTokenSecret } = req.body;
    
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    const user = await client.v2.me({
      'user.fields': ['public_metrics', 'created_at', 'description']
    });

    const tweets = await client.v2.userTimeline(user.data.id, {
      max_results: 10,
      'tweet.fields': ['public_metrics', 'created_at']
    });

    res.json({
      user: {
        id: user.data.id,
        username: user.data.username,
        name: user.data.name,
        followers_count: user.data.public_metrics.followers_count,
        following_count: user.data.public_metrics.following_count,
        tweet_count: user.data.public_metrics.tweet_count
      },
      metrics: {
        impressions: tweets.data?.reduce((sum, tweet) => sum + (tweet.public_metrics?.impression_count || 0), 0) || 0,
        engagement_rate: 3.2,
        retweets: tweets.data?.reduce((sum, tweet) => sum + (tweet.public_metrics?.retweet_count || 0), 0) || 0,
        likes: tweets.data?.reduce((sum, tweet) => sum + (tweet.public_metrics?.like_count || 0), 0) || 0
      },
      recent_tweets: tweets.data || []
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Facebook API Backend
app.post('/api/facebook/connect', async (req, res) => {
  try {
    const { appId, appSecret, accessToken } = req.body;
    
    // Get user profile
    const userResponse = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`);
    const user = await userResponse.json();
    
    if (user.error) {
      throw new Error(user.error.message);
    }

    // Get user posts (limited to user's own posts)
    const postsResponse = await fetch(`https://graph.facebook.com/me/posts?access_token=${accessToken}&fields=id,message,created_time,likes.summary(true),comments.summary(true)`);
    const posts = await postsResponse.json();

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      posts: posts.data || [],
      metrics: {
        total_posts: posts.data?.length || 0,
        total_likes: posts.data?.reduce((sum, post) => sum + (post.likes?.summary?.total_count || 0), 0) || 0,
        total_comments: posts.data?.reduce((sum, post) => sum + (post.comments?.summary?.total_count || 0), 0) || 0
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Instagram Basic Display API Backend
app.post('/api/instagram/connect', async (req, res) => {
  try {
    const { clientId, clientSecret, accessToken } = req.body;
    
    // Get user profile
    const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,media_count&access_token=${accessToken}`);
    const user = await userResponse.json();
    
    if (user.error) {
      throw new Error(user.error.message);
    }

    // Get user media
    const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp&access_token=${accessToken}`);
    const media = await mediaResponse.json();

    res.json({
      user: {
        id: user.id,
        username: user.username,
        media_count: user.media_count
      },
      media: media.data || [],
      metrics: {
        total_media: media.data?.length || 0,
        photos: media.data?.filter(item => item.media_type === 'IMAGE').length || 0,
        videos: media.data?.filter(item => item.media_type === 'VIDEO').length || 0
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Gmail API Backend
const { google } = require('googleapis');

app.post('/api/gmail/connect', async (req, res) => {
  try {
    const { clientId, clientSecret, refreshToken } = req.body;
    
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    // Get user profile
    const profile = await gmail.users.getProfile({ userId: 'me' });
    
    // Get recent messages
    const messages = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 100
    });

    // Get message details for analysis
    const messageDetails = await Promise.all(
      (messages.data.messages || []).slice(0, 10).map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['From', 'Subject', 'Date']
        });
        return detail.data;
      })
    );

    res.json({
      email: profile.data.emailAddress,
      messageCount: profile.data.messagesTotal,
      threadsCount: profile.data.threadsTotal,
      recentMessages: messageDetails,
      metrics: {
        total_messages: profile.data.messagesTotal,
        total_threads: profile.data.threadsTotal,
        unread_estimate: messages.data.resultSizeEstimate
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. YouTube Data API Backend
app.post('/api/youtube/connect', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    // Note: This requires OAuth for channel-specific data
    // For now, we'll get public channel info if channel ID is provided
    const channelId = req.body.channelId; // User needs to provide their channel ID
    
    if (!channelId) {
      throw new Error('Channel ID is required for YouTube analytics');
    }

    const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`);
    const channelData = await channelResponse.json();
    
    if (channelData.error) {
      throw new Error(channelData.error.message);
    }

    const channel = channelData.items[0];
    
    // Get recent videos
    const videosResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`);
    const videosData = await videosResponse.json();

    res.json({
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
        viewCount: channel.statistics.viewCount
      },
      recentVideos: videosData.items || [],
      metrics: {
        subscribers: parseInt(channel.statistics.subscriberCount),
        total_videos: parseInt(channel.statistics.videoCount),
        total_views: parseInt(channel.statistics.viewCount)
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
*/
