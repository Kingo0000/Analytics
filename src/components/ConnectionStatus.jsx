"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
  Alert,
} from "@material-tailwind/react";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowClockwise,
  Gear,
  Crown,
} from "@phosphor-icons/react";
import { useApiConnection } from "../app/hooks/useApiConnection";
import ConnectionModal from "./ConnectionModal";

const ConnectionStatus = () => {
  const { connections, loading, disconnectPlatform } = useApiConnection();
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const platforms = [
    {
      id: "twitter",
      name: "Twitter",
      icon: "🐦",
      color: "blue",
      available: true,
      description: "Track tweets, followers, engagement",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "📘",
      color: "blue",
      available: true,
      description: "Personal posts and basic metrics",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📷",
      color: "purple",
      available: true,
      description: "Personal account photos and stories",
    },
    {
      id: "gmail",
      name: "Gmail",
      icon: "📧",
      color: "red",
      available: true,
      description: "Email analytics and patterns",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "📺",
      color: "red",
      available: true,
      description: "Channel stats and video metrics",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      color: "blue",
      available: false,
      proFeature: true,
      description: "Professional network analytics",
    },
  ];

  const handleConnect = (platformId) => {
    setSelectedPlatform(platformId);
    setModalOpen(true);
  };

  const handleDisconnect = (platformId) => {
    if (window.confirm(`Are you sure you want to disconnect ${platformId}?`)) {
      disconnectPlatform(platformId);
    }
  };

  const getStatusIcon = (connection) => {
    if (connection.connected) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (connection.error) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (connection) => {
    if (connection.connected) {
      return "Connected";
    } else if (connection.error) {
      return "Error";
    } else {
      return "Not Connected";
    }
  };

  const getStatusColor = (connection) => {
    if (connection.connected) {
      return "green";
    } else if (connection.error) {
      return "red";
    } else {
      return "gray";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5" className="text-gray-900 font-bold">
            Account Connections
          </Typography>
          <Typography variant="small" className="text-gray-600 mt-1">
            Connect your accounts to start tracking analytics (All FREE APIs
            included!)
          </Typography>
        </div>
        <Button
          variant="outlined"
          className="flex items-center gap-2 rounded-lg border-gray-300"
          onClick={() => window.location.reload()}
        >
          <ArrowClockwise className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <Alert color="green" className="mb-6">
        <Typography variant="small">
          <strong>Free APIs Available:</strong> Twitter, Facebook (basic),
          Instagram (personal), Gmail, YouTube.
          <strong> Pro Only:</strong> LinkedIn (requires paid partnership).
        </Typography>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const connection = connections[platform.id];
          const isLoading = loading[platform.id];

          return (
            <Card
              key={platform.id}
              className={`border-2 transition-all duration-300 ${
                connection.connected
                  ? "border-green-200 bg-green-50"
                  : connection.error
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <Typography
                        variant="h6"
                        className="text-gray-900 flex items-center gap-2"
                      >
                        {platform.name}
                        {platform.proFeature && (
                          <Crown className="w-4 h-4 text-amber-500" />
                        )}
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        {platform.description}
                      </Typography>
                    </div>
                  </div>
                  {getStatusIcon(connection)}
                </div>

                <div className="mb-4">
                  <Chip
                    value={getStatusText(connection)}
                    size="sm"
                    color={getStatusColor(connection)}
                    className="mb-2"
                  />

                  {connection.connected && connection.data && (
                    <div className="text-xs text-gray-600 space-y-1">
                      {platform.id === "twitter" && connection.data.user && (
                        <>
                          <div>@{connection.data.user.username}</div>
                          <div>
                            {connection.data.user.followers_count} followers
                          </div>
                        </>
                      )}
                      {platform.id === "facebook" && connection.data.user && (
                        <>
                          <div>{connection.data.user.name}</div>
                          <div>
                            {connection.data.posts?.length || 0} recent posts
                          </div>
                        </>
                      )}
                      {platform.id === "instagram" && connection.data.user && (
                        <>
                          <div>{connection.data.user.username}</div>
                          <div>
                            {connection.data.media?.length || 0} media items
                          </div>
                        </>
                      )}
                      {platform.id === "gmail" && connection.data && (
                        <>
                          <div>{connection.data.email}</div>
                          <div>
                            {connection.data.messageCount || 0} messages
                            analyzed
                          </div>
                        </>
                      )}
                      {platform.id === "youtube" && connection.data.channel && (
                        <>
                          <div>{connection.data.channel.title}</div>
                          <div>
                            {connection.data.channel.subscriberCount}{" "}
                            subscribers
                          </div>
                        </>
                      )}
                      <div>
                        Connected:{" "}
                        {new Date(connection.connectedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {connection.error && (
                    <Typography variant="small" className="text-red-600 mt-2">
                      {connection.error}
                    </Typography>
                  )}
                </div>

                <div className="space-y-2">
                  {connection.connected ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outlined"
                        className="flex-1 rounded-lg border-gray-300"
                        onClick={() => handleDisconnect(platform.id)}
                        disabled={isLoading}
                      >
                        Disconnect
                      </Button>
                      <Button
                        size="sm"
                        variant="text"
                        className="p-2 rounded-lg"
                        onClick={() => handleConnect(platform.id)}
                      >
                        <Gear className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className={`w-full rounded-lg ${
                        platform.available
                          ? `bg-${platform.color}-600 hover:bg-${platform.color}-700`
                          : "bg-amber-600 hover:bg-amber-700"
                      }`}
                      onClick={() =>
                        platform.available
                          ? handleConnect(platform.id)
                          : window.open("https://socialsync.com/pro", "_blank")
                      }
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Connecting..."
                        : platform.available
                        ? "Connect"
                        : "Upgrade to Pro"}
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <ConnectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        platform={selectedPlatform}
      />
    </div>
  );
};

export default ConnectionStatus;
