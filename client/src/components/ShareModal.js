import React, { useState } from 'react';
import axios from 'axios';

const ShareModal = ({ reportId, onClose }) => {
    const [email, setEmail] = useState('');

    const handleShare = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/shares/share', {
                reportId,
                sharedWithEmail: email,
                permission: 'view'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Report shared successfully');
            onClose();
        } catch (err) {
            alert('Share failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-bold mb-4">Share Report</h3>
                <form onSubmit={handleShare}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="User Email"
                        required
                        className="w-full border rounded p-2 mb-4"
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Share</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShareModal;
