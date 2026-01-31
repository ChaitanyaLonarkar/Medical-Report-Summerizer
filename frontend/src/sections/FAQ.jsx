import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Section from '../components/common/Section';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 last:border-box">
            <button
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-900 pr-8">{question}</span>
                <span className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown />
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="text-gray-600 leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "What types of medical reports are supported?",
            answer: "We support a wide range of medical documents including lab reports, discharge summaries, prescriptions, radiology reports, and clinical notes in PDF or image formats."
        },
        {
            question: "Is patient data stored?",
            answer: "No. Security is our top priority. Files are processed in memory and deleted immediately after summarization. We do not store any patient data permanently."
        },
        {
            question: "Can I summarize handwritten or scanned reports?",
            answer: "Our advanced OCR technology performs well with high-quality scans. Handwritten text recognition depends on legibility but is supported for clear handwriting."
        },
        {
            question: "Is it free to use?",
            answer: "We offer a free tier for basic usage. For high-volume professional use, we have premium plans with advanced features and API access."
        }
    ];

    return (
        <Section className="bg-gray-50">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
                    Frequently Asked Questions
                </h2>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 px-6 md:px-12 py-4">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </Section>
    );
};

export default FAQ;
