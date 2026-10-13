import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
  FiAward, FiPlus, FiUploadCloud, FiRefreshCw, FiSearch, 
  FiTrash2, FiCalendar, FiCheckCircle, FiX, FiMail, FiPhone, FiUser, FiFileText, FiDownload,
  FiLayers, FiFilter
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Manual Creation Form State
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    domain: 'Full Stack Development',
    startDate: '',
    endDate: '',
    certificateNo: '',
    duration: '3 Months'
  });

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/certificates/all`);
      setCertificates(res.data || []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // 1. Manual Creation Handler
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.candidateName || !formData.domain || !formData.startDate || !formData.endDate) {
      alert('Candidate Name, Domain, Start Date, and End Date are all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/api/certificates`, formData);
      alert('Certificate issued successfully!');
      setIsModalOpen(false);
      setFormData({
        candidateName: '',
        email: '',
        phone: '',
        domain: 'Full Stack Development',
        startDate: '',
        endDate: '',
        certificateNo: '',
        duration: '3 Months'
      });
      fetchCertificates();
    } catch (err) {
      console.error('Error creating certificate:', err);
      alert(err.response?.data?.error || 'Failed to create certificate');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Download Sample Excel Template
  const handleDownloadSampleExcel = () => {
    const sampleData = [
      {
        "Candidate Name": "Rahul Verma",
        "Domain": "Full Stack Web Development",
        "Start Date": "2026-09-04",
        "End Date": "2026-11-04",
        "Certificate No": "PSS/2026/001",
        "Email": "rahul.verma@example.com",
        "Phone": "9876543210"
      },
      {
        "Candidate Name": "Priya Sharma",
        "Domain": "Data Science & AI",
        "Start Date": "2026-09-04",
        "End Date": "2026-11-04",
        "Certificate No": "PSS/2026/002",
        "Email": "priya.sharma@example.com",
        "Phone": "9876543211"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Certificates");
    XLSX.writeFile(workbook, "paultech_certificate_sample.xlsx");
  };

  // 3. Excel Bulk Upload Handler
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setSubmitting(true);
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet);

        if (jsonRows.length === 0) {
          alert('Excel file contains no readable rows.');
          return;
        }

        const res = await axios.post(`${API_BASE_URL}/api/certificates/bulk-upload`, { rows: jsonRows });
        alert(res.data.message || 'Excel bulk upload completed!');
        fetchCertificates();
      } catch (err) {
        console.error('Error parsing Excel:', err);
        alert('Failed to process Excel file. Ensure it contains required columns: Candidate Name, Domain, Start Date, End Date.');
      } finally {
        setSubmitting(false);
        e.target.value = null;
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 3. Sync Interns from Student App
  const handleSyncStudents = async () => {
    try {
      setSubmitting(true);
      const res = await axios.post(`${API_BASE_URL}/api/certificates/sync-students`);
      alert(res.data.message || 'Interns synced successfully from Student App!');
      fetchCertificates();
    } catch (err) {
      console.error('Error syncing students:', err);
      alert('Failed to sync interns from Student App.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Delete Certificate
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate record?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/certificates/${id}`);
      fetchCertificates();
    } catch (err) {
      console.error('Error deleting certificate:', err);
      alert('Failed to delete certificate.');
    }
  };

  // Helper to extract year from certificate
  const getCertificateYear = (c) => {
    if (c.certificateNo) {
      const match = String(c.certificateNo).match(/(?:PSS[\/\-_])?(20\d{2})/i) || String(c.certificateNo).match(/\b(20\d{2})\b/);
      if (match && match[1]) return match[1];
    }
    const dateCandidate = c.issueDate || c.endDate || c.startDate || c.createdAt;
    if (dateCandidate) {
      const d = new Date(dateCandidate);
      if (!isNaN(d.getFullYear())) return String(d.getFullYear());
    }
    return '2026';
  };

  // Dynamic years list (newest first, guaranteeing 2027, 2026, 2025, 2024 + any year from data)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearSet = new Set([
      String(currentYear + 1), // 2027
      String(currentYear),     // 2026
      String(currentYear - 1), // 2025
      String(currentYear - 2), // 2024
    ]);
    certificates.forEach(c => {
      const y = getCertificateYear(c);
      if (y) yearSet.add(y);
    });
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
  }, [certificates]);

  // Year counts mapping
  const yearCounts = useMemo(() => {
    const counts = {};
    certificates.forEach(c => {
      const y = getCertificateYear(c);
      counts[y] = (counts[y] || 0) + 1;
    });
    return counts;
  }, [certificates]);

  // Dynamic domains list
  const availableDomains = useMemo(() => {
    const domainSet = new Set();
    certificates.forEach(c => {
      if (c.domain && c.domain.trim()) {
        domainSet.add(c.domain.trim());
      }
    });
    return Array.from(domainSet).sort();
  }, [certificates]);

  // Combined filtered certificates
  const filteredCertificates = useMemo(() => {
    return certificates.filter(c => {
      // 1. Text Search Filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const matchName = c.candidateName && c.candidateName.toLowerCase().includes(term);
        const matchNo = c.certificateNo && c.certificateNo.toLowerCase().includes(term);
        const matchDomain = c.domain && c.domain.toLowerCase().includes(term);
        const matchEmail = c.email && c.email.toLowerCase().includes(term);
        if (!matchName && !matchNo && !matchDomain && !matchEmail) return false;
      }

      // 2. Year Filter
      if (selectedYear !== 'ALL') {
        const certYear = getCertificateYear(c);
        if (certYear !== selectedYear) return false;
      }

      // 3. Domain Filter
      if (selectedDomain !== 'ALL') {
        if (!c.domain || c.domain.trim().toLowerCase() !== selectedDomain.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [certificates, searchTerm, selectedYear, selectedDomain]);

  const resetFilters = () => {
    setSelectedYear('ALL');
    setSelectedDomain('ALL');
    setSearchTerm('');
  };

  const isFiltered = selectedYear !== 'ALL' || selectedDomain !== 'ALL' || Boolean(searchTerm);

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      
      {/* Standardized Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiAward className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0" />
            Manage Certificates & Verification
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Issue certificates, upload Excel bulk data, and sync intern records from Student App.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0">
          
          {/* Download Sample Excel Template */}
          <button
            onClick={handleDownloadSampleExcel}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
            title="Download Sample Excel Sheet Format"
          >
            <FiDownload className="w-4 h-4 text-slate-600" />
            <span>Sample Excel</span>
          </button>

          {/* Sync Interns Button */}
          <button
            onClick={handleSyncStudents}
            disabled={submitting}
            className="px-3.5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
            title="Import All Interns from Student App"
          >
            <FiRefreshCw className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
            <span>Sync Interns</span>
          </button>

          {/* Excel File Upload Button */}
          <label className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0">
            <FiFileText className="w-4 h-4 text-emerald-600" />
            <span>Upload Excel</span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleExcelUpload}
              className="hidden"
            />
          </label>

          {/* Add Certificate Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/20 text-xs sm:text-sm shrink-0"
          >
            <FiPlus size={18} /> Add Certificate
          </button>
        </div>
      </div>

      {/* Main Filter & List Box */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Filter Toolbar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3.5 bg-slate-50/50">
          
          {/* Top Row: Search Input + Year Dropdown + Domain Dropdown + Reset Button */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input Bar */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search candidate, cert no, domain, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium shadow-2xs placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
                  title="Clear search"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns and Action Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Year Select Dropdown */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors min-w-[150px] flex-1 sm:flex-initial relative focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
                <FiCalendar className="w-4 h-4 text-orange-500 shrink-0 pointer-events-none" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 cursor-pointer appearance-none pr-5 focus:outline-none"
                >
                  <option value="ALL">All Years ({certificates.length})</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      Year {yr} ({yearCounts[yr] || 0})
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 pointer-events-none text-slate-400 text-[10px]">
                  ▼
                </span>
              </div>

              {/* Domain Select Dropdown */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors min-w-[175px] flex-1 sm:flex-initial relative focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
                <FiLayers className="w-4 h-4 text-blue-500 shrink-0 pointer-events-none" />
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 cursor-pointer appearance-none pr-5 focus:outline-none"
                >
                  <option value="ALL">All Domains ({availableDomains.length})</option>
                  {availableDomains.map((dom) => (
                    <option key={dom} value={dom}>
                      {dom}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 pointer-events-none text-slate-400 text-[10px]">
                  ▼
                </span>
              </div>

              {/* Reset Filters Button */}
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-95"
                  title="Clear all filters"
                >
                  <FiX size={14} />
                  <span>Reset</span>
                </button>
              )}

              {/* Total Records Counter Badge */}
              <div className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 shrink-0 shadow-2xs ml-auto sm:ml-0">
                <span className="text-orange-600 font-extrabold">{filteredCertificates.length}</span> / {certificates.length} Records
              </div>
            </div>
          </div>

          {/* Quick Filter Pill Chips: One-Click Year Filter & Active Filter Indicators */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1.5">
              <FiCalendar className="w-3.5 h-3.5 text-orange-500" /> Quick Year:
            </span>

            {/* "All" Year Pill */}
            <button
              type="button"
              onClick={() => setSelectedYear('ALL')}
              className={`px-3 py-1 rounded-lg font-bold text-xs shrink-0 transition-all cursor-pointer ${
                selectedYear === 'ALL'
                  ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30 ring-2 ring-orange-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
              }`}
            >
              All Years ({certificates.length})
            </button>

            {/* Individual Year Pills: 2027, 2026, 2025, 2024 */}
            {availableYears.map((yr) => {
              const count = yearCounts[yr] || 0;
              const isActive = selectedYear === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30 ring-2 ring-orange-500/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  <span>{yr}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-orange-700 text-white' : count > 0 ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Active Domain Indicator Pill */}
            {selectedDomain !== 'ALL' && (
              <span className="ml-auto sm:ml-2 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-2xs">
                <FiLayers className="w-3 h-3 text-blue-500" />
                <span className="truncate max-w-[150px]">{selectedDomain}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDomain('ALL')}
                  className="hover:text-blue-900 ml-0.5 text-blue-400 hover:text-blue-700 cursor-pointer"
                  title="Clear Domain Filter"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700 font-bold border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Certificate ID</th>
                <th className="px-6 py-4">Candidate Name</th>
                <th className="px-6 py-4">Domain / Course</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12 text-slate-400">Loading certificates...</td></tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                        <FiFilter size={22} />
                      </div>
                      <p className="font-bold text-slate-800 text-sm">No certificates found</p>
                      <p className="text-xs text-slate-400 text-center">
                        {isFiltered 
                          ? `No records match your filters (${selectedYear !== 'ALL' ? `Year: ${selectedYear}` : ''}${selectedDomain !== 'ALL' ? ` • Domain: ${selectedDomain}` : ''}${searchTerm ? ` • "${searchTerm}"` : ''}).`
                          : 'No certificate records exist yet.'}
                      </p>
                      {isFiltered && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20 cursor-pointer"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((c) => (
                  <tr key={c.id || c._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-orange-600">
                      {c.certificateNo}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{c.candidateName}</p>
                      {c.email && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <FiMail size={11} /> {c.email}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 inline-block">
                        {c.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {c.duration || '3 Months'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 inline-flex items-center gap-1">
                        <FiCheckCircle size={12} />
                        VERIFIED
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id || c._id)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading certificates...</div>
          ) : filteredCertificates.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <div className="flex flex-col items-center justify-center gap-2">
                <FiFilter size={24} className="text-slate-300" />
                <p className="font-bold text-slate-700 text-xs">No certificates found</p>
                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredCertificates.map((c) => (
              <div key={c.id || c._id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-orange-600">{c.certificateNo}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    VERIFIED
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.candidateName}</h3>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{c.domain}</p>
                  {c.email && <p className="text-[11px] text-slate-400 mt-0.5">{c.email}</p>}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">Duration: {c.duration || '3 Months'}</span>
                  <button
                    onClick={() => handleDelete(c.id || c._id)}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-600"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual Add Certificate Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <FiAward size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Issue New Certificate</h3>
                <p className="text-xs text-slate-500">Add intern details to verification registry</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Candidate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="candidate@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Domain / Course Track *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Web Development"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Certificate Number (Optional)</label>
                <input
                  type="text"
                  placeholder="Auto-generated if left blank (e.g. PSS/2026/001)"
                  value={formData.certificateNo}
                  onChange={(e) => setFormData({ ...formData, certificateNo: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-orange-600/20"
              >
                {submitting ? 'Saving Certificate...' : 'Save & Issue Certificate'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default ManageCertificates;
