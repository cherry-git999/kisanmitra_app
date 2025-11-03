import React, { useState, useEffect } from "react";
import { useI18n } from "../i18n";
import {
  Calendar as CalendarIcon,
  AlertTriangle,
  Sprout,
  Scissors,
  ChevronRight,
} from "lucide-react";

// === Mock Data (shifted to October 2025) ===
const mockEvents = [
  {
    id: 1,
    date: "2025-10-06",
    titleKey: "rainPredictedDelay",
    type: "",
    cropKey: "paddy",
  },
  {
    id: 2,
    date: "2025-10-12",
    titleKey: "applyNeemSeedExtract",
    type: "",
    cropKey: "paddy",
  },
  {
    id: 3,
    date: "2025-10-20",
    titleKey: "humidityAbove80SheathBlightRisk",
    type: "",
    cropKey: "paddy",
  },
  {
    id: 4,
    date: "2025-10-26",
    titleKey: "repeatJeevamruthamDrench",
    type: "",
    cropKey: "paddy",
  },
  {
    id: 5,
    date: "2025-10-30",
    titleKey: "afterHarvestApplyTrichoderma",
    type: "",
    cropKey: "paddy",
  },
];

const mockAlerts = [
  {
    id: 1,
    titleKey: "highRiskLeafFolderInfestation",
    descriptionKey: "regularlyInspectLeavesFolding",
    severity: "high",
    validUntil: "20-10-2025", // changed to DD-MM-YYYY
  },
  {
    id: 2,
    titleKey: "blastDiseaseAlert",
    descriptionKey: "cloudyWeatherContinuousDew",
    severity: "medium",
    validUntil: "20-10-2025", // changed to DD-MM-YYYY
  },
  {
    id: 3,
    titleKey: "brownSpotRisk",
    descriptionKey: "deficientNitrogenHighHumidity",
    severity: "low",
    validUntil: "28-10-2025", // changed to DD-MM-YYYY
  },
];

export default function CalendarView() {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [crop, setCrop] = useState("");

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "planting":
        return <Sprout size={20} className="text-primary-500" />;
      case "harvesting":
        return <Scissors size={20} className="text-primary-500" />;
      default:
        return <CalendarIcon size={20} className="text-primary-500" />;
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          badge: "bg-red-500",
        };
      case "medium":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          badge: "bg-yellow-500",
        };
      default:
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          badge: "bg-green-500",
        };
    }
  };

  // Generate October 2025 calendar
  const generateCalendarDays = () => {
    const days = [];
    const year = 2025;
    const month = 9; // October (0-indexed)
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Fill blanks before first day
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, hasEvent: false });
    }

    // Fill actual days
    for (let i = 1; i <= totalDays; i++) {
      const hasEvent = mockEvents.some(
        (event) => parseInt(event.date.split("-")[2]) === i,
      );
      days.push({ day: i, hasEvent });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Set today's date if in October 2025
  useEffect(() => {
    const today = new Date();
    if (today.getMonth() === 9 && today.getFullYear() === 2025) {
      setSelectedDate(today.getDate());
    } else {
      setSelectedDate(1);
    }
  }, []);

  const todaysEvents = mockEvents.filter((event) => {
    const eventDay = parseInt(event.date.split("-")[2]);
    return eventDay === selectedDate;
  });

  // === Crop selection popup ===
  const handleCropSubmit = () => {
    if (crop.trim() !== "") {
      setShowPopup(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 relative">
      {/* === Popup Modal with Blur === */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-md bg-white/60">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-sm border border-primary-200">
            <h2 className="text-xl font-bold text-primary-600 mb-3 text-center">
              🌾 {t("cropSelection")}
            </h2>
            <p className="text-gray-600 text-sm mb-4 text-center">
              {t("whichCropQuestion")}
            </p>
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder={t("enterCropPlaceholder")}
              className="w-full border border-primary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
            />
            <button
              onClick={handleCropSubmit}
              className="w-full bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 transition"
            >
              {t("continue")}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-primary-500 text-white px-4 pt-12 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {t("advisoryCalendar")}
        </h1>
        <p className="text-primary-100 text-sm sm:text-base">
          {t("planAdvisorySub")}
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Calendar */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary-500 text-center mb-6">
            {t("october2025")}
          </h2>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {[
              t("sun"),
              t("mon"),
              t("tue"),
              t("wed"),
              t("thu"),
              t("fri"),
              t("sat"),
            ].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-secondary-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, idx) => (
              <button
                key={idx}
                disabled={!item.day}
                onClick={() => item.day && setSelectedDate(item.day)}
                className={`aspect-square flex flex-col items-center justify-center p-1 rounded-lg text-sm font-medium transition-colors ${
                  item.day
                    ? selectedDate === item.day
                      ? "bg-primary-500 text-white"
                      : "hover:bg-primary-50 text-primary-500"
                    : "opacity-0 cursor-default"
                }`}
              >
                {item.day && (
                  <>
                    <span>{item.day}</span>
                    {item.hasEvent && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          selectedDate === item.day
                            ? "bg-white"
                            : "bg-primary-500"
                        }`}
                      />
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Events */}
        <div>
          <h2 className="text-lg font-bold text-primary-500 mb-4">
            {t("eventsForDay")} {selectedDate}
          </h2>
          {todaysEvents.length > 0 ? (
            <div className="space-y-3">
              {todaysEvents.map((event) => (
                <div
                  key={event.id}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-primary-500">
                        {t(event.titleKey)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {t(event.cropKey)}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-secondary-500" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-gray-500">{t("noEvents")}</p>
            </div>
          )}
        </div>

        {/* Alerts */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={24} className="text-red-500" />
            <h2 className="text-lg font-bold text-primary-500">
              {t("activeAlerts")}
            </h2>
          </div>
          <div className="space-y-3">
            {mockAlerts.map((alert) => {
              const styles = getSeverityStyles(alert.severity);
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 ${styles.bg} ${styles.border}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold ${styles.text} flex-1 mr-3`}>
                      {t(alert.titleKey)}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold text-white ${styles.badge}`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    {t(alert.descriptionKey)}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {t("validUntilDate")} {alert.validUntil}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="card bg-primary-100 border-2 border-primary-500">
          <h3 className="font-bold text-primary-500 mb-2">{t("didYouKnow")}</h3>
          <p className="text-primary-700 text-sm">{t("didYouKnowText")}</p>
        </div>
      </div>
    </div>
  );
}
