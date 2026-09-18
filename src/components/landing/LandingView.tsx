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

interface StaffItem {
  id: string;
  name: string;
  role: string;
  category: string;
  description: string;
  image: string;
  targetView: ViewScreen;
  viewName: string;
  ctaText: string;
}

const STAFF_WORKFORCE: StaffItem[] = [
  {
    id: 'core',
    name: 'Your Digital Workforce',
    role: 'Operations Coordination',
    category: 'Workforce Core',
    description:
      'Staff OS lets businesses assign goals to AI staff that can research, analyze, execute multi-step tasks and bring important decisions back to a human.',
    image: autonomousCoreImg,
    targetView: 'dashboard',
    viewName: 'Operations Dashboard',
    ctaText: 'Explore in Operations Dashboard',
  },
  {
    id: 'sales-research',
    name: 'Alex Mercer',
    role: 'Sales Research Staff',
    category: 'Market Intelligence',
    description:
      'Finds potential customers, researches companies, qualifies prospects and prepares personalized outreach for your approval.',
    image: salesResearchImg,
    targetView: 'prospects',
    viewName: 'Approvals Queue',
    ctaText: 'Explore in Approvals Queue',
  },
  {
    id: 'fleet-logistics',
    name: 'Jordan Hayes',
    role: 'Freight & Carrier Staff',
    category: 'Logistics Operations',
    description:
      'Matches carriers, routes and available capacity to freight requirements.',
    image: fleetLogisticsImg,
    targetView: 'workspace',
    viewName: 'Tasks Console',
    ctaText: 'Explore in Tasks Console',
  },
  {
    id: 'transit-yard',
    name: 'Field Logistics Staff',
    role: 'Carrier Hub Operations',
    category: 'Terminal Operations',
    description:
      'Monitors regional carrier activity, terminal operations and fleet utilization.',
    image: transitYardImg,
    targetView: 'workspace',
    viewName: 'Execution Console',
    ctaText: 'Explore in Execution Console',
  },
  {
    id: 'compliance-audit',
    name: 'Morgan Vance',
    role: 'Compliance Staff',
    category: 'Regulatory Governance',
    description:
      'Reviews filings, checks safety information and flags potential compliance risks.',
    image: complianceAuditImg,
    targetView: 'activity',
    viewName: 'Audit Stream',
    ctaText: 'Explore in Audit Stream',
  },
  {
    id: 'customer-ops',
    name: 'Elena Chen',
    role: 'Customer Support Staff',
    category: 'Support Operations',
    description:
      'Triages customer inquiries, retrieves verified information and brings important incidents to a supervisor.',
    image: supportTriageImg,
    targetView: 'dashboard',
    viewName: 'Operations Console',
    ctaText: 'Explore in Operations Console',
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
  const [lightboxStaff, setLightboxStaff] = useState<StaffItem | null>(null);

  // Auto-advance hero background gently
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % STAFF_WORKFORCE.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentHero = STAFF_WORKFORCE[activeHeroIndex];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans selection:bg-white selection:text-slate-950 flex flex-col relative">
      {/* 1. MINIMAL EDITORIAL HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between pointer-events-none">
        {/* Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pointer-events-auto flex items-center gap-3 cursor-pointer bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/25 transition-all shadow-xl"
        >
          <div className="w-8 h-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white font-editorial leading-none">
              STAFF OS
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">
              Workforce OS
            </div>
          </div>
        </div>

        {/* Minimal Navigation & Actions */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-4">
          <nav className="hidden md:flex items-center gap-6 px-4 py-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300">
            <a href="#staff" className="hover:text-white transition-colors">
              Staff
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <button
              onClick={() => setIsLearnMoreOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Learn More
            </button>
          </nav>

          {/* Secondary CTA: See how it works */}
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setIsLearnMoreOpen(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">See how it works</span>
            <span className="sm:hidden">Details</span>
          </button>

          {/* Primary CTA: Explore Staff OS */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold shadow-xl transition-all cursor-pointer group"
          >
            <Compass className="w-3.5 h-3.5 text-slate-950" />
            <span>Explore Staff OS</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative w-full h-screen min-h-[640px] flex items-end justify-start overflow-hidden">
        {/* Background Full-Screen Photographic Carousel with crossfade */}
        {STAFF_WORKFORCE.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeHeroIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 pointer-events-none scale-105'
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic dark gradients for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/25" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/80" />
          </div>
        ))}

        {/* Hero Content: Focused & Crystal Clear */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-14 sm:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Brand Descriptor */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>STAFF OS</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-sans">
                {currentHero.name} ({currentHero.role})
              </span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-editorial leading-[1.08]">
              AI staff that
              <br />
              actually work.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl">
              Give your business a goal. Staff OS assigns the work to AI staff who research,
              execute and report back — while you stay in control of important decisions.
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-sm font-semibold shadow-2xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer group"
              >
                <span>Explore Staff OS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setIsLearnMoreOpen(true);
                  }
                }}
                className="px-5 py-3.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-white/20 text-white text-sm font-semibold shadow-2xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>See how it works</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="text-xs text-slate-400 font-mono">
              FEATURED STAFF: <span className="text-white font-sans">{currentHero.name}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md p-1.5 rounded-xl border border-white/15">
              <button
                onClick={() =>
                  setActiveHeroIndex(
                    (prev) => (prev - 1 + STAFF_WORKFORCE.length) % STAFF_WORKFORCE.length
                  )
                }
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Previous Staff Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-[11px] font-mono px-2 text-slate-400">
                {String(activeHeroIndex + 1).padStart(2, '0')}/
                {String(STAFF_WORKFORCE.length).padStart(2, '0')}
              </div>
              <button
                onClick={() =>
                  setActiveHeroIndex((prev) => (prev + 1) % STAFF_WORKFORCE.length)
                }
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Next Staff Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Progress Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{
              width: `${((activeHeroIndex + 1) / STAFF_WORKFORCE.length) * 100}%`,
            }}
          />
        </div>
      </section>

      {/* 3. NEW "HOW STAFF OS WORKS" EDITORIAL SECTION */}
      <section
        id="how-it-works"
        className="w-full bg-slate-950 px-4 sm:px-8 py-20 sm:py-28 border-t border-white/10 max-w-7xl mx-auto space-y-14"
      >
        <div className="space-y-3 max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
            Operational Workflow
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-editorial tracking-tight">
            HOW STAFF OS WORKS
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Staff OS lets businesses assign goals to AI staff that research, execute multi-step
            tasks, and bring important decisions back to a human.
          </p>
        </div>

        {/* 4-Step Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 01 */}
          <div className="space-y-4 border-t border-white/20 pt-6">
            <div className="text-3xl font-light font-mono text-slate-500">01</div>
            <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
              ASSIGN
            </div>
            <h3 className="text-lg font-bold text-white font-editorial">
              Give your staff a goal.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Define target accounts, criteria, or logistics requirements. Your AI staff ingests the
              mission and sets concrete milestones.
            </p>
          </div>

          {/* Step 02 */}
          <div className="space-y-4 border-t border-white/20 pt-6">
            <div className="text-3xl font-light font-mono text-slate-500">02</div>
            <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
              WORK
            </div>
            <h3 className="text-lg font-bold text-white font-editorial">
              Staff OS plans and executes the assignment.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Staff members scan registries, analyze capacity, qualify candidates, and assemble
              custom drafts autonomously.
            </p>
          </div>

          {/* Step 03 */}
          <div className="space-y-4 border-t border-white/20 pt-6">
            <div className="text-3xl font-light font-mono text-slate-500">03</div>
            <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
              REVIEW
            </div>
            <h3 className="text-lg font-bold text-white font-editorial">
              You see the work and approve important actions.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Key actions pause for supervisory review. Inspect research, modify copy, and approve
              or decline with a single click.
            </p>
          </div>

          {/* Step 04 */}
          <div className="space-y-4 border-t border-white/20 pt-6">
            <div className="text-3xl font-light font-mono text-slate-500">04</div>
            <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
              COMPLETE
            </div>
            <h3 className="text-lg font-bold text-white font-editorial">
              Your staff finishes the assignment and records the result.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Finished assignments are recorded in immutable audit logs with verified performance
              metrics and next actions.
            </p>
          </div>
        </div>
      </section>

      {/* 4. MEET THE STAFF (THE STAFF OS WORKFORCE) */}
      <section
        id="staff"
        className="w-full bg-slate-950 px-4 sm:px-8 py-16 sm:py-24 border-t border-white/10 max-w-7xl mx-auto space-y-12"
      >
        {/* Section Intro */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
              Meet The Staff
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-editorial tracking-tight">
              THE STAFF OS WORKFORCE
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLearnMoreOpen(true)}
              className="text-xs font-semibold text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              See how they work
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Staff OS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 Staff Plates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STAFF_WORKFORCE.map((item, index) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col justify-end"
            >
              {/* Photo Plate */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Enlarge / Full View Trigger */}
                <button
                  onClick={() => setLightboxStaff(item)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/75 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  title="View staff plate"
                  aria-label="Enlarge image"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Category Pill */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Staff Description & Details */}
              <div className="p-5 space-y-2.5 bg-slate-900/95 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-500">PLATE 0{index + 1}</span>
                  <span className="font-semibold text-slate-300">{item.role}</span>
                </div>

                <h3 className="text-lg font-bold text-white font-editorial tracking-tight">
                  {item.name}
                </h3>

                {/* Approaching, crystal-clear description */}
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  "{item.description}"
                </p>

                {/* Direct Action Link into Platform */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setLightboxStaff(item)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Staff
                  </button>

                  <button
                    onClick={() => onNavigate(item.targetView)}
                    className="text-white font-semibold hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 5. SUPERVISED AUTONOMY SECTION */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 min-h-[380px] sm:min-h-[440px] flex items-end p-6 sm:p-12 shadow-2xl mt-8">
          <img
            src={desertCanyonImg}
            alt="Supervised Autonomy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SUPERVISED AUTONOMY</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-bold text-white font-editorial tracking-tight leading-tight">
              Be more human.
              <br />
              <span className="text-slate-200 font-light">
                Leave repetitive work to Staff OS.
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-xl">
              Let Staff OS handle the repetitive work. Keep people in control of the important
              decisions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Staff OS</span>
              </button>

              <button
                onClick={() => setIsLearnMoreOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>See how it works</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MINIMAL FOOTER */}
      <footer className="w-full bg-slate-950 border-t border-white/10 px-4 sm:px-8 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white text-slate-950 flex items-center justify-center font-bold text-[10px]">
              S
            </div>
            <span className="text-slate-300 font-semibold">STAFF OS</span>
            <span>• AI staff that actually work.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#staff" className="hover:text-white transition-colors cursor-pointer">
              Staff
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors cursor-pointer">
              How It Works
            </a>
            <button
              onClick={() => setIsLearnMoreOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Learn More
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-white transition-colors cursor-pointer text-slate-300 font-semibold"
            >
              Explore Staff OS
            </button>
          </div>
        </div>
      </footer>

      {/* 7. LIGHTBOX / FULL-RESOLUTION STAFF VIEWER */}
      {lightboxStaff && (
        <div
          onClick={() => setLightboxStaff(null)}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxStaff(null)}
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
              src={lightboxStaff.image}
              alt={lightboxStaff.name}
              referrerPolicy="no-referrer"
              className="w-full max-h-[65vh] object-contain bg-black"
            />
            <div className="p-6 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase">
                  {lightboxStaff.category} • {lightboxStaff.role}
                </div>
                <h4 className="text-xl font-bold text-white font-editorial">
                  {lightboxStaff.name}
                </h4>
                <p className="text-xs text-slate-300 max-w-xl">
                  "{lightboxStaff.description}"
                </p>
              </div>

              <button
                onClick={() => {
                  setLightboxStaff(null);
                  onNavigate(lightboxStaff.targetView);
                }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>{lightboxStaff.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. ELABORATED DETAILS MODAL ("SEE HOW IT WORKS / LEARN MORE") */}
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
