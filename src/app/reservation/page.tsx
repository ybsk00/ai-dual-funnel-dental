"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Clock, User, Phone, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ReservationPage() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
        symptoms: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Check or Create Patient
            let patientId;
            const { data: existingPatient, error: searchError } = await supabase
                .from('patients')
                .select('id')
                .eq('phone', formData.phone)
                .single();

            if (searchError && searchError.code !== 'PGRST116') { // PGRST116 is "not found"
                throw searchError;
            }

            if (existingPatient) {
                patientId = existingPatient.id;
            } else {
                const { data: newPatient, error: createError } = await supabase
                    .from('patients')
                    .insert({
                        name: formData.name,
                        phone: formData.phone,
                        status: 'active'
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                patientId = newPatient.id;
            }

            // 2. Create Visit
            const visitDate = new Date(`${formData.date}T${formData.time}`);
            const { error: visitError } = await supabase
                .from('visits')
                .insert({
                    patient_id: patientId,
                    visit_date: visitDate.toISOString(),
                    visit_type: 'consultation', // Default type
                    status: 'scheduled',
                    chief_complaint: formData.symptoms
                });

            if (visitError) throw visitError;

            setIsSuccess(true);
        } catch (err: any) {
            console.error("Reservation Error:", err);
            setError(err.message || "예약 처리 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-traditional-bg flex items-center justify-center p-6">
                <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center space-y-6 animate-fade-in">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50/50">
                        <CheckCircle2 className="text-green-600" size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-traditional-text font-serif mb-2">예약이 완료되었습니다</h2>
                        <p className="text-traditional-subtext">
                            {formData.name}님, {formData.date} {formData.time}에<br />
                            진료 예약이 확정되었습니다.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Link
                            href="/"
                            className="block w-full py-3.5 bg-traditional-primary text-white rounded-xl font-bold hover:bg-traditional-primary/90 transition-colors"
                        >
                            홈으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-traditional-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-traditional-text font-serif mb-2">진료 예약</h1>
                    <p className="text-traditional-subtext">편안한 진료를 위해 미리 예약해주세요.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-white/50">
                    <div className="h-2 bg-traditional-primary"></div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-traditional-text mb-1.5 ml-1">이름</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-traditional-muted" size={18} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="홍길동"
                                        className="w-full pl-11 pr-4 py-3 bg-traditional-bg/30 border border-traditional-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-traditional-primary/20 focus:border-traditional-primary transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-traditional-text mb-1.5 ml-1">연락처</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-traditional-muted" size={18} />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="010-1234-5678"
                                        className="w-full pl-11 pr-4 py-3 bg-traditional-bg/30 border border-traditional-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-traditional-primary/20 focus:border-traditional-primary transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-traditional-text mb-1.5 ml-1">날짜</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-traditional-muted" size={18} />
                                        <input
                                            required
                                            type="date"
                                            className="w-full pl-11 pr-4 py-3 bg-traditional-bg/30 border border-traditional-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-traditional-primary/20 focus:border-traditional-primary transition-all text-sm"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-traditional-text mb-1.5 ml-1">시간</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-traditional-muted" size={18} />
                                        <input
                                            required
                                            type="time"
                                            className="w-full pl-11 pr-4 py-3 bg-traditional-bg/30 border border-traditional-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-traditional-primary/20 focus:border-traditional-primary transition-all text-sm"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-traditional-text mb-1.5 ml-1">증상 (선택사항)</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-3.5 text-traditional-muted" size={18} />
                                    <textarea
                                        placeholder="어디가 불편하신가요?"
                                        rows={3}
                                        className="w-full pl-11 pr-4 py-3 bg-traditional-bg/30 border border-traditional-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-traditional-primary/20 focus:border-traditional-primary transition-all resize-none"
                                        value={formData.symptoms}
                                        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-traditional-primary text-white rounded-xl font-bold text-lg hover:bg-traditional-primary/90 transition-all shadow-lg shadow-traditional-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    처리 중...
                                </>
                            ) : (
                                "예약하기"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
