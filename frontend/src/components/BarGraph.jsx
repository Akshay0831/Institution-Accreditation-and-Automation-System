import React from "react";
import PropTypes from "prop-types";
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, BarController, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(
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

const BarGraph = ({ graphData, labels, title = "", annonationsData = null }) => {
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
                position: 'bottom'
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
                    y: { min: 0, max: 100 },
                    zoom: { min: 1, max: 10 }
                }
            },
            title: {
                display: true,
                text: title
            },
            annotation: {
                annotations: annonationsData
            }
        }
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
        <div className="bg-light w-100 overflow-auto border rounded">
            <Bar data={data} options={options} plugins={[annotationPlugin]} />
        </div>
    )
};

BarGraph.propTypes = {
    graphData: PropTypes.arrayOf(PropTypes.number).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string,
    annonationsData: PropTypes.object
};

export default BarGraph;
