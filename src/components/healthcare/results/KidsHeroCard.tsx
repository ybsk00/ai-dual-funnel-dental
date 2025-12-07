"use client";

import Link from "next/link";
import { Star } from "lucide-react";

type KidsHeroCardProps = {
    result: {
        hero_name: string;
        mission_badge: string;
        praise_message: string;
        next_mission: string;
        cta: {
            title: string;
            body: string;
        };
    };
    isLoggedIn: boolean;
};

export default function KidsHeroCard({ result, isLoggedIn }: KidsHeroCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 max-w-sm mx-auto my-4">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/confetti.png')] opacity-20"></div>

                <div className="relative z-10">
                    <div className="inline-block px-3 py-1 bg-white text-pink-500 text-xs font-bold rounded-full mb-3 shadow-sm">
                        양치 히어로 인증서
                    </div>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border-4 border-pink-200 animate-bounce-slow">
                        <Star size={48} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-1">{result.hero_name}</h3>
                    <p className="text-pink-600 font-bold text-lg">{result.mission_badge} 획득!</p>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 text-center">
                    <p className="text-slate-700 font-medium leading-relaxed">
                        "{result.praise_message}"
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-slate-700 mb-2 text-sm">🚀 다음 미션</h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {result.next_mission}
                    </p>
                </div>

                {/* CTA Section */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                    <h4 className="font-bold text-slate-800 mb-1 text-sm">{result.cta.title}</h4>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{result.cta.body}</p>

                    {isLoggedIn ? (
                        <Link
                            href={`/medical/chat?source=kids_mission&context=${encodeURIComponent(result.hero_name)}`}
                            className="block w-full py-3 bg-blue-600 text-white text-center rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                        >
                            부모님 상담 이어가기
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
