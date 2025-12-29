import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const ReportUpload = () => {
    const [file, setFile] = useState(null);
    const [type, setType] = useState('Blood Test');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [vitals, setVitals] = useState({ sys: '', dia: '', sugar: '', heartRate: '' });
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleVitalChange = (e) => {
        setVitals({ ...vitals, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('report', file);
        formData.append('type', type);
        formData.append('date', date);

        // Construct vitals JSON
        const vitalsData = {};
        if (vitals.sys && vitals.dia) vitalsData.bp = `${vitals.sys}/${vitals.dia}`;
        if (vitals.sugar) vitalsData.sugar = vitals.sugar;
        if (vitals.heartRate) vitalsData.heartRate = vitals.heartRate;

        formData.append('vitals', JSON.stringify(vitalsData));

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/reports/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Upload Report</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Report File</label>
                    <input type="file" onChange={handleFileChange} required className="mt-1 w-full" />
                </div>
                <div>
                    <label className="block text-gray-700">Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full border rounded p-2">
                        <option>Blood Test</option>
                        <option>X-Ray</option>
                        <option>MRI</option>
                        <option>Prescription</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 w-full border rounded p-2" />
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Vitals (Optional)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm">Systolic BP (mmHg)</label>
                            <input
                                type="number"
                                name="sys"
                                value={vitals.sys}
                                onChange={handleVitalChange}
                                placeholder="120"
                                className="mt-1 w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Diastolic BP (mmHg)</label>
                            <input
                                type="number"
                                name="dia"
                                value={vitals.dia}
                                onChange={handleVitalChange}
                                placeholder="80"
                                className="mt-1 w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Blood Sugar (mg/dL)</label>
                            <input
                                type="number"
                                name="sugar"
                                value={vitals.sugar}
                                onChange={handleVitalChange}
                                placeholder="90"
                                className="mt-1 w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Heart Rate (bpm)</label>
                            <input
                                type="number"
                                name="heartRate"
                                value={vitals.heartRate}
                                onChange={handleVitalChange}
                                placeholder="72"
                                className="mt-1 w-full border rounded p-2"
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Upload</button>
            </form>
        </div>
    );
};

export default ReportUpload;
