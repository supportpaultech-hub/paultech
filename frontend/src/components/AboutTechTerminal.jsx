import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  Sparkles, 
  TrendingUp, 
  Wifi, 
  RefreshCw 
} from 'lucide-react';

const tabs = [
  { id: 'ts', name: 'EnterpriseCore.ts', lang: 'TypeScript' },
  { id: 'sh', name: 'deploy.sh', lang: 'Bash' },
  { id: 'json', name: 'metrics.json', lang: 'JSON' }
];

const AboutTechTerminal = () => {
  const [activeTab, setActiveTab] = useState('ts');
  const [visibleLinesCount, setVisibleLinesCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [livePing, setLivePing] = useState(14);
  const [liveConnections, setLiveConnections] = useState(14840);
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  const editorBodyRef = useRef(null);
  const autoResumeTimerRef = useRef(null);

  // Dynamic values that fluctuate realistically
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setLivePing(13 + Math.floor(Math.random() * 5)); // 13ms - 17ms
      setLiveConnections((prev) => prev + (Math.floor(Math.random() * 7) - 3)); // slight fluctuation
    }, 2400);

    return () => clearInterval(telemetryInterval);
  }, []);

  const codeSnippets = useMemo(() => ({
    ts: [
      { type: 'comment', text: '// PaulTech Enterprise Engineering Architecture' },
      { type: 'keyword', text: 'import', rest: " { CloudMesh, ERPGateway, AIService } from '@paultech/core';" },
      { type: 'empty' },
      { type: 'keyword', text: 'const', rest: ' paultechPlatform = new CloudMesh({' },
      { type: 'indent', key: 'mission', val: "'Silicon Valley Engineering for Global Brands'," },
      { type: 'indent', key: 'scalability', val: "'High-Availability Microservices'," },
      { type: 'indent', key: 'security', val: "'ISO 9001:2015 Verified & Encrypted'," },
      { type: 'indent', key: 'clientRetention', val: "'99% Proven Trust'," },
      { type: 'close', text: '});' },
      { type: 'empty' },
      { type: 'comment', text: '// Auto-deploying enterprise cloud clusters...' },
      { type: 'keyword', text: 'await', rest: ' paultechPlatform.launchProduction();' },
      { type: 'status', text: '✔ Core compiled in 14ms. Transitioning to deploy pipeline...' }
    ],
    sh: [
      { type: 'comment', text: '#!/bin/bash - PaulTech Automated CI/CD Pipeline' },
      { type: 'cmd', text: '$ paultech-cli deploy --env=production --region=global' },
      { type: 'log', text: '⚡ [1/4] Compiling React, Node.js & Cloud microservices... (0.38s)' },
      { type: 'log', text: '✔ [2/4] Connecting Enterprise ERP Gateway & Database clusters... (OK)' },
      { type: 'log', text: '✔ [3/4] Running automated security audit: 0 vulnerabilities (PASSED)' },
      { type: 'log-success', text: '🚀 [4/4] LIVE: 50+ Projects Deployed Worldwide with 99.99% SLA' },
      { type: 'log-ping', text: '✨ Synchronizing live edge telemetry across global clusters...' }
    ],
    json: [
      { type: 'raw', text: '{' },
      { type: 'json-prop', key: '"organization"', val: '"PaulTech Software Services Pvt Ltd"' },
      { type: 'json-prop', key: '"clusterStatus"', val: '"HEALTHY_OPTIMAL"' },
      { type: 'json-dynamic', key: '"activeConnections"', val: liveConnections.toLocaleString() },
      { type: 'json-dynamic', key: '"averageLatency"', val: `"${livePing}ms"` },
      { type: 'json-prop', key: '"projectsDelivered"', val: '"50+ Enterprise Clients"' },
      { type: 'json-prop', key: '"clientRetentionRate"', val: '"99%"' },
      { type: 'json-prop', key: '"yoyGrowthRate"', val: '"+125%"' },
      { type: 'json-prop', key: '"globalEdgeRegions"', val: '["Mumbai", "Singapore", "Frankfurt", "Silicon Valley"]' },
      { type: 'json-prop', key: '"status"', val: '"PROD_READY_ENTERPRISE"' },
      { type: 'raw', text: '}' }
    ]
  }), [livePing, liveConnections]);

  // Main continuous typing and cycling loop
  useEffect(() => {
    let lineTimer;
    let nextTabTimer;
    const currentList = codeSnippets[activeTab];
    const totalLines = currentList.length;

    if (visibleLinesCount < totalLines) {
      // Typing speed based on tab type
      const speed = activeTab === 'sh' ? 220 : activeTab === 'json' ? 140 : 170;
      lineTimer = setTimeout(() => {
        setVisibleLinesCount((prev) => prev + 1);
      }, speed);
    } else if (isAutoPlaying) {
      // Completed current tab, hold and switch to next tab
      const dwellTime = activeTab === 'ts' ? 2400 : activeTab === 'sh' ? 2600 : 3400;
      
      nextTabTimer = setTimeout(() => {
        setIsTabTransitioning(true);
        setTimeout(() => {
          setActiveTab((prevTab) => {
            if (prevTab === 'ts') return 'sh';
            if (prevTab === 'sh') return 'json';
            return 'ts';
          });
          setVisibleLinesCount(0);
          setIsTabTransitioning(false);
        }, 250);
      }, dwellTime);
    }

    return () => {
      clearTimeout(lineTimer);
      clearTimeout(nextTabTimer);
    };
  }, [visibleLinesCount, activeTab, isAutoPlaying, codeSnippets]);

  // Auto-scroll as new lines appear
  useEffect(() => {
    if (editorBodyRef.current) {
      editorBodyRef.current.scrollTop = editorBodyRef.current.scrollHeight;
    }
  }, [visibleLinesCount, activeTab]);

  // Manual tab selection
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setVisibleLinesCount(codeSnippets[tabId].length);
    // Pause briefly on user interaction, auto resume after 10 seconds
    setIsAutoPlaying(false);
    if (autoResumeTimerRef.current) clearTimeout(autoResumeTimerRef.current);
    autoResumeTimerRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const toggleAutoPlay = () => {
    if (autoResumeTimerRef.current) clearTimeout(autoResumeTimerRef.current);
    if (!isAutoPlaying) {
      setIsAutoPlaying(true);
    } else {
      setIsAutoPlaying(false);
    }
  };

  const handleCopy = () => {
    const rawLines = codeSnippets[activeTab].map((l) => {
      if (l.text) return l.text;
      if (l.key && l.val) return `  ${l.key}: ${l.val}`;
      return '';
    });
    navigator.clipboard.writeText(rawLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRerun = () => {
    setVisibleLinesCount(0);
    setIsAutoPlaying(true);
  };

  return (
    <div className="w-full relative rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden select-none group">
      
      {/* Dynamic Ambient Glow Behind Terminal */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-500/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Terminal Title Bar / Window Controls */}
      <div className="h-12 bg-slate-900/90 border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between backdrop-blur-md relative z-10">
        
        {/* Left: macOS Dots + Live Status Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/30" />
          <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/30" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm shadow-emerald-500/30" />
          
          {/* Live Activity Badge */}
          <div className="ml-1 sm:ml-2">
            {activeTab === 'ts' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-500/15 text-blue-400 border border-blue-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                LIVE CODING
              </span>
            )}
            {activeTab === 'sh' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/15 text-amber-400 border border-amber-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                DEPLOYING
              </span>
            )}
            {activeTab === 'json' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                TELEMETRY
              </span>
            )}
          </div>
        </div>

        {/* Center: File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[50%] sm:max-w-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.id === 'ts' && <span className="text-blue-400 font-bold text-[10px]">TS</span>}
              {tab.id === 'sh' && <Terminal className="w-3 h-3 text-emerald-400" />}
              {tab.id === 'json' && <span className="text-amber-400 font-bold text-[10px]">{"{}"}</span>}
              <span className="text-[11px] sm:text-xs">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Right: Auto-play Toggle, Restart & Copy */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={toggleAutoPlay}
            title={isAutoPlaying ? 'Pause Auto-Loop' : 'Resume Auto-Loop'}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-mono ${
              isAutoPlaying 
                ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20' 
                : 'text-slate-400 bg-slate-800/60 hover:text-white'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          
          <button
            onClick={handleRerun}
            title="Restart Animation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:inline-flex"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy Code"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div 
        ref={editorBodyRef}
        className={`p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed min-h-[320px] max-h-[350px] overflow-y-auto relative z-10 text-slate-300 transition-opacity duration-200 ${
          isTabTransitioning ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {codeSnippets[activeTab].slice(0, visibleLinesCount).map((line, idx) => {
          return (
            <div key={idx} className="flex items-start gap-3 py-0.5 group/line hover:bg-white/[0.02] rounded px-1 -mx-1">
              {/* Line Number */}
              <span className="w-5 text-right text-slate-600 select-none shrink-0 font-mono text-[11px] pt-0.5">
                {idx + 1}
              </span>

              {/* Line Content */}
              <div className="flex-1 break-all">
                {line.type === 'comment' && (
                  <span className="text-slate-500 italic font-mono">{line.text}</span>
                )}

                {line.type === 'keyword' && (
                  <>
                    <span className="text-purple-400 font-semibold">{line.text}</span>
                    <span className="text-slate-200">{line.rest}</span>
                  </>
                )}

                {line.type === 'indent' && (
                  <div className="pl-4">
                    <span className="text-orange-300">{line.key}</span>
                    <span className="text-slate-400">: </span>
                    <span className="text-emerald-300">{line.val}</span>
                  </div>
                )}

                {line.type === 'close' && (
                  <span className="text-slate-300">{line.text}</span>
                )}

                {line.type === 'cmd' && (
                  <span className="text-emerald-400 font-bold">{line.text}</span>
                )}

                {line.type === 'log' && (
                  <span className="text-slate-300">{line.text}</span>
                )}

                {line.type === 'log-success' && (
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    {line.text}
                  </span>
                )}

                {line.type === 'log-ping' && (
                  <span className="text-cyan-400 flex items-center gap-1.5 font-semibold">
                    {line.text}
                  </span>
                )}

                {line.type === 'status' && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs my-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span>{line.text}</span>
                  </div>
                )}

                {line.type === 'raw' && (
                  <span className="text-slate-400">{line.text}</span>
                )}

                {line.type === 'json-prop' && (
                  <div className="pl-4">
                    <span className="text-cyan-300">{line.key}</span>
                    <span className="text-slate-400">: </span>
                    <span className="text-emerald-300">{line.val}</span>
                  </div>
                )}

                {line.type === 'json-dynamic' && (
                  <div className="pl-4 flex items-center gap-1.5">
                    <span className="text-cyan-300">{line.key}</span>
                    <span className="text-slate-400">: </span>
                    <span className="text-amber-300 font-bold bg-amber-500/10 px-1 rounded">{line.val}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                  </div>
                )}

                {line.type === 'empty' && <span className="inline-block h-4" />}
              </div>
            </div>
          );
        })}

        {/* Blinking Terminal Cursor */}
        <div className="flex items-center gap-3 py-0.5 px-1">
          <span className="w-5 text-right text-slate-600 select-none shrink-0 font-mono text-[11px]">
            {visibleLinesCount + 1}
          </span>
          <span className="w-2 h-4 bg-orange-400 animate-pulse inline-block shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
        </div>
      </div>

      {/* Terminal Footer Console with Live Deployment Status & Ping */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-[11px]">CLUSTER:</span>
            <span className="text-emerald-400 font-semibold text-[11px]">OPERATIONAL</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 border-l border-slate-800 pl-3">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">{livePing}ms</span>
            <span className="text-slate-500">LATENCY</span>
          </div>
        </div>

        {/* Growth Rate Pill Embedded in Footer */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>+125% YOY GROWTH</span>
        </div>
      </div>

    </div>
  );
};

export default AboutTechTerminal;
