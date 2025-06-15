"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Heart,
  Clock,
  Envelope,
  ArrowUpRight,
  ArrowClockwise,
} from "@phosphor-icons/react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
  Alert,
} from "@material-tailwind/react";
import StatCard from "../components/StatCard";
import Chart from "../components/Chart";
import ConnectionStatus from "../components/ConnectionStatus";
import { useApiConnection } from "../app/hooks/useApiConnection";

const Overview = () => {
  const { connections } = useApiConnection();
  const [stats, setStats] = useState({
    totalFollowers: 0,
    engagementRate: 0,
    optimalPostTime: "2:30 PM",
    emailsReceived: 0,
  });

  // Update stats based on connected accounts
  useEffect(() => {
    let totalFollowers = 0;
    let totalEngagement = 0;
    let connectedAccounts = 0;

    Object.entries(connections).forEach(([platform, connection]) => {
      if (connection.connected && connection.data) {
        connectedAccounts++;

        if (platform === "twitter" && connection.data.user) {
          totalFollowers += connection.data.user.followers_count || 0;
          totalEngagement += connection.data.metrics?.engagement_rate || 0;
        }
        // Add other platforms when implemented
      }
    });

    setStats({
      totalFollowers,
      engagementRate:
        connectedAccounts > 0
          ? (totalEngagement / connectedAccounts).toFixed(1)
          : 0,
      optimalPostTime: "2:30 PM",
      emailsReceived: 1248, // Mock data for now
    });
  }, [connections]);

  // Check if any accounts are connected
  const hasConnectedAccounts = Object.values(connections).some(
    (conn) => conn.connected
  );

  // Chart data - will be populated with real data when accounts are connected
  const engagementData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Likes",
        data: hasConnectedAccounts
          ? [120, 190, 170, 210, 180, 150, 130]
          : [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Comments",
        data: hasConnectedAccounts
          ? [80, 110, 90, 120, 100, 70, 60]
          : [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Shares",
        data: hasConnectedAccounts
          ? [40, 60, 50, 70, 55, 45, 35]
          : [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const followerData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Followers",
        data: hasConnectedAccounts
          ? [320, 450, 380, 520, 480, 560]
          : [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const emailSendersData = {
    labels: ["Marketing", "Support", "Newsletters", "Personal", "Other"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "#3B82F6",
          "#8B5CF6",
          "#10B981",
          "#EF4444",
          "#6B7280",
        ],
        borderWidth: 0,
      },
    ],
  };

  const topPosts = [
    {
      title: "Summer Sale Announcement",
      engagement: 4589,
      reach: 12456,
      status: "high",
    },
    {
      title: "New Product Launch",
      engagement: 3872,
      reach: 10987,
      status: "high",
    },
    {
      title: "Customer Testimonial",
      engagement: 2145,
      reach: 8765,
      status: "medium",
    },
  ];

  const recommendations = [
    {
      title: "Connect More Accounts",
      description: hasConnectedAccounts
        ? "Great start! Connect more platforms to get comprehensive insights across all your social media channels."
        : "Connect your social media accounts to start receiving personalized recommendations and insights.",
      priority: "HIGH",
      color: "blue",
      icon: "🔗",
    },
    {
      title: "Optimal Posting Times",
      description: hasConnectedAccounts
        ? "Your audience is most active between 1:30-3:30 PM on weekdays. Schedule 70% of your posts during this window for maximum engagement."
        : "Connect your accounts to discover when your audience is most active.",
      priority: hasConnectedAccounts ? "HIGH" : "MEDIUM",
      color: "purple",
      icon: "⏰",
    },
    {
      title: "Email Management",
      description:
        "87 unread emails detected. Consider setting up filters for frequent senders and allocating specific times for email management.",
      priority: "MEDIUM",
      color: "red",
      icon: "📧",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      <ConnectionStatus />

      {!hasConnectedAccounts && (
        <Alert color="amber" className="mb-6">
          <Typography variant="small">
            <strong>Get Started:</strong> Connect at least one social media
            account to see your analytics dashboard with real data.
          </Typography>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Followers"
          value={stats.totalFollowers.toLocaleString()}
          change={
            hasConnectedAccounts
              ? "12.5% from last week"
              : "Connect accounts to see data"
          }
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Engagement Rate"
          value={`${stats.engagementRate}%`}
          change={
            hasConnectedAccounts
              ? "0.6% from last week"
              : "Connect accounts to see data"
          }
          changeType="positive"
          icon={Heart}
          iconColor="bg-purple-500"
        />
        <StatCard
          title="Optimal Post Time"
          value={stats.optimalPostTime}
          change={
            hasConnectedAccounts
              ? "Based on last 30 days"
              : "Connect accounts to see data"
          }
          icon={Clock}
          iconColor="bg-green-500"
        />
        <StatCard
          title="Emails Received"
          value={stats.emailsReceived.toLocaleString()}
          change="8.3% from last week"
          changeType="negative"
          icon={Envelope}
          iconColor="bg-red-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border border-gray-100">
          <CardBody className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="text-gray-900 font-semibold">
                Engagement Trends
              </Typography>
              <div className="flex space-x-2">
                <Chip
                  value="7 Days"
                  size="sm"
                  className="bg-blue-50 text-blue-600"
                />
                <Chip value="30 Days" size="sm" variant="outlined" />
                <Chip value="90 Days" size="sm" variant="outlined" />
              </div>
            </div>
            <div className="relative h-80">
              <Chart type="line" data={engagementData} />
            </div>
            {!hasConnectedAccounts && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Typography variant="h6" className="text-gray-500 mb-2">
                    No Data Available
                  </Typography>
                  <Typography variant="small" className="text-gray-400">
                    Connect your accounts to see engagement trends
                  </Typography>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-100">
          <CardBody className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="text-gray-900 font-semibold">
                Follower Growth
              </Typography>
              <div className="flex space-x-2">
                <Chip
                  value="Monthly"
                  size="sm"
                  className="bg-purple-50 text-purple-600"
                />
                <Chip value="Weekly" size="sm" variant="outlined" />
              </div>
            </div>
            <div className="relative h-80">
              <Chart type="bar" data={followerData} />
            </div>
            {!hasConnectedAccounts && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Typography variant="h6" className="text-gray-500 mb-2">
                    No Data Available
                  </Typography>
                  <Typography variant="small" className="text-gray-400">
                    Connect your accounts to see follower growth
                  </Typography>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posts */}
        <Card className="shadow-sm border border-gray-100">
          <CardBody className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="text-gray-900 font-semibold">
                Top Performing Posts
              </Typography>
              <Button
                variant="text"
                className="flex items-center gap-2 text-blue-600 rounded-lg"
                size="sm"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {hasConnectedAccounts ? (
                topPosts.map((post, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <Typography
                        variant="small"
                        className="font-medium text-gray-900"
                      >
                        {post.title}
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        {post.reach.toLocaleString()} reach
                      </Typography>
                    </div>
                    <Chip
                      value={post.engagement.toLocaleString()}
                      size="sm"
                      className={
                        post.status === "high"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Typography variant="small" className="text-gray-500">
                    Connect your accounts to see top performing posts
                  </Typography>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Email Senders Chart */}
        <Card className="shadow-sm border border-gray-100">
          <CardBody className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="text-gray-900 font-semibold">
                Top Email Senders
              </Typography>
              <Button
                variant="text"
                className="flex items-center gap-2 text-blue-600 rounded-lg"
                size="sm"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative h-80">
              <Chart type="doughnut" data={emailSendersData} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recommendations Section */}
      <Card className="shadow-sm border border-gray-100">
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Typography variant="h5" className="text-gray-900 font-bold">
                Personalized Recommendations
              </Typography>
              <Typography variant="small" className="text-gray-600 mt-1">
                AI-powered insights to boost your performance
              </Typography>
            </div>
            <Button
              variant="text"
              className="flex items-center gap-2 text-blue-600 rounded-lg"
            >
              <ArrowClockwise className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((recommendation, index) => (
              <Card
                key={index}
                className={`border-l-4 border-l-${recommendation.color}-500 bg-${recommendation.color}-50/50 hover:shadow-md transition-all duration-300`}
              >
                <CardBody className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className={`bg-${recommendation.color}-100 p-3 rounded-xl mr-4`}
                    >
                      <span className="text-lg">{recommendation.icon}</span>
                    </div>
                    <div>
                      <Typography
                        variant="h6"
                        className="text-gray-900 font-semibold"
                      >
                        {recommendation.title}
                      </Typography>
                      <Chip
                        value={`${recommendation.priority} PRIORITY`}
                        size="sm"
                        className={`bg-${recommendation.color}-100 text-${recommendation.color}-600 mt-1`}
                      />
                    </div>
                  </div>
                  <Typography variant="small" className="text-gray-700 mb-4">
                    {recommendation.description}
                  </Typography>
                  <Button
                    size="sm"
                    className={`bg-${recommendation.color}-600 hover:bg-${recommendation.color}-700 rounded-lg`}
                  >
                    View Details
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Overview;
