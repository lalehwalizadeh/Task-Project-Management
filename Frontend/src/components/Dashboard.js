import Header from './Header';
import Navbar from './Navbar';
import React, { useEffect, useState } from 'react';
import './Styles/Tasks.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateTask from './CreateTasks';

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
					console.log(res.data.username);
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

	const handleDeleteAccount = async () => {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete your account?'
		);
		if (confirmDelete) {
			try {
				const res = await axios.delete('http://localhost:5000/delete-account', {
					withCredentials: true,
				});
				if (res.data.dltMessage) {
					navigate('/');
				}
			} catch (err) {
				console.log(err);
			}
		}
	};
	return (
		<>
			<div className='dashboard-container'>
				<div className='content'>
					<aside>
						<Navbar />
						your account
						<button onClick={handleLogout} className='btn'>
							Log Out
						</button>
						<button onClick={handleDeleteAccount} className='btn'>
							Delete Account
						</button>
					</aside>
					<section>
						<div>{/* <Header /> */}</div>
						<div>
							<div className='dashboard-head'>Welcome {name} to your dashboard!</div>
							<CreateTask />
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
