"use client";

import { useState, Suspense, useEffect } from "react";
import { Calendar, Clock, MoreHorizontal, Send } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import PatientHeader from "@/components/medical/PatientHeader";
import ReservationModal from "@/components/medical/ReservationModal";
import { createClient } from "@/lib/supabase/client";

export default function PatientDashboard() {
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [patientId, setPatientId] = useState<number | null>(null);
    const [appointment, setAppointment] = useState({
        date: "예약 없음",
        time: "",
        type: "예정된 진료가 없습니다.",
        doctor: ""
    });
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Get Patient ID
            let currentPatientId = null;
            const { data: patientData, error: patientError } = await supabase
                .from('patients')
                .select('id, name')
                .eq('user_id', user.id)
                .maybeSingle();

            if (patientData) {
                currentPatientId = patientData.id;
                setPatientId(patientData.id);
            } else {
                // Auto-create patient record if not exists (optional, but good for UX)
                const { data: newPatient, error: createError } = await supabase
                    .from('patients')
                    .insert({
                        user_id: user.id,
                        name: user.user_metadata.full_name || user.email?.split('@')[0] || '환자',
                        status: 'active'
                    })
                    .select()
                    .single();

                if (newPatient) {
                    currentPatientId = newPatient.id;
                    setPatientId(newPatient.id);
                }
            }

            // 2. Get Latest Appointment
            if (currentPatientId) {
                const { data: visitData } = await supabase
                    .from('visits')
                    .select('*')
                    .eq('patient_id', currentPatientId)
                    .in('status', ['scheduled', 'in_progress'])
                    .order('visit_date', { ascending: true })
                    .limit(1)
                    .maybeSingle();

                if (visitData) {
                    const date = new Date(visitData.visit_date);
                    setAppointment({
                        date: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`,
                        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: visitData.visit_type === 'consultation' ? '일반 진료' : visitData.visit_type,
                        doctor: "담당의"
                    });
                } else {
                    setAppointment({
                        date: "예약 없음",
                        time: "",
                        type: "예정된 진료가 없습니다.",
                        doctor: ""
                    });
                }
            }
        };

        fetchData();
    }, [supabase, isReservationModalOpen]); // Refresh when modal closes (to update appointment card)

    return (
        <div className="min-h-screen bg-traditional-bg font-sans selection:bg-traditional-accent selection:text-white">
            <PatientHeader />

            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">

                {/* Header / Appointment Card */}
                <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm ${appointment.date === "예약 없음" ? "bg-slate-700/50 text-slate-500" : "bg-blue-500/10 text-blue-400"}`}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-sm text-slate-400 font-medium mb-1">다음 예약 안내</h2>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-xl font-bold font-serif ${appointment.date === "예약 없음" ? "text-slate-500" : "text-white"}`}>{appointment.date}</span>
                                {appointment.time && <span className="text-xl font-bold text-white font-serif">{appointment.time}</span>}
                            </div>
                            <p className={`${appointment.date === "예약 없음" ? "text-slate-500" : "text-blue-400"} text-sm font-medium mt-1`}>{appointment.type}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setIsReservationModalOpen(true)}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-slate-700 text-slate-300 border border-slate-600 rounded-xl text-sm font-medium hover:bg-slate-600 hover:text-white transition-all shadow-sm"
                        >
                            예약관리
                        </button>
                    </div>
                </div>

                {/* Video Banner */}
                <div className="w-full h-32 md:h-40 relative overflow-hidden rounded-2xl shadow-lg border border-slate-700 group">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    >
                        <source src="/3.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex items-center px-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">AI 정밀 진단</h3>
                            <p className="text-sm text-blue-200">최첨단 AI 기술로 당신의 치아 건강을 지켜드립니다.</p>
                        </div>
                    </div>
                </div>

                <ReservationModal
                    isOpen={isReservationModalOpen}
                    onClose={() => setIsReservationModalOpen(false)}
                    patientId={patientId}
                />

                {/* Main Chat Interface Area */}
                <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-700 overflow-hidden h-[650px] flex flex-col">
                    <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/80">
                        <div>
                            <h3 className="font-bold text-white font-serif text-lg">예진 상담 (Medical Chat)</h3>
                            <p className="text-xs text-blue-400 font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                전문의 감독 하에 운영
                            </p>
                        </div>
                        <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <Suspense fallback={<div className="flex items-center justify-center h-full text-traditional-subtext">Loading...</div>}>
                            <ChatInterface isEmbedded={true} isLoggedIn={true} />
                        </Suspense>
                    </div>
                </div>

            </div>
        </div>
    );
}
