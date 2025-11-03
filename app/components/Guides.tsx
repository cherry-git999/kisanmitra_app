import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import { BookOpen, Play, ChevronRight, WifiOff, ArrowLeft, Search } from 'lucide-react';

const mockGuides = [
  {
    id: 2,
    titleKey: 'panchagavyaTitle',
    categoryKey: 'seedTreatment',
    difficultyKey: 'easy',
    descriptionKey: 'panchagavyaDesc',
    steps: 7,
  },
  {
    id: 1,
    titleKey: 'neemOilTitle',
    categoryKey: 'organicSprays',
    difficultyKey: 'easy',
    descriptionKey: 'neemOilDesc',
    steps: 5,
  },
  {
    id: 6,
    titleKey: 'beejamruthaTitle',
    categoryKey: 'seedTreatment',
    difficultyKey: 'medium',
    descriptionKey: 'beejamruthaDesc',
    steps: 7,
  },
   {
    id: 7,
    titleKey: 'trichodermaTitle',
    categoryKey: 'seedTreatment',
    difficultyKey: 'medium',
    descriptionKey: 'trichodermaDesc',
    steps: 7,
  },
  {
    id: 5,
    titleKey: 'garlicChilliTitle',
    categoryKey: 'organicSprays',
    difficultyKey: 'medium',
    descriptionKey: 'garlicChilliDesc',
    steps: 5,
  },
  {
    id: 8,
    titleKey: 'cropRotationTitle',
    categoryKey: 'soilTreatment',
    difficultyKey: 'easy',
    descriptionKey: 'cropRotationDesc',
    steps: 4,
  },
  {
    id: 3,
    titleKey: 'manureTitle',
    categoryKey: 'soilTreatment',
    difficultyKey: 'easy',
    descriptionKey: 'manureDesc',
    steps: 4,
  },
  {
    id: 9,
    titleKey: 'compostTitle',
    categoryKey: 'soilTreatment',
    difficultyKey: 'easy',
    descriptionKey: 'compostDesc',
    steps: 4,
  },
  {
    id: 4,
    titleKey: 'garlicChilliTitle',
    categoryKey: 'organicSprays',
    difficultyKey: 'medium',
    descriptionKey: 'garlicChilliDesc',
    steps: 5,
  },
];

const mockGuideDetails = {
  titleKey: 'panchagavyaTitle',
  descriptionKey: 'neemOilDesc',
  steps: [
    {
      number: 1,
      titleKey: 'ingredientsLabel',
      descriptionKey: 'ingredientsDescription',
      videoUrl: 'https://res.cloudinary.com/dzhicz6yl/video/upload/v1759858376/clip_1_bfpsn8.mp4', 
      hasAudio: true,
    },
    {
      number: 2,
      titleKey: 'preparationLabel',
      descriptionKey: 'preparationDescription1',
      videoUrl: 'https://res.cloudinary.com/dzhicz6yl/video/upload/v1759858384/clip_2_bcgthl.mp4',
      hasAudio: true,
    },
    {
      number: 3,
      titleKey: 'preparationLabel',
      descriptionKey: 'preparationDescription2',
      videoUrl: 'https://res.cloudinary.com/dzhicz6yl/video/upload/v1759858386/clip_3_wgxsyv.mp4',
      hasAudio: true,
    },
    {
      number: 4,
      titleKey: 'preparationLabel',
      descriptionKey: 'preparationDescription3',
      videoUrl: 'https://res.cloudinary.com/dzhicz6yl/video/upload/v1759858387/clip_4_tad7ex.mp4',
      hasAudio: true,
    },
    {
      number: 5,
      titleKey: 'applicationLabel',
      descriptionKey: 'applicationDescription',
      videoUrl: 'https://res.cloudinary.com/dzhicz6yl/video/upload/v1759858390/clip_5_owu8jp.mp4',
      hasAudio: true,
    },
  ],
};

export default function Guides() {
  const { t } = useI18n();
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const categories = ['All', 'organicSprays', 'seedTreatment', 'soilTreatment', 'harvesting'];

  const handlePlayAudio = (stepNumber: number) => {
    setPlayingAudio(playingAudio === stepNumber ? null : stepNumber);
  };

  const filteredGuides = mockGuides.filter((guide) => {
    const guideTitle = t(guide.titleKey).toLowerCase();
    const guideDesc = t(guide.descriptionKey).toLowerCase();
    const matchesCategory = selectedCategory === 'All' || guide.categoryKey === selectedCategory;
    const matchesSearch =
      guideTitle.includes(searchQuery.toLowerCase()) ||
      guideDesc.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-primary-50">
        {/* Header */}
        <div className="bg-primary-500 text-white px-4 pt-12 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedGuide(null)}
              className="flex items-center gap-2 text-primary-100 hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>{t('back')}</span>
            </button>
            <div className="flex items-center gap-2 bg-primary-100 text-primary-500 px-3 py-1 rounded-full text-sm font-semibold">
              <WifiOff size={14} />
              <span>{t('availableOffline')}</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Guide Title */}
          <div className="card m-4">
            <h1 className="text-2xl font-bold text-primary-500 mb-2">{t(mockGuideDetails.titleKey)}</h1>
             <p className="text-gray-600 mb-4">{t('panchagavyaDesc')}</p>
            <div className="flex items-center gap-4 text-sm text-secondary-500">
              <span>{mockGuideDetails.steps.length} {t('stepsSuffix')}</span>
              <span>•</span>
              <span>20 Days</span>
            </div>
          </div>

          {/* Steps */}
          <div className="px-4 space-y-4">
            {mockGuideDetails.steps.map((step) => (
              <div key={step.number} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-primary-500">{t(step.titleKey)}</h3>
                </div>

                <video
                  controls
                  className="w-full h-48 object-cover rounded-lg mb-4"
                >
                  <source src={step.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <p className="text-gray-700 mb-4">{t(step.descriptionKey)}</p>
              </div>
            ))}
          </div>

          {/* Completion Message */}
          <div className="m-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-center font-medium">
              {t('rememberLog')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-primary-500 text-white px-4 pt-12 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('solutionsTitle')}</h1>
        <p className="text-primary-100 text-sm sm:text-base">
          {t('solutionsDesc')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Offline Banner */}
        <div className="bg-primary-100 text-primary-500 px-4 py-3 flex items-center justify-center gap-2">
          <WifiOff size={18} />
          <span className="font-semibold">{t('guidesOffline')}</span>
        </div>

        {/* 🔍 Search Bar */}
        <div className="p-4 pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={18} />
            <input
              type="text"
              placeholder={t('searchGuidesPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-primary-500 mb-3">{t('browseByCategory')}</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-primary-500 border border-gray-200 hover:bg-primary-50'
                }`}
              >
                {category === 'All' ? 'All' : t(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Guides List */}
        <div className="px-4 space-y-3">
          <h2 className="text-lg font-bold text-primary-500 mb-3">{t('popularGuides')}</h2>
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setSelectedGuide(guide.id)}
                className="w-full card hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen size={28} className="text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary-500 mb-1">{t(guide.titleKey)}</h3>
                    <p className="text-gray-600 text-sm mb-2">{t(guide.descriptionKey)}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {t(guide.categoryKey)}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {guide.steps} {t('stepsSuffix')}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          guide.difficultyKey === 'easy'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {t(guide.difficultyKey)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-secondary-500 flex-shrink-0" />
                </div>
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">{t('noGuidesFound')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
