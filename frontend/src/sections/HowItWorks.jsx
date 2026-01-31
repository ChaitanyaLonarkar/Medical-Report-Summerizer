import React from 'react';
import { Upload, Cpu, Download } from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';

// Images (Assumed to be in assets folder)
import uploadDocImg from '../assets/how_it_works_upload_document.png';
import aiProcessImg from '../assets/how_it_works_ai_processing.png';
import viewSummaryImg from '../assets/how_it_works_view_summary.png';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: "Upload your medical report",
            description: "Drag & drop or select your PDF file. We support lab reports, discharge summaries, and prescriptions.",
            icon: <Upload className="w-5 h-5 text-primary-600" />,
            color: "bg-blue-50",
            image: '/step1.png'
        },
        {
            id: 2,
            title: 'AI analyzes the document',
            description: "Our secure AI scans the text to extract clinical facts, medications, and vital signs in real-time.",
            icon: <Cpu className="w-5 h-5 text-purple-600" />,
            color: "bg-purple-50",
            image: '/step2.png'
        },
        {
            id: 3,
            title: "View & Export Summary",
            description: "Get a structured dashboard with key findings. Export it as a clean PDF for your records.",
            icon: <Download className="w-5 h-5 text-green-600" />,
            color: "bg-green-50",
            image: '/step3.png'
        }
    ];

    return (
        <Section id="how-it-works" className="bg-gray-50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">
                    How it Works
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Three simple steps to clarify your health records.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-4">
                <div className="space-y-12 relative">
                    {/* Connecting Line (Desktop) - Adjusted position */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -z-10 transform -translate-x-1/2"></div>

                    {steps.map((step, index) => (
                        <div key={step.id} className={`relative flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                            {/* Step Indicator (Center) */}
                            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 md:translate-y-0 md:relative md:left-auto md:top-auto z-10">
                                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-xl border-4 border-white">
                                    {step.id}
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className={`flex-1 w-full text-center md:text-left ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                                <div className={`flex flex-col ${index % 2 !== 0 ? 'md:items-end' : 'md:items-start'} items-center`}>
                                    <div className={`p-2 rounded-lg ${step.color} inline-block mb-3`}>
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed max-w-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Image Side */}
                            <div className="flex-1 w-full">
                                <Card className="bg-white p-3 border border-gray-100 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden relative">
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                        />
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
