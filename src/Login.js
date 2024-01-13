import React, { useState, lazy, Suspense } from 'react';
const Application = lazy(() => import('./Application'));
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        // Simulating a simple authentication process
        if (username === 'user' && password === 'password') {
            setLoggedIn(true);
            // Here you might redirect the user or perform other actions upon successful login
            console.log('Login successful!');
        } else {
            console.log('Login failed. Please check your credentials.');
        }
    };

    return (
        loggedIn ? (
            <Suspense fallback={<div>Loading...</div>}>
                <Application />
            </Suspense>
        ) : <div style={{ height: '100vh' }}>
            <form style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto', position: 'relative', top: '50%' }}>
                <label style={{ marginBottom: '10px' }}>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </label>
                <label style={{ marginBottom: '10px' }}>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </label>
                <button type="button" onClick={handleLogin} style={{ padding: '8px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
