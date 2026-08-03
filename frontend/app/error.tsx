"use client";

import React from 'react';

export default function ErrorPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
      <p className="text-gray-500">Error loading page.</p>
    </div>
  );
}
