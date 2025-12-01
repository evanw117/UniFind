// src/app/contact/page.tsx
"use client";

import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react'; 
import { supabase } from '@/lib/supabaseClient'; 

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return; 
        
        setIsSubmitting(true);
        setStatusMessage('Sending message...');

        // REAL SUPABASE SUBMISSION LOGIC
        const { error } = await supabase
            .from('contact_messages') 
            .insert({
                sender_name: formData.name,
                sender_email: formData.email,
                subject: formData.subject,
                content: formData.message,
            });

        setIsSubmitting(false);

        if (error) {
            console.error('Error submitting contact form:', error);
            setStatusMessage(`Error: Failed to send message. Please try again or email us directly.`);
        } else {
            setStatusMessage('Thank you! Your message has been received.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }
    };

    // Card component for contact info
    const ContactInfoCard = ({ icon: Icon, title, content }: { icon: any, title: string, content: string | React.ReactNode }) => (
        <div className="flex items-start space-x-4 p-4 rounded-lg bg-white shadow-sm border border-slate-100">
            <div className="p-3 bg-[#4B7C9B]/10 rounded-full">
                <Icon className="w-6 h-6 text-[#4B7C9B]" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                <p className="text-slate-600 mt-1 text-sm">{content}</p>
            </div>
        </div>
    );

    return (
        // 🎯 CHANGES: Reduced vertical padding (py-8/py-12) to make content more compact.
        <div className="min-h-screen bg-[#F7F9FC] py-8 sm:py-12 flex items-center"> 
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-base font-semibold text-[#4B7C9B] tracking-wide uppercase">Get In Touch</h2>
                    <p className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                        Contact UniFind Support
                    </p>
                    <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
                        We're here to help. Send us an email and we'll get back to you as soon as possible.
                    </p>
                </div>

                {/* Main Content: Two Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Reduced gap */}

                    {/* Left Column: Simplified Contact Information (Only Email) */}
                    <div className="space-y-6 lg:col-span-1">
                        <ContactInfoCard 
                            icon={Mail} 
                            title="Email Us Directly" 
                            content={<a href="mailto:support@unifind.ie" className="text-[#4B7C9B] font-medium hover:underline">support@unifind.ie</a>} 
                        />
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-100"> {/* Reduced padding */}
                            <h3 className="text-2xl font-bold text-slate-800 mb-5">Send a Message</h3>

                            {/* Status Message */}
                            {statusMessage && (
                                <div className={`p-3 mb-5 rounded-lg text-sm font-medium ${
                                    statusMessage.startsWith('Thank you') 
                                        ? 'bg-green-100 text-green-700' 
                                        : statusMessage.startsWith('Sending')
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-red-100 text-red-700'
                                }`}>
                                    {statusMessage}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Reduced gap */}
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4B7C9B] focus:border-[#4B7C9B] transition duration-150"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4B7C9B] focus:border-[#4B7C9B] transition duration-150"
                                        placeholder="university@email.ie"
                                    />
                                </div>
                            </div>
                            
                            {/* Subject Field (Full width) */}
                            <div className="mt-4"> {/* Reduced margin */}
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4B7C9B] focus:border-[#4B7C9B] transition duration-150"
                                    placeholder="Inquiry about a reported item"
                                />
                            </div>

                            {/* Message Field (Full width) */}
                            <div className="mt-4"> {/* Reduced margin */}
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4} // 🎯 CHANGE: Reduced rows from 5 to 4
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4B7C9B] focus:border-[#4B7C9B] transition duration-150 resize-none"
                                    placeholder="Type your detailed message here..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-5"> {/* Reduced margin */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-2 border border-transparent text-base font-bold rounded-lg shadow-lg text-white bg-[#4B7C9B] hover:bg-[#3A627B] disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-150"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}