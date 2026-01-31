import React from 'react';
import { Activity, FileJson, ShieldCheck } from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';

const Features = () => {
    const features = [
        {
            icon: <Activity className="w-6 h-6 text-white" />,
            title: "Clinically Accurate Summaries",
            description: "Extracts diagnoses, vitals, medications, and observations with high precision.",
            color: "bg-blue-500"
        },
        {
            icon: <FileJson className="w-6 h-6 text-white" />,
            title: "Doctor-Friendly Structured Output",
            description: "Organizes data into History, Findings, Lab Results, and Impression sections.",
            color: "bg-purple-500"
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-white" />,
            title: "Enterprise-Grade Data Security",
            description: "No reports stored permanently. Secure medical data handling.",
            color: "bg-green-500"
        }
    ];

    return (
        <Section className="bg-white">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
                    Why Use Our AI Summarizer?
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Image Placeholder */}
                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-100 group">
                        {/* Abstract Medical Image Placeholder using CSS Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-gray-400 text-center p-8">
                                <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <p className="font-medium">Medical Professional Analysis</p>
                            </div>
                        </div>
                        {/* Overlay content to mimic the screenshot's "busy doctor" feel */}
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/009/756/066/large_2x/analysis-report-concept-black-illustration-vector.jpg"
                            alt="Professional analysis report"
                            className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Right Column: Features List */}
                <div className="space-y-6">
                    <Card className="border-l-4 border-l-blue-500 transform hover:-translate-y-1 transition-transform duration-300">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4 mb-8 last:mb-0">
                                <div className={`flex-shrink-0 w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </Card>
                </div>
            </div>
        </Section>
    );
};

export default Features;
