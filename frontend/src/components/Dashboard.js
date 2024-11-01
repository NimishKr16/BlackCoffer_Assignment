// Dashboard.js
import React, { useState } from "react";
// import CountryFilter from './CountryFilter';
import MetricInsights from "./MetricInsights"; // Importing the new MetricInsights component

const Dashboard = () => {
  return (
    <div>
      <h1 class="mb-4 pt-4 text-3xl text-center font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
        <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Energy Insights
        </span>{" "}
        Dashboard
      </h1>
      
      <MetricInsights /> 
    </div>
  );
};

export default Dashboard;
