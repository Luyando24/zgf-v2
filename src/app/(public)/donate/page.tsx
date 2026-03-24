'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Users, Megaphone, TrendingUp, CreditCard, Wallet, Banknote } from 'lucide-react';
import CTA from "@/components/CTA";

export default function DonatePage() {
  const impactStats = [
    { label: "Local organizations supported", value: "100+" },
    { label: "Community members reached", value: "50,000+" },
    { label: "Provinces across Zambia", value: "9" },
  ];

  const donationMethods = [
    {
      title: "Mobile Money",
      description: "Fast and secure donations via Airtel Money or MTN Mobile Money.",
      icon: <Wallet className="w-8 h-8" />,
      action: "Donate via Mobile Money"
    },
    {
      title: "Card Payment",
      description: "Support our work using your Visa or Mastercard through our secure gateway.",
      icon: <CreditCard className="w-8 h-8" />,
      action: "Donate via Card"
    },
    {
      title: "Bank Transfer",
      description: "Direct bank transfers for larger contributions or recurring support.",
      icon: <Banknote className="w-8 h-8" />,
      action: "Get Bank Details"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center text-white text-center overflow-hidden">
        <Image
          src="/images/donationbg.jpg"
          alt="Support Our Mission"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Support Our Mission</h1>
          <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto mb-8">
            Your donation helps us strengthen civil society and empower communities across Zambia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#donate-now" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors">
              Donate Now
            </a>
            <a href="#why-donate" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-dark transition-all">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section id="why-donate" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/impact.jpg"
                  alt="Community Impact"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">Why Your Support Matters</h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Your donation to the Zambian Governance Foundation directly supports our work with local civil society organizations and community-based initiatives across Zambia.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-dark mb-1">Strengthening Communities</h4>
                    <p className="text-gray-600">Your support helps build the capacity of local organizations to address community needs effectively.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-dark mb-1">Amplifying Local Voices</h4>
                    <p className="text-gray-600">We help marginalized communities participate in governance processes that affect their lives.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-dark mb-1">Sustainable Development</h4>
                    <p className="text-gray-600">We promote locally-led solutions that create lasting positive change in communities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Your Donation Makes a Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20">
                <div className="text-4xl md:text-5xl font-bold mb-3">{stat.value}</div>
                <p className="text-lg opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate Now Section */}
      <section id="donate-now" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Make Your Donation Today</h2>
            <p className="text-xl text-gray-600">Choose your preferred donation method below</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationMethods.map((method, index) => (
              <div key={index} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all text-center flex flex-col h-full">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                  {method.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-4">{method.title}</h3>
                <p className="text-gray-600 mb-8 flex-grow">{method.description}</p>
                <button className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors w-full">
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA 
        title="Want to learn more about our impact?"
        description="Download our latest impact report to see how your support is changing lives across Zambia."
        primaryBtnText="View Reports"
        primaryBtnLink="/resources"
      />
    </div>
  );
}
