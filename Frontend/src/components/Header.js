import React from 'react';
import './Styles/nav.css';
import { Link } from 'react-router-dom';


export default function Header() {
	return (
		<header className='head'>

			<div>
				<div className='logo'></div>
				<h3>TPM</h3>
			</div>
			<div className='btn-container'>
				<nav>
					<Link className='regs' to="/SignUp"> Registration</Link>
				</nav>
				{/* <a className='lgn' href='/Login'>Log in</a>
				<a className='snp' href='/SignUp'>Sign Up</a> */}
			</div>
		</header>
	);
}
