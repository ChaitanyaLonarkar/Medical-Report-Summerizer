
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Shield, Loader, File, Cpu } from 'lucide-react';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
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
            handleFileValidation(files[0]);
        }
    };

    const handleFileSelect = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileValidation(files[0]);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileValidation = (file) => {
        if (file.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }
        setError(null);
        setSelectedFile(file);
    };

    const handleSummarize = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
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
            setLoading(false); // Only set loading false on error, success navigates away
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
                    className={`bg-white rounded-3xl p-8 shadow-xl transition-all duration-300 ${isDragOver ? 'ring-4 ring-primary-100' : ''}`}
                >
                    <div
                        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors relative min-h-[320px] flex flex-col items-center justify-center ${isDragOver ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-25"></div>
                                    <div className="relative bg-white p-4 rounded-full shadow-sm border border-primary-100">
                                        <Loader className="animate-spin text-primary-600" size={40} />
                                    </div>
                                </div>
                                <p className="text-gray-900 font-bold text-lg">Analyzing Document...</p>
                                <p className="text-gray-500 mt-2 text-sm max-w-xs">Extracting vital signs, medications, and clinical history.</p>
                            </div>
                        ) : selectedFile ? (
                            // File Selected State
                            <div className="flex flex-col items-center justify-center py-4 animate-fadeIn">
                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Uploaded Successfully</h3>
                                <div className="flex items-center gap-2 text-gray-500 mb-8 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                    <FileText size={16} />
                                    <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                                </div>

                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    <Button onClick={handleSummarize} variant="primary" className="w-full py-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                                        <Cpu size={18} className="mr-2" /> Summarize with AI
                                    </Button>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                                    >
                                        Remove & Upload Another
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Initial State
                            <>
                                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <Upload size={32} strokeWidth={2} />
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Drag & drop your medical report
                                </h3>
                                <p className="text-gray-400 text-sm mb-8">
                                    Supported formats: PDF (Max 20MB)
                                </p>

                                <input
                                    type="file"
                                    accept="application/pdf"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <Button onClick={handleButtonClick}>
                                    Select File
                                </Button>
                            </>
                        )}

                        {error && (
                            <div className="absolute bottom-4 left-0 right-0 text-center text-red-500 text-sm bg-red-50 py-2 mx-8 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                        <Shield size={16} /> Secure & Private
                    </div>
                    <span>•</span>
                    <div>
                        HIPAA Compliant Processing
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Hero;
