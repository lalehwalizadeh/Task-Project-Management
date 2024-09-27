import React from 'react';
import './Styles/Modal.css';
import { ImCross } from 'react-icons/im';

export default function Modal({ onClose, children }) {
	return (
		<div
			className='mdl-container'
			onClick={(e) => {
				if (e.target.className === 'mdl-container') {
					onClose();
				}
			}}>
			<div className='mdl'>
				<div className='mdl-header'>
					<p className='close' onClick={() => onClose('modal was closed')}>
						<ImCross />
					</p>
				</div>
				<div className='mdl-content'> {children}</div>
			</div>
		</div>
	);
}
