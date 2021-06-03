import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import axios from '../../axios';

import classnames from 'classnames';
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	CardImg,
	CardTitle,
	UncontrolledAlert,
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

export default function RegisterPage() {
	const [ squares1to6, setSquares1to6 ] = React.useState('');
	const [ squares7and8, setSquares7and8 ] = React.useState('');
	// const [ fullNameFocus, setFullNameFocus ] = React.useState(false);
	const [ emailFocus, setEmailFocus ] = React.useState(false);
	const [ passwordFocus, setPasswordFocus ] = React.useState(false);

	// Form Error
	const [ formErrors, setFormErrors ] = useState({ title: '', msg: '' });
	//  Login Input Hooks
	const [ values, setValues ] = useState({
		email: '',
		password: ''
	});
	const history = useHistory();

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

		axios
			.post('authenticate', {
				userName: values.email,
				password: values.password
			})
			.then((res) => res.data)
			.then((res) => {
				localStorage.setItem('REACT_TOKEN_AUTH', res.token);
				if (res.role === 'Student') {
					localStorage.setItem('user', res.id);
					localStorage.setItem('userType', 'student');

					history.push('/studenthome');
				} else {
					localStorage.setItem('user', res.id);

					localStorage.setItem('userType', 'instructor');

					history.push('/instructorhome');
				}
			})
			.catch((e) => {
				console.log(e.response.data);
				setFormErrors({
					title: `${Object.keys(e.response.data.errors)[0]}`,
					msg: e.response.data.errors[Object.keys(e.response.data.errors)][0]
				});
			});
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
						<div className="page-header-image" />
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
												<CardTitle tag="h4">Login</CardTitle>
											</CardHeader>
											<Form className="form" onSubmit={handleSubmit}>
												<CardBody>
													<div className="pb-3">
														{/* <div className="text-muted text-center  mb-3">
															<small>Sign in with</small>
														</div> */}

														<UncontrolledAlert
															className="alert-with-icon"
															isOpen={formErrors.title}
															toggle={() => setFormErrors({ title: '', msg: '' })}
															color="danger"
														>
															<span
																data-notify="icon"
																className="tim-icons icon-support-17"
															/>
															<span>
																<b>{formErrors.title}</b> {':  '}
																{formErrors.msg}
															</span>
														</UncontrolledAlert>
														<div className="text-center text-muted mb-4">
															<small className="display-4">Enter Credentials</small>
														</div>
													</div>

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
															type="email"
															required
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
															required
															value={values.password}
															onChange={(e) => {
																setValues((values) => ({
																	...values,
																	password: e.target.value
																}));
															}}
															onFocus={(e) => setPasswordFocus(true)}
															onBlur={(e) => setPasswordFocus(false)}
														/>
													</InputGroup>
												</CardBody>
												<CardFooter>
													<Button
														className="btn-round"
														color="primary"
														size="lg"
														type="submit"
													>
														Login
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
