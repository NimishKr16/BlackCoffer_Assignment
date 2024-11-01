import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const RelevanceLikelihoodMixedChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5500/api/insights/monthly-averages');
                // console.log('Response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log('Fetched data:', result);

                // Months in the correct order for the x-axis
                const months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                // Prepare chart data
                const data = {
                    labels: months,
                    datasets: [
                        {
                            label: 'Relevance',
                            data: months.map(month => result[month]?.relevance || 0),
                            backgroundColor: 'rgba(255, 159, 64, 0.6)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                            type: 'bar', // Bar chart for relevance
                        },
                        {
                            label: 'Likelihood',
                            data: months.map(month => result[month]?.likelihood || 0),
                            borderColor: 'rgba(255, 0, 0, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0)',
                            fill: false,
                            borderWidth: 2,
                            type: 'line', // Line chart for likelihood
                        },
                    ],
                };
                
                setChartData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading data...</div>;

    return (
        <div>
            <h2>Average Relevance and Likelihood by Month</h2>
            {chartData && (
                <Bar
                    data={chartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: (value) => value.toFixed(2), // Ensures numbers are readable
                                },
                            },
                        },
                    }}
                />
            )}
        </div>
    );
};

export default RelevanceLikelihoodMixedChart;