import React from "react";

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
      <div className="text-center text-white">
        {/* Logo Section */}
        <div className="mb-8 animate-bounce">
          <img
            src="/ll.jpg"
            alt="Kisanmitra Logo"
            className="mx-auto w-32 h-32 object-cover rounded-full shadow-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">KISANMITRA</h1>
        <p className="text-xl text-primary-100 mb-8">
          Your Organic Farming Assistant
        </p>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
}
