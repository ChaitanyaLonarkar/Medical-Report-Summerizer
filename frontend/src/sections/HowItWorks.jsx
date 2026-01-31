import React from 'react';
import { Upload, Cpu, Download } from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: "Upload your medical report",
            description: "Upload lab reports, discharge summaries, prescriptions, or scans (PDF/Image).",
            icon: <Upload className="w-5 h-5 text-primary-600" />,
            color: "bg-blue-50"
        },
        {
            id: 2,
            title: 'Click "Summarize with AI"',
            description: "Our advanced AI allows you to extract key medical insights in seconds.",
            icon: <Cpu className="w-5 h-5 text-purple-600" />,
            color: "bg-purple-50"
        },
        {
            id: 3,
            title: "Download or review summary",
            description: "View the structured summary instantly or export as PDF/Word for your records.",
            icon: <Download className="w-5 h-5 text-green-600" />,
            color: "bg-green-50"
        }
    ];

    return (
        <Section id="how-it-works" className="bg-gray-50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">
                    How to Summarize a PDF with AI?
                </h2>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="space-y-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-200 -z-10"></div>

                    {steps.map((step, index) => (
                        <div key={step.id} className="relative flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                            {/* Step Indicator */}
                            <div className="flex-shrink-0 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg border-4 border-white">
                                    {step.id}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-grow grid md:grid-cols-2 gap-6 items-center w-full">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg ${step.color}`}>
                                            {step.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Visual Placeholder */}
                                <Card className="bg-white p-4 border border-gray-100 shadow-sm transform hover:scale-105 transition-transform duration-300">
                                    <div className="aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white opacity-50"></div>
                                        <span className="text-gray-400 font-medium text-sm relative z-10">
                                            Step {step.id} Preview
                                        </span>
                                        {/* Animated element to make it feel alive */}
                                        <div className="absolute bottom-2 right-2 w-8 h-1 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="absolute bottom-4 right-2 w-12 h-1 bg-gray-200 rounded animate-pulse delay-75"></div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default HowItWorks;
