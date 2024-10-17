import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';

export default function UpdateTask(props) {
	const { id } = useParams();
	const [values, setValues] = useState({
		id: id,
		name: '',
		date: '',
		type: '',
		description: '',
		image: null,
	});

	useEffect(() => {
		axios
			.get(`http://localhost:5000/task/${id}`)
			.then((res) => {
				console.log(res.data);
				setValues({
					name: res.data.title || '',
					date: res.data.due_date.split('en-US')[0] || '',
					type: res.data.type || '',
					description: res.data.description || '',
					image: null, //reset img
				});
			})
			.catch((err) => console.log(err));
	}, [id]);

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
			setValues({ ...values, [name]: value });
		}
	};

	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		console.log(formData);
		Object.keys(values).forEach((key) => {
			formData.append(key, values[key]);
		});
		try {
			await axios.patch(`http://localhost:5000/update/${id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			navigate('/dashboard');
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<>
			<div>
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
							value={new Date(values.due_date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
							})}
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
						</div>
						<div className='mb-3'>
							<select
								name='type'
								value={values.type}
								onChange={handleInputChange}
								className='form-select'
								aria-label='Default select example'>
								<option> Select an option</option>
								<option value='team'>Team Work</option>
								<option value='individual'>Individual</option>
							</select>
						</div>
					</div>
					<div className='mdl-btn-container'>
						<Link to={'/dashboard'} className='btn cancel-btn'>
							Cancel
						</Link>
						<button type='submit' className='btn submit-btn'>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
