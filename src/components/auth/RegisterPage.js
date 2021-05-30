import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import axios from '../../axios';
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	CardImg,
	CardTitle,
	Label,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Container,
	Row,
	Col
} from 'reactstrap';

const validate = (values) => {
	let errors = {};
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

	if (!values.email) {
		errors.email = 'Email is Required';
	} else if (!regex.test(values.email)) {
		errors.email = 'Invalid email format';
	}

	if (!values.password) {
		errors.password = 'Cannot be blank';
	} else if (values.password.length < 3) {
		errors.password = 'Password must be more than 3 characters';
	}
	if (values.password !== values.confirmPassword) {
		errors.confirmPassword = 'Password Must Match ';
	}

	return errors;
};

export default function RegisterPage() {
	const [ squares1to6, setSquares1to6 ] = React.useState('');
	const [ squares7and8, setSquares7and8 ] = React.useState('');
	const [ fNameFocus, setFNameFocus ] = React.useState(false);
	const [ lNameFocus, setLNameFocus ] = React.useState(false);
	const [ emailFocus, setEmailFocus ] = React.useState(false);
	const [ passwordFocus, setPasswordFocus ] = React.useState(false);

	//  Login Input Hooks
	const [ values, setValues ] = useState({
		fname: '',
		lname: '',
		email: '',
		password: '',
		confirmPassword: '',
		userType: 'student'
	});
	const [ AgreeTerm, setAgreeTerm ] = useState(true);
	// Validations
	const [ formErrors, setFormErrors ] = useState({});

	React.useEffect(() => {
		document.body.classList.toggle('register-page');
		document.documentElement.addEventListener('mousemove', followCursor);
		// Specify how to clean up after this effect:
		return function cleanup() {
			document.body.classList.toggle('register-page');
			document.documentElement.removeEventListener('mousemove', followCursor);
		};
	}, []);
	const followCursor = (event) => {
		let posX = event.clientX - window.innerWidth / 2;
		let posY = event.clientY - window.innerWidth / 6;
		setSquares1to6('perspective(500px) rotateY(' + posX * 0.05 + 'deg) rotateX(' + posY * -0.05 + 'deg)');
		setSquares7and8('perspective(500px) rotateY(' + posX * 0.02 + 'deg) rotateX(' + posY * -0.02 + 'deg)');
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (values.confirmPassword === values.password) {
			console.log(values);
			if (values.userType === 'student') {
				axios
					.post('authenticate/Students/CreateStudent', {
						firstName: values.fname,
						lastName: values.lname,
						email: values.email,
						password: values.password
					})
					.then((res) => {
						console.log('Student');
						console.log(res);
					})
					.catch((e) => {
						console.log('ERROR');
						console.log(e);
					});
			} else {
				axios
					.post('authenticate/Instructor/CreateInstructor', {
						firstName: values.fname,
						lastName: values.lname,
						email: values.email,
						password: values.password
					})
					.then((res) => {
						console.log('Teacher:');
						console.log(res);
					})
					.catch((e) => {
						console.log('ERROR');
						console.log(e);
					});
			}
			setValues({
				fname: '',
				lname: '',
				email: '',
				password: '',
				confirmPassword: ''
			});
		} else {
			setValues((values) => ({
				...values,
				password: '',
				confirmPassword: ''
			}));
			alert('Password dont match');
		}
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log(name + '  ' + value);
		setValues({ ...values, [name]: value });
	};

	if (localStorage.getItem('user') && localStorage.getItem('userType') === 'instructor') {
		return <Redirect to="/instructorhome" />;
	} else if (localStorage.getItem('user') && localStorage.getItem('userType') === 'student') {
		return <Redirect to="/studenthome" />;
	} else {
		return (
			<React.Fragment>
				<div className="wrapper">
					<div className="page-header">
						<div className="content">
							<Container>
								<Row>
									<Col className="offset-lg-0 offset-md-3" lg="5" md="6">
										<div
											className="square square-7"
											id="square7"
											style={{ transform: squares7and8 }}
										/>
										<div
											className="square square-8"
											id="square8"
											style={{ transform: squares7and8 }}
										/>
										<Card className="card-register">
											<CardHeader>
												<CardImg
													alt="..."
													src={require('assets/img/square-purple-1.png').default}
												/>
												<CardTitle tag="h4">Register</CardTitle>
											</CardHeader>

											<Form className="form" onSubmit={handleSubmit}>
												<CardBody>
													<div className="pb-3">
														<div className="text-muted text-center  mb-3">
															<small>Sign up with</small>
														</div>
														<div className="pl-5 ml-5 mb-2">
															<Button
																className="btn-neutral btn-icon"
																color="default"
																href="#pablo"
																onClick={(e) => {
																	e.preventDefault();
																	console.log('Google');
																}}
															>
																<span className="btn-inner--icon">
																	<img
																		alt="..."
																		src={require('assets/img/google.svg').default}
																	/>
																</span>
															</Button>
															<span className="btn-inner--text text-muted  display-4 pl-2">
																Google
															</span>
														</div>
														<div className="text-center text-muted mb-4">
															<small>Or sign up with credentials</small>
														</div>
													</div>

													<InputGroup
														className={classnames({
															'input-group-focus': fNameFocus
														})}
													>
														<InputGroupAddon addonType="prepend">
															<InputGroupText>
																<i className="tim-icons icon-single-02" />
															</InputGroupText>
														</InputGroupAddon>
														<Input
															placeholder="First Name"
															type="fname"
															name="fname"
															id="fname"
															value={values.fname}
															onChange={handleChange}
															type="text"
															onFocus={(e) => setFNameFocus(true)}
															onBlur={(e) => setFNameFocus(false)}
														/>
													</InputGroup>

													<InputGroup
														className={classnames({
															'input-group-focus': lNameFocus
														})}
													>
														<InputGroupAddon addonType="prepend">
															<InputGroupText>
																<i className="tim-icons icon-single-02" />
															</InputGroupText>
														</InputGroupAddon>
														<Input
															placeholder="Last Name"
															type="lname"
															name="lname"
															id="lname"
															type="text"
															value={values.lname}
															onChange={handleChange}
															onFocus={(e) => setLNameFocus(true)}
															onBlur={(e) => setLNameFocus(false)}
														/>
													</InputGroup>
													<InputGroup
														className={classnames({
															'input-group-focus': emailFocus
														})}
													>
														<InputGroupAddon addonType="prepend">
															<InputGroupText>
																<i className="tim-icons icon-email-85" />
															</InputGroupText>
														</InputGroupAddon>
														<Input
															placeholder="Email"
															type="text"
															value={values.email}
															onChange={(e) => {
																setValues((values) => ({
																	...values,
																	email: e.target.value
																}));
															}}
															onFocus={(e) => setEmailFocus(true)}
															onBlur={(e) => setEmailFocus(false)}
														/>
													</InputGroup>
													<InputGroup
														className={classnames({
															'input-group-focus': passwordFocus
														})}
													>
														<InputGroupAddon addonType="prepend">
															<InputGroupText>
																<i className="tim-icons icon-lock-circle" />
															</InputGroupText>
														</InputGroupAddon>
														<Input
															placeholder="Password"
															type="password"
															name="password"
															id="password"
															value={values.password}
															onChange={handleChange}
															onFocus={(e) => setPasswordFocus(true)}
															onBlur={(e) => setPasswordFocus(false)}
														/>
													</InputGroup>
													<InputGroup>
														<InputGroupAddon addonType="prepend">
															<InputGroupText>
																<i className="tim-icons icon-lock-circle" />
															</InputGroupText>
														</InputGroupAddon>
														<Input
															placeholder="Confirm Password"
															name="confirmPassword"
															id="confirmPassword"
															type="password"
															value={values.confirmPassword}
															onChange={handleChange}
														/>
													</InputGroup>

													<FormGroup>
														<Row>
															<p className="ml-3" color="secondary">
																Register as
															</p>
															<FormGroup check className="form-check-radio">
																<Label check>
																	<Input
																		defaultValue="option1"
																		id="exampleRadios1"
																		name="exampleRadios"
																		type="radio"
																		value="student"
																		checked={values.userType === 'student'}
																		onClick={(e) => {
																			setValues((values) => ({
																				...values,
																				userType: 'student'
																			}));
																		}}
																	/>
																	<span className="form-check-sign" />
																	Student
																</Label>
															</FormGroup>

															<FormGroup check className="form-check-radio">
																<Label check>
																	<Input
																		defaultValue="option1"
																		id="exampleRadios1"
																		name="exampleRadios"
																		type="radio"
																		checked={values.userType === 'instructor'}
																		onClick={(e) => {
																			setValues((values) => ({
																				...values,
																				userType: 'instructor'
																			}));
																		}}
																	/>
																	<span className="form-check-sign" />
																	Teacher
																</Label>
															</FormGroup>
														</Row>
													</FormGroup>

													<FormGroup check className="text-left">
														<Label check>
															<Input
																type="checkbox"
																onClick={(e) => setAgreeTerm(!AgreeTerm)}
															/>
															<span className="form-check-sign" />I agree to the{' '}
															<a href="#pablo" onClick={(e) => e.preventDefault()}>
																Terms and conditions
															</a>
															.
														</Label>
													</FormGroup>
												</CardBody>
												<CardFooter>
													<Button
														disabled={AgreeTerm}
														className="btn-round"
														color="primary"
														size="lg"
														type="submit"
													>
														Sign Up
													</Button>
												</CardFooter>
											</Form>
										</Card>
									</Col>
								</Row>
								<div className="register-bg" />
								<div className="square square-1" id="square1" style={{ transform: squares1to6 }} />
								<div className="square square-2" id="square2" style={{ transform: squares1to6 }} />
								<div className="square square-3" id="square3" style={{ transform: squares1to6 }} />
								<div className="square square-4" id="square4" style={{ transform: squares1to6 }} />
								<div className="square square-5" id="square5" style={{ transform: squares1to6 }} />
								<div className="square square-6" id="square6" style={{ transform: squares1to6 }} />
							</Container>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
