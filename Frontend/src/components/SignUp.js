import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/Form.css';
import SignupValidation from './SignupValidation';
import axios from 'axios';

export default function SignUp() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	});
	const navigate = useNavigate();
	const [errors, setErrors] = useState({});

	const handleInput = (event) => {
		setFormData((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const validationError = SignupValidation(formData);
		setErrors(validationError);

		if (
			!validationError.name &&
			!validationError.email &&
			!validationError.password
		) {
			try {
				const res = await axios.post('http://localhost:5000/signup', formData);
				if (res.data.Signup) {
					navigate('/dashboard');
				} else {
					alert(' This  account is already existed ');
				}
			} catch (err) {
				console.log(err);
				alert('server error, please try again');
			}
		}
	};

	return (
		<>
			<Link to='/' className='back'> 🔙</Link>
			<div className='d-flex justify-content-center align-items-center vh-100 formContainer'>
				<div className='p-3 rounded w-100'>
					<form action='/signup' onSubmit={handleSubmit} method='POST'>
						<h2>Sign Up</h2>
						<div className='mb-3'>
							<label htmlFor='name'>
								<strong>Name</strong>
							</label>
							<input
								type='text'
								onChange={handleInput}
								placeholder='Enter your name'
								className='form-control '
								name='name'
								id='name'
							/>
							{errors.name && (
								<span className='text-danger'>{errors.name}</span>
							)}
						</div>
						<div className='mb-3'>
							<label htmlFor='email'>
								<strong>Email</strong>
							</label>
							<input
								type='email'
								onChange={handleInput}
								placeholder='Enter Email'
								className='form-control '
								name='email'
								id='email'
							/>
							{errors.email && (
								<span className='text-danger'>{errors.email}</span>
							)}
						</div>
						<div className='mb-3'>
							<label htmlFor='password'>
								<strong>Password</strong>
							</label>
							<input
								type='password'
								onChange={handleInput}
								placeholder='Enter Password'
								className='form-control '
								name='password'
								id='password'
							/>
							{errors.password && (
								<span className='text-danger'>{errors.password}</span>
							)}
						</div>
						<button type='submit' className='btn w-100 bton'>
							Sign-Up
						</button>

						<p className='mrg-tp'>
							Have you already an Account? <Link to='/login'>Login</Link>{' '}
						</p>

						<Link
							to='/google'
							className='btn btn-default border w-100 text-decoration-none'>
							{' '}
							Login with your google account
						</Link>
					</form>
				</div>
			</div>
		</>
	);
}
