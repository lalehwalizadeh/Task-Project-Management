// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Styles/CreateTask.css';
import { IoMdAddCircleOutline } from 'react-icons/io';
import Modal from './Modal';
import { createPortal } from 'react-dom';

export default function CreateTask() {
	const [tasks, setTasks] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newTask, setNewTask] = useState({
		name: '',
		date: '',
		type: '',
		description: '',
		image: null,
	});

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		const response = await axios.get('http://localhost:5000/tasks');
		setTasks(response.data);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewTask({ ...newTask, [name]: value });
	};

	const handleImageChange = (e) => {
		setNewTask({ ...newTask, image: e.target.files[0] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		Object.keys(newTask).forEach((key) => {
			formData.append(key, newTask[key]);
		});

		await axios.post('http://localhost:5000/tasks', formData);
		fetchTasks();
		setIsModalOpen(false);
	};

	const handleDelete = async (taskId) => {
		await axios.delete(`/api/tasks/${taskId}`);
		fetchTasks();
	};

	const handleToggleComplete = async (taskId) => {
		await axios.patch(`/api/tasks/${taskId}/toggle`);
		fetchTasks();
	};

	return (
		<>
			<div className='task-container'>
			<div className='task-card'>
					<button className='ad-btn' onClick={() => setIsModalOpen(true)}>
						<IoMdAddCircleOutline style={{ fontSize: '2rem' }} />
					</button>
				</div>
				<div className='grid'>
					{tasks.map((task) => (
						<div key={task.id} className='task-card'>
							<h2>{task.name}</h2>
							<p>{task.description}</p>
							<p>{task.date}</p>
							<img src={task.imageUrl} alt={task.name} />
							<button onClick={() => handleToggleComplete(task.id)}>
								{task.completed ? 'Mark Incomplete' : 'Mark Complete'}
							</button>
							<button onClick={() => handleDelete(task.id)}>Delete</button>
						</div>
					))}
				</div>
			

				{isModalOpen &&
					createPortal(
						<Modal
							onClose={() => {
								setIsModalOpen(false);
							}}>
							<div>
								<h2 className='mdl-title'>Add New Task</h2>

								<form onSubmit={handleSubmit} >
									<div className='mb-3'>
										<input
											className='form-control'
											name='name'
											placeholder='Task Name'
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className='mb-3'>
										<input
											className='form-control'
											name='date'
											type='date'
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className='mb-3'>
										<input
											className='form-control'
											name='type'
											placeholder='Type'
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className='mb-3'>
										<textarea
											className='form-control'
											name='description'
											placeholder='Description'
											onChange={handleInputChange}
											required></textarea>
									</div>
									<input type='file' onChange={handleImageChange} required />
									<div className='mdl-btn-container'>
										<button className='btn cancel-btn'>Cancel</button>
										<button type='submit' className='btn submit-btn'>
											Submit
										</button>
									</div>
								</form>
							</div>
						</Modal>,
						document.body
					)}
			</div>
		</>
	);
}
