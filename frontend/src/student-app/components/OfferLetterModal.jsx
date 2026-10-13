import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sliders, 
  FileText, 
  Sparkles, 
  Building2, 
  User, 
  Calendar, 
  Briefcase, 
  Phone, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import { 
  COMPANY_DETAILS, 
  DOMAIN_CONFIGS, 
  DEFAULT_DOMAIN_CONFIG, 
  SAMPLE_PRESETS,
  getDomainConfig, 
  formatDateDDMMYYYY, 
  formatDateOrdinal, 
  formatDurationText 
} from '../templates/offerLetterTemplate';

export default function OfferLetterModal({ student = null, initialDomain = null, onClose }) {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  // Active Preset Mode: 'student' | 'blank' | 'hr' | 'fullstack'
  const [activeMode, setActiveMode] = useState(() => {
    if (student) return 'student';
    return 'blank';
  });

  // Selected Domain
  const [selectedDomain, setSelectedDomain] = useState(() => {
    if (initialDomain) return initialDomain;
    if (student?.domain) return student.domain;
    return 'Human Resources (HR)';
  });

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: formatDateDDMMYYYY(new Date()),
    startDate: formatDateOrdinal(new Date()),
    duration: '60 Days',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    subjectLine: '',
    customPosition: '',
    customDepartment: ''
  });

  // Synchronize form fields whenever activeMode or student changes
  useEffect(() => {
    if (activeMode === 'student' && student) {
      const rawName = (student.name || student.candidateName || '').trim();
      const sDomain = student.domain || 'Human Resources (HR)';
      const conf = getDomainConfig(sDomain);
      setSelectedDomain(sDomain);
      setFormData({
        name: rawName ? rawName.toUpperCase() : 'STUDENT NAME',
        phone: student.phone || student.candidatePhone || '9876543210',
        email: student.email || student.candidateEmail || 'student@example.com',
        date: formatDateDDMMYYYY(new Date()),
        startDate: student.joining_date ? formatDateOrdinal(student.joining_date) : formatDateOrdinal(new Date()),
        duration: formatDurationText(student.duration, conf.domainKey),
        reportingTo: conf.reportingTo,
        subjectLine: conf.subjectLine,
        customPosition: conf.positionTitle,
        customDepartment: conf.department
      });
    } else if (activeMode === 'hr') {
      const p = SAMPLE_PRESETS.hrSample;
      const conf = DOMAIN_CONFIGS['Human Resources (HR)'];
      setSelectedDomain('Human Resources (HR)');
      setFormData({
        name: p.name,
        phone: p.phone,
        email: p.email,
        date: p.date,
        startDate: p.startDate,
        duration: p.duration,
        reportingTo: p.reportingTo,
        subjectLine: p.subjectLine,
        customPosition: conf.positionTitle,
        customDepartment: conf.department
      });
    } else if (activeMode === 'fullstack') {
      const p = SAMPLE_PRESETS.fullstackSample;
      const conf = DOMAIN_CONFIGS['Full Stack Web Development'];
      setSelectedDomain('Full Stack Web Development');
      setFormData({
        name: p.name,
        phone: p.phone,
        email: p.email,
        date: p.date,
        startDate: p.startDate,
        duration: p.duration,
        reportingTo: p.reportingTo,
        subjectLine: p.subjectLine,
        customPosition: conf.positionTitle,
        customDepartment: conf.department
      });
    } else if (activeMode === 'blank') {
      const p = SAMPLE_PRESETS.blankTemplate;
      const conf = getDomainConfig(selectedDomain);
      setFormData({
        name: '{{STUDENT_NAME}}',
        phone: '{{CONTACT_NO}}',
        email: '{{EMAIL}}',
        date: '{{DATE}}',
        startDate: '{{START_DATE}}',
        duration: '{{DURATION}}',
        reportingTo: '{{REPORTING_TO}}',
        subjectLine: conf.subjectLine ? '{{SUBJECT_LINE}}' : '',
        customPosition: '{{POSITION_TITLE}}',
        customDepartment: '{{DEPARTMENT}}'
      });
    }
  }, [activeMode, student]);

  // When domain changes manually, update domain-specific defaults
  const handleDomainChange = (newDomain) => {
    setSelectedDomain(newDomain);
    const conf = getDomainConfig(newDomain);
    if (activeMode !== 'blank') {
      setFormData(prev => ({
        ...prev,
        reportingTo: conf.reportingTo,
        subjectLine: conf.subjectLine,
        customPosition: conf.positionTitle,
        customDepartment: conf.department,
        duration: prev.duration || conf.defaultDuration
      }));
    }
  };

  const domainConf = useMemo(() => {
    return getDomainConfig(selectedDomain);
  }, [selectedDomain]);

  // Derive first name for salutation
  const salutationName = useMemo(() => {
    if (activeMode === 'blank') return '{{FIRST_NAME}}';
    const trimmed = (formData.name || '').trim();
    if (!trimmed) return 'CANDIDATE';
    return trimmed.split(' ')[0].toUpperCase();
  }, [formData.name, activeMode]);

  // PDF Download Handler via html2canvas & jspdf
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      setDownloading(true);
      const element = printRef.current;

      const canvas = await html2canvas(element, {
        scale: 2.2, // High resolution crisp print quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const filename = activeMode === 'blank' 
        ? 'PaulTech_Offer_Letter_Master_Template.pdf' 
        : `PaulTech_Offer_Letter_${(formData.name || 'Candidate').replace(/\s+/g, '_')}.pdf`;

      pdf.save(filename);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again or use the Print button.');
    } finally {
      setDownloading(false);
    }
  };

  // Browser Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Copy HTML to Clipboard
  const handleCopyHtml = () => {
    if (!printRef.current) return;
    const html = printRef.current.outerHTML;
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900/80 backdrop-blur-md overflow-hidden animate-fadeIn">
      
      {/* TOP CONTROL NAVBAR */}
      <div className="bg-slate-900 border-b border-slate-700/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg z-20">
        
        {/* Left: Title & Mode Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <span className="p-1.5 bg-orange-500 rounded-lg text-white">📜</span>
            <span>Internship Offer Letter</span>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            {student && (
              <button
                onClick={() => setActiveMode('student')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeMode === 'student' ? 'bg-orange-500 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                🎓 {student.name?.split(' ')[0] || 'Student'}
              </button>
            )}
            <button
              onClick={() => setActiveMode('blank')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                activeMode === 'blank' ? 'bg-orange-500 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              🏷️ Blank Master Format
            </button>
            <button
              onClick={() => setActiveMode('hr')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                activeMode === 'hr' ? 'bg-orange-500 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              👩‍💼 HR Sample (Ashwini)
            </button>
            <button
              onClick={() => setActiveMode('fullstack')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                activeMode === 'fullstack' ? 'bg-orange-500 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              💻 Full Stack Sample (Suvra)
            </button>
          </div>
        </div>

        {/* Center: Domain Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-300 font-semibold whitespace-nowrap hidden sm:inline">
            Domain:
          </label>
          <select
            value={selectedDomain}
            onChange={(e) => handleDomainChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            {Object.keys(DOMAIN_CONFIGS).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 border transition ${
              showEditor 
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Live Field Editor"
          >
            <Sliders size={14} />
            <span className="hidden md:inline">Edit Fields</span>
          </button>

          <button
            onClick={handleCopyHtml}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 border border-slate-700 transition"
            title="Copy Raw HTML"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span className="hidden md:inline">{copied ? 'Copied!' : 'Copy HTML'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 border border-slate-700 transition"
            title="Print Letter"
          >
            <Printer size={14} />
            <span className="hidden md:inline">Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="px-3.5 py-1.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-lg flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition disabled:opacity-50"
          >
            <Download size={14} />
            <span>{downloading ? 'Exporting PDF...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* BODY CONTENT: EDITOR DRAWER + PREVIEW SHEET */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* SIDEBAR LIVE EDITOR (Optional toggle drawer) */}
        {showEditor && (
          <div className="w-80 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto space-y-3 z-10 animate-slideRight text-xs text-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-white text-sm">
              <span>Live Content Editor</span>
              <button onClick={() => setShowEditor(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">Candidate Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">Contact Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">Email Address</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">Offer Date (DD.MM.YYYY)</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">Internship Start Date</label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">Duration (e.g. 60 Days / 6 Weeks)</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">Reporting Authority</label>
              <input
                type="text"
                value={formData.reportingTo}
                onChange={(e) => setFormData({ ...formData, reportingTo: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">Subject Line (Optional)</label>
              <input
                type="text"
                value={formData.subjectLine}
                onChange={(e) => setFormData({ ...formData, subjectLine: e.target.value })}
                placeholder="Subject: Internship Offer for..."
                className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              💡 Changes reflect in real time on the preview and PDF download.
            </div>
          </div>
        )}

        {/* MAIN PREVIEW CONTAINER */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start bg-slate-950/60">
          
          {/* THE PIXEL-PERFECT A4 OFFER LETTER SHEET (DOCX Matched) */}
          <div
            ref={printRef}
            id="offerLetterA4Sheet"
            className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-black shadow-2xl relative overflow-hidden flex flex-col justify-between select-text"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            
            {/* 1. TOP GEOMETRIC DECORATIVE BANNER */}
            <div className="absolute top-0 left-0 right-0 h-[48px] pointer-events-none z-10">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-[#f26522]"></div>
              <svg className="absolute top-0 right-0 w-[320px] h-[48px]" viewBox="0 0 320 48" preserveAspectRatio="none">
                <polygon points="50,0 200,0 150,48 0,48" fill="#2b2e35" />
                <polygon points="198,0 216,0 166,48 148,48" fill="#ffffff" />
                <polygon points="214,0 320,0 270,48 164,48" fill="#f26522" />
              </svg>
            </div>

            {/* 2. BOTTOM GEOMETRIC DECORATIVE BANNER */}
            <div className="absolute bottom-0 left-0 right-0 h-[44px] pointer-events-none z-10">
              <div className="absolute bottom-0 left-0 w-full h-[6px] bg-[#2b2e35]"></div>
              <svg className="absolute bottom-0 left-0 w-[320px] h-[44px]" viewBox="0 0 320 44" preserveAspectRatio="none">
                <polygon points="0,0 150,0 200,44 0,44" fill="#f26522" />
                <polygon points="146,0 164,0 214,44 196,44" fill="#ffffff" />
                <polygon points="162,0 240,0 280,44 202,44" fill="#2b2e35" />
              </svg>
            </div>

            {/* 3. AUTHENTIC WATERMARK IMAGE */}
            <img 
              src="/watermark.png" 
              alt="PaulTech Watermark" 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[195mm] opacity-[0.18] pointer-events-none z-[1] select-none" 
            />

            {/* 4. MAIN CONTENT AREA (DOCX Margins: Left 20mm, Right 18mm, Top 16mm, Bottom 12mm) */}
            <div className="relative z-[2] flex-1 flex flex-col p-[16mm_18mm_12mm_20mm]">

              {/* Logo Header */}
              <div className="mt-[2mm] mb-[5mm]">
                <img 
                  src="/logo.png" 
                  alt="PaulTech Software Services" 
                  className="h-[58px] w-auto object-contain block"
                />
              </div>

              {/* Candidate Info & Date Row */}
              <div className="flex justify-between items-start mb-[5mm]">
                <div className="text-[12pt] leading-[1.35]">
                  <div className="text-[13pt] font-bold text-black tracking-[0.2px] uppercase mb-[1px]">
                    {activeMode === 'blank' ? (
                      <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                        {"{{CANDIDATE_NAME}}"}
                      </span>
                    ) : (
                      formData.name || 'CANDIDATE NAME'
                    )}
                  </div>
                  <div className="text-[12pt] text-black mb-[1px]">
                    <span className="font-bold">Contact No:</span>{' '}
                    {activeMode === 'blank' ? (
                      <span className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                        {"{{CONTACT_NUMBER}}"}
                      </span>
                    ) : (
                      formData.phone
                    )}
                  </div>
                  <div className="text-[12pt] text-black">
                    <span className="font-bold">Email:</span>{' '}
                    {activeMode === 'blank' ? (
                      <span className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                        {"{{EMAIL_ADDRESS}}"}
                      </span>
                    ) : (
                      <a href={`mailto:${formData.email}`} className="text-[#0033cc] underline">
                        {formData.email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-[12pt] font-bold text-black whitespace-nowrap pt-[1px]">
                  Date:{activeMode === 'blank' ? (
                    <span className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                      {"{{OFFER_DATE}}"}
                    </span>
                  ) : (
                    formData.date
                  )}
                </div>
              </div>

              {/* Salutation */}
              <div className="text-[12pt] font-bold text-black mb-[4mm]">
                Dear {salutationName},
              </div>

              {/* Optional Subject Line */}
              {formData.subjectLine && (
                <div className="text-[12pt] font-bold text-black mb-[4mm]">
                  {activeMode === 'blank' ? (
                    <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                      {"{{SUBJECT_LINE}}"}
                    </span>
                  ) : (
                    formData.subjectLine
                  )}
                </div>
              )}

              {/* Lead Paragraph */}
              <p className="text-[12pt] leading-[1.28] text-black mb-[3.5mm] text-justify">
                We are pleased to offer you the position of{' '}
                <span className="font-bold">
                  {activeMode === 'blank' ? (
                    <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                      {"{{POSITION_TITLE}}"}
                    </span>
                  ) : (
                    formData.customPosition || domainConf.positionTitle
                  )}
                </span>{' '}
                at{' '}
                <span className="font-bold">
                  PAULTECH SOFTWARE SERVICES (OPC) PVT LTD.
                </span>{' '}
                We believe your skills and enthusiasm will be a valuable addition to our team.
              </p>

              {/* Internship Details Box */}
              <div className="mb-[3.5mm] text-[12pt] leading-[1.3]">
                <div className="font-bold mb-[2px]">Internship Details:</div>
                <div className="mb-[1px]">
                  <span className="font-bold">Position:</span>{' '}
                  {activeMode === 'blank' ? (
                    <span className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                      {"{{POSITION_SHORT}}"}
                    </span>
                  ) : (
                    formData.customPosition || domainConf.positionShort || domainConf.positionTitle
                  )}
                </div>
                <div className="mb-[1px]">
                  <span className="font-bold">Department:</span>{' '}
                  {activeMode === 'blank' ? (
                    <span className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                      {"{{DEPARTMENT}}"}
                    </span>
                  ) : (
                    formData.customDepartment || domainConf.department
                  )}
                </div>
                <div className="mb-[1px]">
                  <span className="font-bold">Duration:</span> Starting from{' '}
                  {activeMode === 'blank' ? (
                    <span className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                      {"{{START_DATE}}"}
                    </span>
                  ) : (
                    formData.startDate
                  )}
                  ,{' '}
                  {activeMode === 'blank' ? (
                    <span className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                      {"{{DURATION}}"}
                    </span>
                  ) : (
                    formData.duration
                  )}
                </div>
                <div>
                  <span className="font-bold">Reporting To:</span>{' '}
                  {activeMode === 'blank' ? (
                    <span className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded border border-dashed border-orange-400 font-mono text-xs">
                      {"{{REPORTING_TO}}"}
                    </span>
                  ) : (
                    formData.reportingTo || domainConf.reportingTo
                  )}
                </div>
              </div>

              {/* Domain Specific Paragraphs */}
              <div className="space-y-[3.5mm]">
                {domainConf.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-[12pt] leading-[1.28] text-black text-justify">
                    {p}
                  </p>
                ))}
              </div>

              {/* Official Scanned Rubber Stamp */}
              <div className="text-center my-[2mm] pointer-events-none">
                <img 
                  src="/stamp.jpeg" 
                  alt="Official Rubber Stamp" 
                  className="w-[126px] h-[126px] object-contain block mx-auto" 
                />
              </div>

              {/* Footer Section */}
              <div className="flex justify-between items-end mt-auto pb-[4mm]">
                
                {/* Left Signoff */}
                <div className="text-[12pt] leading-[1.3] text-black">
                  <div className="font-bold">Thanks & Regards,</div>
                  <div className="font-bold">Mrs. Daljeet Paul</div>
                  <div className="font-bold">HR MANAGER HEAD</div>
                  {domainConf.domainKey === 'HR' && (
                    <div className="font-bold">PaulTech Software Services (OPC) Pvt Ltd.</div>
                  )}
                </div>

                {/* Right Contact Info */}
                <div className="text-right text-[11pt] text-[#464646] leading-[1.3]">
                  <div className="flex items-center justify-end gap-[5px] mb-[1.5px]">
                    <span>7209986943/7061273234</span>
                    <img src="/icon_phone.png" alt="Phone" className="w-[13px] h-[13px] object-contain inline-block shrink-0" />
                  </div>
                  <div className="flex items-center justify-end gap-[5px] mb-[1.5px]">
                    <a href="mailto:hr@paultechsoftwareservices.com" className="text-[#464646] underline">
                      hr@paultechsoftwareservices.com
                    </a>
                    <img src="/icon_email.png" alt="Email" className="w-[13px] h-[13px] object-contain inline-block shrink-0" />
                  </div>
                  <div className="flex items-center justify-end gap-[5px] mb-[1.5px]">
                    <a href="https://paultechsoftwareservices.com" target="_blank" rel="noreferrer" className="text-[#464646] underline">
                      https://paultechsoftwareservices.com
                    </a>
                    <img src="/icon_web.png" alt="Website" className="w-[13px] h-[13px] object-contain inline-block shrink-0" />
                  </div>
                  <div className="flex items-center justify-end gap-[5px] mb-[1.5px]">
                    <span>1<sup>st</sup> Floor, Pacific Height Building, Aambagan,</span>
                    <img src="/icon_location.png" alt="Location" className="w-[13px] h-[13px] object-contain inline-block shrink-0" />
                  </div>
                  <div className="mb-[1.5px]">
                    <span>Sakchi, Jamshedpur-831001</span>
                  </div>
                  <div className="font-bold text-[#464646] mt-[1px]">
                    GSTIN: 20AAKCP7675D1ZE
                  </div>
                </div>

              </div>

            </div>

          </div>{/* /#offerLetterA4Sheet */}

        </div>

      </div>

    </div>,
    document.body
  );
}

