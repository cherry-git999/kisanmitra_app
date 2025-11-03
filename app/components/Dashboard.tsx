import React, { useEffect, useState, useRef } from "react";
import {
  Camera,
  BookOpen,
  Users,
  Calendar,
  MapPin,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Clock,
  MessageCircle,
  ScanLine,
} from "lucide-react";
import { useI18n, languageToLocale } from "../i18n";

interface DashboardProps {
  onFeatureSelect: (featureId: string) => void;
  selectedLanguage: string;
  isActive?: boolean; // <-- Add this prop
}

const getGreeting = (language: string) => {
  switch (language) {
    case "te":
      return "నమస్కారం, రైతు గారు!";
    case "hi":
      return "नमस्कार, किसान जी!";
    default:
      return "Welcome, Farmer!";
  }
};

const getSubtitle = (language: string) => {
  switch (language) {
    case "te":
      return "మీ సేంద్రీయ వ్యవసాయ సహాయకుడు";
    case "hi":
      return "आपका जैविक खेती सहायक";
    default:
      return "Your Organic Farming Assistant";
  }
};

export default function Dashboard({
  onFeatureSelect,
  selectedLanguage,
  isActive,
}: DashboardProps) {
  const { t, language } = useI18n();
  const features = [
    {
      id: "chatbot",
      icon: MessageCircle,
      title: t("aiChatBotTitle"),
      subtitle: t("aiChatBotDesc"),
      description: t("aiChatBotDesc"),
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
    },
    {
      id: "guides",
      icon: BookOpen,
      title: t("solutionsTitle"),
      subtitle: t("solutionsDesc"),
      description: t("solutionsDesc"),
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      id: "calendar",
      icon: Calendar,
      title: t("advisoryCalendar"),
      subtitle: t("planAdvisorySub"),
      description: t("planAdvisorySub"),
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      id: "tracking",
      icon: ClipboardList,
      title: t("mySuccessLogs"),
      subtitle: t("trackBest"),
      description: t("trackBest"),
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    },
    {
      id: "community",
      icon: Users,
      title: t("communityHeader"),
      subtitle: t("communitySub"),
      description: t("communitySub"),
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      id: "suppliers",
      icon: MapPin,
      title: t("localSuppliers"),
      subtitle: t("findSuppliersSub"),
      description: t("certifiedSuppliers"),
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
  ];

  const [weather, setWeather] = useState<{
    temp: number;
    city: string;
    country: string;
    area?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeInfo, setTimeInfo] = useState<{
    time: string;
    day: string;
    date: string;
  }>({
    time: "",
    day: "",
    date: "",
  });

  // Ref for the main scrollable container
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top every time Dashboard becomes active
  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
      // Also scroll window to top for mobile browsers
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isActive]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const apiKey = "b9e51e729ddc2d801ba61197edd69b7f";
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
            const weatherResp = await fetch(weatherUrl);
            if (!weatherResp.ok) throw new Error("Failed to fetch weather");
            const weatherData = await weatherResp.json();

            const acceptLang = languageToLocale(language as any);
            const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
            const geoResp = await fetch(geoUrl, {
              headers: {
                "Accept-Language": acceptLang,
                "User-Agent": "FarmAI/1.0 (contact@example.com)",
              },
            });
            const geoData = await geoResp.json();
            const area =
              geoData.address.suburb ||
              geoData.address.village ||
              geoData.address.town ||
              geoData.address.city ||
              "";

            setWeather({
              temp: weatherData.main.temp,
              city:
                geoData.address.city ||
                geoData.address.town ||
                geoData.address.village ||
                weatherData.name,
              country: weatherData.sys.country,
              area,
            });
          } catch (err) {
            setError("Unable to fetch weather/location data");
          }
        },
        () => setError("Location access denied"),
      );
    } else {
      setError("Geolocation not supported");
    }
  }, [language]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const locale = languageToLocale(language as any);
      const time = now.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
      const day = now.toLocaleDateString(locale, { weekday: "long" });
      const date = now.toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setTimeInfo({ time, day, date });
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <div ref={containerRef} className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white px-4 pt-12 pb-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {getGreeting(selectedLanguage)}
          </h1>
          <p className="text-primary-100 text-sm sm:text-base mb-4">
            {getSubtitle(selectedLanguage)}
          </p>

          {/* 📍 Location + Time */}
          {weather && (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-md">
              <div className="mb-3 sm:mb-0">
                <p className="text-lg font-semibold">
                  📍 {weather.area ? `${weather.area}, ` : ""}
                  {weather.city}, {weather.country}
                </p>
                <p className="text-sm text-primary-100">
                  {t("currentLocation")}
                </p>
              </div>
              <div className="flex flex-col sm:items-end text-primary-50">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span className="text-lg font-semibold">{timeInfo.time}</span>
                </div>
                <p className="text-sm text-primary-100">
                  {timeInfo.day}, {timeInfo.date}
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              {weather ? (
                <>
                  <div className="text-xl font-bold">
                    {Math.round(weather.temp)}°C
                  </div>
                  <div className="text-xs text-primary-100 mt-1">
                    {t("cloudy")}
                  </div>
                </>
              ) : error ? (
                <div className="text-xs text-red-200">{error}</div>
              ) : (
                <div className="text-xs text-primary-100">Loading...</div>
              )}
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{t("good")}</div>
              <div className="text-xs text-primary-100">{t("soilHealth")}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">3</div>
              <div className="text-xs text-primary-100">
                {t("activeAlertsStat")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Featured */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-primary-500 mb-3 flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-500" /> {t("featured")}
          </h2>
          <button
            onClick={() => onFeatureSelect("photo")}
            className="w-full relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <ScanLine size={32} className="text-white" />
                </div>
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  {t("aiPowered")}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t("aiPhotoAnalysis")}
              </h3>
              <p className="text-green-100 mb-4">{t("aiPhotoSub")}</p>
              <div className="flex items-center gap-2 text-green-100">
                <span className="font-semibold">{t("tryItNow")}</span>
                <ArrowRight size={20} />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Sparkles size={24} className="text-yellow-300 animate-pulse" />
            </div>
          </button>
        </div>

        {/* All Features */}
        <div>
          <h2 className="text-lg font-bold text-primary-500 mb-4">
            {t("allFeatures")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => onFeatureSelect(feature.id)}
                  className="flex flex-col items-start bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 p-4 text-left"
                >
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-3`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-primary-600 text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-tight">
                    {feature.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 card bg-gradient-to-r from-primary-100 to-secondary-100 border-2 border-primary-500">
          <h3 className="font-bold text-primary-500 mb-2 flex items-center gap-2">
            <Sparkles size={20} /> {t("dailyTip")}
          </h3>
          <p className="text-primary-700 text-sm">{t("dailyTipText")}</p>
        </div>
      </div>
    </div>
  );
}
