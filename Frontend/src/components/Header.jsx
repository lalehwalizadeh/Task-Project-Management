import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles/nav.css';
import './Styles/Header.css';
import { FaSearch, FaAngleUp, FaAngleDown } from 'react-icons/fa';

export default function Header({ searchTask, setSearchTask }) {

	//State to hold the username and  dropdwon visibility 
	const [name, setName] = useState('');
	const [isOpenSetting, setIsOpenSetting] = useState(false);
	const navigate = useNavigate();

	// Enable sending cookies with requests
	axios.defaults.withCredentials = true;

	useEffect(() => {
		const checkAuth = async () => {
			try {
				
				const res = await axios.get('https://task-project-management-2.onrender.com/dashboard',{withCredentials:true ,headers:{'Content-type' :'application/json'}});
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
	}, [navigate]); //dependecy array to return effect if navigate changes


	//function to handle user logout
	const handleLogout = async () => {
		const confirmLogout = window.confirm('Are you sure you want to Log out?');
		if (confirmLogout) {
			try {
				await axios.get('https://task-project-management-2.onrender.com/logout');
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
				const res = await axios.delete('https://task-project-management-2.onrender.com/delete-account', {
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
	const toggleSetting = () => {
		setIsOpenSetting((prev) => !prev);
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
					<img
						src={`https://task-project-management-2.onrender.com/uploads/user-profile-placeholder.jpg`}
						className='user-profile'
						alt='user-profile-image'
					/>
					<span style={{textTransform:'capitalize',margin:'4px'}}>

					{name}
					</span>
					<span onClick={toggleSetting} style={{ cursor: 'pointer' }}>
						{isOpenSetting ? <FaAngleDown /> : <FaAngleUp />}
					</span>
					<span>
						{isOpenSetting && (
							<div className={` dropdown ${isOpenSetting ?'open' : ''}`}>
								<button onClick={handleLogout} className='btn '>
									 Log Out
								</button>
								<button onClick={handleDeleteAccount} className='btn '>
									 Delete Account
								</button>
							</div>
						)}
					</span>
				</div>
			</div>
		</header>
	);
}
