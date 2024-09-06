import React from 'react';
import './Styles/nav.css';

export default function Header() {
	return (
		<header className='head'>
			<div>
				<div className='logo'></div>
				<h3>TPM</h3>
			</div>
			<div className='btn-container'>
				<button className='lgn'>Log in</button>
				<button style={{background:"#f2e8c1"}}>Sign Up</button>
			</div>
		</header>
	);
}
