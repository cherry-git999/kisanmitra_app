import React, { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Loader2,
  AlertCircle,
  Microscope,
  RefreshCw,
  Bug,
  User,
} from "lucide-react";

interface PestAdvisory {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  link: string;
  category: string;
  author?: string;
}

interface PestScopeProps {
  onBack: () => void;
  isActive?: boolean;
}

export default function PestScope({ onBack, isActive }: PestScopeProps) {
  const [advisories, setAdvisories] = useState<PestAdvisory[]>([]);
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
      const response = await fetch('/api/pest-scope');
      const data = await response.json();

      if (data.success) {
        setAdvisories(data.advisories);
      } else {
        setError('Failed to load pest advisories');
      }
    } catch (err) {
      setError('Unable to fetch data. Please try again later.');
      console.error('Error fetching pest advisories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAdvisories();
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-lime-600 text-white px-4 pt-12 pb-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Microscope size={32} />
            <h1 className="text-2xl sm:text-3xl font-bold">Pest Scope</h1>
          </div>
          <p className="text-emerald-100 text-sm sm:text-base">
            Advanced pest detection and management solutions
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
            <p className="text-gray-600">Loading pest advisories...</p>
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
              Recent Pest Advisories ({advisories.length})
            </h2>
            
            {advisories.map((advisory) => (
              <a
                key={advisory.id}
                href={advisory.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 border-l-4 border-emerald-500"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-primary-800 text-base leading-tight flex-1">
                    {advisory.title}
                  </h3>
                  <ExternalLink size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {advisory.date && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar size={14} />
                      <span>{advisory.date}</span>
                    </div>
                  )}
                  {advisory.author && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User size={14} />
                      <span>{advisory.author}</span>
                    </div>
                  )}
                </div>

                {advisory.category && (
                  <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                    <Bug size={12} className="inline mr-1" />
                    {advisory.category}
                  </div>
                )}

                {advisory.excerpt && (
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {advisory.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm mt-3">
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
            <Microscope size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No Advisories Found</h3>
            <p className="text-gray-600 text-sm mb-4">
              We couldn't find any pest advisories at the moment.
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
          <div className="mt-6 bg-gradient-to-r from-emerald-100 via-green-50 to-lime-100 rounded-xl p-4 border-2 border-emerald-300">
            <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <Microscope size={20} /> About Pest Scope
            </h3>
            <p className="text-emerald-900 text-sm leading-relaxed">
              Pest Scope provides comprehensive pest management information from Pestoscope, 
              including pest identification, non-pesticidal management techniques, organic pest 
              control methods, and sustainable pest management practices. Click on any advisory 
              to learn more about protecting your crops naturally.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
