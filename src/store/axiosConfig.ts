// import axios from 'axios';

// const token = localStorage.getItem('token');

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8009/api',
//   headers: {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   },
// });

// // Optionally, add an interceptor to update the token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const newToken = localStorage.getItem('token');
//     if (newToken && config.headers) {
//       config.headers['Authorization'] = `Bearer ${newToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const App: React.FC = () => {
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post('http://localhost:8009/api/users/login', { email, password });
//       setToken(res.data.token);
//       localStorage.setItem('token', res.data.token);
//       alert('Logged in successfully');
//     } catch (err: any) {
//       alert(err.response?.data?.error || 'Login failed');
//     }
//   };

//   const handleLogout = () => {
//     setToken(null);
//     localStorage.removeItem('token');
//     alert('Logged out successfully');
//   };

//   return (
//     <div>
//       {token ? (
//         <div>
//           <h2>Welcome!</h2>
//           <button onClick={handleLogout}>Logout</button>
//           {/* Protected content can go here */}
//         </div>
//       ) : (
//         <div>
//           <h2>Login</h2>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           /><br />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           /><br />
//           <button onClick={handleLogin}>Login</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;