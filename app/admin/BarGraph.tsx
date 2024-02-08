"use client"

import { Chart as ChartJs, BarElement, CategoryScale, Legend, LinearScale, Tooltip } from "chart.js"
import { Bar } from "react-chartjs-2";

ChartJs.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarGraphProps {
    data: GraphData[]
}

type GraphData = {
    day: string;
    date: string;
    totalAmount: number;
}

const BarGraph = ({ data }: BarGraphProps) => {
    const labels = data.map(item => item.day);
    const amounts = data.map(item => item.totalAmount / 100);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Valor de venda",
                data: amounts,  
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

    return (
        <Bar data={chartData} options={options}></Bar>
    );
};

export default BarGraph;