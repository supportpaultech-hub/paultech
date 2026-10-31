import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Code2, 
  ShoppingBag, 
  Smartphone, 
  Cpu, 
  Cloud, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

const Services = () => {
  const [pricingTab, setPricingTab] = useState('web');
  useEffect(() => {
    // Scroll to top when visiting the page
    window.scrollTo(0, 0);
  }, []);

  const services = [
    { 
      id: "web-design",
      title: "Web Design and Development", 
      subtitle: "Immersive Digital Experiences",
      desc: "Web designing is not just about making a website look pretty; it's about creating an immersive digital experience that engages users and communicates your brand effectively. We build responsive, robust, and highly scalable websites tailored to your specific business needs. From corporate portals to complex e-commerce platforms, our web solutions are designed to perform.",
      features: ["Custom UI/UX Design", "Responsive Layouts", "E-Commerce Solutions", "CMS Integration"],
      img: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80",
    },
    { 
      id: "mobile-dev",
      title: "Mobile Application Development", 
      subtitle: "Powerful Apps for iOS & Android",
      desc: "We build intuitive, responsive, and high-performance mobile applications for both iOS and Android platforms to help you reach your customers on the go. Our development process ensures your app is not only visually stunning but also technically flawless, providing a seamless user experience across all devices.",
      features: ["Native iOS & Android", "Cross-Platform Frameworks", "API Integration", "App Store Deployment"],
      img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80",
    },
    { 
      id: "erp-development",
      title: "ERP Development", 
      subtitle: "Streamline Enterprise Operations",
      desc: "Streamline your business operations with our bespoke ERP software tailored to your organization's workflow. We build scalable CRM, inventory management, HR, supply chain, and financial tracking modules that centralize data and automate core business processes.",
      features: ["Custom ERP Systems", "Supply Chain & Inventory", "Financial Management", "CRM & Process Automation"],
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    },
    { 
      id: "logo-design",
      title: "Logo Design & Branding", 
      subtitle: "Establish Your Unique Identity",
      desc: "Create a strong brand identity with our professional logo design services. We craft unique, memorable logos that resonate with your target audience. Beyond just a logo, we help you define your brand's color palette, typography, and visual language to ensure consistency across all touchpoints.",
      features: ["Custom Logo Creation", "Brand Guidelines", "Typography Selection", "Marketing Collateral"],
      img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=80",
    },
    { 
      id: "consulting",
      title: "IT Consulting", 
      subtitle: "Strategic Technological Guidance",
      desc: "Our expert IT consultants provide strategic guidance to help you navigate complex technological transformations and optimize your business processes. We analyze your current infrastructure, identify inefficiencies, and recommend the best software solutions and ERP integrations (like SAP) to propel your business forward.",
      features: ["Digital Transformation", "ERP Integration", "Security Audits", "Technology Roadmaps"],
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
    },
    { 
      id: "digital-marketing",
      title: "Digital Marketing", 
      subtitle: "Boost Online Visibility",
      desc: "Boost your online visibility and drive conversions with our comprehensive digital marketing strategies, including SEO, social media, and PPC campaigns. We don't just drive traffic; we drive the right traffic. Our data-driven approach ensures maximum ROI for your marketing budget.",
      features: ["Search Engine Optimization", "Social Media Management", "PPC Campaigns", "Content Marketing"],
      img: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1000&q=80",
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Services Hero Header */}
      <section className="bg-slate-900 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-slate-800 relative overflow-hidden">
        {/* Glow ambient effects: Matching Brand Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[85px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-orange-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            End-To-End Software Capabilities
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Our Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Software Services</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            We offer end-to-end software solutions designed to help your business scale, innovate, and thrive in the digital era.
          </p>
        </div>
      </section>

      {/* Services Detailed List (Zig-Zag Layout) */}
      <section className="py-12 sm:py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24">
          {services.map((service, index) => (
            <div key={service.id} id={service.id} className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-20`}>
              
              {/* Image Side */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${index % 2 !== 0 ? 'from-green-400 to-cyan-500' : 'from-blue-500 to-orange-400'} rounded-2xl transform translate-x-2 sm:translate-x-4 translate-y-2 sm:translate-y-4 opacity-50 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300`}></div>
                  <img src={service.img} alt={service.title} className="relative w-full h-[220px] sm:h-[300px] md:h-[380px] lg:h-[400px] object-cover rounded-2xl shadow-2xl border border-white" />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2">
                <h4 className="text-blue-600 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-2">{service.subtitle}</h4>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4 sm:mb-6">{service.title}</h2>
                <div className="w-16 h-1 bg-orange-500 mb-4 sm:mb-6 rounded-full"></div>
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
                  {service.desc}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-slate-700 text-xs sm:text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 sm:mt-10">
                  <Link to="/contact" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-orange-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors duration-300">
                    Get Started With Us
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>
      
      {/* 4. Pricing Plans Section (Modern & Professional) */}
      <section id="pricing" className="relative py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 border-t border-slate-200 overflow-hidden">
        {/* Soft Ambient Brand Accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-500/5 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />
        
        {/* Subtle Tech Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <p className="text-orange-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
              Transparent & Value-Driven Pricing
            </p>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Choose the Perfect Plan for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600">Your Growth</span>
            </h2>
            
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
              Transparent, competitive packages designed to deliver real business outcomes. From rapid digital launches to enterprise-grade bespoke architectures.
            </p>

            {/* Interactive Pricing Category Toggle */}
            <div className="flex justify-center mt-8 sm:mt-10">
              <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-inner backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setPricingTab('web')}
                  className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                    pricingTab === 'web'
                      ? 'bg-white text-slate-900 shadow-md shadow-slate-200/80 ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Globe className={`w-4 h-4 ${pricingTab === 'web' ? 'text-orange-500' : 'text-slate-500'}`} />
                  <span>Website Packages</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${pricingTab === 'web' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                    3 Plans
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPricingTab('custom')}
                  className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                    pricingTab === 'custom'
                      ? 'bg-white text-slate-900 shadow-md shadow-slate-200/80 ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Cpu className={`w-4 h-4 ${pricingTab === 'custom' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Custom Apps & Software</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${pricingTab === 'custom' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    Enterprise
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: WEBSITE PACKAGES */}
          {pricingTab === 'web' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-14 sm:mb-16 items-stretch">
              {/* 1. Static Website (Starter) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group">
                <div>
                  {/* Card Top Pill */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-orange-600 shadow-sm">
                      <Globe className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] sm:text-xs tracking-wider uppercase">
                      Starter
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">Static Website</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
                    Perfect for personal portfolios, landing pages & small businesses needing a fast digital presence.
                  </p>

                  {/* Price Block */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-slate-700">₹</span>
                      <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">5,999</span>
                      <span className="text-slate-500 text-xs sm:text-sm font-semibold">/ Year</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">Complete setup • No hidden setup fee</p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 mb-8 text-xs sm:text-sm text-slate-600 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">1 Modern</strong> Home Page</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">5 Static</strong> Content Pages</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Interactive</strong> Contact Form</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Free SSL</strong> & Cloud Hosting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">100% Mobile</strong> Responsive</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link 
                    to="/contact" 
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-orange-500 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-slate-400 font-medium mt-2.5">
                    ✓ Delivery in 5–7 Working Days
                  </p>
                </div>
              </div>

              {/* 2. Dynamic Website (Professional - MOST POPULAR) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border-2 border-orange-500 shadow-2xl shadow-orange-500/15 md:-translate-y-4 transition-all duration-300 flex flex-col justify-between relative group z-10">
                {/* Floating Best Value Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-full shadow-lg shadow-orange-500/30 tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  <span>MOST POPULAR • BEST VALUE</span>
                </div>

                <div>
                  {/* Card Top Pill */}
                  <div className="flex items-center justify-between mb-6 pt-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-orange-100/80 text-orange-700 font-black text-[10px] sm:text-xs tracking-wider uppercase">
                      Growth Plan
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">Dynamic Website</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
                    Designed for growing businesses needing content management, product catalogs & dynamic updates.
                  </p>

                  {/* Price Block */}
                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-orange-600">₹</span>
                      <span className="text-4xl sm:text-5xl font-extrabold text-orange-600 tracking-tight">10,999</span>
                      <span className="text-slate-600 text-xs sm:text-sm font-semibold">/ Year</span>
                    </div>
                    <p className="text-[11px] text-orange-700 font-semibold mt-1">Most recommended for businesses & firms</p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 mb-8 text-xs sm:text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Custom UI/UX</strong> Home Page</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Up to 10</strong> Dynamic Pages (CMS)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Portfolio / Gallery</strong> Module</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">WhatsApp Chat</strong> & Lead Capture</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">On-Page SEO</strong> & Analytics</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">24/7 Technical</strong> Support</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link 
                    to="/contact" 
                    className="w-full py-4 px-4 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-2 group-hover:gap-3 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Claim Popular Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-orange-600 font-semibold mt-2.5">
                    ✓ Dedicated Project Manager Included
                  </p>
                </div>
              </div>

              {/* 3. E-Commerce (Scale / Online Store) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group">
                <div>
                  {/* Card Top Pill */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 font-bold text-[10px] sm:text-xs tracking-wider uppercase">
                      Online Store
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">E-Commerce</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
                    Full-featured online storefront with shopping cart, payment gateways, and inventory management.
                  </p>

                  {/* Price Block */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-slate-700">₹</span>
                      <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">20,000</span>
                      <span className="text-slate-500 text-xs sm:text-sm font-semibold">/ Year</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">0% Commission on your store sales</p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 mb-8 text-xs sm:text-sm text-slate-600 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Shopping Cart</strong> & Fast Checkout</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Payment Gateway</strong> (UPI & Cards)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Unlimited</strong> Products & Categories</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Customer Accounts</strong> & Tracking</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Discount Coupons</strong> Engine</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Security Audits</strong> & Backups</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link 
                    to="/contact" 
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-orange-500 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3"
                  >
                    <span>Launch Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-slate-400 font-medium mt-2.5">
                    ✓ PCI-DSS & High-Security Standards
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM APPS & ENTERPRISE SOFTWARE */}
          {pricingTab === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-14 sm:mb-16 items-stretch">
              {/* 1. Mobile Applications */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200/70 flex items-center justify-center text-cyan-600 shadow-sm">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] sm:text-xs tracking-wider uppercase">
                      iOS & Android
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">Mobile Applications</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
                    Native and cross-platform apps built for blazing speed, intuitive UI, and high user retention.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Scope-Based Pricing</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                      Custom Quote
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">Starting from ₹29,999 • Milestone sprints</p>
                  </div>

                  <ul className="space-y-3.5 mb-8 text-xs sm:text-sm text-slate-600 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Android & iOS Apps</strong> (React Native / Flutter)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Custom Interactive UI/UX Design</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Push Notifications & Live Chat</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Secure Cloud Backend & API Sync</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Play Store & App Store Deployment</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">6 Months Post-Launch Warranty</strong></span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link 
                    to="/contact" 
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-orange-500 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3"
                  >
                    <span>Discuss App Requirements</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-slate-400 font-medium mt-2.5">
                    ✓ Dedicated Technical PM & Wireframes
                  </p>
                </div>
              </div>

              {/* 2. Enterprise Software / ERP (MOST REQUESTED) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 md:-translate-y-4 transition-all duration-300 flex flex-col justify-between relative group z-10">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-full shadow-lg shadow-emerald-600/30 tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  <span>MOST REQUESTED ENTERPRISE</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6 pt-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 font-black text-[10px] sm:text-xs tracking-wider uppercase">
                      ERP & Software
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">Enterprise Software</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
                    Bespoke CRM, ERP, Billing, and automation platforms built specifically around your organization's workflow.
                  </p>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 mb-6">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Enterprise Scope</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight mt-0.5">
                      Tailored Scope
                    </div>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">Dedicated sprint team • SLA Guarantee</p>
                  </div>

                  <ul className="space-y-3.5 mb-8 text-xs sm:text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Custom Web Apps, ERP & Billing Software</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Role-Based Access Control (RBAC)</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Automated PDF/Excel Reporting & GST</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Real-time Data Analytics & Dashboards</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">High-Concurrency Cloud Database Tuning</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Weekly Sprint Demos & Dedicated Leads</strong></span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link 
                    to="/contact" 
                    className="w-full py-4 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 flex items-center justify-center gap-2 group-hover:gap-3 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Book Architect Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-emerald-700 font-semibold mt-2.5">
                    ✓ Custom NDA & Complete IP Ownership
                  </p>
                </div>
              </div>

              {/* 3. Cloud & DevOps Systems */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/70 flex items-center justify-center text-sky-600 shadow-sm">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-sky-100/70 text-sky-800 font-bold text-[10px] sm:text-xs tracking-wider uppercase">
                      Cloud & DevOps
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">Cloud & SaaS Platforms</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
                    Scalable multi-tenant cloud platforms, microservices architecture, and DevOps CI/CD pipelines.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Infrastructure Scope</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                      Cloud Contract
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">99.9% Uptime SLA • Automated pipelines</p>
                  </div>

                  <ul className="space-y-3.5 mb-8 text-xs sm:text-sm text-slate-600 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">AWS, Azure & DigitalOcean Architecture</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Microservices & Multi-Tenant SaaS</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">CI/CD Automated Deployment Pipelines</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">Automated Disaster Recovery & Backups</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">API Security, Firewall & DDoS Guard</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span><strong className="text-slate-900 font-bold">24/7 Cloud Monitoring & Log Audits</strong></span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link 
                    to="/contact" 
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-orange-500 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3"
                  >
                    <span>Consult Cloud Engineers</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-slate-400 font-medium mt-2.5">
                    ✓ 99.9% Uptime SLA Guaranteed
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4-Pillar Trust & Assurance Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">100% IP Ownership</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Full transfer of source code, design assets & credentials upon completion.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Milestone Sprints</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Weekly demos and live staging links so you verify progress in real-time.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Zero Hidden Fees</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Clear upfront proposals, transparent milestone billing, and fair renewals.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Direct Dev Support</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Dedicated project manager and direct WhatsApp/email support anytime.</p>
              </div>
            </div>
          </div>

          {/* Custom Requirement Callout Card */}
          <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
              <div className="text-center lg:text-left">
                <p className="text-orange-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
                  Custom Requirements?
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Need a Tailored Solution or Enterprise Scope?
                </h3>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
                  Our senior software architects can evaluate your requirements, design the optimal architecture, and deliver a detailed fixed-price roadmap within 24 hours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all text-center text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <span>Request Custom Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+917209986943"
                  className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-bold rounded-xl border border-white/15 transition-all text-center text-sm sm:text-base"
                >
                  Call +91 72099 86943
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12 sm:py-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-6">Ready to transform your business?</h2>
          <p className="text-blue-100 mb-8 sm:mb-10 text-sm sm:text-base lg:text-lg">Let's discuss how our services can help you achieve your goals.</p>
          <Link to="/contact" className="bg-white text-blue-600 hover:bg-orange-500 hover:text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-colors duration-300 shadow-xl inline-block">
            Contact Our Experts
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
