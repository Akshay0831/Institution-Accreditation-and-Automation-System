import React from "react";
import annotationPlugin from 'chartjs-plugin-annotation';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    BarController,
    BarElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin,
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: false,
        },
        annotation: {
            annotations: {
                line1: {
                    type: 'line',
                    yMin: 60,
                    yMax: 60,
                    borderColor: 'rgb(0, 255, 0)',
                    borderWidth: 2,
                },
                line2: {
                    type: 'line',
                    yMin: 55,
                    yMax: 55,
                    borderColor: 'rgb(150, 255, 0)',
                    borderWidth: 2,
                },
                line3: {
                    type: 'line',
                    yMin: 50,
                    yMax: 50,
                    borderColor: 'rgb(200, 255, 0)',
                    borderWidth: 2,
                },
                line4: {
                    type: 'line',
                    yMin: 34,
                    yMax: 34,
                    borderColor: 'rgb(255, 0, 0)',
                    borderWidth: 2,
                }
            }
        }
    },
};


export default function BarGraph({ graphData, labels, subjectName }) {
    const data = {
        labels,
        datasets: [
            {
                label: subjectName,
                data: graphData,
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                hoverBackgroundColor: 'rgba(0, 255, 0, 1)'
            }
        ]
    };
    return (
        <div style={{ background: "white" }}>
            <Bar data={data} options={options} plugins={[annotationPlugin]} />
        </div>
    )
}