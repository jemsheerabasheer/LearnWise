import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Zap, Map, Bookmark, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">LearnWise</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Log in</Link>
            <Link to="/register" className="btn-primary py-2 px-4 text-sm hidden sm:flex">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative overflow-hidden bg-mesh-pattern pt-20 pb-32">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
              Your personalized <span className="text-indigo-600 block sm:inline">learning roadmap.</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              LearnWise uses local AI to generate structured, step-by-step learning paths tailored to your skill level, known languages, and career goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group w-full sm:w-auto">
                Start Learning Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-8 py-4 text-lg font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Everything you need to succeed</h2>
              <p className="mt-4 text-lg text-slate-600">Stop guessing what to learn next. We build the path for you.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI Powered</h3>
                <p className="text-slate-600 leading-relaxed">Runs entirely on a local LLaMA model, ensuring fast, privacy-focused roadmap generation.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <Map className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Structured Paths</h3>
                <p className="text-slate-600 leading-relaxed">Get detailed topics, sequential action steps, recommended resources, and mini-projects.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Track Progress</h3>
                <p className="text-slate-600 leading-relaxed">Check off topics as you master them, track your completion percentage, and bookmark materials.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-center text-slate-400 border-t border-slate-800 mt-auto">
        <p className="flex items-center justify-center gap-2 mb-2">
           <GraduationCap className="h-5 w-5" /> LearnWise
        </p>
        <p className="text-sm">Built with React, Node.js, Express, and MongoDB.</p>
      </footer>
    </div>
  );
}
