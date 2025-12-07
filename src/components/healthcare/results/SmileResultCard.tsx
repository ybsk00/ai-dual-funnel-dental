"use client";

import Link from "next/link";

type SmileResultCardProps = {
    result: {
        smile_type_name: string;
        score: number;
        one_line_summary: string;
        style_tips: string[];
        disclaimer: string;
        cta: {
            title: string;
            body: string;
        };
    };
    isLoggedIn: boolean;
};

export default function SmileResultCard({ result, isLoggedIn }: SmileResultCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 max-w-sm mx-auto my-4">
            <div className="bg-amber-50 p-6 text-center">
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-2">
                    AI 스마일 인상체크
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{result.smile_type_name}</h3>
                <div className="text-5xl font-black text-amber-500 mb-2">{result.score}<span className="text-2xl text-amber-300">점</span></div>
                <p className="text-slate-600 text-sm">{result.one_line_summary}</p>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <h4 className="font-bold text-slate-700 mb-2 text-sm">✨ 미소 스타일링 팁</h4>
                    <ul className="space-y-2">
                        {result.style_tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-400 leading-relaxed">
                    {result.disclaimer}
                </div>

                {/* CTA Section */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                    <h4 className="font-bold text-slate-800 mb-1 text-sm">{result.cta.title}</h4>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{result.cta.body}</p>

                    {isLoggedIn ? (
                        <Link
                            href={`/medical/chat?source=smile_test&context=${encodeURIComponent(result.smile_type_name)}`}
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
