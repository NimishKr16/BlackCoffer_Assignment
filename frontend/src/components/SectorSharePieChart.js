import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const SectorSharePieChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5500/api/insights/sector-shares');
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sector data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading data...</div>;

    // Prepare data for Pie chart
    const chartData = {
        labels: data.map(item => item.sector),
        datasets: [
            {
                label: 'Share of Sectors',
                data: data.map(item => item.count),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                ],
                hoverBackgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                ]
            }
        ]
    };

    return (
        <div>
            <h2>Share of Each Sector</h2>
            <Pie data={chartData} />
        </div>
    );
};

export default SectorSharePieChart;