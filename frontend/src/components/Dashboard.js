// Dashboard.js
import React, { useState } from 'react';
// import CountryFilter from './CountryFilter';
import MetricInsights from './MetricInsights'; // Importing the new MetricInsights component

const Dashboard = () => {
  

    return (
        <div>
            <h1>Energy Insights Dashboard</h1>
            {/* <CountryFilter onCountrySelect={handleCountrySelect} /> */}
            <MetricInsights /> {/* Adding the MetricInsights component here */}
        </div>
    );
};

export default Dashboard;