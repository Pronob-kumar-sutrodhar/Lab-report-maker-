import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { authService } from '../services/authService';

interface EmailVerificationModalProps {
  token: string;
  onClose: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ token, onClose }) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      try {
        const response = await authService.verifyEmail(token);
        if (mounted) {
          if (response.success) {
            setStatus('success');
          } else {
            setStatus('error');
            setErrorMessage(response.error || 'Verification failed');
          }
        }
      } catch (e) {
        if (mounted) {
          setStatus('error');
          setErrorMessage('An unexpected error occurred');
        }
      }
    };

    verify();

    return () => { mounted = false; };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResendStatus('sending');
    await authService.resendVerification(resendEmail);
    setResendStatus('sent');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Email Verification</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                <Loader2 size={32} className="animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Verifying your email...</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Please wait a moment.</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                <CheckCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Email Verified!</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your account has been successfully verified. You can now use all features of the application.
                </p>
              </div>
              <Button onClick={onClose} className="w-full">
                Continue to App
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Verification Failed</h3>
                <p className="text-red-600 dark:text-red-400 mb-2">{errorMessage}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  The link may have expired or is invalid.
                </p>
              </div>

              {resendStatus === 'sent' ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg text-sm text-green-700 dark:text-green-300">
                   If an account matches that email, a new link has been sent!
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                   <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Resend Verification Email</p>
                   <div className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="Enter your email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <Button type="submit" isLoading={resendStatus === 'sending'} className="shrink-0" variant="secondary">
                        <RefreshCw size={14} className="mr-1" /> Resend
                      </Button>
                   </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};