import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import { IoMdArrowRoundBack } from "react-icons/io";
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
	const [visible, setVisible] = useState(false);

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
					alert('This account already exists');
				}
			} catch (err) {
				console.log(err);
				alert('Server error, please try again');
			}
		}
	};

	const handleGoogleLogin = () => {
		window.open('http://localhost:5000/auth/google', '_self');
	};

	// useEffect(() => {
	// 	const checkGoogleLogin = async () => {
	// 		try {
	// 			const res = await axios.get(
	// 				'http://localhost:5000/auth/google/dashboard'
	// 			);
	// 			if (res.data.googleLogin) {
	// 				navigate('/dashboard');
	// 			}
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	};
	// 	checkGoogleLogin();
	// }, [navigate]);

	useEffect(() => {
		axios
			.get('http://localhost:5000/auth/google/dashboard', {
				withCredentials: true,
			})
			.then((res) => {
				if (res.data.googleLogin) {
					navigate('/dashboard');
				}
			})
			.catch((err) => {
				console.log(err, 'what is the error');
				console.log('Error message:', err.response);
				console.log('error message:', err.message);
			});
	}, [navigate]);

	return (
		<>
			<Link to='/' className='back'>
				<IoMdArrowRoundBack style={{color: '#141c30',margin:'1rem',fontSize :'20px'}}/>
			</Link>
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
							<div className='password-input-container'>
								<input
									type={visible ? 'text' : 'password'}
									onChange={handleInput}
									placeholder='Enter Password'
									
									name='password'
									id='password'
								/>

								<div onClick={() => setVisible(!visible)}>
									{visible ? <IoEyeSharp /> : <IoEyeOffSharp />}
								</div>
							</div>

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

						</form>
						<button
							type='button'
							className='btn btn-default border w-100 text-decoration-none'
							onClick={handleGoogleLogin}>
							Login with your Google account
						</button>
				</div>
			</div>
		</>
	);
}
