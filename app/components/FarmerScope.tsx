import React, { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Loader2,
  AlertCircle,
  Telescope,
  RefreshCw,
} from "lucide-react";

interface Advisory {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  link: string;
  category: string;
}

interface FarmerScopeProps {
  onBack: () => void;
  isActive?: boolean;
}

export default function FarmerScope({ onBack, isActive }: FarmerScopeProps) {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isActive]);

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const fetchAdvisories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/farmer-scope');
      const data = await response.json();

      if (data.success) {
        setAdvisories(data.advisories);
      } else {
        setError('Failed to load farm advisories');
      }
    } catch (err) {
      setError('Unable to fetch data. Please try again later.');
      console.error('Error fetching advisories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAdvisories();
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 text-white px-4 pt-12 pb-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Telescope size={32} />
            <h1 className="text-2xl sm:text-3xl font-bold">FarmScope</h1>
          </div>
          <p className="text-teal-100 text-sm sm:text-base">
            Farm advisories and insights for sustainable agriculture
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={48} className="text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading farm advisories...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advisories List */}
        {!loading && !error && advisories.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-primary-700 mb-4">
              Recent Farm Advisories ({advisories.length})
            </h2>
            
            {advisories.map((advisory) => (
              <a
                key={advisory.id}
                href={advisory.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 border-l-4 border-teal-500"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-primary-800 text-base leading-tight flex-1">
                    {advisory.title}
                  </h3>
                  <ExternalLink size={18} className="text-teal-600 flex-shrink-0 mt-1" />
                </div>

                {advisory.date && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    <Calendar size={14} />
                    <span>{advisory.date}</span>
                  </div>
                )}

                {advisory.category && (
                  <div className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                    {advisory.category}
                  </div>
                )}

                {advisory.excerpt && (
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {advisory.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 text-teal-600 font-medium text-sm mt-3">
                  <span>Read Full Advisory</span>
                  <ArrowLeft size={16} className="rotate-180" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && advisories.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Telescope size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No Advisories Found</h3>
            <p className="text-gray-600 text-sm mb-4">
              We couldn't find any farm advisories at the moment.
            </p>
            <button
              onClick={handleRefresh}
              className="text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              Refresh to try again
            </button>
          </div>
        )}

        {/* Info Card */}
        {!loading && advisories.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-teal-100 via-emerald-50 to-green-100 rounded-xl p-4 border-2 border-teal-300">
            <h3 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
              <Telescope size={20} /> About Farmer Scope
            </h3>
            <p className="text-teal-900 text-sm leading-relaxed">
              Farmer Scope provides you with the latest farm advisories from Kisan Mitra, 
              including weather forecasts, crop management tips, pest control advice, and 
              sustainable farming practices. Click on any advisory to read the full details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
