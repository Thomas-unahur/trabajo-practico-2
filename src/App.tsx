import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <main>
                    <Routes>
                        {/* Rutas publicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/post/:id" element={<PostDetail />} />

                        {/* Rutas protegidas */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create-post"
                            element={
                                <ProtectedRoute>
                                    <CreatePost />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </AuthProvider>
        </BrowserRouter>
    );
}