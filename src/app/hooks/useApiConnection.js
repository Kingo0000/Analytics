"use client";

import { useState, useEffect } from "react";

export const useApiConnection = () => {
  const [connections, setConnections] = useState({
    twitter: { connected: false, data: null, error: null },
    facebook: { connected: false, data: null, error: null },
    instagram: { connected: false, data: null, error: null },
    gmail: { connected: false, data: null, error: null },
    youtube: { connected: false, data: null, error: null },
    linkedin: { connected: false, data: null, error: null },
  });

  const [loading, setLoading] = useState({});

  // Load saved connections from localStorage
  useEffect(() => {
    const savedConnections = localStorage.getItem("socialSyncConnections");
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
  }, []);

  // Save connections to localStorage
  const saveConnections = (newConnections) => {
    setConnections(newConnections);
    localStorage.setItem(
      "socialSyncConnections",
      JSON.stringify(newConnections)
    );
  };

  const connectPlatform = async (platform, credentials) => {
    setLoading((prev) => ({ ...prev, [platform]: true }));

    try {
      let result;

      switch (platform) {
        case "twitter":
          result = await connectTwitter(credentials);
          break;
        case "facebook":
          result = await connectFacebook(credentials);
          break;
        case "instagram":
          result = await connectInstagram(credentials);
          break;
        case "gmail":
          result = await connectGmail(credentials);
          break;
        case "youtube":
          result = await connectYoutube(credentials);
          break;
        case "linkedin":
          result = await connectLinkedIn(credentials);
          break;
        default:
          throw new Error("Unsupported platform");
      }

      const newConnections = {
        ...connections,
        [platform]: {
          connected: true,
          data: result,
          error: null,
          connectedAt: new Date().toISOString(),
        },
      };

      saveConnections(newConnections);
      return { success: true, data: result };
    } catch (error) {
      const newConnections = {
        ...connections,
        [platform]: {
          connected: false,
          data: null,
          error: error.message,
        },
      };

      saveConnections(newConnections);
      return { success: false, error: error.message };
    } finally {
      setLoading((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const disconnectPlatform = (platform) => {
    const newConnections = {
      ...connections,
      [platform]: {
        connected: false,
        data: null,
        error: null,
      },
    };

    saveConnections(newConnections);
  };

  return {
    connections,
    loading,
    connectPlatform,
    disconnectPlatform,
  };
};

// Twitter API integration (FREE - Basic tier)
const connectTwitter = async (credentials) => {
  const { apiKey, apiSecret, accessToken, accessTokenSecret } = credentials;

  try {
    // Call your backend API
    const response = await fetch("/api/twitter/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to connect to Twitter");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to connect to Twitter: " + error.message);
  }
};

// Facebook API (FREE - Basic tier with limitations)
const connectFacebook = async (credentials) => {
  const { appId, appSecret, accessToken } = credentials;

  try {
    const response = await fetch("/api/facebook/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to connect to Facebook");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to connect to Facebook: " + error.message);
  }
};

// Instagram Basic Display API (FREE)
const connectInstagram = async (credentials) => {
  const { clientId, clientSecret, accessToken } = credentials;

  try {
    const response = await fetch("/api/instagram/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to connect to Instagram");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to connect to Instagram: " + error.message);
  }
};

// Gmail API (FREE with quotas)
const connectGmail = async (credentials) => {
  const { clientId, clientSecret, refreshToken } = credentials;

  try {
    const response = await fetch("/api/gmail/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to connect to Gmail");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to connect to Gmail: " + error.message);
  }
};

// YouTube Data API (FREE with quotas)
const connectYoutube = async (credentials) => {
  const { apiKey } = credentials;

  try {
    const response = await fetch("/api/youtube/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to connect to YouTube");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to connect to YouTube: " + error.message);
  }
};

// LinkedIn API (PAID - requires partnership)
const connectLinkedIn = async (credentials) => {
  throw new Error("LinkedIn API requires paid partnership - Pro feature only");
};
