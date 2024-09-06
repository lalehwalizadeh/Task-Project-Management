import React from 'react';
import Navbar from './Navbar';
import './Styles/Home.css';

export default function Tasks() {
	const style = {
		border: '1px solid ',
		borderRadius: '5px',
		margin: '20px',
		padding: '10px',
    };
    
	return (
		<div style={{maxHeight:'100vh'}}>
			<header>
				<h1> Manage your Tasks and Projects!</h1>
				<Navbar />
			</header>
			<div className='content'>
				<aside style={style}> your account </aside>
				<section style={style}>
					<p>home page, introduction</p>
				</section>
			</div>
			
		</div>
	);
}
