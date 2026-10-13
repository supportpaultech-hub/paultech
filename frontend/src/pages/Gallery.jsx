import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiImage, FiCalendar, FiX, FiChevronLeft, FiChevronRight, 
  FiLayers, FiMaximize2
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Album Modal state (viewing all photos in an album)
  const [activeAlbum, setActiveAlbum] = useState(null);

  // Lightbox Fullscreen Image state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', 'Internship Batch', 'Picnic & Outings', 'Events & Celebrations', 'Office Life', 'Workshops'];

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/gallery`);
      setAlbums(res.data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  };

  const filteredAlbums = albums.filter(album => 
    selectedCategory === 'All' || album.category === selectedCategory
  );

  // Get full list of all photos in active album (thumbnail + images array)
  const getActiveAlbumPhotos = () => {
    if (!activeAlbum) return [];
    const list = [];
    if (activeAlbum.thumbnail) list.push(activeAlbum.thumbnail);
    if (activeAlbum.images && activeAlbum.images.length > 0) {
      activeAlbum.images.forEach(img => {
        if (img !== activeAlbum.thumbnail) list.push(img);
      });
    }
    return list;
  };

  const activePhotosList = getActiveAlbumPhotos();

  const handlePrevPhoto = () => {
    if (lightboxIndex === null || activePhotosList.length === 0) return;
    setLightboxIndex((prev) => (prev === 0 ? activePhotosList.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    if (lightboxIndex === null || activePhotosList.length === 0) return;
    setLightboxIndex((prev) => (prev === activePhotosList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* 1. Hero Banner */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 shadow-xs backdrop-blur-md mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              PaulTech Life & Culture
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Memories & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Moments</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Explore highlights from our internship batches, annual picnics, hackathons, and vibrant team celebrations.
          </p>
        </div>
      </section>

      {/* 2. Main Content & Gallery Albums Grid */}
      <section className="py-8 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Category Filter Pills Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto sm:flex-wrap mb-8 sm:mb-10 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 sm:scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <CardGridSkeleton count={6} />
        ) : filteredAlbums.length === 0 ? (
          <div className="py-16 sm:py-20 text-center bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8">
            <FiLayers size={44} className="text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">No Gallery Albums Found</h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
              Check back soon for new event photos, internship batch highlights, and picnic albums!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredAlbums.map((album) => {
              const totalPhotos = (album.images ? album.images.length : 0) + 1;
              return (
                <div
                  key={album._id}
                  onClick={() => setActiveAlbum(album)}
                  className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1.5"
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={getImageUrl(album.thumbnail)}
                      alt={album.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>

                    {/* Category Tag */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-slate-900/90 backdrop-blur-md text-orange-400 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-xl border border-orange-500/30 shadow-md">
                      {album.category}
                    </div>

                    {/* Photo Count Badge */}
                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-orange-600/95 backdrop-blur-md text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                      <FiImage size={13} />
                      <span>{totalPhotos} Photos</span>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug mb-1.5 sm:mb-2">
                        {album.title}
                      </h3>

                      {album.eventDate && (
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mb-2 sm:mb-3">
                          <FiCalendar className="text-orange-500" size={13} />
                          {album.eventDate}
                        </p>
                      )}

                      {album.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {album.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-600 group-hover:underline flex items-center gap-1">
                        Explore Album Photos
                      </span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 group-hover:bg-orange-600 text-slate-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <FiMaximize2 size={13} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. ALBUM PHOTOS GRID MODAL */}
      {activeAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 my-4 sm:my-6 max-h-[92vh] flex flex-col animate-fade-in text-slate-900">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 sm:pb-4 border-b border-slate-100 shrink-0 gap-3">
              <div>
                <span className="text-[10px] sm:text-xs font-black text-orange-600 uppercase tracking-widest">{activeAlbum.category}</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{activeAlbum.title}</h2>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <FiCalendar size={12} className="text-orange-500" /> {activeAlbum.eventDate} • {activePhotosList.length} Photos in Album
                </p>
              </div>

              <button
                onClick={() => setActiveAlbum(null)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl sm:rounded-2xl transition-colors shrink-0"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Photos Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
                {activePhotosList.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-orange-500 group cursor-pointer shadow-sm"
                  >
                    <img
                      src={getImageUrl(photoUrl)}
                      alt={`Album photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FiMaximize2 className="text-white w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 sm:pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Click any image to view full screen slider</span>
              <button
                onClick={() => setActiveAlbum(null)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Close Album
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. LIGHTBOX SLIDER MODAL */}
      {lightboxIndex !== null && activePhotosList[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-3 sm:p-4">
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-colors z-50 border border-white/10"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Left Arrow */}
          {activePhotosList.length > 1 && (
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-colors z-50 border border-white/10"
            >
              <FiChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          )}

          {/* Image Container */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center p-2">
            <img
              src={getImageUrl(activePhotosList[lightboxIndex])}
              alt="Fullscreen photo"
              className="max-w-full max-h-[75vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-slate-800 animate-fade-in"
            />
            
            {/* Counter */}
            <div className="mt-3 sm:mt-4 bg-slate-900/80 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-slate-300 border border-slate-800 text-center">
              {activeAlbum ? activeAlbum.title : 'Gallery'} • Photo {lightboxIndex + 1} of {activePhotosList.length}
            </div>
          </div>

          {/* Right Arrow */}
          {activePhotosList.length > 1 && (
            <button
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-colors z-50 border border-white/10"
            >
              <FiChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;

