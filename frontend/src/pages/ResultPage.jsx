import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import {
    User, Activity, FileText, Calendar, Pill,
    Thermometer, Heart, Beaker, Clock, ChevronLeft, Download,
    ShieldCheck, PlusCircle, Footprints, Utensils, HelpCircle, CheckCircle, Droplet
} from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
    ComposedChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    RadialBarChart, RadialBar
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

    // --- Insufficient Data Handling ---
    if (summary.insufficient_data) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <FileText size={48} className="text-red-500 opacity-50" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Insufficient Information</h2>
                    <p className="text-gray-600 max-w-md mb-8">
                        The uploaded PDF does not appear to contain sufficient medical data to generate a report.
                        Please ensure you upload a clear, valid medical record.
                    </p>
                    <Button variant="primary" onClick={() => navigate('/')} className="bg-primary-600">
                        <ChevronLeft size={18} className="mr-2" /> Go Back
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    console.log("DEBUG: Full Summary Data:", summary);

    let { patient_profile, sections, medications, timeline, lab_data, medicine_tracking, personalized_guidance, dynamic_charts, vital_trends } = summary;



    // --- Mock Data fallback for visuals if API didn't return them ---




    // ----------------------------------------------------------------

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <div className="flex-grow pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto">

                    {/* Top Action Bar */}
                    <div className="flex justify-between items-center mb-6">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white p-2.5 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 border border-gray-200 shadow-sm transition-all"
                            title="Go Back"
                        >
                            <ChevronLeft size={20} />
                        </button>

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
                                    <div className="space-y-4 text-sm opacity-90">
                                        {patient_profile?.doctor && patient_profile.doctor !== 'null' && (
                                            <div>
                                                <div className="text-white/60 text-xs uppercase mb-0.5">Doctor</div>
                                                <div className="font-medium">{patient_profile.doctor}</div>
                                            </div>
                                        )}
                                        {patient_profile?.primary_diagnosis && patient_profile.primary_diagnosis !== 'null' && (
                                            <div>
                                                <div className="text-white/60 text-xs uppercase mb-0.5">Primary Diagnosis</div>
                                                <div className="font-medium">{patient_profile.primary_diagnosis}</div>
                                            </div>
                                        )}
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
                            {(!Object.values(patient_profile || {}).every(val => !val || val === 'null' || val === 'NA')) && (
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {patient_profile?.gender && patient_profile.gender !== 'null' && patient_profile.gender !== 'NA' && (
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400 uppercase font-semibold">Gender</label>
                                            <div className="font-bold text-gray-800">{patient_profile.gender}</div>
                                        </div>
                                    )}
                                    {patient_profile?.age && patient_profile.age !== 'null' && patient_profile.age !== 'NA' && (
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400 uppercase font-semibold">Age</label>
                                            <div className="font-bold text-gray-800">{patient_profile.age}</div>
                                        </div>
                                    )}
                                    {patient_profile?.phone && patient_profile.phone !== 'null' && patient_profile.phone !== 'NA' && (
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400 uppercase font-semibold">Phone</label>
                                            <div className="font-bold text-gray-800">{patient_profile.phone}</div>
                                        </div>
                                    )}
                                    {patient_profile?.location && patient_profile.location !== 'null' && patient_profile.location !== 'NA' && (
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400 uppercase font-semibold">Location</label>
                                            <div className="font-bold text-gray-800">{patient_profile.location}</div>
                                        </div>
                                    )}
                                </div>
                            )}

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
                                {sections?.chief_complaint && sections.chief_complaint !== 'null' && (
                                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                                        <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><Activity size={16} /></div>
                                            Chief Complaint
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            {sections.chief_complaint}
                                        </p>
                                    </div>
                                )}
                                {(sections?.diagnosis_details !== 'null' || patient_profile?.primary_diagnosis !== 'null') && (
                                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                                        <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Heart size={16} /></div>
                                            Diagnosis
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            {sections?.diagnosis_details !== 'null' ? sections.diagnosis_details : patient_profile?.primary_diagnosis}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Key Findings */}
                            {sections?.key_findings && sections.key_findings.length > 0 && (
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
                                                {item.page && (
                                                    <span className="text-gray-400 text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                                                        Ref: Pg {item.page}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Treatment Plan */}
                            {sections?.treatment_plan && sections.treatment_plan.length > 0 && (
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
                            {medications && medications.length > 0 && (
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Pill size={16} /></div>
                                        Current Medications
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {medications.map((med, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all bg-gray-50/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-bold text-gray-900">{med.name}</h5>
                                                    {med.type && med.type !== 'null' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">{med.type}</span>}
                                                </div>
                                                <div className="text-xs text-gray-500 space-y-1">
                                                    {med.dose && med.dose !== 'null' && (
                                                        <div className="flex justify-between">
                                                            <span>Dose:</span> <span className="font-medium text-gray-700">{med.dose}</span>
                                                        </div>
                                                    )}
                                                    {med.frequency && med.frequency !== 'null' && (
                                                        <div className="flex justify-between">
                                                            <span>Frequency:</span> <span className="font-medium text-gray-700">{med.frequency}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Vitals & Charts Row */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* --- Vital Statistics & Pulse --- */}
                                <div className="col-span-12 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-bold text-gray-800 text-lg">Vital Statistics</h4>
                                        <div className="h-px bg-gray-200 flex-grow"></div>
                                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                                            Latest Readings
                                        </span>
                                    </div>

                                    {/* Vitals Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* BP Card */}
                                        {sections?.vital_signs?.bp && sections.vital_signs.bp !== 'null' && (
                                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
                                                <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                                <div className="flex flex-col h-full justify-between relative z-10">
                                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-3">
                                                        <Droplet size={20} fill="currentColor" className="opacity-80" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500 font-medium mb-1">Blood Pressure</div>
                                                        <div className="text-2xl font-bold text-gray-800">{sections.vital_signs.bp}</div>
                                                        <div className="text-xs text-red-400 mt-1 font-medium">mmHg</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Heart Rate Card */}
                                        {sections?.vital_signs?.hr && sections.vital_signs.hr !== 'null' && (
                                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
                                                <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                                <div className="flex flex-col h-full justify-between relative z-10">
                                                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mb-3">
                                                        <Heart size={20} fill="currentColor" className="opacity-80" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500 font-medium mb-1">Heart Rate</div>
                                                        <div className="text-2xl font-bold text-gray-800">{sections.vital_signs.hr}</div>
                                                        <div className="text-xs text-rose-400 mt-1 font-medium">bpm</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* SpO2 / Respiratory Card */}
                                        {sections?.vital_signs?.spo2 && sections.vital_signs.spo2 !== 'null' && (
                                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
                                                <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                                <div className="flex flex-col h-full justify-between relative z-10">
                                                    <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-500 flex items-center justify-center mb-3">
                                                        <Activity size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500 font-medium mb-1">SpO2 Level</div>
                                                        <div className="text-2xl font-bold text-gray-800">{sections.vital_signs.spo2.toString().replace('%', '')}%</div>
                                                        <div className="text-xs text-cyan-400 mt-1 font-medium">Oxygen Saturation</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pulse Chart Section - Render ONLY if we have data trends */}
                                    {vital_trends && vital_trends.length > 1 && (
                                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className="font-bold text-gray-800 text-lg text-rose-500 flex items-center gap-2">
                                                    Pulse Trend
                                                </h4>
                                            </div>

                                            <div className="h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={vital_trends}>
                                                        <defs>
                                                            <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                                        <YAxis hide domain={['auto', 'auto']} />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="hr"
                                                            stroke="#f43f5e"
                                                            strokeWidth={3}
                                                            fillOpacity={1}
                                                            fill="url(#colorHr)"
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                                <span className="font-bold text-gray-800">Average Heart Rate:</span>
                                                <span className="text-rose-500 font-bold">{sections?.vital_signs?.hr || '-'} bpm</span>
                                            </div>
                                        </div>
                                    )}
                                </div>



                                {/* --- Dynamic Charts Grid --- */}
                                {dynamic_charts && dynamic_charts.length > 0 && (
                                    <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {dynamic_charts.map((chartConfig, idx) => (
                                            <div key={idx} className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 ${dynamic_charts.length === 1 ? 'col-span-2' : ''} h-96`}>
                                                <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center"><Activity size={16} /></div>
                                                    {chartConfig.title || "Insight Analysis"}
                                                </h4>
                                                <ResponsiveContainer width="100%" height="90%">
                                                    {renderDynamicChart(chartConfig)}
                                                </ResponsiveContainer>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* --- Personalized Patient Guidance --- */}
                            {personalized_guidance && (
                                <div className="space-y-6">
                                    {/* Next Steps & Lifestyle Headers */}
                                    {(Array.isArray(personalized_guidance.next_steps) && personalized_guidance.next_steps.length > 0 ||
                                        Array.isArray(personalized_guidance.lifestyle_tips) && personalized_guidance.lifestyle_tips.length > 0) && (
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-gray-800">Personalized Guidance</h3>
                                                <div className="h-px bg-gray-200 flex-grow"></div>
                                            </div>
                                        )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Next Steps */}
                                        {Array.isArray(personalized_guidance.next_steps) && personalized_guidance.next_steps.length > 0 && (
                                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                                <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Footprints size={16} /></div>
                                                    Next Steps
                                                </h4>
                                                <ul className="space-y-3">
                                                    {personalized_guidance.next_steps.map((step, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                                            <CheckCircle size={16} className="text-blue-500 mt-0.5" />
                                                            <span>{step}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Lifestyle Tips */}
                                        {Array.isArray(personalized_guidance.lifestyle_tips) && personalized_guidance.lifestyle_tips.length > 0 && (
                                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                                <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Utensils size={16} /></div>
                                                    Diet & Lifestyle
                                                </h4>
                                                <div className="space-y-3">
                                                    {personalized_guidance.lifestyle_tips.map((tip, idx) => (
                                                        <div key={idx} className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                                                            <div className="font-semibold text-orange-800 text-xs uppercase mb-1">{tip.topic}</div>
                                                            <div className="text-sm text-orange-900">{tip.advice}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* --- FAQs (Questions & Answers) --- */}
                            {personalized_guidance?.faq && personalized_guidance.faq.length > 0 && (
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-sm border border-indigo-100">
                                    <h4 className="flex items-center gap-2 font-bold text-indigo-900 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center"><HelpCircle size={16} /></div>
                                        Answered Questions (FAQ)
                                    </h4>
                                    <p className="text-xs text-indigo-600 mb-6">
                                        Common questions about your results, answered by AI based on the report data.
                                    </p>
                                    <div className="space-y-4">
                                        {personalized_guidance.faq.map((item, idx) => (
                                            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100">
                                                <h5 className="text-indigo-900 font-bold text-sm mb-2 flex items-start gap-2">
                                                    <span className="bg-indigo-100 text-indigo-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">Q</span>
                                                    {item.question}
                                                </h5>
                                                <p className="text-gray-600 text-sm pl-7 leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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



const renderDynamicChart = (chartConfig) => {
    console.log("DEBUG: rendering dynamic chart with config:", chartConfig);
    if (!chartConfig || !chartConfig.data || chartConfig.data.length === 0) return null;

    // Extract labels (default to empty string if not provided)
    const { chart_type, data, x_axis_key, data_key, x_label, y_label, title } = chartConfig;
    const commonProps = { data, margin: { top: 10, right: 30, left: 20, bottom: 20 } };

    // Helper for axis labels
    const xAxisLabel = x_label ? { value: x_label, position: 'insideBottom', offset: -10, fill: '#6B7280', fontSize: 12 } : undefined;
    const yAxisLabel = y_label ? { value: y_label, angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 12 } : undefined;

    switch (chart_type) {
        case 'composed':
            return (
                <ComposedChart {...commonProps}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey={x_axis_key || 'label'} scale="band" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={data_key || 'value'} barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey={chartConfig.data_key_2 || 'value2'} stroke="#ff7300" />
                </ComposedChart>
            );
        case 'radar':
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey={x_axis_key || 'label'} tick={{ fill: '#6b7280', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar name={title || "Data"} dataKey={data_key || 'value'} stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                        <Legend />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    </RadarChart>
                </ResponsiveContainer>
            );
        case 'radial':
            return (
                <RadialBarChart innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
                    <RadialBar
                        minAngle={15}
                        label={{ position: 'insideStart', fill: '#fff' }}
                        background
                        clockWise
                        dataKey={data_key || 'value'}
                    />
                    <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" wrapperStyle={{ top: '50%', right: 0, transform: 'translate(0, -50%)', lineHeight: '24px' }} />
                </RadialBarChart>
            );
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
                        innerRadius={60}
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
