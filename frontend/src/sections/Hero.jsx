
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Shield, Loader } from 'lucide-react';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleFileUpload(files[0]);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (file) => {
        if (file.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Update URL to match backend
            const response = await axios.post('http://localhost:8000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Navigate to Result Page with summary data
            navigate('/result', { state: { summary: response.data } });

        } catch (err) {
            console.error(err);
            setError('Failed to process the file. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        } `}
                >
                    <div
                        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors relative ${isDragOver ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200 hover:border-gray-300'
                            } `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader className="animate-spin text-primary-600 mb-4" size={48} />
                                <p className="text-gray-600 font-medium">Processing your report...</p>
                                <p className="text-sm text-gray-400 mt-2">This may take a moment.</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Upload size={32} strokeWidth={2} />
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Drag & drop your medical report here or
                                </h3>

                                <div className="mt-6">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                    <Button onClick={handleButtonClick}>
                                        Upload Medical Report
                                    </Button>
                                </div>

                                <p className="text-sm text-gray-400 mt-6 flex items-center justify-center gap-2">
                                    <span>Supports PDF</span>
                                    <span>•</span>
                                    <span>Max 20MB</span>
                                </p>
                            </>
                        )}

                        {error && (
                            <div className="absolute bottom-4 left-0 right-0 text-center text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Hero;
