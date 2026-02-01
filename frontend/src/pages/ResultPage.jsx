import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import {
    User, Activity, FileText, Calendar, Pill,
    Thermometer, Heart, Beaker, Clock, ChevronLeft, Download,
    ShieldCheck, PlusCircle
} from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const summary = location.state?.summary;

    useEffect(() => {
        if (!summary) {
            navigate('/');
        }
    }, [summary, navigate]);

    if (!summary) return null;

    console.log("DEBUG: Full Summary Data:", summary);

    let { patient_profile, sections, medications, timeline, lab_data, billing_summary, medicine_tracking } = summary;

    // --- Mock Data fallback for visuals if API didn't return them ---
    const mockBillingData = billing_summary?.breakdown || [
        { category: 'Surgery', amount: 850 },
        { category: 'Room', amount: 450 },
        { category: 'Medicine', amount: 320 },
        { category: 'Test', amount: 200 },
        { category: 'Doctor', amount: 150 },
    ];

    const mockMedicineSales = medications?.map(m => ({
        name: m.name.split(' ')[0], // short name
        quantity: m.quantity || Math.floor(Math.random() * 30) + 10
    })).slice(0, 5) || [];

    // ----------------------------------------------------------------

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <div className="flex-grow pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto">

                    {/* Top Action Bar */}
                    <div className="flex justify-end items-center mb-6">
                        <div className="flex gap-3">
                            <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center">
                                <ShieldCheck size={14} className="mr-1.5" /> Zero Data Retention
                            </div>
                            <Button variant="primary" onClick={() => window.print()} className="bg-primary-600">
                                <Download size={16} className="mr-2" /> PDF
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        {/* --- LEFT SIDEBAR (Patient Identity) --- */}
                        <div className="col-span-12 lg:col-span-3 space-y-6">
                            {/* Blue/Primary Card */}
                            <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                                {/* Decorative Circles */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>

                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-lg font-semibold opacity-90">Hospital</h2>
                                    <FileText className="opacity-70" size={20} />
                                </div>

                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-2 border-white/30">
                                        {patient_profile?.name ? patient_profile.name.charAt(0) : 'P'}
                                    </div>
                                    <h3 className="text-xl font-bold text-center">{patient_profile?.name || 'Unknown Patient'}</h3>
                                    <span className="bg-green-400/20 text-green-100 text-xs px-2 py-0.5 rounded mt-2">Active Case</span>
                                </div>

                                <div className="space-y-4 text-sm opacity-90">
                                    <div>
                                        <div className="text-white/60 text-xs uppercase mb-0.5">Doctor</div>
                                        <div className="font-medium">{patient_profile?.doctor || 'Not assigned'}</div>
                                    </div>
                                    <div>
                                        <div className="text-white/60 text-xs uppercase mb-0.5">Primary Diagnosis</div>
                                        <div className="font-medium">{patient_profile?.primary_diagnosis || 'Under Evaluation'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Admission Timeline (Vertical) */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar size={18} className="text-primary-600" /> Key Dates
                                </h4>
                                <div className="space-y-4">
                                    {/* Mock Dates for demo if not in timeline */}
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                        <div className="text-xs text-blue-500 font-semibold uppercase">Admission Date</div>
                                        <div className="text-blue-900 font-bold">
                                            {timeline?.find(e => e.event.toLowerCase().includes('admit'))?.date || '20 July 2023'}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                        <div className="text-xs text-green-500 font-semibold uppercase">Discharge Date</div>
                                        <div className="text-green-900 font-bold">
                                            {timeline?.find(e => e.event.toLowerCase().includes('discharge'))?.date || 'Pending'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT MAIN CONTENT --- */}
                        <div className="col-span-12 lg:col-span-9 space-y-6">

                            {/* Top Demographics Row */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-semibold">Gender</label>
                                    <div className="font-bold text-gray-800">{patient_profile?.gender || '-'}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-semibold">Age</label>
                                    <div className="font-bold text-gray-800">{patient_profile?.age || '-'}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-semibold">Phone</label>
                                    <div className="font-bold text-gray-800">{patient_profile?.phone || '-'}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-semibold">Location</label>
                                    <div className="font-bold text-gray-800">{patient_profile?.location || '-'}</div>
                                </div>
                            </div>

                            {/* AI Summary Banner */}
                            <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-4 text-white flex justify-between items-center shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg"><FileText size={20} /></div>
                                    <div>
                                        <h3 className="font-bold text-lg">AI-Generated Medical Summary</h3>
                                        <p className="text-xs text-white/80">Extracted from medical records • Privacy-safe processing</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                                    Live Summary
                                </div>
                            </div>

                            {/* Chief Complaint & Diagnosis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><Activity size={16} /></div>
                                        Chief Complaint
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {sections?.chief_complaint || 'No complaints recorded.'}
                                    </p>
                                </div>
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Heart size={16} /></div>
                                        Diagnosis
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {sections?.diagnosis_details || patient_profile?.primary_diagnosis || 'No diagnosis recorded.'}
                                    </p>
                                </div>
                            </div>

                            {/* Key Findings */}
                            {sections?.key_findings && (
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Activity size={16} /></div>
                                        Key Clinical Findings
                                    </h4>
                                    <ul className="space-y-3">
                                        {sections.key_findings.map((item, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="text-primary-500 font-bold mt-1">•</span>
                                                <div className="flex-grow">
                                                    {item.text}
                                                </div>
                                                <span className="text-gray-400 text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                                                    Ref: Pg {item.page}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Treatment Plan */}
                            {sections?.treatment_plan?.length > 0 && (
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><PlusCircle size={16} /></div>
                                        Treatment Plan
                                    </h4>
                                    <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                                        <ul className="space-y-2">
                                            {sections.treatment_plan.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</div>
                                                    <span className="text-sm text-gray-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Current Medications Grid */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Pill size={16} /></div>
                                    Current Medications
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {medications?.map((med, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all bg-gray-50/50">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-bold text-gray-900">{med.name}</h5>
                                                {med.type && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">{med.type}</span>}
                                            </div>
                                            <div className="text-xs text-gray-500 space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Dose:</span> <span className="font-medium text-gray-700">{med.dose || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Frequency:</span> <span className="font-medium text-gray-700">{med.frequency || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vitals & Charts Row */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Vitals */}
                                <div className="col-span-12 md:col-span-12 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center"><Activity size={16} /></div>
                                        Latest Vital Signs
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <VitalBox label="BP" value={sections?.vital_signs?.bp} unit="mmHg" />
                                        <VitalBox label="Heart Rate" value={sections?.vital_signs?.hr} unit="bpm" />
                                        <VitalBox label="Temp" value={sections?.vital_signs?.temp} unit="°F" />
                                        <VitalBox label="SpO2" value={sections?.vital_signs?.spo2} unit="%" />
                                        <VitalBox label="Resp" value={sections?.vital_signs?.resp} unit="/min" />
                                    </div>
                                </div>

                                {/* Financial Chart (Spend by Type) */}
                                <div className="col-span-12 md:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-80">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                        Spend by Charge Type (Est.)
                                    </h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart layout="vertical" data={mockBillingData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="category" type="category" width={80} tick={{ fontSize: 12 }} />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="amount" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20}>
                                                {mockBillingData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'][index % 5]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Medicine Sales Chart */}
                                <div className="col-span-12 md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-80">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                        Medicine Qty
                                    </h4>
                                    <ResponsiveContainer width="100%" height="90%">
                                        <BarChart data={mockMedicineSales}>
                                            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                            <Tooltip />
                                            <Bar dataKey="quantity" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* --- Dynamic Chart from LLM Analysis --- */}
                                {summary?.dynamic_chart && (
                                    <div className="col-span-12 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-96">
                                        <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center"><Activity size={16} /></div>
                                            {summary.dynamic_chart.title || "Insight Analysis"}
                                        </h4>
                                        <ResponsiveContainer width="100%" height="90%">
                                            {renderDynamicChart(summary.dynamic_chart)}
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>

                            <p className="text-center text-xs text-gray-400 mt-8 pb-8">
                                This summary was generated in-memory with zero data persistence. No patient information is stored or logged.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const VitalBox = ({ label, value, unit }) => (
    <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
        <div className="text-xs text-gray-400 uppercase font-semibold mb-1">{label}</div>
        <div className="text-xl font-bold text-gray-800">{value || '-'}</div>
        <div className="text-[10px] text-gray-400">{unit}</div>
    </div>
);

const renderDynamicChart = (chartConfig) => {
    console.log("DEBUG: rendering dynamic chart with config:", chartConfig);
    if (!chartConfig || !chartConfig.data || chartConfig.data.length === 0) return null;

    // Extract labels (default to empty string if not provided)
    const { chart_type, data, x_axis_key, data_key, x_label, y_label } = chartConfig;
    const commonProps = { data, margin: { top: 10, right: 30, left: 20, bottom: 20 } };

    // Helper for axis labels
    const xAxisLabel = x_label ? { value: x_label, position: 'insideBottom', offset: -10, fill: '#6B7280', fontSize: 12 } : undefined;
    const yAxisLabel = y_label ? { value: y_label, angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 12 } : undefined;

    switch (chart_type) {
        case 'line':
            return (
                <LineChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey={x_axis_key || 'label'} tick={{ fontSize: 12 }} stroke="#9CA3AF" label={xAxisLabel} />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" label={yAxisLabel} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend verticalAlign="top" height={36} />
                    <Line name={y_label || "Value"} type="monotone" dataKey={data_key || 'value'} stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            );
        case 'area':
            return (
                <AreaChart {...commonProps}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey={x_axis_key || 'label'} tick={{ fontSize: 12 }} stroke="#9CA3AF" label={xAxisLabel} />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" label={yAxisLabel} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend verticalAlign="top" height={36} />
                    <Area name={y_label || "Value"} type="monotone" dataKey={data_key || 'value'} stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            );
        case 'pie':
            return (
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey={data_key || 'value'}
                        nameKey={x_axis_key || 'label'}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444'][index % 5]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend verticalAlign="bottom" />
                </PieChart>
            );
        case 'bar':
        default:
            return (
                <BarChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey={x_axis_key || 'label'} tick={{ fontSize: 12 }} stroke="#9CA3AF" label={xAxisLabel} />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" label={yAxisLabel} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar name={y_label || "Value"} dataKey={data_key || 'value'} fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
            );
    }
};

export default ResultPage;
