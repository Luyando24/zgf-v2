'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Wrench, 
  Clock, 
  Heart, 
  FileUp, 
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import CTA from "@/components/CTA";

export default function VolunteerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center bg-gray-50 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-white p-12 md:p-16 rounded-[3rem] shadow-xl border border-gray-100">
            <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-lg shadow-primary/20">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-dark mb-4">Application Received!</h1>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Thank you for your interest in volunteering with the Zambia Governance Foundation. 
              Our team will review your application and get back to you shortly.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-primary text-white px-10 py-4 rounded-full font-black hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              Back to Careers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Volunteer With Us</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Join our team of dedicated volunteers and make a difference in Zambian communities. Share your skills, time, and passion to support our initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-16">
                {error && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Personal Information */}
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-dark">Personal Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            required
                            type="text" 
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            required
                            type="email" 
                            placeholder="john@example.com"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            required
                            type="tel" 
                            placeholder="+260 9xx xxx xxx"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Location / Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            required
                            type="text" 
                            placeholder="Lusaka, Zambia"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Volunteer Details */}
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Wrench size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-dark">Volunteer Details</h2>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Skills & Expertise</label>
                        <div className="relative">
                          <Wrench className="absolute left-4 top-4 text-gray-400" size={18} />
                          <textarea 
                            required
                            placeholder="What skills can you offer? (e.g., teaching, marketing, data analysis)"
                            rows={3}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Availability</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-4 text-gray-400" size={18} />
                          <textarea 
                            required
                            placeholder="How much time can you commit? (e.g., 5 hours/week, weekends only)"
                            rows={2}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Why do you want to volunteer with us?</label>
                        <div className="relative">
                          <Heart className="absolute left-4 top-4 text-gray-400" size={18} />
                          <textarea 
                            required
                            placeholder="Share your motivation for joining our mission..."
                            rows={4}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Resume / CV (Optional)</label>
                        <div className="relative border-2 border-dashed border-gray-100 rounded-[2rem] p-8 text-center hover:border-primary/40 transition-all group">
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <FileUp className="mx-auto mb-4 text-gray-300 group-hover:text-primary transition-colors" size={40} />
                          <p className="text-sm font-bold text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">PDF, DOC, DOCX (Max 5MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-8">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-lg hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Send size={20} />
                        </>
                      )}
                    </button>
                    <p className="text-center mt-6 text-xs text-gray-400 font-medium">
                      By submitting this form, you agree to our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA 
        title="Looking for a career instead?"
        description="Check out our current job openings and become a full-time part of our mission."
        primaryBtnText="View Jobs"
        primaryBtnLink="/careers"
      />
    </div>
  );
}
