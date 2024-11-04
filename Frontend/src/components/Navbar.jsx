import React, { useEffect, useState } from 'react';
import './Styles/nav.css';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FaBars, FaHome } from 'react-icons/fa';
import {RiDashboard3Line} from 'react-icons/ri'
import { IoLogoBuffer} from "react-icons/io5";
import {MdTaskAlt} from 'react-icons/md'
import { LuLogIn } from 'react-icons/lu';
import {SiGnuprivacyguard} from 'react-icons/si'


//define the routes and thier associated icons for the navbar
const nav_routes = [
	{
		path: '/',
		name: 'Home',
		icon: <FaHome />,
	},
	{
		path: '/dashboard',
		name: 'Tasks',
		icon: <MdTaskAlt />,
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: <RiDashboard3Line />,
	},
	{
		path: '/signup',
		name: 'Signup',
		icon: <SiGnuprivacyguard />,
	},
	{
		path: '/login',
		name: 'Login',
		icon: <LuLogIn />,
	},
	
];

export default function Navbar() {
	// Satate to control visibility of navbar
	const [isOpen, setIsOpen] = useState(window.innerWidth>768); // open if screen width is greater than 768px
	const toggle = () => {
		setIsOpen(!isOpen)
	}
	
	// effect to handle window resizng
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				setIsOpen(false)
			} else {
				setIsOpen(true)
			}
		}
		window.addEventListener('resize', handleResize); // Listen for window resize events
		handleResize(); // initialize the state based on the current window size
		return () => {
			window.removeEventListener('resize', handleResize);
		}
	},[])
	
	return (
		<div className='nav-design'>
			<motion.div
				animate={{ width: isOpen? '200px' :'40px'}}
				className='side-bar'>
				<div className='top-section'>
					
						<div className='logo'>
						{isOpen && <IoLogoBuffer style={{ fontSize: '24px' }} />}
						</div>
					

					<div className='bars'>
						<FaBars onClick={toggle}/>
					</div>
				</div>
				<section className='routes'>
					{nav_routes.map((route) => (
						<NavLink to={route.path} key={route.name} className='link'>
							<div className='icon'> {route.icon}</div>
							<div className='link-text'> {isOpen &&  route.name}</div>
						</NavLink>
					))}
				</section>
				
			</motion.div>
		</div>
	);
}
