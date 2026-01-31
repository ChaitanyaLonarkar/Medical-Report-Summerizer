import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Download, FileText, Activity, Heart, Calendar,
    Shield, CheckCircle, Clock, Pill, Thermometer,
    User, MapPin, Phone, Mail, AlertCircle
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';

const ResultPage = () => {
    const location = useLocation();
    const { summary } = location.state || { summary: null };

    // Debug log
    console.log("Dashboard Data:", summary);

    // --- Fallback State ---
    if (!summary) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">No Summary Data Found</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        It seems you accessed this page directly or the analysis is incomplete.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Go Back Home
                    </Link>
                </div>
            </div>
        );
    }

    // --- Data Extraction safely ---
    const patient = summary.patient_profile || {};
    const sections = summary.sections || {};
    const medications = summary.medications || [];
    const timeline = summary.timeline || [];
    const labData = summary.lab_data || [];

    // --- Mock Data for Visuals if 'lab_data' is sparse ---
    // If we have actual lab data, we format it. Otherwise we might show placeholder or hide.
    const chartData = labData.map(item => ({
        name: item.test_name,
        value: item.value,
        fullMark: 100 // simplistic scale
    }));

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
            {/* --- Top Header "Medicare Portal" style --- */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-600 text-white p-2 rounded-lg">
                        <Shield size={20} fill="currentColor" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">MedSummary AI <span className="text-gray-400 font-normal">| Portal</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">
                        <Shield size={12} /> Zero Data Retention
                    </span>
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors">
                        <Download size={16} /> Export
                    </button>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        DR
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">

                {/* --- Top Section: Patient Card & Details --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Patient Profile Card (Blue/Orange Gradient) */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        {/* Decor circles */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-8">
                                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                        <FileText size={24} className="text-white" />
                                    </div>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md">
                                        Admitted
                                    </span>
                                </div>

                                <div className="mb-8">
                                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4 backdrop-blur-sm border border-white/10">
                                        {patient.name ? patient.name.charAt(0) : 'U'}
                                    </div>
                                    <h2 className="text-2xl font-bold mb-1">{patient.name || 'Unknown Patient'}</h2>
                                    <p className="text-primary-100 text-sm">Patient ID: #MS-{Math.floor(Math.random() * 10000)}</p>
                                </div>

                                <div className="space-y-3 text-sm text-primary-50">
                                    <div className="flex items-center gap-3">
                                        <User size={16} className="opacity-70" />
                                        <span>Dr. {patient.doctor || 'Not Assigned'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Activity size={16} className="opacity-70" />
                                        <span>{patient.primary_diagnosis || 'Observation'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Patient Details Tabs/Grid */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="uppercase tracking-wider text-xs font-bold text-gray-400 mb-6">Patient Details</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DetailItem label="Gender" value={patient.gender} />
                            <DetailItem label="Age" value={patient.age ? `${patient.age} Years` : null} />
                            <DetailItem label="Location" value={patient.location} />
                            <DetailItem label="Phone" value={patient.phone} />
                            <DetailItem label="Email" value={patient.email} />
                            <DetailItem label="Emergency Contact" value="Not Available" />
                        </div>
                    </div>
                </div>

                {/* --- AI Assessment Section (Full Width) --- */}
                {/* Only show if we have at least one sub-section or vitals */}
                {(sections.chief_complaint || sections.diagnosis_details || (sections.key_findings && sections.key_findings.length > 0) || sections.vital_signs) && (
                    <div className="bg-white rounded-3xl shadow-lg border border-primary-100 overflow-hidden">
                        <div className="bg-primary-50 px-8 py-4 border-b border-primary-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                                    <Activity size={20} />
                                </div>
                                <h3 className="font-bold text-gray-800">AI-Generated Medical Summary</h3>
                            </div>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-primary-600 border border-primary-100 shadow-sm flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live Analysis
                            </span>
                        </div>

                        <div className="p-8 space-y-10">

                            {/* Chief Complaint */}
                            {sections.chief_complaint && (
                                <SectionCard
                                    icon={<AlertCircle className="text-rose-500" />}
                                    title="Chief Complaint"
                                    color="rose"
                                >
                                    <p className="text-gray-700 leading-relaxed font-medium">
                                        {sections.chief_complaint}
                                    </p>
                                </SectionCard>
                            )}

                            {/* Diagnosis */}
                            {sections.diagnosis_details && (
                                <SectionCard
                                    icon={<Heart className="text-blue-500" />}
                                    title="Diagnosis"
                                    color="blue"
                                >
                                    <p className="text-gray-700 leading-relaxed">
                                        {sections.diagnosis_details}
                                    </p>
                                </SectionCard>
                            )}

                            {/* Key Findings */}
                            {sections.key_findings && sections.key_findings.length > 0 && (
                                <SectionCard
                                    icon={<FileText className="text-amber-500" />}
                                    title="Key Clinical Findings"
                                    color="amber"
                                >
                                    <ul className="space-y-3 mt-2">
                                        {sections.key_findings.map((finding, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></div>
                                                <span className="text-gray-600 text-sm md:text-base">{finding.text}</span>
                                                {finding.page && (
                                                    <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1 rounded ml-auto flex-shrink-0 self-center">
                                                        Ref: {finding.page}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </SectionCard>
                            )}

                            {/* Vitals Grid */}
                            {sections.vital_signs && Object.values(sections.vital_signs).some(v => v) && (
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
                                    {sections.vital_signs.bp && <VitalCard label="Blood Pressure" value={sections.vital_signs.bp} unit="mmHg" color="blue" />}
                                    {sections.vital_signs.hr && <VitalCard label="Heart Rate" value={sections.vital_signs.hr} unit="bpm" color="rose" />}
                                    {sections.vital_signs.temp && <VitalCard label="Temperature" value={sections.vital_signs.temp} unit="°F" color="amber" />}
                                    {sections.vital_signs.spo2 && <VitalCard label="SpO2" value={sections.vital_signs.spo2} unit="%" color="emerald" />}
                                    {sections.vital_signs.resp && <VitalCard label="Resp. Rate" value={sections.vital_signs.resp} unit="/min" color="purple" />}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- Medications & Treatment Plan --- */}
                {((sections.treatment_plan && sections.treatment_plan.length > 0) || (medications && medications.length > 0)) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Treatment Plan */}
                        {sections.treatment_plan && sections.treatment_plan.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                                        <CheckCircle size={20} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Treatment Plan</h3>
                                </div>
                                <div className="bg-blue-50/50 rounded-2xl p-6 flex-grow">
                                    <ul className="space-y-4">
                                        {sections.treatment_plan.map((plan, idx) => (
                                            <li key={idx} className="flex gap-4">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-gray-700 text-sm leading-relaxed">{plan}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Current Medications */}
                        {medications && medications.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                                        <Pill size={20} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Current Medications</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {medications.map((med, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors group">
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{med.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {med.dose} • {med.frequency}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-600 group-hover:bg-emerald-50 group-hover:border-emerald-100 group-hover:text-emerald-700 transition-colors">
                                                {med.type || 'Medication'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- Visual Analysis Charts --- */}
                {((chartData.length > 0) || (timeline.length > 0)) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 1. Lab Results Chart (Bar) */}
                        {chartData.length > 0 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Lab Results Analysis</h3>
                                        <p className="text-gray-400 text-xs mt-1">Quantitative extraction from report</p>
                                    </div>
                                    <button className="text-primary-600 text-sm font-medium hover:underline">View All</button>
                                </div>

                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                            <RechartsTooltip
                                                cursor={{ fill: '#fff7ed' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* 2. Timeline Visualization (Simulated Activity) */}
                        {timeline.length > 0 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Event Timeline</h3>
                                        <p className="text-gray-400 text-xs mt-1">Key medical events extracted</p>
                                    </div>
                                </div>

                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                    {timeline.map((event, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-50 group-hover:bg-primary-50 text-gray-500 group-hover:text-primary-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                                                <Calendar size={18} />
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between space-x-2 mb-1">
                                                    <div className="font-bold text-gray-900 text-sm">{event.event}</div>
                                                    <time className="font-mono text-xs text-gray-400">{event.date}</time>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

// --- Helper Components ---

const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</span>
        <span className="text-gray-900 font-semibold text-base truncate">{value || 'Na'}</span>
    </div>
);

const SectionCard = ({ icon, title, color, children }) => {
    // Determine gradient/color classes based on prop
    const bgClass = `bg-${color}-50`;

    return (
        <div className="flex gap-4 md:gap-6">
            <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgClass} border border-${color}-100`}>
                    {icon}
                </div>
            </div>
            <div className="flex-grow">
                <h4 className="font-bold text-gray-900 text-lg mb-2">{title}</h4>
                {children}
            </div>
        </div>
    );
};

const VitalCard = ({ label, value, unit, color }) => (
    <div className={`bg-${color}-50/30 border border-${color}-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-transform hover:scale-105`}>
        <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">{label}</span>
        <div className={`text-2xl font-bold text-${color}-600`}>{value || '--'}</div>
        <span className="text-xs text-gray-400 font-medium">{unit}</span>
    </div>
);

export default ResultPage;
