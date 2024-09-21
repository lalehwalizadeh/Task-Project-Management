import React, { useState, useEffect } from 'react';
import './Styles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import LoginValidation from './LoginValidation';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function Login() {
	const [formData, setFormData] = useState({
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

	useEffect(() => {
		axios
			.get('http://localhost:5000/dashboard')
			.then((res) => {
				if (res.data.valid) {
					navigate('/dashboard');
				}
			})
			.catch((err) => console.log(err));
	}, [navigate]);
	useEffect(() => {
		axios.get('http://localhost:5000/auth/google/dashboard')
			.then((res => {
				if (res.data.googleLogin) {
				navigate('/dashboard')
			}
		}))
	},[navigate])

	const handleSubmit = async (event) => {
		event.preventDefault();
		const validationError = LoginValidation(formData);
		setErrors(validationError);
		if (!validationError.email && !validationError.password) {
			try {
				const res = await axios.post('http://localhost:5000/login', formData);
				if (res.data.Login) {
					navigate('/dashboard');
				} else {
					alert(
						res.data.errMessage
							? 'Incorrect Password or Email'
							: 'Login failed!'
					);
				}
			} catch (err) {
				console.log(err);
				alert('Server error, please try again.');
			}
		}
	};

	return (
		<>
			<Link to='/signup' className='back'>
				
				🔙
			</Link>

			<div className='d-flex justify-content-center align-items-center vh-100 formContainer'>
				<div className='p-3 rounded w-100'>
					<form action='/login' onSubmit={handleSubmit}>
						<h2>Log In</h2>
						<div className='mb-3'>
							<label htmlFor='email'>
								<strong>Email</strong>
							</label>
							<input
								type='email'
								placeholder='Enter Email'
								name='email'
								id='email'
								className='form-control '
								onChange={handleInput}
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
								placeholder='Enter Password'
								name='password'
								id='password'
								className='form-control '
								onChange={handleInput}
							/>
							{errors.password && (
								<span className='text-danger'>{errors.password}</span>
							)}
						</div>
						<button type='submit' className='btn w-100 bton'>
							{' '}
							Log in
						</button>
						<p className='mrg-tp'>
							Don't have any Account? <Link to='/signup'>Create Account</Link>
						</p>
					</form>
				</div>
			</div>
		</>
	);
}
