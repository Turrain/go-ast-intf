import { useEffect } from 'react'


import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/AuthStore';


const App: React.FC = () => {
  const { token, initialize, loading } = useAuthStore();

  useEffect(() => {
      initialize();
  }, [initialize]);

  if (loading) {
      return <Loading />;
  }

  return (
      <BrowserRouter>
          <Routes>
              <Route
                  path="/"
                  element={
                      token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                  }
              />
              <Route
                  path="/login"
                  element={token ? <Navigate to="/dashboard" replace /> : <Login />}
              />
              <Route
                  path="/register"
                  element={token ? <Navigate to="/dashboard" replace /> : <Register />}
              />
              <Route
                  path="/dashboard"
                  element={
                      token ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <Navigate to="/login" replace />
                  }
              />
              {/* Add more routes as needed */}
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </BrowserRouter>
  );
};
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {

  const  token = useAuthStore((state) => state.token);
  console.log({token});
  
  if (!token) {
      return <Navigate to="/login" replace />;
  }
  return children;
};

// function App() {

//   return (
    // <>
    //   <CssVarsProvider disableTransitionOnChange>
    //     <CssBaseline />
    //     <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
    //       {/* <Sidebar /> */}
    //       <Box
    //         component="main"
    //         className="MainContent"
    //         sx={{


    //           flex: 1,
    //           display: 'flex',
    //           flexDirection: 'column',
    //           minWidth: 0,
    //           height: '100dvh',
    //           gap: 1,
    //         }}
    //       >
            
    //         <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          
    //           <Sheet
    //             sx={{
    //               height: { xs: 'calc(100dvh - 10px)', md: '100dvh' },
    //               display: 'flex',
    //               width: '100%',
    //               flexDirection: 'column',
    //               backgroundColor: 'background.level1',
    //             }}
    //           >
    //             <ChatPane />
    //           </Sheet>
              
    //         </Box>
    //       </Box>
    //     </Box>
    //   </CssVarsProvider>
    // </>
//   )
// }

export default App
