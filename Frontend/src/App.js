import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';
import Login from './components/Login'
import SignUp from './components/SignUp';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import UpdateTask from './components/UpdateTask';

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
					<Route path='/update/:id' element={<UpdateTask />} />
					
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
