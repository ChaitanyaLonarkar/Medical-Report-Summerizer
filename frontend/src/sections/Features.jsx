import React from 'react';
import { Activity, FileJson, ShieldCheck } from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import featureIllustration from '../assets/feature_illustration.png';

const Features = () => {
    const features = [
        {
            icon: <Activity className="w-6 h-6 text-white" />,
            title: "Clinically Accurate Summaries",
            description: "Extracts diagnoses, vitals, medications, and observations with high precision.",
            color: "bg-orange-500"
        },
        {
            icon: <FileJson className="w-6 h-6 text-white" />,
            title: "Doctor-Friendly Structured Output",
            description: "Organizes data into History, Findings, Lab Results, and Impression sections.",
            color: "bg-amber-600"
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-white" />,
            title: "Enterprise-Grade Data Security",
            description: "No reports stored permanently. Secure medical data handling.",
            color: "bg-orange-400"
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
                {/* Left Column: Illustration */}
                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="relative rounded-2xl overflow-hidden p-8 flex items-center justify-center">
                        <img
                            src={featureIllustration}
                            alt="AI Analysis Illustration"
                            className="w-full h-auto max-w-lg transform hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Right Column: Features List */}
                <div className="space-y-6">
                    <Card className="border-l-4 border-l-amber-600 transform hover:-translate-y-1 transition-transform duration-300">
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
