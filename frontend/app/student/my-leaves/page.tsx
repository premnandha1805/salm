"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

type LeaveItem = {
    id: number;
    start_date: string;
    end_date: string;
    reason: string;
    auto_type: string;
    status: string;
    conflict_count: number;
    created_at: string;
};

export default function MyLeavesPage() {
    const [leaves, setLeaves] = useState<LeaveItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await apiFetch<LeaveItem[]>(
                    `/leaves/me`
                );
                setLeaves(data);
            } catch (err: any) {
                setError(err.message || "Failed to load leaves");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-900">
            <Navbar role="STUDENT" />

            <main className="max-w-6xl mx-auto px-4 py-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-100/50 p-8 border border-white/50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">My Leave History</h2>
                            <p className="text-slate-500 mt-1">Track the status of your past requests.</p>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-sm font-bold text-slate-700">{leaves.length} <span className="text-slate-400 font-normal">Records</span></span>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    {!loading && !error && leaves.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                            <p className="text-slate-900 font-semibold">No records found</p>
                            <p className="text-slate-500 text-sm mt-1">You haven't applied for any leave yet.</p>
                            <Link
                                href="/student/apply-leave"
                                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Apply Now
                            </Link>
                        </div>
                    )}

                    {!loading && !error && leaves.length > 0 && (
                        <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-200/60 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                            <th className="px-6 py-4">Dates</th>
                                            <th className="px-6 py-4">Reason</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {leaves.map((leave) => (
                                            <tr key={leave.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-700 text-sm">
                                                        {leave.start_date} <span className="text-slate-300 mx-1">→</span> {leave.end_date}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <p className="text-sm text-slate-600 truncate" title={leave.reason}>
                                                        {leave.reason}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                                        {leave.auto_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${leave.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        leave.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${leave.status === 'APPROVED' ? 'bg-emerald-500' :
                                                            leave.status === 'REJECTED' ? 'bg-rose-500' :
                                                                'bg-amber-500'
                                                            }`}></span>
                                                        {leave.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-xs font-mono text-slate-400 group-hover:text-slate-600 transition-colors">#{leave.id}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
