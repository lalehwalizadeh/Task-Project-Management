import React, { useState } from 'react';
import axios from 'axios';
import { FaTrashCan } from 'react-icons/fa6';
import Modal from './Modal';
import { createPortal } from 'react-dom';
import './Styles/CreateTask.css';


export default function DeleteTask(props) {
	const [confirmDelete, setConfirmDelete] = useState(false);

	const confirmDeleteTask = async () => {
		try {
			await axios.delete(`http://localhost:5000/delete/task/${props.task.id}`);

			setConfirmDelete(false);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<>
			<button
				className='btn'
				onClick={() => {
					setConfirmDelete(true);
				}}>
				<FaTrashCan style={{ fontSize: '20px' }} />
			</button>
			{confirmDelete &&
				createPortal(
					<Modal
						onClose={() => {
							setConfirmDelete(false);
						}}>
						<p> Are you sure you want to delete this task?</p>
						<div className='dlt-mdl-btn'>
							<button
								className='submit-btn btn'
								onClick={() => {
									confirmDeleteTask(props.task.id);
								}}>
								Delete Task
							</button>
							<button
								className='cancel-btn btn'
								onClick={() => {
									setConfirmDelete(false);
								}}>
								Cancel
							</button>
						</div>
					</Modal>,
					document.body
				)}
		</>
	);
}
