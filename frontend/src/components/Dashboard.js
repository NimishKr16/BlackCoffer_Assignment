// Dashboard.js
import React, { useState } from "react";
// import CountryFilter from './CountryFilter';
import IntensityChart from "./IntensityChart"; // Importing the new MetricInsights component
import RelevanceLikelihoodMixedChart from "./RelevanceLikelihoodMixedChart";
import SectorSharePieChart from "./SectorSharePieChart";
import CountryRegionChoropleth from "./CountryRegionChoropleth";
import TopicWordCloud from "./TopicWordCloud";
const Dashboard = () => {
  return (
    <div>
      <h1 class="mb-4 pt-4 text-3xl text-center font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
        <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Energy Insights
        </span>{" "}
        Dashboard
      </h1>
      
      <IntensityChart /> 
      <RelevanceLikelihoodMixedChart />
      <SectorSharePieChart />
      <CountryRegionChoropleth />
      <TopicWordCloud />
    </div>
  );
};

export default Dashboard;
