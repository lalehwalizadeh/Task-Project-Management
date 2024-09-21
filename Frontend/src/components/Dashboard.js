import Header from './Header';
import React, { useEffect, useState } from 'react';
import './Styles/Tasks.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
	const [name, setName] = useState('');
	const navigate = useNavigate();

	axios.defaults.withCredentials = true;

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get('http://localhost:5000/dashboard');
				if (res.data.valid) {
					setName(res.data.username);
				} else {
					navigate('/login');
				}
			} catch (err) {
				console.log(err);
				navigate('/login'); // redirect to the Login on err
			}
		};
		checkAuth();
	}, [navigate]);

	const handleLogout = async () => {
		const confirmLogout = window.confirm('Are you sure you want to Log out?');
		if (confirmLogout) {
			try {
				await axios.get('http://localhost:5000/logout');
				navigate('/'); // Redirect to the home page after log out
			} catch (err) {
				console.log(err);
			}
		}
	};

	

	return (
		<>
			<Header />
			<div className='dashboard-container'>
				<div className='content'>
					<aside >your account </aside>
					<section >
						<h1> Manage your Tasks and Projects!</h1> Welcome {name}
						<button onClick={handleLogout} className='btn'>
							{' '}
							Log Out{' '}
						</button>
					</section>
				</div>
			</div>
		</>
	);
}
