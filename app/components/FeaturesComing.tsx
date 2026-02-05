import React, { useEffect, useRef } from "react";
import {
  MessageSquare,
  ScanLine,
  Users,
  ClipboardList,
  Zap,
  Bell,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { useI18n } from "../i18n";

interface FeaturesComingProps {
  onFeatureSelect: (featureId: string) => void;
  selectedLanguage: string;
  isActive?: boolean;
}

export default function FeaturesComing({
  onFeatureSelect,
  selectedLanguage,
  isActive,
}: FeaturesComingProps) {
  const { t, language } = useI18n();

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top every time FeaturesComing becomes active
  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isActive]);

  const comingFeatures = [
    {
      id: "chatbot",
      icon: MessageSquare,
      title: "Get Instant Answers",
      subtitle: "Ask anything about your crops, pests, and organic farming",
      description: "AI-powered chat assistant for instant answers",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      isAvailable: false,
    },
    {
      id: "photo",
      icon: ScanLine,
      title: "Scan your crop & detect pest",
      subtitle: "Try it for more and get instant solutions",
      description: "AI-powered crop and pest disease detection",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      isAvailable: false,
    },
    {
      id: "community",
      icon: Users,
      title: t("community"),
      subtitle: t("communitySub"),
      description: "Connect with fellow organic farmers",
      color: "bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500",
      isAvailable: false,
    },
    {
      id: "tracking",
      icon: ClipboardList,
      title: t("myLogs"),
      subtitle: t("trackBest"),
      description: "Track your farming activities and success",
      color: "bg-gradient-to-br from-lime-500 via-green-500 to-emerald-500",
      isAvailable: false,
    },
    {
      id: "weather-alerts",
      icon: Bell,
      title: "Weather Alerts",
      subtitle: "Get real-time weather notifications",
      description: "Stay informed about weather changes",
      color: "bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500",
      isAvailable: false,
    },
    {
      id: "smart-recommendations",
      icon: Zap,
      title: "Smart Recommendations",
      subtitle: "AI-powered farming suggestions",
      description: "Personalized recommendations for your farm",
      color: "bg-gradient-to-br from-green-500 via-lime-500 to-emerald-500",
      isAvailable: false,
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white px-4 pt-12 pb-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Features Coming Soon
          </h1>
          <p className="text-purple-100 text-sm sm:text-base">
            Exciting new features and tools for your farming journey
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Featured - AI Chatbot */}
        <div className="mb-6">
          <div className="w-full relative overflow-hidden rounded-2xl shadow-lg opacity-75">
            <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <MessageSquare size={32} className="text-white" />
                </div>
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  AI POWERED
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Get Instant Answers
              </h3>
              <p className="text-pink-100 mb-4">
                Ask anything about your crops, pests, and organic farming
              </p>
              <div className="flex items-center gap-2 text-pink-100">
                <span className="font-semibold">Start chatting →</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Lock size={12} />
                Coming Soon
              </div>
              <button
                onClick={() => onFeatureSelect("chatbot")}
                className="bg-white text-green-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-green-50 transition-colors flex items-center gap-1 shadow-md"
              >
                <Sparkles size={12} />
                Try Sample
              </button>
            </div>
          </div>
        </div>

        {/* Featured - Photo Scanner */}
        <div className="mb-6">
          <div className="w-full relative overflow-hidden rounded-2xl shadow-lg opacity-75">
            <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <ScanLine size={32} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Scan your crop & detect pest
              </h3>
              <p className="text-green-100 mb-4">
                Try it for more and get instant solutions
              </p>
              <div className="flex items-center gap-2 text-green-100">
                <span className="font-semibold">Try it now →</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Lock size={12} />
                Coming Soon
              </div>
              <button
                onClick={() => onFeatureSelect("photo")}
                className="bg-white text-green-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-green-50 transition-colors flex items-center gap-1 shadow-md"
              >
                <Sparkles size={12} />
                Try Sample
              </button>
            </div>
          </div>
        </div>

        {/* All Coming Features */}
        <div>
          <h2 className="text-lg font-bold text-primary-600 mb-4">
            More Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {comingFeatures
              .filter((feature) => feature.id !== "chatbot" && feature.id !== "photo")
              .map((feature) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    onClick={() =>
                      feature.isAvailable && onFeatureSelect(feature.id)
                    }
                    disabled={!feature.isAvailable}
                    className={`flex flex-col items-start bg-white rounded-xl shadow-sm transition-all duration-200 p-4 text-left border-l-4 ${
                      feature.isAvailable
                        ? "border-primary-500 hover:shadow-md hover:scale-105 active:scale-95"
                        : "border-gray-300 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-3">
                      <div
                        className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      {!feature.isAvailable && (
                        <div className="flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                          <Lock size={12} />
                          <span>Coming Soon</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-primary-700 text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-tight">
                      {feature.subtitle}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 card bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100 border-2 border-green-400 shadow-md">
          <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
            <Sparkles size={20} /> Stay Tuned!
          </h3>
          <p className="text-purple-800 text-sm">
            We're constantly working on new features to make your organic farming journey easier and more successful. These exciting features will be available soon!
          </p>
        </div>
      </div>
    </div>
  );
}
