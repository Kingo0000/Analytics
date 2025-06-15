"use client";

import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import { useApiConnection } from "../app/hooks/useApiConnection";

const ConnectionModal = ({ open, onClose, platform }) => {
  const { connectPlatform, loading } = useApiConnection();
  const [credentials, setCredentials] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const platformConfigs = {
    twitter: {
      name: "Twitter",
      icon: "🐦",
      fields: [
        { key: "apiKey", label: "API Key", type: "text", required: true },
        {
          key: "apiSecret",
          label: "API Secret",
          type: "password",
          required: true,
        },
        {
          key: "accessToken",
          label: "Access Token",
          type: "text",
          required: true,
        },
        {
          key: "accessTokenSecret",
          label: "Access Token Secret",
          type: "password",
          required: true,
        },
      ],
      instructions:
        "Get your Twitter API credentials from developer.twitter.com (FREE)",
      available: true,
      setupSteps: [
        "Go to developer.twitter.com",
        "Apply for a developer account (free)",
        "Create a new app",
        "Generate API keys and access tokens",
        "Copy the credentials here",
      ],
    },
    facebook: {
      name: "Facebook",
      icon: "📘",
      fields: [
        { key: "appId", label: "App ID", type: "text", required: true },
        {
          key: "appSecret",
          label: "App Secret",
          type: "password",
          required: true,
        },
        {
          key: "accessToken",
          label: "Access Token",
          type: "text",
          required: true,
        },
      ],
      instructions: "Facebook Graph API - Basic features are FREE",
      available: true,
      setupSteps: [
        "Go to developers.facebook.com",
        "Create a Facebook App",
        "Add Facebook Login product",
        "Get App ID and App Secret",
        "Generate User Access Token",
        "Note: Limited to personal data only",
      ],
    },
    instagram: {
      name: "Instagram",
      icon: "📷",
      fields: [
        { key: "clientId", label: "Client ID", type: "text", required: true },
        {
          key: "clientSecret",
          label: "Client Secret",
          type: "password",
          required: true,
        },
        {
          key: "accessToken",
          label: "Access Token",
          type: "text",
          required: true,
        },
      ],
      instructions: "Instagram Basic Display API - FREE for personal accounts",
      available: true,
      setupSteps: [
        "Go to developers.facebook.com",
        "Create a Facebook App",
        "Add Instagram Basic Display product",
        "Configure OAuth redirect URIs",
        "Get Client ID and Secret",
        "Generate Access Token via OAuth flow",
      ],
    },
    gmail: {
      name: "Gmail",
      icon: "📧",
      fields: [
        { key: "clientId", label: "Client ID", type: "text", required: true },
        {
          key: "clientSecret",
          label: "Client Secret",
          type: "password",
          required: true,
        },
        {
          key: "refreshToken",
          label: "Refresh Token",
          type: "text",
          required: true,
        },
      ],
      instructions: "Gmail API - FREE with daily quotas",
      available: true,
      setupSteps: [
        "Go to console.cloud.google.com",
        "Create a new project",
        "Enable Gmail API",
        "Create OAuth 2.0 credentials",
        "Configure consent screen",
        "Generate refresh token via OAuth flow",
      ],
    },
    youtube: {
      name: "YouTube",
      icon: "📺",
      fields: [
        { key: "apiKey", label: "API Key", type: "text", required: true },
      ],
      instructions: "YouTube Data API - FREE with daily quotas",
      available: true,
      setupSteps: [
        "Go to console.cloud.google.com",
        "Create a new project",
        "Enable YouTube Data API v3",
        "Create API Key credentials",
        "Copy the API key here",
      ],
    },
    linkedin: {
      name: "LinkedIn",
      icon: "💼",
      fields: [],
      instructions: "LinkedIn API requires paid partnership",
      available: false,
      proFeature: true,
    },
  };

  const config = platformConfigs[platform];
  const isLoading = loading[platform];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!config.available) {
      setError(`${config.name} integration is only available in Pro plan`);
      return;
    }

    // Validate required fields
    const missingFields = config.fields
      .filter((field) => field.required && !credentials[field.key])
      .map((field) => field.label);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    const result = await connectPlatform(platform, credentials);

    if (result.success) {
      setSuccess(`Successfully connected to ${config.name}!`);
      setTimeout(() => {
        onClose();
        setCredentials({});
        setSuccess("");
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  const handleInputChange = (key, value) => {
    setCredentials((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!config) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader className="flex items-center gap-3">
        <span className="text-2xl">{config.icon}</span>
        <Typography variant="h5">Connect {config.name}</Typography>
      </DialogHeader>

      <DialogBody className="space-y-4 max-h-96 overflow-y-auto">
        {config.proFeature && (
          <Alert color="amber" className="mb-4">
            <Typography variant="small">
              🚀 <strong>Pro Feature:</strong> {config.instructions}
            </Typography>
          </Alert>
        )}

        {!config.proFeature && (
          <Alert color="blue" className="mb-4">
            <Typography variant="small">ℹ️ {config.instructions}</Typography>
          </Alert>
        )}

        {error && (
          <Alert color="red">
            <Typography variant="small">{error}</Typography>
          </Alert>
        )}

        {success && (
          <Alert color="green">
            <Typography variant="small">{success}</Typography>
          </Alert>
        )}

        {config.available && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.key}>
                <Input
                  label={field.label}
                  type={field.type}
                  value={credentials[field.key] || ""}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  required={field.required}
                  disabled={isLoading}
                  className="!border-gray-300 focus:!border-blue-500"
                />
              </div>
            ))}
          </form>
        )}

        {config.available && config.setupSteps && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <Typography
              variant="small"
              className="text-blue-800 font-medium mb-2"
            >
              Setup Steps for {config.name}:
            </Typography>
            <ol className="text-sm text-blue-700 space-y-1">
              {config.setupSteps.map((step, index) => (
                <li key={index}>
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </DialogBody>

      <DialogFooter className="space-x-2">
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>

        {config.available ? (
          <Button
            color="blue"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <Spinner className="h-4 w-4" />}
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        ) : (
          <Button
            color="amber"
            onClick={() => window.open("", "_blank")}
          >
            Upgrade to Pro
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
};

export default ConnectionModal;
