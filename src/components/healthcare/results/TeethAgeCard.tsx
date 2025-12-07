"use client";

import Link from "next/link";

type TeethAgeCardProps = {
    result: {
        headline: string;
        summary: string;
        ten_year_simulation: string;
        lifestyle_tips: string[];
        disclaimer: string;
        cta: {
            title: string;
            body: string;
        };
    };
    isLoggedIn: boolean;
};

export default function TeethAgeCard({ result, isLoggedIn }: TeethAgeCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 max-w-sm mx-auto my-4">
            <div className="bg-green-50 p-6 text-center">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-2">
                    치아 나이 테스트
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight">{result.headline}</h3>
                <p className="text-slate-600 text-sm bg-white/50 p-2 rounded-lg">{result.summary}</p>
            </div>

            <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-700 mb-2 text-sm">🔮 10년 뒤 시뮬레이션</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {result.ten_year_simulation}
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-slate-700 mb-2 text-sm">🌿 젊어지는 습관</h4>
                    <ul className="space-y-2">
                        {result.lifestyle_tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA Section */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                    <h4 className="font-bold text-slate-800 mb-1 text-sm">{result.cta.title}</h4>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{result.cta.body}</p>

                    {isLoggedIn ? (
                        <Link
                            href={`/medical/chat?source=teeth_age&context=${encodeURIComponent(result.headline)}`}
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
