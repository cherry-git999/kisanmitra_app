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
  Telescope,
  Bug,
  X,
  Microscope,
  Database,
  Radio,
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
  const [showPestScopeDialog, setShowPestScopeDialog] = useState(false);
  
  const features = [
    {
      id: "farmer-scope",
      icon: Telescope,
      title: t("farmscope"),
      subtitle: "Get personalized crop advisories and weather-based recommendations",
      description: "Real-time farming insights tailored to your location",
      color: "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500",
    },
    {
      id: "pest-scope",
      icon: Bug,
      title: t("pestoscope"),
      subtitle: "Identify pests and diseases with expert treatment solutions",
      description: "Complete pest management database with organic remedies",
      color: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500",
    },
    {
      id: "tracking",
      icon: ClipboardList,
      title: t("mySuccessLogs"),
      subtitle: t("trackBest"),
      description: "Monitor your farming activities and track progress",
      color: "bg-gradient-to-br from-lime-500 via-green-500 to-emerald-500",
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white px-4 pt-12 pb-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {getGreeting(selectedLanguage)}
          </h1>
          <p className="text-primary-100 text-sm sm:text-base mb-4">
            {getSubtitle(selectedLanguage)}
          </p>

          {/* 📍 Location + Time */}
          {weather && (
            <div className="bg-white bg-opacity-15 rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-md backdrop-blur-sm">
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
            <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center backdrop-blur-sm">
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
            <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center backdrop-blur-sm">
              <div className="text-xl font-bold">{t("good")}</div>
              <div className="text-xs text-primary-100">{t("soilHealth")}</div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center backdrop-blur-sm">
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
        {/* Featured - AI Chat Bot 
        <div className="mb-6">
          <button
            onClick={() => onFeatureSelect("chatbot")}
            className="w-full relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="bg-gradient-to-br from-secondary-500 to-orange-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  {t("aiPowered")}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t("getInstantAnswers")}
              </h3>
              <p className="text-pink-100 mb-4">{t("askAnything")}</p>
              <div className="flex items-center gap-2 text-pink-100">
                <span className="font-semibold">{t("startChatting")}</span>
                <ArrowRight size={20} />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Sparkles size={24} className="text-yellow-300 animate-pulse" />
            </div>
          </button>
        </div>
        */}

        {/* Featured - AI Photo Analysis 
        <div className="mb-6">
          <button
            onClick={() => onFeatureSelect("photo")}
            className="w-full sm:w-2/3 relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-white flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">
                  {t("scanCropPest")}
                </h3>
                <p className="text-primary-100 text-sm mb-2">{t("detectPestSub")}</p>
                <div className="flex items-center gap-1 text-primary-100 text-sm">
                  <span className="font-semibold">{t("tryItNow")}</span>
                  <ArrowRight size={16} />
                </div>
              </div>
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0 ml-4">
                <ScanLine size={40} className="text-white" />
              </div>
            </div>
          </button>
        </div>
        */}

        {/* All Features */}
        <div>
          <h2 className="text-lg font-bold text-primary-600 mb-4">
            {t("What Else ?")}
          </h2>
          <div className="space-y-4">
            {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    onClick={() => {
                      if (feature.id === "pest-scope") {
                        setShowPestScopeDialog(true);
                      } else {
                        onFeatureSelect(feature.id);
                      }
                    }}
                    className="w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 p-5 text-left border-l-4 border-primary-500 flex items-center gap-4"
                  >
                    <div
                      className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <Icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-primary-700 text-base mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-snug">
                        {feature.subtitle}
                      </p>
                    </div>
                    <ArrowRight size={24} className="text-primary-500 flex-shrink-0" />
                  </button>
                );
              })}
          </div>
        </div>

        {/* Connect with Advisors */}
        <div className="mt-8 mb-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-orange-400 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-bold text-orange-800 mb-4">
            {t("connectWithAdvisors")}
          </h2>
          <div className="space-y-3">
            <a
              href="https://chat.whatsapp.com/your-kisan-sangam-link"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border-2 border-primary-500 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <div className="flex-1">
                <h3 className="font-bold text-primary-700 text-base">{t("kisanSangam")}</h3>
                <p className="text-xs text-primary-600 mt-1">{t("kisanSangamDesc")}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded">+55</span>
                <ArrowRight size={20} className="text-primary-600" />
              </div>
            </a>

            <a
              href="https://chat.whatsapp.com/your-soil-recommenders-link"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border-2 border-orange-400 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <div className="flex-1">
                <h3 className="font-bold text-orange-800 text-base">{t("soilRecommenders")}</h3>
                <p className="text-xs text-orange-700 mt-1">{t("soilRecommendersDesc")}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm font-semibold text-orange-800 bg-orange-100 px-2 py-1 rounded">+42</span>
                <ArrowRight size={20} className="text-orange-700" />
              </div>
            </a>

            <a
              href="https://chat.whatsapp.com/your-soil-documentation-link"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border-2 border-yellow-500 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <div className="flex-1">
                <h3 className="font-bold text-yellow-800 text-base">{t("soilDocumentation")}</h3>
                <p className="text-xs text-yellow-700 mt-1">{t("soilDocumentationDesc")}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded">+38</span>
                <ArrowRight size={20} className="text-yellow-700" />
              </div>
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 card bg-gradient-to-r from-emerald-100 via-teal-50 to-cyan-100 border-2 border-emerald-400 shadow-md">
          <h3 className="font-bold text-primary-700 mb-2 flex items-center gap-2">
            <Sparkles size={20} /> {t("dailyTip")}
          </h3>
          <p className="text-primary-800 text-sm">{t("dailyTipText")}</p>
        </div>
      </div>

      {/* PestScope Selection Dialog */}
      {showPestScopeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowPestScopeDialog(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Bug size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold">Pestoscope</h2>
              </div>
              <p className="text-orange-50 text-sm">
                Choose how you want to access pest information
              </p>
            </div>

            {/* Options */}
            <div className="p-6 space-y-4">
              {/* Real-time Advisories - Coming Soon */}
              <button
                disabled
                className="w-full p-4 border-2 border-gray-300 rounded-xl bg-gray-50 opacity-60 cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Radio size={24} className="text-gray-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-500">Real-time Advisories</h3>
                      <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Get instant alerts and real-time pest advisories for your location
                    </p>
                  </div>
                </div>
              </button>

              {/* Knowledge Base - Active */}
              <button
                onClick={() => {
                  setShowPestScopeDialog(false);
                  onFeatureSelect("pest-scope");
                }}
                className="w-full p-4 border-2 border-orange-500 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database size={24} className="text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-orange-700 mb-1">Knowledge Base</h3>
                    <p className="text-sm text-orange-600">
                      Browse comprehensive pest database and management solutions
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-orange-500 flex-shrink-0 mt-1" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
