import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Building2,
  FileText,
  Activity,
  Sparkles,
} from 'lucide-react';
import { ViewScreen } from '../../types';

// Import the generated high-quality service images
import salesResearchImg from '../../assets/images/service_sales_research_1789681967814.jpg';
import fleetLogisticsImg from '../../assets/images/service_fleet_logistics_1789681979057.jpg';
import complianceAuditImg from '../../assets/images/service_compliance_audit_1789681989445.jpg';
import supportTriageImg from '../../assets/images/service_support_triage_1789682001928.jpg';

interface ServiceSlide {
  id: string;
  title: string;
  category: string;
  oneLiner: string;
  secondaryDetail: string;
  staffName: string;
  staffRole: string;
  image: string;
  badges: string[];
  metrics: { label: string; value: string }[];
  targetView: ViewScreen;
  actionText: string;
}

const SERVICE_SLIDES: ServiceSlide[] = [
  {
    id: 'sales-research',
    title: 'B2B Sales & Market Research',
    category: 'Market Intelligence',
    oneLiner: 'Autonomous B2B registry scans, ICP qualification, and personalized outreach drafts requiring your final sign-off.',
    secondaryDetail: 'Scours federal and state commerce registries to uncover high-fit accounts, identifies safety and operations leaders, and composes contextual drafts tailored to each carrier.',
    staffName: 'Alex Mercer',
    staffRole: 'Sales Research Specialist',
    image: salesResearchImg,
    badges: ['Autonomous Discovery', 'ICP Scoring', 'Supervised Outbound'],
    metrics: [
      { label: 'Carrier Filings Scanned', value: '1,420+' },
      { label: 'Avg. Fit Accuracy', value: '94%' },
      { label: 'Human Review Gate', value: '100% Enforced' },
    ],
    targetView: 'prospects',
    actionText: 'Review Outbound Drafts (6)',
  },
  {
    id: 'fleet-logistics',
    title: 'Freight Carrier & Lane Logistics',
    category: 'Supply Chain Operations',
    oneLiner: 'Continuous carrier fleet tracking, lane capacity matching, and real-time transit bottleneck mitigation.',
    secondaryDetail: 'Monitors key corridors like I-35 and Port of Houston drayage hubs, calculating power unit availability and flagging capacity bottlenecks before service delays occur.',
    staffName: 'Jordan Hayes',
    staffRole: 'Logistics Orchestration Staff',
    image: fleetLogisticsImg,
    badges: ['Corridor Monitoring', 'Power Unit Tracking', 'Drayage Intelligence'],
    metrics: [
      { label: 'Active Corridors', value: '18 Lanes' },
      { label: 'Transit Bottlenecks Mitigated', value: '87%' },
      { label: 'Turnaround Latency', value: '< 2.4 hrs' },
    ],
    targetView: 'workspace',
    actionText: 'Inspect Logistics Tasks',
  },
  {
    id: 'compliance-audit',
    title: 'Regulatory Safety & DOT Filings Audit',
    category: 'Governance & Compliance',
    oneLiner: 'Automated DOT filings census verification, safety rating validation, and regulatory risk scoring before contract dispatch.',
    secondaryDetail: 'Cross-checks motor carrier numbers, insurance certificates, and safety inspection records against federal safety thresholds to ensure complete compliance.',
    staffName: 'Morgan Vance',
    staffRole: 'Compliance Assurance Staff',
    image: complianceAuditImg,
    badges: ['DOT Census Auditing', 'Insurance Validation', 'Safety Verification'],
    metrics: [
      { label: 'Safety Checks Run', value: '3,850+' },
      { label: 'Discrepancy Catch Rate', value: '99.8%' },
      { label: 'Audit Log Integrity', value: 'Immutable' },
    ],
    targetView: 'activity',
    actionText: 'View Audit Log Stream',
  },
  {
    id: 'customer-ops',
    title: 'Customer Inquiries & Exception Triage',
    category: 'Operational Support',
    oneLiner: 'Multi-channel customer inquiry triage, verified knowledge retrieval, and supervisor-gated incident resolution.',
    secondaryDetail: 'Processes inbound shipping inquiries, matches internal operating procedures, and drafts validated resolutions for human sign-off before dispatch.',
    staffName: 'Elena Chen',
    staffRole: 'Inbound Resolution Specialist',
    image: supportTriageImg,
    badges: ['SOP Retrieval', 'Exception Categorization', 'Supervisor Approved'],
    metrics: [
      { label: 'First-Response Draft', value: '< 45s' },
      { label: 'SOP Grounding Rate', value: '100%' },
      { label: 'Escalation Threshold', value: 'Tier 1 & 2' },
    ],
    targetView: 'dashboard',
    actionText: 'Open Operations Dashboard',
  },
];

interface ServicesSlideShowProps {
  onNavigate: (view: ViewScreen) => void;
  onRunWorker: () => void;
}

export const ServicesSlideShow: React.FC<ServicesSlideShowProps> = ({
  onNavigate,
  onRunWorker,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 6500; // 6.5s per slide

  // Go to next slide
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SERVICE_SLIDES.length);
    setProgress(0);
  };

  // Go to previous slide
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SERVICE_SLIDES.length) % SERVICE_SLIDES.length);
    setProgress(0);
  };

  // Select specific slide
  const handleSelect = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Autoplay progression
  useEffect(() => {
    if (!isPlaying) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const intervalStep = 50;
    progressTimerRef.current = setInterval(() => {
      setProgress((old) => {
        const next = old + (intervalStep / SLIDE_DURATION) * 100;
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, intervalStep);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const activeSlide = SERVICE_SLIDES[currentIndex];

  return (
    <section className="w-full bg-slate-950 text-white border-y border-slate-800 py-16 px-4 sm:px-8 relative overflow-hidden">
      {/* Background soft ambient radial light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SPECIALIZED SERVICES IN ACTION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-editorial">
              Enterprise Services Powered by Staff OS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-normal">
              Explore autonomous workforce specializations. Each service operates under strict supervisory guidelines with deterministic checkpoints.
            </p>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Previous Service"
              aria-label="Previous Service"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Next Service"
              aria-label="Next Service"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN PICTURE SLIDE CARD */}
        <div
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden group"
        >
          {/* Progress bar at the top of the card */}
          <div className="w-full h-1 bg-slate-800/80 absolute top-0 left-0 z-30">
            <div
              className="h-full bg-emerald-500 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[500px]">
            {/* Left Col: High-Res Service Photography */}
            <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-full overflow-hidden bg-slate-950">
              <img
                key={activeSlide.id}
                src={activeSlide.image}
                alt={activeSlide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform group-hover:scale-105"
              />
              {/* Subtle gradient overlay to enhance legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/20 lg:to-slate-900" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-semibold text-emerald-300">
                  {activeSlide.category}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-semibold text-slate-200">
                  Staff: {activeSlide.staffName}
                </span>
              </div>

              {/* Overlaid One-Liner Box on Mobile / Lower-Left */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3 rounded-xl lg:hidden">
                <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold mb-1">
                  Service Mission
                </div>
                <div className="text-xs text-white font-medium leading-snug">
                  "{activeSlide.oneLiner}"
                </div>
              </div>
            </div>

            {/* Right Col: Service Details, One-Liner, and Action triggers */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-900 relative z-20">
              <div className="space-y-4">
                {/* Header info */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Service {currentIndex + 1} of {SERVICE_SLIDES.length}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-editorial tracking-tight">
                    {activeSlide.title}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Lead Assigned Staff: <strong className="text-slate-200">{activeSlide.staffName}</strong> ({activeSlide.staffRole})
                  </div>
                </div>

                {/* THE HIGHLIGHTED ONE-LINER DESCRIPTION */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 shadow-inner relative">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-emerald-400 font-semibold mb-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>One-Liner Service Directive</span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                    "{activeSlide.oneLiner}"
                  </p>
                </div>

                {/* Secondary description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {activeSlide.secondaryDetail}
                </p>

                {/* Capability Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeSlide.badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/60"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  {activeSlide.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                      <div className="text-xs sm:text-sm font-bold text-emerald-400 font-editorial">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onNavigate(activeSlide.targetView)}
                  className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{activeSlide.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {activeSlide.id === 'sales-research' && (
                  <button
                    onClick={() => {
                      onNavigate('workspace');
                      onRunWorker();
                    }}
                    className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Run Assignment Live</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Slide Indicators Navigation (Click to jump) */}
          <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {SERVICE_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleSelect(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-emerald-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="hidden sm:inline">
                Hover to pause • Click tabs or arrows to explore services
              </span>
              <span className="font-mono text-slate-200">
                {String(currentIndex + 1).padStart(2, '0')} / {String(SERVICE_SLIDES.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* CONTINUOUS SCROLLING ONE-LINER TICKER TAPE */}
        <div className="relative w-full rounded-xl bg-slate-900 border border-slate-800 py-3 overflow-hidden">
          {/* Edge gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          <div className="flex items-center gap-3 px-4 mb-2 border-b border-slate-800/80 pb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Live Services Stream • One-Liner Directives Scrolling
            </span>
          </div>

          {/* Continuous scrolling ticker row */}
          <div className="flex overflow-hidden select-none">
            <div className="flex shrink-0 animate-marquee items-center gap-12 whitespace-nowrap">
              {SERVICE_SLIDES.concat(SERVICE_SLIDES).map((service, index) => (
                <div
                  key={`${service.id}-${index}`}
                  onClick={() => {
                    const originalIdx = index % SERVICE_SLIDES.length;
                    handleSelect(originalIdx);
                  }}
                  className="flex items-center gap-3 cursor-pointer group hover:text-emerald-300 transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                    {service.title}
                  </span>
                  <span className="text-xs text-slate-300 group-hover:text-white font-medium">
                    "{service.oneLiner}"
                  </span>
                  <span className="text-slate-600 font-mono">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
