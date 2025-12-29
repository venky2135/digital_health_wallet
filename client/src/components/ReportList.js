import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShareModal from './ShareModal';

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [shareReportId, setShareReportId] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/reports', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReports();
    }, []);

    const handleDownload = async (id, filename) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reports/${id}/download`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">My Reports</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.original_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleDownload(report.id, report.original_name)} className="text-indigo-600 hover:text-indigo-900 mr-4">Download</button>
                                    <button onClick={() => setShareReportId(report.id)} className="text-green-600 hover:text-green-900">Share</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {shareReportId && <ShareModal reportId={shareReportId} onClose={() => setShareReportId(null)} />}
        </div>
    );
};

export default ReportList;
