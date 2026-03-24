'use client';

import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl opacity-90">
              Have questions or want to partner with us? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-dark mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  Our team is here to help and answer any questions you might have.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark">Our Office</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      9 Mansasa close, off Bwinjimfumu road,<br />
                      Rhodespark, Lusaka, Zambia<br />
                      P.O BOX 32615
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark">Email Us</h4>
                    <a href="mailto:info@zgf.org.zm" className="text-gray-600 text-sm hover:text-primary transition-colors">
                      info@zgf.org.zm
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark">Call Us</h4>
                    <a href="tel:+260211259784" className="text-gray-600 text-sm hover:text-primary transition-colors">
                      +260 211 259784
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark">Working Hours</h4>
                    <p className="text-gray-600 text-sm">Mon - Fri: 08:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold text-dark ml-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-bold text-dark ml-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold text-dark ml-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-dark ml-1">Message</label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder="Your message here..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-gray-200 relative grayscale hover:grayscale-0 transition-all duration-700">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">
          Map Integration Placeholder
        </div>
      </section>
    </div>
  );
}
