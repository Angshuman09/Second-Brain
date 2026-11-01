"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
    { day: "Mon", visits: 120 },
    { day: "Tue", visits: 210 },
    { day: "Wed", visits: 160 },
    { day: "Thu", visits: 290 },
    { day: "Fri", visits: 240 },
];

const HeavyChart = () => {
    return (
        <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visits" stroke="#2563eb" />
        </LineChart>
    )
}

export default HeavyChart