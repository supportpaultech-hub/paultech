import React from 'react';
import Card from '../components/Card';
import { FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Starts at ₹9,999',
      features: ['5 Pages Static Website', 'Responsive Design', 'Basic SEO', '1 Year Free Hosting', 'Contact Form'],
      recommended: false
    },
    {
      name: 'Professional',
      price: 'Starts at ₹24,999',
      features: ['Dynamic Website (CMS)', 'Admin Panel', 'E-commerce Integration (up to 50 products)', 'Advanced SEO', 'Social Media Integration'],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 'Custom Pricing',
      features: ['Custom Web Application', 'Mobile App (Android + iOS)', 'ERP / Billing Solutions', 'Dedicated Server Setup', '24/7 Priority Support'],
      recommended: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-3 sm:mb-6">Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Pricing</span></h1>
        <p className="text-sm sm:text-xl text-slate-600 max-w-2xl mx-auto">
          Choose a plan that fits your business needs. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            highlight={plan.recommended}
            className={`relative ${plan.recommended ? 'py-8 sm:py-12 shadow-xl md:scale-105 z-10' : 'py-6 sm:py-10'}`}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider shadow-md">
                RECOMMENDED
              </div>
            )}
            
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-600 mb-6 sm:mb-8">{plan.price}</div>
            
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2.5 sm:gap-3 text-slate-600 text-xs sm:text-sm">
                  <FiCheck className="text-blue-500 shrink-0" size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              to="/contact" 
              className={`block w-full text-center py-2.5 sm:py-3 px-6 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                plan.recommended 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Select Plan
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
