"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

type LeaveResponse = {
    id: number;
    start_date: string;
    end_date: string;
    reason: string;
    auto_type: string;
    status: string;
    conflict_count: number;
    created_at: string;
};

export default function ApplyLeavePage() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    // Summary Prediction State
    const [summary, setSummary] = useState<any>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<LeaveResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch summary when dates change
    useEffect(() => {
        if (!startDate || !endDate) {
            setSummary(null);
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Simple day diff calculation
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (days <= 0 || isNaN(days)) return;

        async function fetchSummary() {
            setLoadingSummary(true);
            try {
                const data = await apiFetch<any>(
                    `/leaves/summary?requested_days=${days}`
                );
                setSummary(data);
            } catch (err) {
                console.error("Failed to fetch summary", err);
            } finally {
                setLoadingSummary(false);
            }
        }

        const timeout = setTimeout(fetchSummary, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [startDate, endDate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await apiFetch<LeaveResponse>(
                `/leaves/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        start_date: startDate,
                        end_date: endDate,
                        reason,
                    }),
                }
            );
            setResult(data);
            // Refresh summary after successful submission
            setSummary(null);
            // In a real app we'd refresh the summary to show new balance, 
            // but for now clearing it avoids confusion.
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-900">
            <Navbar role="STUDENT" />

            <main className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-8 items-start">

                    {/* Form Section */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-white/50">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">Apply for Leave</h2>
                            <p className="text-slate-500 mt-1">Submit your leave request for AI classification.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">From Date</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">To Date</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Smart Impact Card */}
                            {loadingSummary && (
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 animate-pulse">
                                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            )}

                            {summary && !loadingSummary && (
                                <div className={`p-5 rounded-2xl border ${summary.will_drop_below_threshold ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                                    <h4 className={`text-sm font-bold mb-3 ${summary.will_drop_below_threshold ? 'text-red-800' : 'text-blue-800'}`}>
                                        📊 Projected Impact
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                        <div>
                                            <p className="text-slate-500 text-xs uppercase font-bold">Leaves Used</p>
                                            <p className="font-semibold text-slate-700">
                                                {summary.used_leaves} <span className="text-slate-400">→</span> <span className="text-blue-600 font-bold">{summary.projected_used_leaves}</span>
                                                <span className="text-slate-400 text-xs font-normal"> / {summary.total_leaves_allowed}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs uppercase font-bold">Remaining</p>
                                            <p className="font-semibold text-slate-700">
                                                {summary.remaining_leaves} <span className="text-slate-400">→</span> <span className={`${summary.projected_remaining_leaves < 2 ? 'text-red-600' : 'text-blue-600'} font-bold`}>
                                                    {summary.projected_remaining_leaves}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600">Current Attendance</span>
                                            <span className="font-bold text-slate-800">{summary.current_attendance_percentage}%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className={`${summary.will_drop_below_threshold ? 'text-red-700 font-medium' : 'text-slate-600'}`}>
                                                Projected After Leave
                                            </span>
                                            <span className={`font-bold ${summary.will_drop_below_threshold ? 'text-red-700' : 'text-slate-800'}`}>
                                                {summary.projected_attendance_percentage}%
                                                <span className="text-xs ml-1 font-normal opacity-70">
                                                    ({summary.projected_absent_days} absent days)
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {summary.will_drop_below_threshold && (
                                        <div className="mt-3 p-3 bg-red-100/50 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2">
                                            <span>⚠️</span>
                                            Warning: Applying for this leave may drop your attendance below the {summary.threshold}% threshold.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Reason</label>
                                <textarea
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-slate-900 font-medium"
                                    rows={4}
                                    placeholder="Enter your reason here... (e.g. 'I have a fever')"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-slate-400 px-1">
                                    * Our AI will automatically categorize this as Medical, Personal, or Academic.
                                </p>
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : "Submit Request"}
                            </button>
                        </form>
                    </div>

                    {/* Status Section (unchanged from here down mostly) */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Request Summary</h3>

                        {!result ? (
                            <div className="text-center py-10 px-4">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📝</div>
                                <p className="text-slate-500 text-sm font-medium">No request to show</p>
                                <p className="text-slate-400 text-xs mt-1">Submit the form to see the AI classification result.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Status</p>
                                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${result.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                            result.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {result.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Category</p>
                                        <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                            {result.auto_type}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50">
                                    <h4 className="text-sm font-bold text-slate-800 mb-2">Details</h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between text-sm">
                                            <span className="text-slate-500">Request ID</span>
                                            <span className="font-mono font-medium text-slate-700">#{result.id}</span>
                                        </li>
                                        <li className="flex justify-between text-sm">
                                            <span className="text-slate-500">Duration</span>
                                            <span className="font-medium text-slate-700">{result.start_date} to {result.end_date}</span>
                                        </li>
                                        <li className="text-sm">
                                            <span className="text-slate-500 block mb-1">Reason</span>
                                            <p className="text-slate-700 italic">"{result.reason}"</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
