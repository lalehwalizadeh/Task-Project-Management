import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles/nav.css';
import './Styles/Header.css';
import { FaSearch } from 'react-icons/fa';

export default function Header({ searchTask, setSearchTask }) {
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
		<header className='header'>
			<div className='head-content'>
				<div className='searchBar-container'>
					<span className='search'>
						<FaSearch />
					</span>
					<input
						type='text'
						placeholder='Explore Tasks & Projects...'
						className='search-input '
						value={searchTask}
						onChange={(e) => setSearchTask(e.target.value)}
					/>
				</div>
				<div>
					<div>
						<img
							src={`http://localhost:5000/uploads/user-profile-placeholder.jpg`}
							className='user-profile'
							alt='user-profile-image'
						/>{' '}
						{name}
					<button onClick={handleLogout} className='btn'>
						Log Out
					</button>
					<button onClick={handleDeleteAccount} className='btn'>
						Delete Account
					</button>
					</div>
				</div>
			</div>
		</header>
	);
}
