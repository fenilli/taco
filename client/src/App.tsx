import { Routes, Route } from 'react-router';

export const App = () => {
    return (
        <Routes>
            <Route path='/' element={<>Hello World</>} />
        </Routes>
    )
};
