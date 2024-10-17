import React from 'react';
import './Styles/nav.css';
import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import { IoLogoBuffer } from "react-icons/io5"; //logo
import { IoNotifications } from "react-icons/io5";
import { GrProjects } from "react-icons/gr";
import { CgProfile } from "react-icons/cg"

const nav_routes = [
	{
		path: '/',
		name: 'Home',
		icon: <FaHome />,
	},
	{
		path: '/signup',
		name: 'Search',
		icon: <FaSearch />,
	},
	{
		path: '/dashboard',
		name: 'Projects',
		icon: <GrProjects />,
	},
	{
		path: '/',
		name: 'Notifications',
		icon: <IoNotifications />,
	},
	
	{
		path: '/signup',
		name: 'Profile',
		icon: <CgProfile />,
	},
	
];

export default function Navbar() {

	
	return (
		<div className='nav-design'>
			<motion.div
				animate={{ width:  '200px' }}
				className='side-bar'>
				<div className='top-section'>
					
						<div className='logo'>
							<IoLogoBuffer style={{fontSize:'24px'}}/> <span> TPM </span>
						</div>
					

					<div className='bars'>
						
					</div>
				</div>
				<section className='routes'>
					{nav_routes.map((route) => (
						<NavLink to={route.path} key={route.name} className='link'>
							<div className='icon'> {route.icon}</div>
							<div className='link-text'> {route.name}</div>
						</NavLink>
					))}
				</section>
			</motion.div>
				<div></div>
				<div className='btn-container'>
					<Link className='regs' to='/SignUp'>
						Registration
					</Link>
				</div>
		</div>
	);
}
