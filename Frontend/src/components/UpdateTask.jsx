import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../components/Styles/UpdateTask.css';
import '../components/Styles/CreateTask.css';

import axios from 'axios';
import { toast } from 'react-toastify';
export default function UpdateTask(props) {
	// Get the task id from the URL parameters
	const { id } = useParams();
	// State to hold values for the task
	const [values, setValues] = useState({
		id: id, // set the task id 
		name: '',
		date: '',
		type: '',
		description: '',
		image: null,
	});

	// fetch the task details when the component mounts
	useEffect(() => {
		axios
			.get(`https://task-project-management-2.onrender.com/task/${id}`)
			.then((res) => {
				const dueDate = new Date(res.data.due_date);
				const formattedDate = dueDate.toISOString().split('T')[0];
// update state with the fetch task data
				setValues({
					name: res.data.title || '',
					date: formattedDate || '',
					type: res.data.type || '',
					description: res.data.description || '',
					image: res.data.image, //reset img
				});
			})
			.catch((err) => console.log(err));
	}, [id]); // Dependency array ensures this runswhen 'id changes

	const handleInputChange = (e) => {
		const { name, value, files } = e.target;
		if (name === 'file') {
			setValues({ ...values, [name]: files[0] });
		} else if (name === 'type') {
			setValues({
				...values,
				[name]: e.target.options[e.target.selectedIndex].text,
			});
		} else {
			//For other inputs, update the corresponding state value
			setValues({ ...values, [name]: value });
		}
	};

	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		console.log('submiting form data', formData);

		Object.keys(values).forEach((key) => { // Append values to FormData obj for submission
			formData.append(key, values[key]);
		});
		try { // send patch request to update tha task
			await axios.patch(`https://task-project-management-2.onrender.com/update/${id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			
			console.log('form data ');
			navigate('/dashboard');

			toast('Task updated successfully!');
			console.log(formData);
		} catch (err) {
			console.log('not navigating to dashboard', err);
		}
	};
	return (
		<>
			<div className='update-task-container'>
				<h2 className='mdl-title'>Edit Task</h2>

				<form action='/update/:id' method='PATCH' onSubmit={handleSubmit}>
					<div className='mb-3'>
						<input
							className='form-control'
							name='name'
							value={values.name}
							placeholder='Edit task Name'
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className='mb-3'>
						<input
							className='form-control'
							name='date'
							value={values.date}
							type='date'
							required
							onChange={handleInputChange}
						/>
					</div>

					<div className='mb-3'>
						<textarea
							className='form-control'
							name='description'
							value={values.description}
							placeholder='Description'
							onChange={handleInputChange}
							rows={2}></textarea>
					</div>
					<div style={{ display: 'inline-flex' }}>
						<div className='mb-3' style={{ marginRight: '2rem' }}>
							<input
								type='file'
								name='file'
								className='form-control'
								onChange={handleInputChange}
							/>
							<img
								className='task-img'
								src={`https://task-project-management-2.onrender.com/task/${values.image}`}
								alt={values.name || 'task Image'}
							/>
						</div>
						<div className='mb-3'>
							<select
								name='type'
								value={values.type}
								onChange={handleInputChange}
								className='form-select'
								aria-label='Default select example'>
								<option>{values.type} </option>
								<option value='low'>Low</option>
								<option value='medium'>Medium</option>
								<option value='high'>High</option>
							</select>
						</div>
					</div>
					<div className='mdl-btn-container'>
						<Link to={'/dashboard'} className='btn cancel-btn'>
							Cancel
						</Link>
						<button type='submit' className='btn submit-btn' to={'/dashboard'}>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
