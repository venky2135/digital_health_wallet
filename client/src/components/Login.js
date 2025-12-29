import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // Force reload to update App state or use context (simple reload for now)
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-96">
                <h3 className="text-2xl font-bold text-center text-blue-600">Login to Health Wallet</h3>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="username"
                            placeholder="Email Address"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex items-baseline justify-between">
                        <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</button>
                        <Link to="/register" className="text-sm text-blue-600 hover:underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
