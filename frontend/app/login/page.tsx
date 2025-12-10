"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type LoginResponse = {
    id: number;
    name: string;
    role: string;
    class_name?: string | null;
    access_token: string;
};

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultRole = searchParams.get("role") === "FACULTY" ? "FACULTY" : "STUDENT";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"STUDENT" | "FACULTY">(defaultRole);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<LoginResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    role,
                }),
            });

            if (typeof window !== "undefined") {
                window.localStorage.setItem("user", JSON.stringify(data));
                window.localStorage.setItem("access_token", data.access_token);
            }

            if (data.role === "STUDENT") {
                router.push("/student/apply-leave");
            } else {
                router.push("/faculty/requests");
            }
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl p-10">
            <div className="text-center mb-8">
                <p className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2">
                    Welcome Back
                </p>
                <h2 className="text-3xl font-bold text-slate-900">
                    Sign In
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                    Enter your credentials to access your dashboard
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => setRole("STUDENT")}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${role === "STUDENT"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("FACULTY")}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${role === "FACULTY"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Faculty
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 pl-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-2xl border border-slate-200 bg-white/50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="name@college.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 pl-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-2xl border border-slate-200 bg-white/50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">!</span> {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ${role === 'STUDENT'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Signing in...
                        </span>
                    ) : (
                        "Sign In Account"
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                    Demo Credentials: <span className="font-semibold text-slate-600">prem@student.com</span> / <span className="font-semibold text-slate-600">123</span>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[100px] pointer-events-none" />

            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
