import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './Styles/CreateTask.css';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdModeEditOutline } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
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
		const { name, value, files } = e.target;
		if (name === 'file') {
			setNewTask({ ...newTask, [name]: files[0] });
		} else if (name === 'options') {
			setNewTask({ ...newTask, [name]: value });
		} else {
			setNewTask({ ...newTask, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();

		Object.keys(newTask).forEach((key) => {
			formData.append(key, newTask[key]);
		});
		try {
			await axios.post('http://localhost:5000/submit/task', formData, {
				headers: { 'Content-type': 'multipart/form-data' },
			});

			fetchTasks();
			setIsModalOpen(false);
		} catch (err) {
			console.error('task rout error:', err);
		}
	};
	const handleDelete = async (taskID) => {
		await axios.delete(`http://localhost:5000/delete/task/${taskID}`);
		fetchTasks();
	};

	return (
		<>
			<div className='task-container'>
				{tasks.map((task) => (
					<div key={task.id} className='task-card'>
						<h3 className='task-title'>{task.title}</h3>
						<img
							className='task-img'
							src={`http://localhost:5000/uploads/${task.image}`}
							
							alt={task.name || 'task Image'}
						/>
						<p className='task-dec'> Caption: {task.description}</p>
						<p className='task-date'>Deadline:{task.due_date}</p>
						<p> Type: { task.type}</p>

						<div className='task-btn-container'>
							<div>
								<button className='tgl-btn'>
									{task.completed ? ' Incomplete' : ' Complete'}
								</button>
							</div>
							<div>
								<button className='btn'>
									<MdModeEditOutline style={{ fontSize: '20px' }} />{' '}
								</button>
								<button
									className='btn'
									onClick={() => {
										handleDelete(task.id);
									}}>
									<FaTrashCan style={{ fontSize: '20px' }} />
								</button>
							</div>
						</div>
					</div>
				))}
				<div className='create-new-task'>
					<button className='ad-btn' onClick={() => setIsModalOpen(true)}>
						<IoMdAddCircleOutline style={{ fontSize: '2rem' }} />
					</button>
				</div>

				{isModalOpen &&
					createPortal(
						<Modal
							onClose={() => {
								setIsModalOpen(false);
							}}>
							<div>
								<h2 className='mdl-title'>Add New Task</h2>

								<form
									action='/submit/task'
									onSubmit={handleSubmit}
									method='POST'>
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
										<textarea
											className='form-control'
											name='description'
											placeholder='Description'
											onChange={handleInputChange}
											required></textarea>
									</div>
									<div style={{ display: 'inline-flex' }}>
										<div className='mb-3' style={{ marginRight: '2rem' }}>
											<input
												type='file'
												name='file'
												onChange={handleInputChange}
												className='form-control'
											/>
										</div>
										<div className='mb-3'>
											<select
												name='options'
												className='form-select'
												aria-label='Default select example'
											onChange={handleInputChange}>
												<option> Select an option</option>
												<option  name='team'>Team Work</option>
												<option  name='individual'>Individual</option>
											</select>
										</div>
									</div>
									<div className='mdl-btn-container'>
										<button
											className='btn cancel-btn'
											onClick={() => {
												setIsModalOpen(false);
											}}>
											Cancel
										</button>
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
