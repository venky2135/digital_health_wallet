import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const VitalsChart = () => {
    const [data, setData] = useState([]);
    const [type, setType] = useState('BP'); // Default vital type

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/vitals?type=${type}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const formattedData = res.data.map(item => {
                    if (type === 'BP') {
                        const [sys, dia] = item.value.split('/');
                        return { date: item.date, systolic: parseInt(sys), diastolic: parseInt(dia) };
                    }
                    return { date: item.date, value: parseInt(item.value) };
                });
                setData(formattedData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [type]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Vitals Trends</h2>
                <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded p-2">
                    <option value="BP">Blood Pressure</option>
                    <option value="Sugar">Blood Sugar</option>
                    <option value="HeartRate">Heart Rate</option>
                </select>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {type === 'BP' ? (
                            <>
                                <Line type="monotone" dataKey="systolic" stroke="#8884d8" name="Systolic" />
                                <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" name="Diastolic" />
                            </>
                        ) : (
                            <Line type="monotone" dataKey="value" stroke="#8884d8" name={type} />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VitalsChart;
