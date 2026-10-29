import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiMail, FiPhone, FiCheck, FiX, FiFilter, FiUser, FiClock, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';

const ClientInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/contact`);
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this client inquiry from database?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/contact/${id}`);
      setInquiries(prev => prev.filter(inq => inq._id !== id));
      if (selectedInquiry?._id === id) setSelectedInquiry(null);
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry from database. Please try again.');
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const term = searchTerm.toLowerCase();
    return (
      (inq.name && inq.name.toLowerCase().includes(term)) ||
      (inq.email && inq.email.toLowerCase().includes(term)) ||
      (inq.subject && inq.subject.toLowerCase().includes(term)) ||
      (inq.message && inq.message.toLowerCase().includes(term))
    );
  });

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Unified Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiMessageSquare className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0" />
            Client Inquiries
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage incoming website leads, contact forms, and client service requests.
          </p>
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700 font-bold border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Client Details</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Received Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-12 text-slate-400">Loading inquiries...</td></tr>
              ) : filteredInquiries.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-slate-400">No client inquiries found.</td></tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{inq.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <FiMail size={12} className="text-orange-500 shrink-0" />
                        <span className="truncate max-w-[200px]">{inq.email}</span>
                        {inq.phone && (
                          <>
                            <span className="text-slate-300">•</span>
                            <FiPhone size={12} className="text-orange-500 shrink-0" />
                            <span>{inq.phone}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {inq.subject || 'General Inquiry'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(inq.createdAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        New Lead
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors text-xs font-bold flex items-center gap-1.5"
                        >
                          <FiMessageSquare size={14} /> View
                        </button>
                        <button
                          onClick={() => handleDelete(inq._id)}
                          className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Delete Inquiry"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Mobile-Friendly Card View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading inquiries...</div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No client inquiries found.</div>
          ) : (
            filteredInquiries.map((inq) => (
              <div key={inq._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{inq.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <FiMail size={12} className="text-orange-500 shrink-0" />
                      <span className="break-all">{inq.email}</span>
                    </div>
                    {inq.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <FiPhone size={12} className="text-orange-500 shrink-0" />
                        <span>{inq.phone}</span>
                      </div>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 shrink-0">
                    New
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                    Subject: {inq.subject || 'General Inquiry'}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {inq.message}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <FiClock size={12} />
                    {new Date(inq.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <FiMessageSquare size={13} /> View Detail
                    </button>
                    <button
                      onClick={() => handleDelete(inq._id)}
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-600"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4 relative">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 font-bold text-lg">
                {selectedInquiry.name ? selectedInquiry.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="min-w-0 pr-8">
                <h3 className="text-lg font-bold text-slate-900 truncate">{selectedInquiry.name}</h3>
                <p className="text-xs text-slate-500 break-all">{selectedInquiry.email}</p>
                {selectedInquiry.phone && (
                  <p className="text-xs text-orange-600 font-semibold">{selectedInquiry.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Subject</label>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedInquiry.subject || 'General Inquiry'}</p>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Message Content</label>
              <div className="mt-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="text-xs text-slate-400 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center">
              <span>Received: {new Date(selectedInquiry.createdAt || Date.now()).toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedInquiry._id)}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <FiTrash2 size={14} /> Delete
                </button>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'Inquiry')}`}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <FiMail size={14} /> Reply Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInquiries;

