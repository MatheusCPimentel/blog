"use client";

import React, { Suspense } from "react";
import { Posts } from "../components/Posts";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple Blog</h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A simple blog application for creating and managing posts
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <Suspense fallback={<LoadingSpinner />}>
              <Posts />
            </Suspense>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 border-t pt-8">
          <p>Built with modern web technologies.</p>
        </footer>
      </div>
    </main>
  );
}
