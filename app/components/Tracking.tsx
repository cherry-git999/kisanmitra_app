import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Star, Calendar, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n';

const mockLogs = [
  {
    id: 1,
    date: '2025-08-28',
    solution: 'logNeemOilPestControl',
    outcome: 'logNeemOilPestControlOutcome',
    rating: 5,
    crop: 'cropTomato',
  },
  {
    id: 2,
    date: '2025-09-20',
    solution: 'logCompostTeaApplication',
    outcome: 'logCompostTeaApplicationOutcome',
    rating: 4,
    crop: 'cropMixedVegetables',
  },
  {
    id: 3,
    date: '2025-10-11',
    solution: 'logCompanionPlanting',
    outcome: 'logCompanionPlantingOutcome',
    rating: 5,
    crop: 'cropOkra',
  },
];

export default function Tracking() {
  const { t, language } = useI18n();
  const [logs, setLogs] = useState(mockLogs);
  const [showNewLog, setShowNewLog] = useState(false);
  const [newLog, setNewLog] = useState({
    solution: '',
    outcome: '',
    rating: 0,
    crop: '',
  });

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleSaveLog = () => {
    if (newLog.solution && newLog.outcome && newLog.rating > 0) {
      const log = {
        id: logs.length + 1,
        date: new Date().toISOString().split('T')[0],
        solution: newLog.solution,
        outcome: newLog.outcome,
        rating: newLog.rating,
        crop: newLog.crop || 'Not specified',
      };
      setLogs([log, ...logs]);
      setNewLog({ solution: '', outcome: '', rating: 0, crop: '' });
      setShowNewLog(false);
    }
  };

  const renderStars = (rating: number, onPress?: (star: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onPress && onPress(star)}
            disabled={!onPress}
            className={onPress ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              size={20}
              className={`${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getEffectivenessLabel = (rating: number) => {
    if (rating >= 4) return { label: t('effectivenessHigh'), color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
    if (rating >= 3) return { label: t('effectivenessModerate'), color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertCircle };
    return { label: t('effectivenessLow'), color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle };
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
            <h1 className="text-xl font-bold">{t('newLogEntry')}</h1>
            <button
              onClick={handleSaveLog}
              disabled={!newLog.solution || !newLog.outcome || newLog.rating === 0}
              className={`font-bold ${
                newLog.solution && newLog.outcome && newLog.rating > 0
                  ? 'text-white'
                  : 'text-primary-200'
              }`}
            >
              {t('save')}
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary-500 mb-2">
              {t('solutionUsed')}
            </label>
            <input
              type="text"
              value={newLog.solution}
              onChange={(e) => setNewLog({ ...newLog, solution: e.target.value })}
              placeholder="e.g., Neem Oil Spray"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-500 mb-2">
              {t('cropPlant')}
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
              {t('outcomeResults')}
            </label>
            <textarea
              value={newLog.outcome}
              onChange={(e) => setNewLog({ ...newLog, outcome: e.target.value })}
              placeholder="Describe what happened after applying this solution..."
              className="input h-32 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-500 mb-2">
              {t('effectivenessRating')}
            </label>
            {renderStars(newLog.rating, (star) => setNewLog({ ...newLog, rating: star }))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-primary-500 text-white px-4 pt-12 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('mySuccessLogs')}</h1>
        <p className="text-primary-100 text-sm sm:text-base">
          {t('trackBest')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="card">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-500">{logs.length}</div>
              <div className="text-sm text-gray-600">{t('totalLogs')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-500">
                {(logs.reduce((sum, log) => sum + log.rating, 0) / logs.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">{t('avgRating')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-500">
                {logs.filter((log) => log.rating >= 4).length}
              </div>
              <div className="text-sm text-gray-600">{t('successful')}</div>
            </div>
          </div>
        </div>

        {/* Add New Log Button */}
        <button
          onClick={() => setShowNewLog(true)}
          className="btn-primary w-full"
        >
          <Plus size={20} />
          {t('newLogEntry')}
        </button>

        {/* Logs List */}
        <div>
          <h2 className="text-lg font-bold text-primary-500 mb-4">{t('yourLogs')}</h2>
          <div className="space-y-4">
            {logs.map((log) => {
              const effectiveness = getEffectivenessLabel(log.rating);
              const EffectivenessIcon = effectiveness.icon;

              return (
                <div key={log.id} className="card">
                  {/* Log Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>
                        {new Date(log.date).toLocaleDateString(
                          language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </span>
                    </div>
                    <span className="bg-primary-100 text-primary-500 px-2 py-1 rounded text-xs font-semibold">
                      {t(log.crop)}
                    </span>
                  </div>

                  {/* Solution */}
                  <h3 className="text-lg font-bold text-primary-500 mb-2">{t(log.solution)}</h3>

                  {/* Outcome */}
                  <p className="text-gray-700 text-sm mb-4">{t(log.outcome)}</p>

                  {/* Rating and Effectiveness */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('effectiveness')}</p>
                        {renderStars(log.rating)}
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${effectiveness.bg}`}>
                        <EffectivenessIcon size={14} className={effectiveness.color} />
                        <span className={`text-xs font-semibold ${effectiveness.color}`}>
                          {effectiveness.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="card bg-primary-100 border-2 border-primary-500">
          <div className="flex gap-3">
            <ClipboardList size={24} className="text-primary-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-primary-500 mb-2">{t('keepTracking')}</h3>
              <p className="text-primary-700 text-sm">
                {t('regularLoggingHelps')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}