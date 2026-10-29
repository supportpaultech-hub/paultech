import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { API_BASE_URL } from '../../student-app/config';

const EditEmployeeModal = ({ isOpen, onClose, onSuccess, employee }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    designation: '',
    department: '',
    experience: '',
    phone: '',
    education: '',
    projects: '',
    skills: '',
    bio: '',
    github: '',
    linkedin: '',
    image: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeId: employee.employeeId || '',
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        designation: employee.designation || '',
        department: employee.department || '',
        experience: employee.experience || '',
        phone: employee.phone || '',
        education: employee.education || '',
        projects: employee.projects || '',
        skills: employee.skills ? employee.skills.join(', ') : '',
        bio: employee.bio || '',
        github: employee.github || '',
        linkedin: employee.linkedin || '',
        image: null
      });
      setSuccess(false);
      setError('');
    }
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
    
    const submitData = new FormData();
    submitData.append('employeeId', formData.employeeId);
    submitData.append('firstName', formData.firstName);
    submitData.append('lastName', formData.lastName);
    submitData.append('designation', formData.designation);
    submitData.append('department', formData.department);
    submitData.append('experience', formData.experience);
    submitData.append('phone', formData.phone);
    submitData.append('education', formData.education);
    submitData.append('projects', formData.projects || '');
    submitData.append('skills', skillsArray.join(','));
    submitData.append('bio', formData.bio || '');
    submitData.append('github', formData.github || '');
    submitData.append('linkedin', formData.linkedin || '');
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/auth/employees/${employee._id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-10">
          <FiX size={24} />
        </button>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-8">
          {success ? 'Employee Updated Successfully' : 'Edit Employee Details'}
        </h3>
        
        {success ? (
          <div className="flex flex-col items-center justify-center text-center animate-fade-in py-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <FiCheckCircle size={40} />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">Profile Updated!</h4>
            <p className="text-slate-500 mb-6">The employee profile has been updated and synchronized.</p>
            
            <button onClick={handleClose} className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-md shadow-orange-600/20">
              Done & Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl font-semibold flex items-center gap-3 animate-fade-in">
                <FiX className="shrink-0" /> {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">First Name</label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Last Name</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Employee ID</label>
                <input type="text" name="employeeId" required value={formData.employeeId} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Designation</label>
                <input type="text" name="designation" required value={formData.designation} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Department</label>
                <select name="department" required value={formData.department} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
                  <option value="">Select Department...</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="QA">Quality Assurance</option>
                  <option value="HR">HR / Admin</option>
                  <option value="Sales">Sales & Marketing</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Experience</label>
                <select name="experience" required value={formData.experience} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
                  <option value="">Select Experience...</option>
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="4 Years">4 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Projects (e.g. 5+ Web Apps, ERP)</label>
                <input type="text" name="projects" placeholder="e.g. 10+ Enterprise Apps, Cloud CRM" value={formData.projects} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Skills (Comma Separated)</label>
              <input type="text" name="skills" placeholder="e.g. React, Node.js, Python, MongoDB" value={formData.skills} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Short Bio / About (Displayed on Team Card Flip)</label>
              <textarea 
                name="bio" 
                rows="3"
                placeholder="e.g. Specialized in architecting modern full-stack web platforms, microservices, and sleek user experiences..." 
                value={formData.bio} 
                onChange={handleChange} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">LinkedIn Profile URL (Optional)</label>
                <input type="url" name="linkedin" placeholder="https://linkedin.com/in/username" value={formData.linkedin} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">GitHub Profile URL (Optional)</label>
                <input type="url" name="github" placeholder="https://github.com/username" value={formData.github} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Update Profile Image (Optional)</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
            </div>
            
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button type="button" onClick={handleClose} className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-8 rounded-xl shadow-md shadow-orange-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? 'Updating...' : 'Update Employee'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditEmployeeModal;
