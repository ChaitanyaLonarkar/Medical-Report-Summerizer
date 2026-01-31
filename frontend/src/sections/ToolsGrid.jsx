import React from 'react';
import { Microscope, FileText, Pill, Scan, ClipboardPlus } from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';

const ToolsGrid = () => {
    const tools = [
        {
            icon: <Microscope className="w-8 h-8 text-blue-600" />,
            title: "Lab Report Summarizer",
            description: "Analyze blood tests and diagnostic reports with reference ranges."
        },
        {
            icon: <FileText className="w-8 h-8 text-purple-600" />,
            title: "Discharge Summary Analyzer",
            description: "Condense lengthy hospital discharge papers into key action items."
        },
        {
            icon: <Pill className="w-8 h-8 text-green-600" />,
            title: "Prescription Insight Tool",
            description: "Understand medication interactions, strict dosages, and timings."
        },
        {
            icon: <Scan className="w-8 h-8 text-indigo-600" />,
            title: "Radiology Report Parser",
            description: "Simplify complex MRI, CT, and X-ray reports for better understanding."
        },
        {
            icon: <ClipboardPlus className="w-8 h-8 text-rose-600" />,
            title: "Clinical Notes Summarizer",
            description: "Turn unstructured doctor notes into organized medical history."
        }
    ];

    return (
        <Section className="bg-white">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif max-w-2xl mx-auto">
                    More AI Tools to Speed Up Your Workflow
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                    <Card
                        key={index}
                        className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                    >
                        <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-white group-hover:shadow-md transition-all">
                            {tool.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                            {tool.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {tool.description}
                        </p>
                    </Card>
                ))}
                {/* promotional card to make the grid even or interesting */}
                <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white flex flex-col justify-center items-center text-center p-8">
                    <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
                    <p className="text-primary-100 text-lg font-medium">More will coming stay tune</p>
                </Card>
            </div>
        </Section>
    );
};

export default ToolsGrid;
