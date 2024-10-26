import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';
import Header from './Header';
import './Styles/CreateTask.css';
import './Styles/Dashboard.css';
import { GrFormNext } from 'react-icons/gr';
import { GrFormPrevious } from 'react-icons/gr';
// import { CiMenuKebab } from 'react-icons/ci';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { createPortal } from 'react-dom';
import { SlStar } from 'react-icons/sl';
import { TbEdit } from 'react-icons/tb';
import DeleteTask from './DeleteTask';

export default function CreateTask() {
	const [tasks, setTasks] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTask, setSearchTask] = useState('');
	// const [menu,setMenu]=useState(false)
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
	// const filteredTask = tasks.filter((task) => {
	// 	setSearchTask()

	// });
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

	return (
		<>
			<Header searchTask={searchTask} setSearchTask={setSearchTask} />
			<div>
				<div className='dashboard-head'>
					<div className='d-flex justify-content-between gap-5 mb-0 '>
						<h3>Tasks</h3>

						<select
							className='filter-tasks'
							aria-label='Default select example'>
							<option>All Tasks</option>
							<option>High tasks</option>
							<option>Medium tasks</option>
							<option>Low tasks</option>
							<option>Compeleted tasks</option>
							<option>Incompeleted tasks</option>
						</select>
					</div>
					<div className='gap-2'>
						<button className='btn border bg-white'>
							<GrFormPrevious />
						</button>
						<button className='btn border bg-white'>
							{' '}
							<GrFormNext />
						</button>
					</div>
				</div>
			</div>
			<div className='task-container'>
				{tasks.map((task) => (
					<div key={task.id} className='task-card shadow '>
						<img
							className='task-img'
							src={`http://localhost:5000/uploads/${task.image}`}
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
								<button className='icon-btn-container'>
									<SlStar style={{ color: '#FFDE21' }} />
								</button>
								{/* <EditTask /> */}
								<Link to={`/update/${task.id}`}>
									<TbEdit style={{ color: '#0077B6' }} />
								</Link>
								{/* Delete task */}

								<DeleteTask task={task} />
							</div>

							{/* <CiMenuKebab onClick={() => setMenu(!menu)} /> 
							{menu && ''} */}
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
											rows={2}></textarea>
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
