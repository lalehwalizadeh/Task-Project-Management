import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';
import Login from './components/Login'
import SignUp from './components/SignUp';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

function App() {
	console.log('object');
	return (
		<>

			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/SignUp' element={<SignUp />} />
					<Route path='/login' element={<Login />} />
					<Route path='/dashboard' element={<Dashboard />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
