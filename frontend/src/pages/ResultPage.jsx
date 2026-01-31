import React from 'react';
import { useLocation } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';

const ResultPage = () => {
    const location = useLocation();
    const { summary } = location.state || { summary: null };

    // Fallback if no summary is present (e.g., direct access)
    console.log("ResultPage location state:", location.state);

    // Fallback if no summary is present (e.g., direct access)
    if (!summary) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Summary Data Found</h2>
                    <p className="text-gray-600 mb-6">It seems you accessed this page directly or the upload failed to pass data.</p>
                    <a href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg">
                        Go Home & Upload
                    </a>
                </div>
            </div>
        );
    }

    // summary is expected to be a JSON object: { summary: [ { section: "...", points: [...] } ] }
    // If it's the raw summary wrapper due to parse error, handle gracefully
    // But let's assume valid structure based on prompts.py

    const summarySections = summary.summary || [];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar / TOC */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block sticky top-0 h-screen overflow-y-auto p-6">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Contents</h3>
                <nav className="space-y-4">
                    {summarySections.map((section, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="block w-full text-left text-gray-600 hover:text-blue-600 text-sm transition-colors"
                        >
                            {section.section}
                        </button>
                    ))}
                    {/* Hardcoded static links if needed or just dynamic ones */}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-10 mb-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Medical Report Summary</h1>

                    {summarySections.length === 0 ? (
                        <p>No sections found in summary.</p>
                    ) : (
                        summarySections.map((section, idx) => (
                            <section key={idx} id={`section-${idx}`} className="mb-10">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                    {section.section}
                                </h2>
                                <ul className="space-y-3">
                                    {section.points.map((point, pIdx) => (
                                        <li key={pIdx} className="text-gray-700 leading-relaxed flex items-start">
                                            <span className="mr-2 text-blue-500 mt-1.5">•</span>
                                            <span>
                                                {point.text}
                                                {point.pages && point.pages.length > 0 && (
                                                    <span className="ml-2 text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                        p. {point.pages.join(', ')}
                                                    </span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))
                    )}
                </div>
            </main>

            {/* Right Sidebar / Actions */}
            <div className="w-72 p-6 hidden lg:block">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
                    <button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-6 transition-colors shadow-sm">
                        Download
                        <Download size={18} />
                    </button>

                    <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Choose Download Format</h4>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 text-left group">
                            <FileText size={20} className="text-gray-400 group-hover:text-red-500" />
                            <span className="text-gray-600 font-medium group-hover:text-gray-900">PDF</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 text-left group">
                            <FileText size={20} className="text-gray-400 group-hover:text-blue-500" />
                            <span className="text-gray-600 font-medium group-hover:text-gray-900">Word</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
