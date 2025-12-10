"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT: SRKR + TITLE */}
          <section className="space-y-6 text-center md:text-left">
            <div className="inline-block px-3 py-1 bg-blue-100/50 rounded-full border border-blue-200 backdrop-blur-sm">
              <p className="text-xs tracking-widest text-blue-700 font-bold uppercase">
                SRKR Engineering College
              </p>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Smart Academic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Leave Manager
              </span>
            </h1>

            <p className="text-slate-600 text-lg max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
              Experience seamless leave management with AI-powered classification and real-time approval tracking.
            </p>
          </section>

          {/* RIGHT: Login Glass Card */}
          <section className="flex justify-center">
            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-10 transform transition hover:scale-[1.02] duration-500">

              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-slate-500 mt-2 font-medium">
                  Please select your portal to login
                </p>
              </div>

              <div className="space-y-4">
                {/* Student Login Button */}
                <button
                  onClick={() => router.push("/login?role=STUDENT")}
                  className="group w-full p-1 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
                >
                  <div className="bg-white rounded-[13px] px-6 py-5 flex items-center justify-between group-hover:bg-opacity-95 transition-all">
                    <div className="text-left">
                      <span className="block text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        Student Login
                      </span>
                      <span className="text-sm text-slate-400 font-medium group-hover:text-slate-500">
                        Apply & Track Leaves
                      </span>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <span className="text-blue-600 text-xl">→</span>
                    </div>
                  </div>
                </button>

                {/* Faculty Login Button */}
                <button
                  onClick={() => router.push("/login?role=FACULTY")}
                  className="group w-full p-1 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
                >
                  <div className="bg-white rounded-[13px] px-6 py-5 flex items-center justify-between group-hover:bg-opacity-95 transition-all">
                    <div className="text-left">
                      <span className="block text-lg font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                        Faculty Login
                      </span>
                      <span className="text-sm text-slate-400 font-medium group-hover:text-slate-500">
                        Review & Approve
                      </span>
                    </div>
                    <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <span className="text-purple-600 text-xl">→</span>
                    </div>
                  </div>
                </button>
              </div>

              <p className="text-xs text-slate-400 font-medium text-center mt-8">
                Official Portal · SRKR Engineering College
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
