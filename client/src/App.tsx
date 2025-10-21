import { Route, Routes, useNavigate } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AppContainer } from './components/AppContainer';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { setNavigate } from './lib/navigation';

export default function App() {
    const navigate = useNavigate();
    setNavigate(navigate);

    return (
        <Routes>
            <Route path='/' element={<AppContainer />}>
                <Route index element={<Profile />} />
                <Route path='settings' element={<Settings />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes >
    );
}
