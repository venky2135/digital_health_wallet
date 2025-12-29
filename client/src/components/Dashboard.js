import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ReportList from './ReportList';
import ReportUpload from './ReportUpload';
import VitalsChart from './VitalsChart';
import SharedReports from './SharedReports';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">Digital Health Wallet</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user?.username}</span>
                    <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
                </div>
            </nav>

            <div className="flex flex-1">
                <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
                    <ul className="space-y-2">
                        <li><Link to="/dashboard" className="block p-2 rounded hover:bg-blue-50 text-blue-600">Reports</Link></li>
                        <li><Link to="/dashboard/upload" className="block p-2 rounded hover:bg-blue-50 text-blue-600">Upload Report</Link></li>
                        <li><Link to="/dashboard/shared" className="block p-2 rounded hover:bg-blue-50 text-blue-600">Shared with Me</Link></li>
                        <li><Link to="/dashboard/vitals" className="block p-2 rounded hover:bg-blue-50 text-blue-600">Vitals Trends</Link></li>
                    </ul>
                </aside>

                <main className="flex-1 p-8">
                    <Routes>
                        <Route path="/" element={<ReportList />} />
                        <Route path="/upload" element={<ReportUpload />} />
                        <Route path="/shared" element={<SharedReports />} />
                        <Route path="/vitals" element={<VitalsChart />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
