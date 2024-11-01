import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
Chart.register(...registerables);

// Helper to sort and format month names
const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const IntensityChart = () => {
    const [data, setData] = useState([]); // State to store the processed data
    const [loading, setLoading] = useState(true); // State to track loading status
    const chartRef = useRef(null); // Reference to the chart component

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5500/api/insights'); // Fetch data from the API
                const result = await response.json(); // Parse the response as JSON
                console.log('Fetched raw data:', result);

                // Process data: group by month, calculate average intensity
                const processedData = result.reduce((acc, item) => {
                    const month = new Date(item.added).toLocaleString('default', { month: 'long' }).replace(/,$/, '').trim(); // Extract month from timestamp
                    console.log(month);
                    acc[month] = { totalIntensity: 0, count: 0 };
                    acc[month].totalIntensity += item.intensity || 0;
                    acc[month].count += 1;
                    return acc;
                }, {});

                // Calculate average intensity per month and order by calendar
                const averagedData = monthOrder.map(month => {
                    const monthData = processedData[month];
                    const averageIntensity = monthData ? (monthData.totalIntensity / monthData.count).toFixed(2) : 0;
                    console.log(`Month: ${month}, Total Intensity: ${monthData ? monthData.totalIntensity : 0}, Count: ${monthData ? monthData.count : 0}, Average: ${averageIntensity}`);
                    return {
                        month,
                        intensity: averageIntensity,
                    };
                });

                console.log('Averaged data by month:', averagedData);
                setData(averagedData); // Update the state with the processed data
                setLoading(false); // Set loading status to false
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Set loading status to false in case of an error
            }
        };

        fetchData(); // Call the fetchData function to fetch and process the data

        return () => {
            if (chartRef.current) {
                const chartInstance = chartRef.current.chartInstance;
                if (chartInstance) {
                    chartInstance.destroy(); // Destroy the chart instance when the component is unmounted
                }
            }
        };
    }, []);

    // Prepare chart data
    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: 'Average Intensity by Month',
                data: data.map(item => parseFloat(item.intensity)), // Parse values to ensure they are numbers
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.2,
            },
        ],
    };

    // Chart configuration
    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
                type: 'category',
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Average Intensity',
                },
                ticks: {
                    beginAtZero: true,
                    callback: value => Number(value).toFixed(2), // Keep decimal values consistent
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: context => `Average Intensity: ${context.raw}`,
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    if (loading) return <div>Loading data...</div>; // Show loading message if data is still loading

    return (
        <div>
            <h2>Metric Insights: Monthly Average Intensity</h2>

            {/* // Render the Line chart component with the provided data and options */}
            <Line ref={chartRef} data={chartData} options={chartOptions} /> 
        </div>
    );
};

export default IntensityChart;
