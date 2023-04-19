import React from "react";

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PieController,
    ArcElement
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
    PieController,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

export default function PieGraph({ graphData, labels, subjectName }) {
    const data = {
        labels,
        datasets: [
            {
                label: subjectName,
                data: graphData,
                backgroundColor: [
                    'rgb(0, 255, 0)',
                    'rgb(0, 255, 150)',
                    'rgb(150, 255, 150)',
                    'rgb(200, 255, 200)',
                    'rgb(255, 0, 0)',
                ],
                hoverOffset: 4
            }
        ]
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
            <div style={{ width: "500px" }}>
                <Pie data={data} />
            </div>
        </div>
    )
}