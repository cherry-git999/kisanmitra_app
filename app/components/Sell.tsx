import React, { useEffect, useRef } from "react";
import {
  MapPin,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { useI18n } from "../i18n";

interface SellProps {
  onFeatureSelect: (featureId: string) => void;
  selectedLanguage: string;
  isActive?: boolean;
}

export default function Sell({
  onFeatureSelect,
  selectedLanguage,
  isActive,
}: SellProps) {
  const { t, language } = useI18n();

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top every time Sell becomes active
  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isActive]);

  const sellFeatures = [
    {
      id: "suppliers",
      icon: MapPin,
      title: t("localSuppliers"),
      subtitle: t("findSuppliersSub"),
      description: "Find certified organic suppliers near you",
      color: "bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500",
      isAvailable: true,
    },
    {
      id: "market-prices",
      icon: TrendingUp,
      title: "Market Prices",
      subtitle: "Real-time crop and commodity prices",
      description: "Stay updated with latest market rates",
      color: "bg-gradient-to-br from-green-500 via-emerald-500 to-lime-500",
      isAvailable: false,
    },
    {
      id: "buyer-network",
      icon: Users,
      title: "Buyer Network",
      subtitle: "Connect with organic produce buyers",
      description: "Find buyers for your organic produce",
      color: "bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500",
      isAvailable: false,
    },
    {
      id: "product-listing",
      icon: Package,
      title: "Product Listing",
      subtitle: "List your products for sale",
      description: "Showcase your organic produce to buyers",
      color: "bg-gradient-to-br from-lime-500 via-green-500 to-emerald-500",
      isAvailable: false,
    },
    {
      id: "pricing-calculator",
      icon: DollarSign,
      title: "Pricing Calculator",
      subtitle: "Calculate optimal selling prices",
      description: "Get price recommendations for your crops",
      color: "bg-gradient-to-br from-green-500 via-teal-500 to-emerald-500",
      isAvailable: false,
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white px-4 pt-12 pb-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Sell Your Produce
          </h1>
          <p className="text-teal-100 text-sm sm:text-base">
            Connect with suppliers and markets for your organic products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Featured - Suppliers */}
        <div className="mb-6">
          <button
            onClick={() => onFeatureSelect("suppliers")}
            className="w-full relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <MapPin size={32} className="text-white" />
                </div>
                <div className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold">
                  Available Now
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t("localSuppliers")}
              </h3>
              <p className="text-teal-100 mb-4">
                {t("findSuppliersSub")}
              </p>
              <div className="flex items-center gap-2 text-teal-100">
                <span className="font-semibold">Find Suppliers</span>
                <ArrowRight size={20} />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Sparkles size={24} className="text-yellow-300 animate-pulse" />
            </div>
          </button>
        </div>

        {/* All Sell Features */}
        <div>
          <h2 className="text-lg font-bold text-primary-600 mb-4">
            Selling Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sellFeatures
              .filter((feature) => feature.id !== "suppliers")
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
          <h3 className="font-bold text-teal-700 mb-2 flex items-center gap-2">
            <Sparkles size={20} /> Selling Tip
          </h3>
          <p className="text-teal-800 text-sm">
            Connect with certified organic suppliers to ensure quality standards and get the best prices for your produce.
          </p>
        </div>
      </div>
    </div>
  );
}
