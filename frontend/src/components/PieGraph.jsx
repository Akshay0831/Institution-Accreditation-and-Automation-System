import React from "react";
import { Chart as ChartJS, Title, Tooltip, Legend, PieController, ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(PieController, ArcElement, Title, Tooltip, Legend);

export default function PieGraph({ graphData, labels, title="" }) {
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

    const options = {
        plugins: {
            legend: {
                position: 'right'
            },
            title:{
                display:true,
                text:title
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div className="d-flex col-lg-6 justify-content-center overflow-auto border bg-light rounded">
            <Pie className="p-0 m-0 w-100" data={data} options={options} />
        </div>
    )
}
