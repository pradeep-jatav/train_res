// frontend/pages/login.js
"use client";

import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token); // Save token in localStorage
            setMessage(response.data.message);
            setTimeout(() => router.push('/SeatGrid'), 2000); // Redirect to SeatGrid page
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-300">Welcome Back</h1>
                <p className="text-center text-gray-500 dark:text-gray-400">Sign in to your account</p>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 text-black border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM6 17a6 6 0 0012 0v-5a2 2 0 00-2-2h-8a2 2 0 00-2 2v5z" />
                        </svg>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 text-black border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12m0 6a6 6 0 100-12 6 6 0 000 12zm0 0v.01" />
                        </svg>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <a
                            href="/signup"
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
                {message && <p className="text-center text-red-500">{message}</p>}
            </div>
        </div>
    );
}
