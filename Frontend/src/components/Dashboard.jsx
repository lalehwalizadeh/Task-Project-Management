import React from 'react';
import './Styles/Dashboard.css';
import Navbar from './Navbar';
import CreateTask from './CreateTasks';

export default function Dashboard() {
	return (
		<>
			<div className=' dashboard-container'>
				<div>
					<Navbar />
				</div>

				<div className='dashboard-content'>
					<CreateTask />
				</div>
			</div>
		</>
	);
}
