import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(() => Math.floor(Math.random() * (1000 - (-1000) + 1)) + (-1000)),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: labels.map(() => Math.floor(Math.random() * (1000 - (-1000) + 1)) + (-1000)),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Target',
            data: labels.map(() => 200),
            borderColor: 'rgb(0, 0, 0)',
            backgroundColor: 'rgb(0, 0, 0)',
        }
    ],
};

export default function Analytics() {
    return (
        <main>
            <div className="container pt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
                <Line options={options} data={data} />
            </div>
        </main>
    );
}
