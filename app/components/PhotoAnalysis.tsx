import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  Leaf,
  Upload,
  ChevronDown,
  ChevronUp,
  Volume2,
  Pause,
  Play,
} from "lucide-react";
import { useI18n, languageToLocale } from "../i18n";

export default function PhotoAnalysis() {
  const { t, language } = useI18n();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [ttsStatus, setTtsStatus] = useState<"idle" | "playing" | "paused">(
    "idle"
  );
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // ---- CAMERA CONTROL ----
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      setShowCamera(true);
    } catch (err) {
      console.error("Camera access failed", err);
      fileInputRef.current?.click();
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    setCapturedImage(imageDataUrl);
    stopCamera();
    analyzeImage(imageDataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = ev.target?.result as string;
      setCapturedImage(img);
      analyzeImage(img);
    };
    reader.readAsDataURL(file);
  };

  // ---- SMART ANALYSIS SIMULATION ----
  const analyzeImage = (image: string) => {
    setAnalyzing(true);
    setTimeout(() => {
      const result = {
        title: t('smartDiagnosisTitle'),
        crop: t('ricePaddy'),
        disease: t('riceBlast'),
        commonName: t('riceBlastLeafBlast'),
        scientificName: t('magnaportheOryzae'),
        symptoms: [
          t('diamondSpindleShapedGraySpots'),
          t('severeInfectionLeadsDrying'),
          t('neckBlastAppearsPanicle'),
        ],
        spread: t('airborneSporesRainSplash'),
        organicSolutions: [
          {
            name: t('neemOilSpray'),
            content: `${t('ingredientsNeemOilSpray')}
${t('preparationNeemOilSpray')}
${t('preparationNeemOilSpray2')}
${t('preparationNeemOilSpray3')}
${t('preparationNeemOilSpray4')}
${t('preparationNeemOilSpray5')}
${t('applicationNeemOilSpray')}`,
          },
        ],
        traditionalSolutions: [
          {
            name: t('tulsiAndBael'),
            content: t('whenSprayedInfectedFields'),
          },
          {
            name: t('cowsUrine'),
            content: t('soakingPaddySeedsDiluted'),
          },
        ],
        causes: [
          t('highHumidityFrequentRain'),
          t('humidity90AboveWetLeaves'),
          t('temperature25To28Optimal'),
          t('weatherCloudySkiesFrequent'),
          t('soilFertilityHighNitrogen'),
        ],
        preventiveMeasures: [
          t('removeCropResiduesWeeds'),
          t('properWaterManagement'),
          t('ensureSpacingAirCirculation'),
          t('timelySowingAvoidDisease'),
          t('applyNeemTrichodermaSprays'),
          t('regularMonitoringRemoveInfected'),
        ],
      };
      setAnalysisResult(result);
      setAnalyzing(false);
    }, 1500);
  };

  const retakePhoto = () => {
    window.speechSynthesis.cancel();
    setTtsStatus("idle");
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // ---- MOBILE-FRIENDLY TTS FIX ----
  const toggleTTS = () => {
    if (!analysisResult) return;
    const synth = window.speechSynthesis;

    // Cancel existing speech to avoid overlapping
    if (ttsStatus === "idle") {
      synth.cancel();
    }

    if (ttsStatus === "playing") {
      synth.pause();
      setTtsStatus("paused");
      return;
    }

    if (ttsStatus === "paused") {
      // Some mobile browsers require a fresh utterance to resume reliably
      if (utterRef.current) {
        synth.cancel(); // stop previous utterance
        const text = utterRef.current.text;
        const newUtter = new SpeechSynthesisUtterance(text);
        newUtter.lang = languageToLocale(language as any);
        newUtter.rate = 0.8;
        newUtter.pitch = 1;
        newUtter.onstart = () => setTtsStatus("playing");
        newUtter.onend = () => setTtsStatus("idle");
        newUtter.onerror = () => setTtsStatus("idle");
        utterRef.current = newUtter;
        synth.speak(newUtter);
      }
      return;
    }

    // Idle state: start fresh
    const text = `${t('cropLabel')}: ${analysisResult.crop}. ${t('diseaseLabel')}: ${analysisResult.disease}. ${t('commonNameLabel')}: ${analysisResult.commonName}. ${t('scientificNameLabel')}: ${analysisResult.scientificName}. ${t('symptomsTitle')}: ${analysisResult.symptoms.join(". ")}. ${t('organicSolutionsTitle')}: ${analysisResult.organicSolutions.map((o: any) => o.name + ": " + o.content.substring(0, 200) + "...").join(". ")}. ${t('traditionalSolutionsTitle')}: ${analysisResult.traditionalSolutions.map((ti: any) => ti.name + ": " + ti.content).join(". ")}. ${t('causesTitle')}: ${analysisResult.causes.join(". ")}. ${t('preventiveMeasuresTitle')}: ${analysisResult.preventiveMeasures.join(". ")}.`;

    const utter = new SpeechSynthesisUtterance(text);
    
    // Enhanced voice selection for Telugu
    if (language === 'te') {
      // Wait for voices to load if not available
      const setTeluguVoice = () => {
        const voices = synth.getVoices();
        const teluguVoice = voices.find(voice => 
          voice.lang === 'te-IN' || 
          voice.lang === 'te' ||
          voice.name.toLowerCase().includes('telugu') ||
          voice.name.toLowerCase().includes('india')
        );
        
        if (teluguVoice) {
          utter.voice = teluguVoice;
          utter.lang = teluguVoice.lang;
        } else {
          // Fallback to Hindi or English Indian voice
          const hindiVoice = voices.find(voice => 
            voice.lang === 'hi-IN' || 
            voice.name.toLowerCase().includes('hindi')
          );
          if (hindiVoice) {
            utter.voice = hindiVoice;
            utter.lang = 'hi-IN';
          } else {
            utter.lang = 'en-IN'; // Indian English as last resort
          }
        }
      };
      
      if (synth.getVoices().length === 0) {
        synth.onvoiceschanged = setTeluguVoice;
      } else {
        setTeluguVoice();
      }
    } else {
      utter.lang = languageToLocale(language as any);
    }
    
    utter.rate = 0.8;
    utter.pitch = 1;
    utter.onstart = () => setTtsStatus("playing");
    utter.onend = () => setTtsStatus("idle");
    utter.onerror = (event) => {
      console.log('TTS Error:', event.error, 'Language:', language);
      setTtsStatus("idle");
    };

    utterRef.current = utter;
    synth.speak(utter);
  };

  // ---- CAMERA VIEW ----
  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 flex flex-col">
          <div className="flex justify-between items-center p-4 pt-12">
            <button
              onClick={stopCamera}
              className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center"
            >
              <X size={24} color="white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 px-6 py-3 rounded-full">
              <p className="text-white text-center">{t('alignCenter')}</p>
            </div>
          </div>
          <div className="pb-8 flex justify-center">
            <button
              onClick={takePicture}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white border-opacity-50 active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- LOADING VIEW ----
  if (capturedImage && analyzing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        <img
          src={capturedImage}
          alt="Captured"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <div className="text-center">
            <Leaf
              size={50}
              className="text-green-600 mx-auto mb-4 animate-pulse"
            />
            <h2 className="text-2xl font-semibold text-green-700">
              {t('analyzingYourCrop')}
            </h2>
            <p className="text-gray-600">{t('pleaseWait')}</p>
          </div>
        </div>
      </div>
    );
  }

  // ---- ANALYSIS RESULT VIEW ----
  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Crop Image */}
          <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-lg hover:scale-[1.01] transition-transform">
            <img
              src={capturedImage!}
              alt="Analyzed"
              className="w-full h-64 object-contain bg-gray-100"
            />
            <button
              onClick={retakePhoto}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Voice Button below image */}
          <div className="flex justify-center mt-3">
            <button
              onClick={toggleTTS}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700 transition"
            >
              {ttsStatus === "playing" ? (
                <>
                  <Pause size={18} /> {t('pause')}
                </>
              ) : ttsStatus === "paused" ? (
                <>
                  <Play size={18} /> {t('resume')}
                </>
              ) : (
                <>
                  <Volume2 size={18} /> {t('listen')}
                </>
              )}
            </button>
          </div>

          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold text-green-700">
              🌾 {analysisResult.title}
            </h2>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-2">
              <p>
                <strong>{t('cropLabel')}:</strong> {analysisResult.crop}
              </p>
              <p>
                <strong>{t('diseaseLabel')}:</strong> {analysisResult.disease}
              </p>
              <p>
                <strong>{t('commonNameLabel')}:</strong> {analysisResult.commonName}
              </p>
              <p>
                <strong>{t('scientificNameLabel')}:</strong> {analysisResult.scientificName}
              </p>
            </div>

            {/* Collapsible sections */}
            {[
              { key: "symptoms", title: t('symptomsTitle'), content: analysisResult.symptoms },
              { key: "spread", title: t('modeOfSpreadTitle'), content: [analysisResult.spread] },
              { key: "organicSolutions", title: t('organicSolutionsTitle'), content: analysisResult.organicSolutions },
              { key: "traditionalSolutions", title: t('traditionalSolutionsTitle'), content: analysisResult.traditionalSolutions },
              { key: "causes", title: t('causesTitle'), content: analysisResult.causes },
              { key: "preventiveMeasures", title: t('preventiveMeasuresTitle'), content: analysisResult.preventiveMeasures },
            ].map((section) => (
              <div
                key={section.key}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
              >
                <button
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-green-700 hover:bg-green-50 transition"
                  onClick={() => toggleSection(section.key)}
                >
                  {section.title}
                  {openSection === section.key ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {openSection === section.key && (
                  <div className="px-5 pb-4 text-gray-700 text-sm space-y-2 animate-fadeIn">
                    {section.key === "organicSolutions" ||
                    section.key === "traditionalSolutions"
                      ? section.content.map((item: any, i: number) => (
                          <div key={i} className="mt-2">
                            <p className="font-semibold text-green-600">
                              {i + 1}. {item.name}
                            </p>
                            <p
                              className="whitespace-pre-line mt-1"
                              dangerouslySetInnerHTML={{
                                __html: item.content
                                  .replace(
                                    /(Ingredients:)/g,
                                    `<span class="font-semibold text-green-600">${t('ingredientsLabel')}:</span>`
                                  )
                                  .replace(
                                    /(Preparation:)/g,
                                    `<span class="font-semibold text-green-600">${t('preparationLabel')}:</span>`
                                  )
                                  .replace(
                                    /(Application:)/g,
                                    `<span class="font-semibold text-green-600">${t('applicationLabel')}:</span>`
                                  ),
                              }}
                            />
                          </div>
                        ))
                      : section.content.map((item: string, i: number) => (
                          <p key={i}>• {item}</p>
                        ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- DEFAULT HOME ----
  return (
      <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white px-6 pt-14 pb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('aiPhotoCropAnalysis')}</h1>
        <p className="text-green-100">
          {t('captureOrUpload')}
        </p>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        <div className="text-center">
          <Leaf size={120} className="text-green-500 mx-auto opacity-80" />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-green-700 mb-4">
            {t('howItWorks')}
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>{t('step1')}</li>
            <li>{t('step2')}</li>
            <li>{t('step3')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={startCamera}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <Camera size={22} /> {t('openCamera')}
          </button>

          <div className="text-center text-gray-500">{t('or')}</div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <Upload size={22} /> {t('uploadPhoto')}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
