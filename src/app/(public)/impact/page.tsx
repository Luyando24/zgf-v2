'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import CTA from "@/components/CTA";
import { ChevronLeft, ChevronRight, Quote, Download, ArrowRight, Shield, Users, Zap, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stories = [
  {
    quote: "Through ZGF's training, our local CSO was able to secure funding and mobilize over 200 women in our district for civic engagement.",
    author: "Grace, CSO Leader in Central Province"
  },
  {
    quote: "The governance workshops provided by ZGF helped our community understand our rights and how to effectively engage with local authorities.",
    author: "John, Community Leader in Lusaka"
  },
  {
    quote: "With ZGF's support, we developed a youth-led initiative that has created sustainable livelihoods for over 50 young people in our rural community.",
    author: "Sarah, Youth Coordinator in Northern Province"
  }
];

const stats = [
  { value: "120+", label: "Civil Society Organizations Supported" },
  { value: "10", label: "Projects in All Provinces" },
  { value: "15,000+", label: "Direct Community Beneficiaries" },
  { value: "50+", label: "Capacity-Building Workshops" }
];

const impactAreas = [
  {
    title: "Governance and Civic Engagement",
    description: "Empowering citizens to participate in democratic processes and hold institutions accountable through training, resources, and advocacy support.",
    icon: <Shield className="w-8 h-8" />,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Grantmaking and CSO Support",
    description: "Providing financial resources and organizational development to strengthen civil society organizations across Zambia.",
    icon: <Zap className="w-8 h-8" />,
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Community Empowerment",
    description: "Building capacity within communities to identify, prioritize, and address their own development needs through participatory approaches.",
    icon: <Users className="w-8 h-8" />,
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    title: "Youth and Women Inclusion",
    description: "Creating opportunities for marginalized groups to participate in decision-making processes and access resources for development.",
    icon: <Heart className="w-8 h-8" />,
    color: "bg-red-50 text-red-600"
  }
];

export default function ImpactPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000 })]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Impact</h1>
            <p className="text-xl opacity-90">
              At the Zambian Governance Foundation (ZGF), we believe in meaningful, community-led change. 
              Our impact reflects years of support to civil society organizations across Zambia.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</h2>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">Impact Areas</h2>
            <p className="text-gray-600 text-lg">
              We focus our efforts on four key pillars that drive sustainable development and accountable governance in Zambia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="flex gap-6 p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-lg transition-all">
                <div className={`${area.color} p-4 rounded-2xl h-fit shrink-0`}>
                  {area.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-3">{area.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories of Change Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-12">Stories of Change</h2>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {stories.map((story, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
                    <div className="bg-white p-8 md:p-12 rounded-3xl relative shadow-sm border border-gray-100">
                      <Quote className="absolute top-6 left-6 text-primary/10 w-16 h-16 -z-0" />
                      <div className="relative z-10">
                        <p className="text-xl md:text-2xl italic text-gray-700 mb-8 leading-relaxed">
                          "{story.quote}"
                        </p>
                        <footer className="text-primary font-bold">
                          — {story.author}
                        </footer>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={scrollPrev}
              className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 bg-white text-primary p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all z-20"
              aria-label="Previous story"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 bg-white text-primary p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all z-20"
              aria-label="Next story"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Impact Section 1 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/impact.jpg"
                  alt="Inclusive Governance"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Focus Area</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">Inclusive Governance</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We work to ensure that governance processes in Zambia are inclusive, transparent, and accountable. 
                By empowering local CSOs, we help them advocate for the rights of marginalized groups and 
                engage effectively with decision-makers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Policy Advocacy Training",
                  "Civic Engagement Workshops",
                  "Transparency Tools",
                  "Accountability Frameworks"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/what-we-do" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                Explore our approach <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Impact Section 2 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Our Reach</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">Strengthening Civil Society</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Our support extends across all ten provinces of Zambia, reaching both urban and remote rural communities. 
                We provide the tools, funding, and mentorship that local organizations need to become sustainable 
                drivers of development.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary h-fit">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark">Technical Assistance</h4>
                    <p className="text-sm text-gray-500">One-on-one mentorship and organizational capacity building.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary h-fit">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark">Direct Funding</h4>
                    <p className="text-sm text-gray-500">Providing the financial resources needed for community-led projects.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about2.jpg"
                alt="CSO Support"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Reports CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-dark text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">Download Our Impact Reports</h2>
              <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                Dive deeper into our work and see the detailed results of our programs through our annual impact and financial reports.
              </p>
              <Link
                href="/resources"
                className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-primary-dark transition-all inline-flex items-center gap-3 shadow-xl shadow-primary/20"
              >
                <Download size={20} />
                Go to Resource Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTA 
        title="Be Part of the Change"
        description="Your support helps us reach more communities and create lasting impact across Zambia."
      />
    </div>
  );
}
