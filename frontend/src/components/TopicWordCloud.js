import React, { useEffect, useState } from 'react';
import WordCloud from 'react-wordcloud';

const TopicWordCloud = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchWordCloudData = async () => {
            try {
                const response = await fetch('http://localhost:5500/api/topics/frequencies');
                const result = await response.json();
                console.log('Fetched word cloud data:', result);
                setData(result);
            } catch (error) {
                console.error("Error fetching word cloud data:", error);
            }
        };

        fetchWordCloudData();
    }, []);

    const options = {
        rotations: 2,
        rotationAngles: [-90, 0],
        fontSizes: [15, 60], // Adjust font size range
    };

    return (
        <div>
            <h2>Topic Word Cloud</h2>
            <WordCloud words={data} options={options} />
        </div>
    );
};

export default TopicWordCloud;