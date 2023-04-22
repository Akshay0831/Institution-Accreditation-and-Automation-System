import React from "react";
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';

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
    zoomPlugin
);



export default function BarGraph({ graphData, labels, title, thresholdLines }) {
    const options = {
        responsive: true,
        scales: {
            y: {
                suggestedMin: 0,
                suggestedMax: 40
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x'
                },
                pan: {
                    enabled: true,
                    mode: 'xy'
                },
                limits: {
                  x: { min: 0, max: 100 },
                  y: { min: 1, max: 100 },
                  zoom: { min: 1, max: 10 },
                }
            },
            title: {
                display: false,
            },
            annotation: {
                annotations: thresholdLines ? {
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
                } : null
            }
        },
    };
    const data = {
        labels,
        datasets: [
            {
                label: title,
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

BarGraph.defaultProps = {
    graphData: [],
    labels: [],
    title: "",
    thresholdLines: false
}