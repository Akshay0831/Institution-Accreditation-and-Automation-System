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

export default function PieGraph({ graphData, labels, title }) {
    const data = {
        labels,
        datasets: [
            {
                label: title,
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: "rgb(240, 240, 240)", borderRadius: "10px" }} className="overflow-auto p-4">
            <div>
                <Pie data={data} />
            </div>
        </div>
    )
}