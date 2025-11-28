import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Login = () => {
    const [passcode, setPasscode] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded check for demo purposes
        if (passcode === '145300' || passcode === 'admin') {
            navigate('/admin');
        } else {
            alert('Invalid passcode');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Lock size={32} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Access</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Passcode</label>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter passcode"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-500">
                    Default: 145300
                </div>
            </div>
        </div>
    );
};

export default Login;
