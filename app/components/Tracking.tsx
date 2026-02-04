import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  Calendar,
  X,
} from "lucide-react";
import { useI18n } from "../i18n";

const mockLogs = [
  {
    id: 1,
    date: "2025-08-28",
    solution: "logNeemOilPestControl",
    outcome: "logNeemOilPestControlOutcome",
    crop: "cropTomato",
  },
];

export default function Tracking() {
  const { t, language } = useI18n();
  const [logs, setLogs] = useState(mockLogs);
  const [showNewLog, setShowNewLog] = useState(false);
  const [newLog, setNewLog] = useState({
    solution: "",
    outcome: "",
    crop: "",
  });

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleSaveLog = () => {
    if (newLog.solution && newLog.outcome) {
      const log = {
        id: logs.length + 1,
        date: new Date().toISOString().split("T")[0],
        solution: newLog.solution,
        outcome: newLog.outcome,
        crop: newLog.crop || "Not specified",
      };
      setLogs([log, ...logs]);
      setNewLog({ solution: "", outcome: "", crop: "" });
      setShowNewLog(false);
    }
  };



  if (showNewLog) {
    return (
      <div className="min-h-screen bg-primary-50">
        {/* Header */}
        <div className="bg-primary-500 text-white px-4 pt-12 pb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowNewLog(false)}
              className="text-primary-100 hover:text-white"
            >
              <X size={24} />
            </button>
            <h1 className="text-xl font-bold">{t("newLogEntry")}</h1>
            <button
              onClick={handleSaveLog}
              disabled={
                !newLog.solution || !newLog.outcome
              }
              className={`font-bold ${
                newLog.solution && newLog.outcome
                  ? "text-white"
                  : "text-primary-200"
              }`}
            >
              {t("save")}
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary-500 mb-2">
              {t("solutionUsed")}
            </label>
            <input
              type="text"
              value={newLog.solution}
              onChange={(e) =>
                setNewLog({ ...newLog, solution: e.target.value })
              }
              placeholder="e.g., Neem Oil Spray"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-500 mb-2">
              {t("cropPlant")}
            </label>
            <input
              type="text"
              value={newLog.crop}
              onChange={(e) => setNewLog({ ...newLog, crop: e.target.value })}
              placeholder="e.g., Tomato"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-500 mb-2">
              {t("outcomeResults")}
            </label>
            <textarea
              value={newLog.outcome}
              onChange={(e) =>
                setNewLog({ ...newLog, outcome: e.target.value })
              }
              placeholder="Describe what happened after applying this solution..."
              className="input h-32 resize-none"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-primary-500 text-white px-4 pt-12 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {t("mySuccessLogs")}
        </h1>
        <p className="text-primary-100 text-sm sm:text-base">
          {t("trackBest")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="card">
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500">
                {logs.length}
              </div>
              <div className="text-sm text-gray-600">{t("totalLogs")}</div>
            </div>
          </div>
        </div>

        {/* Add New Log Button */}
        <button
          onClick={() => setShowNewLog(true)}
          className="btn-primary w-full"
        >
          <Plus size={20} />
          {t("newLogEntry")}
        </button>

        {/* Logs List */}
        <div>
          <h2 className="text-lg font-bold text-primary-500 mb-4">
            {t("yourLogs")}
          </h2>
          <div className="space-y-4">
            {logs.map((log, index) => {
              return (
                <div key={log.id} className="card">
                  {/* Log Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>
                        {new Date(log.date).toLocaleDateString(
                          language === "hi"
                            ? "hi-IN"
                            : language === "te"
                              ? "te-IN"
                              : "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                      {/* Sample Badge */}
                      {index === logs.length - 1 && (
                        <span className="bg-secondary-500 text-white px-2 py-0.5 rounded text-xs font-semibold ml-2">
                          Sample
                        </span>
                      )}
                    </div>
                    <span className="bg-primary-100 text-primary-500 px-2 py-1 rounded text-xs font-semibold">
                      {t(log.crop)}
                    </span>
                  </div>

                  {/* Solution */}
                  <h3 className="text-lg font-bold text-primary-500 mb-2">
                    {t(log.solution)}
                  </h3>

                  {/* Outcome */}
                  <p className="text-gray-700 text-sm">{t(log.outcome)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="card bg-primary-100 border-2 border-primary-500">
          <div className="flex gap-3">
            <ClipboardList
              size={24}
              className="text-primary-500 flex-shrink-0"
            />
            <div>
              <h3 className="font-bold text-primary-500 mb-2">
                {t("keepTracking")}
              </h3>
              <p className="text-primary-700 text-sm">
                {t("regularLoggingHelps")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
