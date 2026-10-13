import React, { useEffect, useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Loader2,
  AlertCircle,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { openRazorpayPopup } from '../utils/razorpay';

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  amount = 1000,
  title = "Industrial Internship Registration",
  candidateDetails = {},
  onPaymentSuccess
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const launchRazorpayModal = () => {
    setErrorMsg('');
    setIsProcessing(true);

    openRazorpayPopup({
      amount,
      title,
      candidateName: candidateDetails.name,
      candidateEmail: candidateDetails.email,
      candidatePhone: candidateDetails.phone,
      onSuccess: (paymentInfo) => {
        setIsProcessing(false);
        onPaymentSuccess(paymentInfo);
      },
      onFailure: (errText) => {
        setIsProcessing(false);
        setErrorMsg(errText || 'Payment failed. Please try again.');
      },
      onDismiss: () => {
        setIsProcessing(false);
      }
    });
  };

  useEffect(() => {
    if (isOpen) {
      launchRazorpayModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">Razorpay Popup Gateway</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  <Lock className="w-2.5 h-2.5" /> 256-bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-400">Official Razorpay Modal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Summary */}
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-50 p-4 border-b border-orange-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registration Amount</div>
            <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1">
              ₹{amount.toLocaleString('en-IN')} <span className="text-xs font-semibold text-slate-500">INR</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">{candidateDetails.name || 'Candidate'}</div>
            <div className="text-[11px] text-slate-500">{candidateDetails.email || ''}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-center">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isProcessing ? (
            <div className="py-8 space-y-3">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Opening Official Razorpay Popup Modal...</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Please choose your preferred payment option (UPI, GPay, PhonePe, Cards, NetBanking, Wallets) in the Razorpay popup.
              </p>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-800">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Razorpay Standard Checkout Active</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Razorpay Popup Modal supports all Indian payment methods including UPI Apps, QR Code, Credit/Debit Cards, NetBanking, and Wallets.
                </p>
                {!keyId && (
                  <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 mt-2 font-mono">
                    ⚠️ <code>VITE_RAZORPAY_KEY_ID</code> is not set in <code>frontend/.env</code>. Enter your Razorpay Key ID (e.g. <code>rzp_test_...</code>) in <code>frontend/.env</code> for live payments.
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={launchRazorpayModal}
                className="w-full py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <CreditCard className="w-4 h-4" />
                <span>Open Razorpay Popup Modal (₹{amount})</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
