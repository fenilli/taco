import { Route, Routes } from 'react-router';
import { Login } from './pages/Login';

export default function App() {
    return (
        <Routes>
            <Route path='/' element={<>Hello World</>} />
            <Route path='/login' element={<Login />} />
        </Routes>
    );
}
