import React, { useEffect, useRef } from "react";
import {
  BookOpen,
  ScanLine,
  Droplets,
  Bug,
  Leaf,
  ArrowRight,
  Sparkles,
  Lock,
  Microscope,
} from "lucide-react";
import { useI18n } from "../i18n";

interface GrowProps {
  onFeatureSelect: (featureId: string) => void;
  selectedLanguage: string;
  isActive?: boolean;
}

export default function Grow({
  onFeatureSelect,
  selectedLanguage,
  isActive,
}: GrowProps) {
  const { t, language } = useI18n();

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top every time Grow becomes active
  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isActive]);

  const growFeatures = [
    {
      id: "pest-scope",
      icon: Microscope,
      title: "Pest Scope",
      subtitle: "Advanced pest detection and analysis",
      description: "Comprehensive pest identification and management insights",
      color: "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500",
      isAvailable: true,
    },
    {
      id: "guides",
      icon: BookOpen,
      title: t("solutionsTitle"),
      subtitle: t("solutionsDesc"),
      description: "Expert guides for organic farming practices",
      color: "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500",
      isAvailable: true,
      isSample: true,
    },
    {
      id: "photo",
      icon: ScanLine,
      title: t("scanner"),
      subtitle: t("detectPestSub"),
      description: "AI-powered crop and pest disease detection",
      color: "bg-gradient-to-br from-lime-500 via-green-500 to-emerald-500",
      isAvailable: false,
    },
    {
      id: "irrigation",
      icon: Droplets,
      title: "Irrigation Management",
      subtitle: "Smart water management for your crops",
      description: "Optimize water usage and irrigation schedules",
      color: "bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500",
      isAvailable: false,
    },
    {
      id: "pest-control",
      icon: Bug,
      title: "Pest Control",
      subtitle: "Natural pest management solutions",
      description: "Organic pest control methods and tips",
      color: "bg-gradient-to-br from-green-500 via-lime-500 to-emerald-500",
      isAvailable: false,
    },
    {
      id: "nutrition",
      icon: Leaf,
      title: "Crop Nutrition",
      subtitle: "Organic fertilization and soil health",
      description: "Nutrient management for healthy crops",
      color: "bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500",
      isAvailable: false,
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white px-4 pt-12 pb-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Grow Your Crops
          </h1>
          <p className="text-green-100 text-sm sm:text-base">
            Expert guidance and tools for successful crop cultivation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Featured - Pest Scope */}
        <div className="mb-6">
          <button
            onClick={() => onFeatureSelect("pest-scope")}
            className="w-full relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <Microscope size={32} className="text-white" />
                </div>
                <div className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold">
                  Available Now
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Pest Scope
              </h3>
              <p className="text-blue-100 mb-4">
                Advanced pest detection and analysis
              </p>
              <div className="flex items-center gap-2 text-blue-100">
                <span className="font-semibold">Analyze Now</span>
                <ArrowRight size={20} />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Sparkles size={24} className="text-yellow-300 animate-pulse" />
            </div>
          </button>
        </div>

        {/* All Grow Features */}
        <div>
          <h2 className="text-lg font-bold text-primary-600 mb-4">
            Growing Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {growFeatures
              .filter((feature) => feature.id !== "pest-scope")
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
                      {feature.isSample ? (
                        <div className="flex items-center gap-1 bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                          <Sparkles size={12} />
                          <span>Sample</span>
                        </div>
                      ) : !feature.isAvailable ? (
                        <div className="flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                          <Lock size={12} />
                          <span>Coming Soon</span>
                        </div>
                      ) : null}
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
          <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
            <Sparkles size={20} /> Growing Tip
          </h3>
          <p className="text-green-800 text-sm">
            Use Pest Scope for advanced pest detection and analysis to protect your crops and maximize your yield.
          </p>
        </div>
      </div>
    </div>
  );
}
