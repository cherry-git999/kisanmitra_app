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
  image: string | null;
  excerpt: string;
  author: string | null;
  date: string | null;
  category: string | null;
  link: string;
}

interface PestCategory {
  name: string;
  slug: string;
  url: string;
  image: string | null;
  pests: PestItem[];
}

interface PestDetail {
  id: string;
  title: string;
  images: string[];
  causedBy: string;
  problemCategory: string;
  symptoms: string;
  comments: string;
  management: string;
  control: string;
  sku: string;
  category: string | null;
  url: string;
}

interface PestItem {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  excerpt: string;
  price: string | null;
  url: string;
  detail: PestDetail | null;
}

interface PestScopeProps {
  onBack: () => void;
  isActive?: boolean;
}

export default function PestScope({ onBack, isActive }: PestScopeProps) {
  const [advisories, setAdvisories] = useState<PestAdvisory[]>([]);
  const [categories, setCategories] = useState<PestCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PestCategory | null>(null);
  const [selectedPest, setSelectedPest] = useState<PestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isActive]);

  useEffect(() => {
    loadPestData();
    fetchAdvisories();
  }, []);

  const loadPestData = async () => {
    setDataLoading(true);
    try {
      const response = await fetch('/data/pest-data.json');
      const data = await response.json();
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error loading pest data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleCategoryClick = (e: React.MouseEvent, category: PestCategory) => {
    e.preventDefault();
    setSelectedCategory(category);
    setSelectedPest(null);
  };

  const handlePestClick = (e: React.MouseEvent, pest: PestItem) => {
    e.preventDefault();
    setSelectedPest(pest);
  };

  const fetchAdvisories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/pest-scope');
      const data = await response.json();

      if (data.success && data.data) {
        setAdvisories(data.data);
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

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedPest(null);
  };

  const handleBackToPests = () => {
    setSelectedPest(null);
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
            <h1 className="text-2xl sm:text-3xl font-bold">PestoScope</h1>
          </div>
          <p className="text-emerald-100 text-sm sm:text-base">
            Advanced pest detection and management solutions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Show Categories, Pests, or Pest Details */}
        {selectedPest && selectedPest.detail ? (
          /* Individual Pest Detail Section */
          <div className="mb-6">
            <button
              onClick={handleBackToPests}
              className="flex items-center gap-2 mb-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft size={20} />
              <span>Back to {selectedCategory?.name}</span>
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedPest.detail.title}
            </h2>

            {/* Images Gallery */}
            {selectedPest.detail.images.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedPest.detail.images.map((image, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-md">
                      <img
                        src={image}
                        alt={`${selectedPest.detail!.title} - Image ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Content */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 space-y-4">
              {selectedPest.detail.causedBy && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Caused by:</h3>
                  <p className="text-gray-700 text-sm">{selectedPest.detail.causedBy}</p>
                </div>
              )}

              {selectedPest.detail.problemCategory && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Problem Category:</h3>
                  <p className="text-gray-700 text-sm">{selectedPest.detail.problemCategory}</p>
                </div>
              )}

              {selectedPest.detail.symptoms && (
                <div>
                  <h3 className="font-bold text-red-900 mb-1 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Symptoms:
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedPest.detail.symptoms}</p>
                </div>
              )}

              {selectedPest.detail.comments && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Comments:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedPest.detail.comments}</p>
                </div>
              )}

              {selectedPest.detail.management && (
                <div>
                  <h3 className="font-bold text-green-900 mb-1 flex items-center gap-2">
                    <Bug size={16} />
                    Management:
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedPest.detail.management}</p>
                </div>
              )}

              {selectedPest.detail.control && (
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Control:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedPest.detail.control}</p>
                </div>
              )}

              {selectedPest.detail.sku && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">SKU:</h3>
                  <p className="text-gray-700 text-sm">{selectedPest.detail.sku}</p>
                </div>
              )}

              {selectedPest.detail.category && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Category:</h3>
                  <p className="text-gray-700 text-sm">{selectedPest.detail.category}</p>
                </div>
              )}
            </div>
          </div>
        ) : !selectedCategory ? (
          /* Categories Section */
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bug size={20} className="text-emerald-600" />
              Crop Categories
            </h2>
            
            {dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={32} className="text-emerald-600 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={(e) => handleCategoryClick(e, category)}
                    className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-emerald-400 text-left"
                  >
                    {/* Image */}
                    {category.image ? (
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                        <Bug size={40} className="text-emerald-600" />
                      </div>
                    )}
                    
                    {/* Category Name */}
                    <div className="p-2 bg-white">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 text-center group-hover:text-emerald-600 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-all duration-200 pointer-events-none" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Pest Details Section */
          <div className="mb-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 mb-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft size={20} />
              <span>Back to Categories</span>
            </button>
            
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bug size={20} className="text-emerald-600" />
              {selectedCategory.name} - Pests & Diseases
            </h2>
            
            {selectedCategory.pests.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedCategory.pests.map((pest) => (
                  <button
                    key={pest.id}
                    onClick={(e) => handlePestClick(e, pest)}
                    className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-emerald-400 text-left"
                  >
                    {/* Image */}
                    {pest.image ? (
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={pest.image}
                          alt={pest.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                        <Bug size={40} className="text-red-600" />
                      </div>
                    )}
                    
                    {/* Pest Info */}
                    <div className="p-2 bg-white">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {pest.title}
                      </h3>
                      {pest.excerpt && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {pest.excerpt}
                        </p>
                      )}
                    </div>
                    
                    {/* External Link Icon */}
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
                      <ExternalLink size={14} className="text-emerald-600" />
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-all duration-200 pointer-events-none" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <Bug size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No Pests Found</h3>
                <p className="text-gray-600 text-sm">
                  No pest information available for this crop yet.
                </p>
              </div>
            )}
          </div>
        )}

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
              <Microscope size={20} /> About PestoScope
            </h3>
            <p className="text-emerald-900 text-sm leading-relaxed">
              PestoScope provides comprehensive pest management information from Pestoscope, 
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
