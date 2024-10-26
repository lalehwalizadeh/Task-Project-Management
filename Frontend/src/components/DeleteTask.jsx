import React, { useState } from 'react';
import axios from 'axios';
import { FaTrashCan } from 'react-icons/fa6';
import Modal from './Modal';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import './Styles/CreateTask.css';

export default function DeleteTask(props) {
	const [confirmDelete, setConfirmDelete] = useState(false);

	const confirmDeleteTask = async () => {
		try {
			await axios.delete(`http://localhost:5000/delete/task/${props.task.id}`);
			setConfirmDelete(false);
			toast.success('Task deleted successfully!');
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<>
			<button
				className='icon-btn-container'
				onClick={() => {
					setConfirmDelete(true);
				}}>
				<FaTrashCan style={{ color: '#ff2c2c', fontSize: '12px' }} />
			</button>
			{confirmDelete &&
				createPortal(
					<Modal
						onClose={() => {
							setConfirmDelete(false);
						}}>
						<p> Are you sure you want to delete this task?</p>
						<div className='dlt-mdl-btn mdl-btn-container'>
						<button
								className='cancel-btn btn'
								onClick={() => {
									setConfirmDelete(false);
								}}>
								Cancel
							</button>
							<button
								className='submit-btn btn'
								onClick={() => {
									confirmDeleteTask(props.task.id);
								}}>
								Delete Task
							</button>
							
						</div>
					</Modal>,
					document.body
				)}
		</>
	);
}
