"use client";

import Link from "next/link";

type MbtiResultCardProps = {
    result: {
        type_code: string;
        type_name: string;
        one_line_summary: string;
        description: string;
        lifestyle_tips: string[];
        weekly_mission: string;
        disclaimer: string;
        cta: {
            title: string;
            body: string;
        };
    };
    isLoggedIn: boolean;
};

export default function MbtiResultCard({ result, isLoggedIn }: MbtiResultCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 max-w-sm mx-auto my-4">
            <div className="bg-blue-50 p-6 text-center">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2">
                    입냄새 MBTI
                </div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border-4 border-blue-100">
                    <span className="text-4xl font-black text-blue-500">{result.type_code}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{result.type_name}</h3>
                <p className="text-slate-600 text-sm">{result.one_line_summary}</p>
            </div>

            <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    {result.description}
                </p>

                <div>
                    <h4 className="font-bold text-slate-700 mb-2 text-sm">💡 생활 습관 팁</h4>
                    <ul className="space-y-2">
                        {result.lifestyle_tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-1 text-xs">🎯 이번 주 미션</h4>
                    <p className="text-sm text-blue-700 font-medium">{result.weekly_mission}</p>
                </div>

                {/* CTA Section */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                    <h4 className="font-bold text-slate-800 mb-1 text-sm">{result.cta.title}</h4>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{result.cta.body}</p>

                    {isLoggedIn ? (
                        <Link
                            href={`/medical/chat?source=breath_mbti&context=${encodeURIComponent(result.type_name)}`}
                            className="block w-full py-3 bg-blue-600 text-white text-center rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                        >
                            전문 상담 이어가기
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="block w-full py-3 bg-slate-800 text-white text-center rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors"
                        >
                            로그인하고 자세히 보기
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
