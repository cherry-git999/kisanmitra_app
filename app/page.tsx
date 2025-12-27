"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  MapPin,
  ClipboardList,
  Menu,
  X,
  Home,
  User,
  Settings,
  LogOut,
  MessageSquare,
  ScanLine,
  FileText,
  Sprout,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import PhotoAnalysis from "./components/PhotoAnalysis";
import Guides from "./components/Guides";
import Community from "./components/Community";
import CalendarView from "./components/CalendarView";
import Suppliers from "./components/Suppliers";
import Tracking from "./components/Tracking";
import SplashScreen from "./components/SplashScreen";
import LanguageSelection from "./components/LanguageSelection";
import Dashboard from "./components/Dashboard";
import ChartBot from "./components/ChartBot";
import Plan from "./components/Plan";
import Grow from "./components/Grow";
import Sell from "./components/Sell";
import FeaturesComing from "./components/FeaturesComing";

import { useI18n } from "./i18n";

function useLocalizedTabs(t: (k: string) => string) {
  return useMemo(
    () => [
      {
        id: "chatbot",
        label: t("aiChat"),
        icon: MessageSquare,
        component: ChartBot,
      },
      {
        id: "photo",
        label: t("scanner"),
        icon: ScanLine,
        component: PhotoAnalysis,
      },
      { id: "guides", 
        label: t("guides"), 
        icon: BookOpen, 
        component: Guides },
      {
        id: "community",
        label: t("community"),
        icon: Users,
        component: Community,
      },
      {
        id: "calendar",
        label: t("calendar"),
        icon: Calendar,
        component: CalendarView,
      },
      {
        id: "suppliers",
        label: t("suppliers"),
        icon: MapPin,
        component: Suppliers,
      },
      {
        id: "tracking",
        label: t("myLogs"),
        icon: ClipboardList,
        component: Tracking,
      },
      {
        id: "plan",
        label: "Plan",
        icon: FileText,
        component: Plan,
      },
      {
        id: "grow",
        label: "Grow",
        icon: Sprout,
        component: Grow,
      },
      {
        id: "sell",
        label: "Sell",
        icon: ShoppingCart,
        component: Sell,
      },
      {
        id: "features",
        label: "Upcoming Features",
        icon: Sparkles,
        component: FeaturesComing,
      },
    ],
    [t],
  );
}

const bottomNavTabs = ["plan", "grow", "sell", "features"];

export default function Page() {
  const { t, setLanguage, language } = useI18n();
  const [showSplash, setShowSplash] = useState(true);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [user, setUser] = useState({
    name: "",
    phone: "",
    crops: "",
    type: "",
  });

  const [tempData, setTempData] = useState({
    phone: "",
    otp: "",
    name: "",
    crops: "",
    type: "",
  });

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "te", label: "Telugu" },
    { value: "hi", label: "Hindi" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowLanguageSelection(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = useLocalizedTabs(t);

  const handleLanguageSelect = (langCode: string) => {
    const code = (langCode as "en" | "hi" | "te") || "en";
    setSelectedLanguage(code);
    setLanguage(code);
    setShowLanguageSelection(false);
    setShowDashboard(true);
  };

  const handleFeatureSelect = (featureId: string) => {
    setActiveTab(featureId);
    setShowDashboard(false);
    window.scrollTo({ top: 0 });
  };

  const handleBackToDashboard = () => {
    setActiveTab("");
    setShowDashboard(true);
    window.scrollTo({ top: 0 });
  };

  const handleLoginSubmit = () => {
    if (!otpSent) {
      setOtpSent(true);
    } else {
      setLoggedIn(true);
      setUser({
        name: tempData.name || "Ram Babu",
        phone: tempData.phone,
        crops: tempData.crops || "Paddy",
        type: tempData.type || "Organic",
      });
      setProfileOpen(false);
      setOtpSent(false);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser({ name: "", phone: "", crops: "", type: "" });
    setTempData({ phone: "", otp: "", name: "", crops: "", type: "" });
    setProfileOpen(false);
  };

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || PhotoAnalysis;

  if (showSplash) return <SplashScreen />;
  if (showLanguageSelection)
    return <LanguageSelection onLanguageSelect={handleLanguageSelect} />;

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-primary-600 text-white flex items-center justify-center px-4 py-3 shadow-md relative">
        <h1 className="text-lg font-bold">
          {t("appTitle")}
        </h1>
      </header>

      {/* Sidebar */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-0 left-0 w-64 h-full bg-white shadow-xl p-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setMenuOpen(false)} className="ml-auto mb-6">
              <X size={26} />
            </button>

            <h2 className="text-xl font-semibold mb-4">{t("quickLinks")}</h2>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => {
                    handleBackToDashboard();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
                >
                  <Home size={20} /> <span>{t("home")}</span>
                </button>
              </li>
              {tabs
                .filter((tab) => tab.id !== "tracking")
                .map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMenuOpen(false);
                          window.scrollTo({ top: 0 });
                        }}
                        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
                      >
                        <Icon size={20} /> <span>{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setProfileOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setProfileOpen(false)}
              className="absolute top-3 right-3"
            >
              <X size={22} />
            </button>

            {!loggedIn ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-center">
                  {isSignup
                    ? t("signUp")
                    : otpSent
                      ? t("enterOtp")
                      : t("login")}
                </h2>
                <div className="space-y-3">
                  {!otpSent && (
                    <>
                      {isSignup && (
                        <>
                          <input
                            type="text"
                            placeholder={t("nameLabel")}
                            value={tempData.name}
                            onChange={(e) =>
                              setTempData({ ...tempData, name: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                          />
                          <input
                            type="text"
                            placeholder={t("cropsPlaceholder")}
                            value={tempData.crops}
                            onChange={(e) =>
                              setTempData({
                                ...tempData,
                                crops: e.target.value,
                              })
                            }
                            className="w-full border p-2 rounded"
                          />
                          <select
                            value={tempData.type}
                            onChange={(e) =>
                              setTempData({ ...tempData, type: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                          >
                            <option value="">{t("selectFarmingType")}</option>
                            <option value="Organic">{t("organic")}</option>
                            <option value="Conventional">
                              {t("conventional")}
                            </option>
                            <option value="Mixed">{t("mixed")}</option>
                          </select>
                        </>
                      )}
                      <input
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        value={tempData.phone}
                        onChange={(e) =>
                          setTempData({ ...tempData, phone: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </>
                  )}

                  {otpSent && (
                    <input
                      type="text"
                      placeholder={t("enterOtp")}
                      value={tempData.otp}
                      onChange={(e) =>
                        setTempData({ ...tempData, otp: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    />
                  )}

                  <button
                    onClick={handleLoginSubmit}
                    className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors"
                  >
                    {otpSent ? t("verifyOtp") : t("continueBtn")}
                  </button>

                  <p className="text-center text-sm mt-3">
                    {isSignup ? (
                      <>
                        {t("alreadyHaveAccount")}{" "}
                        <button
                          className="text-primary-600 font-semibold"
                          onClick={() => setIsSignup(false)}
                        >
                          {t("login")}
                        </button>
                      </>
                    ) : (
                      <>
                        {t("newHere")}{" "}
                        <button
                          className="text-primary-600 font-semibold"
                          onClick={() => setIsSignup(true)}
                        >
                          {t("signUp")}
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-center mb-4 text-primary-700">
                  {t("profileTitle")}
                </h2>
                <p className="text-primary-900">
                  <strong>{t("nameField")}:</strong> {user.name}
                </p>
                <p className="text-primary-900">
                  <strong>{t("phoneField")}:</strong> {user.phone}
                </p>
                <p className="text-primary-900">
                  <strong>{t("cropsField")}:</strong> {user.crops}
                </p>
                <p className="text-primary-900">
                  <strong>{t("farmingTypeField")}:</strong> {user.type}
                </p>

                <div className="mt-4 mb-4">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary-700">
                    <Settings size={16} /> <span>{t("language")}</span>
                  </label>
                  <select
                    value={selectedLanguage || language}
                    onChange={(e) => handleLanguageSelect(e.target.value)}
                    className="w-full border-2 border-primary-300 p-2 rounded text-primary-700 focus:outline-none focus:border-primary-600"
                  >
                    {languageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("tracking");
                    setShowDashboard(false);
                    setProfileOpen(false);
                    window.scrollTo({ top: 0 });
                  }}
                  className="w-full bg-secondary-500 hover:bg-orange-600 text-white py-2 rounded mt-4 flex items-center justify-center gap-2 transition-colors font-semibold"
                >
                  <ClipboardList size={18} />
                  <span>{t("myLogs")}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-4 flex items-center justify-center gap-2 transition-colors font-semibold"
                >
                  <LogOut size={18} />
                  <span>{t("logout")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 pb-20">
        {showDashboard && activeTab === "" ? (
          <Dashboard
            onFeatureSelect={handleFeatureSelect}
            selectedLanguage={selectedLanguage}
            isActive={activeTab === "" || activeTab === "dashboard"}
          />
        ) : (
          <ActiveComponent 
            onFeatureSelect={handleFeatureSelect}
            selectedLanguage={selectedLanguage}
            isActive={true}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-2 py-2 z-30">
        <div className="flex justify-around items-center">
          <button
            onClick={handleBackToDashboard}
            className="flex flex-col items-center p-2"
          >
            <Home size={20} />
            <span className="text-xs font-semibold">Home</span>
          </button>

          {tabs
            .filter((tab) => bottomNavTabs.includes(tab.id))
            .map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isFeatures = tab.id === "features";
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0 });
                  }}
                  className={`flex flex-col items-center p-2 ${
                    isActive
                      ? "text-primary-600 bg-primary-50"
                      : "text-secondary-500"
                  }`}
                >
                  <Icon size={20} strokeWidth={2.5} />
                  <span className={`${isFeatures ? "text-[0.6rem]" : "text-xs"} font-semibold mt-1`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
        </div>
      </nav>
    </div>
  );
}
