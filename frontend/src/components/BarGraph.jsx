import React, { useState } from "react";
import { Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
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

const BarGraph = ({ graphData, labels, title = "", annotationsData = null }) => {
    const [sortOrder, setSortOrder] = useState("none");

    const options = {
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
                    mode: 'x',
                },
                pan: {
                    enabled: true,
                    mode: 'xy'
                },
                limits: {
                    x: { min: 0 },
                    y: { min: 0, max: 100 }
                }
            },
            title: {
                display: true,
                text: title
            },
            annotation: {
                annotations: annotationsData
            }
        }
    };
    
    const sortData = (order) => [...graphData].sort((a, b) => (order === "ascending" ? a - b : b - a));
    
    const data = {
        labels: sortOrder === "none" ? labels : [...labels].sort((a, b) => {
            const indexA = graphData[labels.indexOf(a)];
            const indexB = graphData[labels.indexOf(b)];
            if (sortOrder === "ascending")
            return indexA - indexB;
            else return indexB - indexA;
          }),
        datasets: [
            {
                label: title,
                data: sortOrder === "none" ? graphData : sortData(sortOrder),
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                hoverBackgroundColor: 'rgba(0, 255, 0, 1)'
            }
        ]
    };

    const handleSort = (order) => {
        setSortOrder(order);
    };

    return (
        <div className="bg-light w-100 overflow-auto border p-3 rounded">
            <ToggleButtonGroup type="radio" size="sm" name="sortOrderOptions" value={sortOrder} aria-label="Sort Buttons">
                <ToggleButton type="button" variant={sortOrder === 'ascending'?"secondary":"outline-secondary"} onClick={() => handleSort("ascending")}>Sort Ascending</ToggleButton>
                <ToggleButton type="button" variant={sortOrder === 'descending'?"secondary":"outline-secondary"} onClick={() => handleSort("descending")}>Sort Descending</ToggleButton>
                <ToggleButton type="button" variant={sortOrder === 'none'?"secondary":"outline-secondary"} onClick={() => handleSort("none")}>No Sort</ToggleButton>
            </ToggleButtonGroup>
            <Bar data={data} options={options} plugins={[annotationPlugin]} />
        </div>
    )
};

BarGraph.propTypes = {
    graphData: PropTypes.arrayOf(PropTypes.number).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string,
    annotationsData: PropTypes.object
};

export default BarGraph;