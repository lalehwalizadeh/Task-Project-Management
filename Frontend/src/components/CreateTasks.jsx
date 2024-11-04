import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/CreateTask.css';
import './Styles/Dashboard.css';
import axios from 'axios';
import Modal from './Modal';
import Header from './Header';
import DeleteTask from './DeleteTask';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { createPortal } from 'react-dom';
import { TbEdit } from 'react-icons/tb';

export default function CreateTask() {
	// State variables for managing tasks and modal visibility
	const [tasks, setTasks] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTask, setSearchTask] = useState('');
	const [isCompleted, setIsCompleted] = useState({});


	// state for new task input
	const [newTask, setNewTask] = useState({
		name: '',
		date: '',
		type: '',
		description: '',
		image: null,
	});

	// fetch tasks on component mount
	useEffect(() => {
		fetchTasks();
	}, []);

	// Configure axios to send cookies with requests
	axios.defaults.withCredentials = true;


	// function to fetch tasks from the server
	const fetchTasks = async () => {
		try {

			const response = await axios.get(
				'https://task-project-management-2.onrender.com//tasks',
				{
					withCredentials: true, // Important for sending cookies
				}
			);
			setTasks(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	// handle chandes in input fields
	const handleInputChange = (e) => {
		const { name, value, files } = e.target;
		if (name === 'file') {
			setNewTask({ ...newTask, [name]: files[0] });
		} else if (name === 'type') {
			setNewTask({
				...newTask,
				[name]: e.target.options[e.target.selectedIndex].text,
			});
		} else {
			setNewTask({ ...newTask, [name]: value });
		}
	};

	// handle form submission to create a new task
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();

		Object.keys(newTask).forEach((key) => {
			formData.append(key, newTask[key]);
		});
		try {

			await axios.post(
				'https://task-project-management-2.onrender.com//submit/task',
				formData,
				{
					headers: { 'Content-type': 'multipart/form-data' },
				}
			);

			fetchTasks();
			setIsModalOpen(false);
		} catch (err) {
			console.error('task rout error:', err);
		}
	
	};

	// filter task based on search input
	const filteredTask = tasks.filter((task) => {
		const matchesSearch = task.title
			.toLowerCase()
			.includes(searchTask.toLowerCase());
		return matchesSearch;
	});

	// function to determine bg color based on task type
	const typeColor = (type) => {
		switch (type) {
			case 'Low':
				return { backgroundColor: ' #D6F6D5', color: '#008631' };
			case 'Medium':
				return { backgroundColor: '#FFFBC8', color: '#FDD017' };
			case 'High':
				return { backgroundColor: '#FFB3B2', color: '#d1001f' };
			default:
				return 'black';
		}
	};

	// Toggle completion status of task
	const toggleCompletion = (taskId) => {
		setIsCompleted((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
	};
	// handle task deletion
	const handleDeleteTask = (taskId) => {
		setTasks((prevTask) => prevTask.filter((task) => task.id !== taskId));
	};
	return (
		<>
			<Header searchTask={searchTask} setSearchTask={setSearchTask} />
			<div>
				<div className='dashboard-head'>
					<div className='d-flex justify-content-between gap-5 mb-0 '>
						<button
							className='d-flex gap-2 ad-btn btn border'
							onClick={() => setIsModalOpen(true)}>
							<IoMdAddCircleOutline style={{ fontSize: '1.5rem' }} />
							New
						</button>
					</div>
				</div>
			</div>
			<div className='task-container'>
				{filteredTask.map((task) => (
					<div key={task.id} className='task-card shadow '>
						<img
							className='task-img'
							src={`https://task-project-management-2.onrender.com//uploads/${task.image}`}
							alt={task.name || 'task Image'}
						/>
						<h6 className='task-title'>{task.title}</h6>
						<p> {task.description}</p>
						<p>
							{new Date(task.due_date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
							})}
						</p>
						<div className='task-btn-container'>
							<p className='task-type' style={typeColor(task.type)}>
								{task.type}{' '}
							</p>

							<div className='edit-delete-icons'>
								{/* compelet ||incompelet */}

								<button
									className={` status-box ${
										isCompleted[task.id] ? 'completed' : ''
									}`}
									onClick={() => toggleCompletion(task.id)}>
									{isCompleted[task.id] ? (
										<>
											<IoCheckmarkDoneSharp style={{ color: 'green' }} /> Done
										</>
									) : (
										'Todo'
									)}
								</button>

								{/* <EditTask /> */}
								<Link to={`/update/${task.id}`}>
									<TbEdit style={{ color: '#0077B6' }} />
								</Link>
								{/* Delete task */}

								<DeleteTask task={task} onDelete={handleDeleteTask} />
							</div>
						</div>
					</div>
				))}
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
											rows={2}></textarea>
									</div>
									<div className='d-inline-flex'>
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
												name='type'
												className='form-select'
												aria-label='Default select example'
												onChange={handleInputChange}>
												<option> Select level</option>
												<option value='low'>Low</option>
												<option value='medium'>Medium</option>
												<option value='high'>High</option>
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
