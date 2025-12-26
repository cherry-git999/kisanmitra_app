import React, { useEffect, useRef } from "react";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  FileText,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { useI18n } from "../i18n";

interface PlanProps {
  onFeatureSelect: (featureId: string) => void;
  selectedLanguage: string;
  isActive?: boolean;
}

export default function Plan({
  onFeatureSelect,
  selectedLanguage,
  isActive,
}: PlanProps) {
  const { t, language } = useI18n();

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top every time Plan becomes active
  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isActive]);

  const planFeatures = [
    {
      id: "calendar",
      icon: Calendar,
      title: t("advisoryCalendar"),
      subtitle: t("planAdvisorySub"),
      description: "Get personalized crop calendar and farming schedules",
      color: "bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500",
      isAvailable: true,
    },
    {
      id: "crop-planning",
      icon: TrendingUp,
      title: "Crop Planning",
      subtitle: "Plan your crop rotation and seasonal strategy",
      description: "Optimize your crop selection based on season and soil",
      color: "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500",
      isAvailable: false,
    },
    {
      id: "budget-planner",
      icon: BarChart3,
      title: "Budget Planner",
      subtitle: "Plan your farming expenses and investments",
      description: "Track costs and plan your budget effectively",
      color: "bg-gradient-to-br from-lime-500 via-green-500 to-emerald-500",
      isAvailable: false,
    },
    {
      id: "farm-reports",
      icon: FileText,
      title: "Farm Reports",
      subtitle: "Generate detailed farm planning reports",
      description: "Create comprehensive reports for better planning",
      color: "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
      isAvailable: false,
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white px-4 pt-12 pb-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Plan Your Farming
          </h1>
          <p className="text-primary-100 text-sm sm:text-base">
            Strategic planning tools for successful organic farming
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Featured - Calendar */}
        <div className="mb-6">
          <button
            onClick={() => onFeatureSelect("calendar")}
            className="w-full relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <Calendar size={32} className="text-white" />
                </div>
                <div className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold">
                  Available Now
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t("advisoryCalendar")}
              </h3>
              <p className="text-orange-100 mb-4">
                {t("planAdvisorySub")}
              </p>
              <div className="flex items-center gap-2 text-orange-100">
                <span className="font-semibold">View Calendar</span>
                <ArrowRight size={20} />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Sparkles size={24} className="text-yellow-300 animate-pulse" />
            </div>
          </button>
        </div>

        {/* All Plan Features */}
        <div>
          <h2 className="text-lg font-bold text-primary-600 mb-4">
            Planning Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {planFeatures
              .filter((feature) => feature.id !== "calendar")
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
        <div className="mt-8 card bg-gradient-to-r from-emerald-100 via-green-50 to-teal-100 border-2 border-green-400 shadow-md">
          <h3 className="font-bold text-primary-700 mb-2 flex items-center gap-2">
            <Sparkles size={20} /> Planning Tip
          </h3>
          <p className="text-primary-800 text-sm">
            Start with the Advisory Calendar to plan your farming activities based on weather patterns and crop cycles.
          </p>
        </div>
      </div>
    </div>
  );
}
