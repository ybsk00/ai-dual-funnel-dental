"use client";

import { useState } from "react";
import { Calendar, Clock, X, CheckCircle2, AlertCircle } from "lucide-react";

type ReservationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: "book" | "reschedule" | "cancel";
};

export default function ReservationModal({ isOpen, onClose, initialTab = "book" }: ReservationModalProps) {
    const [activeTab, setActiveTab] = useState<"book" | "reschedule" | "cancel">(initialTab);
    const [step, setStep] = useState(1); // 1: Input, 2: Confirm, 3: Success

    if (!isOpen) return null;

    const handleConfirm = () => {
        setStep(3);
        // In a real app, you would make an API call here
    };

    const resetAndClose = () => {
        setStep(1);
        setActiveTab("book");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="bg-traditional-bg p-4 flex justify-between items-center border-b border-traditional-muted/20">
                    <h3 className="font-bold text-lg text-traditional-text flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-traditional-accent" />
                        예약 관리
                    </h3>
                    <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 3 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">처리되었습니다</h4>
                            <p className="text-gray-600 mb-6">
                                {activeTab === "book" && "예약 신청이 완료되었습니다."}
                                {activeTab === "reschedule" && "예약 변경이 완료되었습니다."}
                                {activeTab === "cancel" && "예약이 취소되었습니다."}
                                <br />
                                카카오톡으로 알림을 보내드렸습니다.
                            </p>
                            <button
                                onClick={resetAndClose}
                                className="w-full py-3 bg-traditional-accent text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Tabs */}
                            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                                <button
                                    onClick={() => setActiveTab("book")}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "book" ? "bg-white text-traditional-accent shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    예약하기
                                </button>
                                <button
                                    onClick={() => setActiveTab("reschedule")}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "reschedule" ? "bg-white text-traditional-accent shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    예약변경
                                </button>
                                <button
                                    onClick={() => setActiveTab("cancel")}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "cancel" ? "bg-white text-red-500 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    예약취소
                                </button>
                            </div>

                            {/* Content based on Tab */}
                            <div className="space-y-4">
                                {activeTab === "book" && (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                                            <p className="font-bold mb-1">진료 예약</p>
                                            <p>원하시는 날짜와 시간을 선택해주세요.</p>
                                        </div>
                                        {/* Mock Date Picker */}
                                        <div className="border rounded-xl p-4 text-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                                            📅 날짜/시간 선택하기
                                        </div>
                                    </div>
                                )}

                                {activeTab === "reschedule" && (
                                    <div className="space-y-4">
                                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm text-amber-800">
                                            <p className="font-bold mb-1">기존 예약 정보</p>
                                            <p>2025.12.08 (금) 오후 2:30</p>
                                            <p>정기 침구치료 (김환자님)</p>
                                        </div>
                                        <div className="border rounded-xl p-4 text-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                                            📅 변경할 날짜/시간 선택하기
                                        </div>
                                    </div>
                                )}

                                {activeTab === "cancel" && (
                                    <div className="space-y-4">
                                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-sm text-red-800 flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold mb-1">정말 취소하시겠습니까?</p>
                                                <p>당일 취소는 노쇼 페널티가 발생할 수 있습니다.</p>
                                            </div>
                                        </div>
                                        <div className="bg-white border rounded-xl p-4">
                                            <p className="text-sm text-gray-600 font-medium mb-2">취소 사유</p>
                                            <select className="w-full p-2 border rounded-lg text-sm">
                                                <option>단순 변심</option>
                                                <option>일정 변경</option>
                                                <option>증상 호전</option>
                                                <option>기타</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleConfirm}
                                    className={`w-full py-3 rounded-xl font-medium text-white transition-colors mt-4 ${activeTab === "cancel" ? "bg-red-500 hover:bg-red-600" : "bg-traditional-accent hover:bg-opacity-90"}`}
                                >
                                    {activeTab === "book" && "예약 신청하기"}
                                    {activeTab === "reschedule" && "변경 신청하기"}
                                    {activeTab === "cancel" && "예약 취소하기"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
