import React from "react";
import "./graph.css";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";

function Graph(graphData) {
    var label = []
    var DoneTask = []
    graphData.data && graphData.data.length > 0 && graphData.data.map((data) => {
        label.push(data.date);
        DoneTask.push(data.TaskDone)
    });

    console.log("labe", label)
    console.log("DoneTask", DoneTask)
    const data = {
        labels: label,
        datasets: [
            {
                label: "WEEKLY TASK DETAILS",
                data: DoneTask,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
            },

        ]
    };
    return (
        <div className="line">
            <Line data={data} options={{
                scales: { yAxis: { min: 0, max: 10, } },
            }} />
        </div>

    );

}



export default Graph;