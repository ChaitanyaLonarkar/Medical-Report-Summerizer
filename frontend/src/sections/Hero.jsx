import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Shield } from 'lucide-react';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Hero = () => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        // Handle file drop logic here (visual only for now)
        console.log('File dropped');
    };

    return (
        <Section className="bg-gradient-to-b from-primary-50 to-white pt-24 md:pt-32 pb-16">
            <div className="text-center max-w-4xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Summarize <span className="text-primary-600">Medical Reports</span> with AI
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Instantly extract key clinical insights and structured summaries from medical PDFs.
                </p>
            </div>

            {/* Upload Card */}
            <div className="max-w-xl mx-auto">
                <div
                    className={`bg-white rounded-3xl p-8 shadow-xl transition-all duration-300 ${isDragOver ? 'ring-4 ring-primary-100' : ''
                        }`}
                >
                    <div
                        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${isDragOver ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Upload size={32} strokeWidth={2} />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Drag & drop your medical report here or
                        </h3>

                        <div className="mt-6">
                            <Button>
                                Upload Medical Report
                            </Button>
                        </div>

                        <p className="text-sm text-gray-400 mt-6 flex items-center justify-center gap-2">
                            <span>Supports PDF</span>
                            <span>•</span>
                            <span>Max 20MB</span>
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Hero;
