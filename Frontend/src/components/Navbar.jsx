import React, { useEffect, useState } from 'react';
import './Styles/nav.css';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FaBars, FaHome } from 'react-icons/fa';
import {RiDashboard3Line} from 'react-icons/ri'
import { IoNotifications,IoSettingsSharp, IoLogoBuffer} from "react-icons/io5";
import {MdTaskAlt} from 'react-icons/md'
import { CgProfile } from "react-icons/cg"

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
		path: '/',
		name: 'Notifications',
		icon: <IoNotifications />,
	},
	
	{
		path: '/signup',
		name: 'Profile',
		icon: <CgProfile />,
	},
	
	{
		path: '/',
		name: 'Setting',
		icon: <IoSettingsSharp />,
	},
	
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(window.innerWidth>768);
	const toggle = () => {
		setIsOpen(!isOpen)
	}
	
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				setIsOpen(false)
			} else {
				setIsOpen(true)
			}
		}
		window.addEventListener('resize', handleResize);
		handleResize();
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
				<div></div>
				{/* <div className='btn-container'>
					<Link className='regs' to='/SignUp'>
						Registration
					</Link>
				</div> */}
			</motion.div>
		</div>
	);
}
