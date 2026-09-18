import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Play,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Activity,
  CheckSquare,
} from 'lucide-react';
import { ViewScreen, Worker } from '../../types';
import { ElaboratedDetailsModal } from './ElaboratedDetailsModal';

// High-resolution photography assets
import autonomousCoreImg from '../../assets/images/gallery_autonomous_core_1789682277885.jpg';
import salesResearchImg from '../../assets/images/service_sales_research_1789681967814.jpg';
import fleetLogisticsImg from '../../assets/images/service_fleet_logistics_1789681979057.jpg';
import transitYardImg from '../../assets/images/gallery_transit_yard_1789682291205.jpg';
import complianceAuditImg from '../../assets/images/service_compliance_audit_1789681989445.jpg';
import supportTriageImg from '../../assets/images/service_support_triage_1789682001928.jpg';
import desertCanyonImg from '../../assets/images/desert_canyon_hero_1789681538333.jpg';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  image: string;
  staff: string;
  targetView: ViewScreen;
  viewName: string;
}

const GALLERY_COLLECTION: GalleryItem[] = [
  {
    id: 'core',
    title: 'Autonomous Workforce Core',
    category: 'Mission Control',
    tagline: 'Multi-agent orchestration and deterministic execution pipelines with continuous supervisory checkpoints.',
    image: autonomousCoreImg,
    staff: 'System Orchestrator',
    targetView: 'dashboard',
    viewName: 'Operations Dashboard',
  },
  {
    id: 'sales-research',
    title: 'B2B Sales & Registry Research',
    category: 'Market Intelligence',
    tagline: 'Autonomous registry scanning, ICP qualification, and personalized outreach drafts awaiting sign-off.',
    image: salesResearchImg,
    staff: 'Alex Mercer',
    targetView: 'prospects',
    viewName: 'Approvals Queue',
  },
  {
    id: 'fleet-logistics',
    title: 'Freight Carrier & Lane Logistics',
    category: 'Supply Chain Operations',
    tagline: 'Continuous carrier fleet tracking, lane capacity matching, and real-time transit bottleneck mitigation.',
    image: fleetLogisticsImg,
    staff: 'Jordan Hayes',
    targetView: 'workspace',
    viewName: 'Tasks Console',
  },
  {
    id: 'transit-yard',
    title: 'Carrier Hub Operations & Corridors',
    category: 'Transit Infrastructure',
    tagline: 'Regional highway corridor surveillance, terminal drayage flow, and power unit utilization metrics.',
    image: transitYardImg,
    staff: 'Field Logistics Agent',
    targetView: 'workspace',
    viewName: 'Execution Console',
  },
  {
    id: 'compliance-audit',
    title: 'DOT Filings Census & Safety Audit',
    category: 'Governance & Compliance',
    tagline: 'Automated DOT filings census verification, safety rating validation, and regulatory risk scoring.',
    image: complianceAuditImg,
    staff: 'Morgan Vance',
    targetView: 'activity',
    viewName: 'Audit Stream',
  },
  {
    id: 'customer-ops',
    title: 'Customer Inquiries & Exception Triage',
    category: 'Operational Support',
    tagline: 'Multi-channel customer inquiry triage, verified knowledge retrieval, and supervisor-gated incident resolution.',
    image: supportTriageImg,
    staff: 'Elena Chen',
    targetView: 'dashboard',
    viewName: 'Operations Console',
  },
];

interface LandingViewProps {
  worker: Worker;
  onNavigate: (view: ViewScreen) => void;
  onRunWorker: () => void;
  isLiveAi: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  worker,
  onNavigate,
  onRunWorker,
  isLiveAi,
}) => {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // Auto-advance hero photography gently
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % GALLERY_COLLECTION.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentHero = GALLERY_COLLECTION[activeHeroIndex];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans selection:bg-white selection:text-slate-950 flex flex-col relative">
      {/* 1. MINIMAL FLOATING HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between pointer-events-none">
        {/* Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pointer-events-auto flex items-center gap-3 cursor-pointer bg-slate-950/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/25 transition-all shadow-lg"
        >
          <div className="w-8 h-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white font-editorial leading-none">
              Staff OS
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">
              Workforce OS
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* Learn More Button */}
          <button
            onClick={() => setIsLearnMoreOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-slate-300" />
            <span>Learn More</span>
          </button>

          {/* Explore Platform Button */}
          <div className="relative">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold shadow-lg transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-slate-950" />
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. FULL-SCREEN HERO PHOTOGRAPHIC CANVAS */}
      <section className="relative w-full h-screen min-h-[600px] flex items-end justify-start overflow-hidden">
        {/* Background Full-Screen Image with crossfade effect */}
        {GALLERY_COLLECTION.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeHeroIndex ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-105'
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out scale-100 hover:scale-105"
            />
            {/* Cinematic dark gradients for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/70" />
          </div>
        ))}

        {/* Hero Bottom Minimal Text & Action Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-12 sm:pb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Minimal Typography */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentHero.category.toUpperCase()}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-sans">{currentHero.staff}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-editorial leading-tight">
              {currentHero.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl">
              {currentHero.tagline}
            </p>
          </div>

          {/* Direct Actions & Slider Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* The Two Main Action Buttons */}
            <div className="flex items-center gap-2.5">
              {/* Explore Button */}
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer group"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Learn More Button */}
              <button
                onClick={() => setIsLearnMoreOpen(true)}
                className="px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Learn More</span>
              </button>
            </div>

            {/* Slide Next / Prev Controls */}
            <div className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() =>
                  setActiveHeroIndex(
                    (prev) => (prev - 1 + GALLERY_COLLECTION.length) % GALLERY_COLLECTION.length
                  )
                }
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-[11px] font-mono px-2 text-slate-400">
                {String(activeHeroIndex + 1).padStart(2, '0')}/
                {String(GALLERY_COLLECTION.length).padStart(2, '0')}
              </div>
              <button
                onClick={() =>
                  setActiveHeroIndex((prev) => (prev + 1) % GALLERY_COLLECTION.length)
                }
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Slide Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{
              width: `${((activeHeroIndex + 1) / GALLERY_COLLECTION.length) * 100}%`,
            }}
          />
        </div>
      </section>

      {/* 3. FULL-LENGTH PICTURE GALLERY (CINEMATIC PHOTO STREAM) */}
      <section className="w-full bg-slate-950 px-4 sm:px-8 py-16 sm:py-24 max-w-7xl mx-auto space-y-12">
        {/* Gallery Intro with Limited Text */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
              Visual Archive
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial tracking-tight">
              Enterprise Photographic Gallery
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLearnMoreOpen(true)}
              className="text-xs font-semibold text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Learn More About Architecture
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Picture Gallery Grid: Visual First, Limited Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_COLLECTION.map((item, index) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col justify-end"
            >
              {/* Photo */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Enlarge / Lightbox Trigger */}
                <button
                  onClick={() => setLightboxImage(item)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  title="View full resolution"
                  aria-label="Enlarge image"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Minimal Top-Left Pill */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Minimal Text Container */}
              <div className="p-5 space-y-2 bg-slate-900/90 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-500">PLATE 0{index + 1}</span>
                  <span className="font-semibold text-slate-300">{item.staff}</span>
                </div>

                <h3 className="text-base font-bold text-white font-editorial tracking-tight">
                  {item.title}
                </h3>

                {/* One-Liner Description */}
                <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-2">
                  "{item.tagline}"
                </p>

                {/* Direct Action Link into Platform */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setLightboxImage(item)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Photo
                  </button>

                  <button
                    onClick={() => onNavigate(item.targetView)}
                    className="text-white font-semibold hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Explore in {item.viewName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Single Panoramic Feature Picture Slice */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 min-h-[380px] sm:min-h-[460px] flex items-end p-6 sm:p-12 shadow-2xl">
          <img
            src={desertCanyonImg}
            alt="Staff OS Autonomous Landscape"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SUPERVISED AUTONOMY GUARANTEE</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-bold text-white font-editorial tracking-tight leading-tight">
              Be more human.
              <br />
              <span className="text-slate-300 font-light">Leave repetitive intelligence to Staff OS.</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Autonomous research operates continuously. Every outbound letter requires human sign-off.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Platform Now</span>
              </button>

              <button
                onClick={() => setIsLearnMoreOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>Learn More Details</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="w-full bg-slate-950 border-t border-white/10 px-4 sm:px-8 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white text-slate-950 flex items-center justify-center font-bold text-[10px]">
              S
            </div>
            <span className="text-slate-300 font-semibold">Staff OS</span>
            <span>• Full-Length Picture Gallery</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsLearnMoreOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Learn More
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Explore Dashboard
            </button>
            <button
              onClick={() => onNavigate('workspace')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Tasks Console
            </button>
            <button
              onClick={() => onNavigate('prospects')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Approvals Queue (6)
            </button>
          </div>
        </div>
      </footer>

      {/* 5. LIGHTBOX / FULL-RESOLUTION VIEWER */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close photo"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/20 bg-slate-900 shadow-2xl flex flex-col"
          >
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[65vh] object-contain bg-black"
            />
            <div className="p-6 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase">
                  {lightboxImage.category} • {lightboxImage.staff}
                </div>
                <h4 className="text-xl font-bold text-white font-editorial">
                  {lightboxImage.title}
                </h4>
                <p className="text-xs text-slate-400 max-w-xl">
                  "{lightboxImage.tagline}"
                </p>
              </div>

              <button
                onClick={() => {
                  setLightboxImage(null);
                  onNavigate(lightboxImage.targetView);
                }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Explore in {lightboxImage.viewName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ELABORATED DETAILS MODAL ("LEARN MORE") */}
      <ElaboratedDetailsModal
        isOpen={isLearnMoreOpen}
        onClose={() => setIsLearnMoreOpen(false)}
        worker={worker}
        onNavigate={onNavigate}
        onRunWorker={onRunWorker}
      />
    </div>
  );
};
