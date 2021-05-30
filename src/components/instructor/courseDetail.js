import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeKeeper from 'react-timekeeper';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';

import axios from '../../axios';

// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	Label,
	Form,
	FormGroup,
	Input,
	NavItem,
	NavLink,
	Nav,
	Table,
	TabContent,
	TabPane,
	Container,
	Row,
	Modal,
	ListGroupItem,
	ListGroup,
	Col
} from 'reactstrap';

import '../../assets/css/courseDetail.css';
import { useParams } from 'react-router';

// core components

let ps = null;

export default function CourseDetailInstructor(props) {
	let { id } = useParams();
	const [ courseInfo, setCourseInfo ] = useState({});
	const [ studentList, setStudentList ] = useState([]);
	const [ resourceList, setResourceList ] = useState([
		{
			id: 1,
			filename: 'C# Essentials',
			downloadLink: ''
		}
	]);
	const [ classRoomList, setClassRoomList ] = useState([]);

	useEffect(
		() => {
			async function fetchData() {
				const request = await axios.get(`Course/${id}`);
				console.log('token ' + localStorage.getItem('REACT_TOKEN_AUTH'));
				setCourseInfo(request.data);

				return request;
			}

			fetchData();
		},
		[ id ]
	);

	useEffect(
		() => {
			async function fetchData() {
				const request = await axios.get(`Course/${id}/Students`);
				setStudentList(request.data);
				return request;
			}
			fetchData();
		},
		[ id ]
	);

	// useEffect(
	// 	() => {
	// 		async function fetchData() {
	// 			const token = localStorage.getItem('REACT_TOKEN_AUTH') || '';
	// 			const request = await Axios.get(`http://localhost:51044/api/Courses​/${id}​/Resources`, {
	// 				headers: {
	// 					responseType: 'blob',
	// 					Authorization: `Bearer ${token}`
	// 				}
	// 			});

	// 			console.log('ReQuest Resources');
	// 			console.log(request);
	// 			setResourceList(request.data);
	// 			return request;
	// 		}
	// 		fetchData();
	// 	},
	// 	[ id ]
	// );

	useEffect(
		() => {
			async function fetchData() {
				const request = await axios.get(`Courses/${id}/Classrooms`);
				console.log('ReQuest');
				console.log(request.data);
				setClassRoomList(request.data);
				return request;
			}
			fetchData();
		},
		[ id ]
	);

	const [ startDate, setStartDate ] = useState(null);
	const [ StartTime, setStartTime ] = useState('12:00am');
	const [ showStartTime, setShowStartTime ] = useState(false);

	const [ EndTime, setEndTime ] = useState('1:00pm');
	const [ showEndTime, setShowEndTime ] = useState(false);

	const [ tabs, setTabs ] = React.useState(1);
	const [ DemoModal, setDemoModal ] = React.useState(false);
	const [ DeleteStudent, setDeleteStudent ] = React.useState(0);
	const [ DeleteModal, setDeleteModal ] = React.useState(false);
	const [ addVirtualClassRoom, setAddVirtualClassRoom ] = React.useState(false);

	const [ studentEmail, setStudentEmail ] = useState('');

	function AddStudent(e) {
		e.preventDefault();

		// axios.post(`Course/${id}`, {
		// 	studentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
		// 	courseId: id
		// });
	}

	React.useEffect(() => {
		if (navigator.platform.indexOf('Win') > -1) {
			document.documentElement.className += ' perfect-scrollbar-on';
			document.documentElement.classList.remove('perfect-scrollbar-off');
			let tables = document.querySelectorAll('.table-responsive');
			for (let i = 0; i < tables.length; i++) {
				ps = new PerfectScrollbar(tables[i]);
			}
		}
		document.body.classList.toggle('profile-page');
		// Specify how to clean up after this effect:
		return function cleanup() {
			if (navigator.platform.indexOf('Win') > -1) {
				ps.destroy();
				document.documentElement.className += ' perfect-scrollbar-off';
				document.documentElement.classList.remove('perfect-scrollbar-on');
			}
			document.body.classList.toggle('profile-page');
		};
	}, []);

	return (
		<React.Fragment>
			<div className="wrapper">
				<div className="page-header">
					<img alt="..." className="dots" src={require('assets/img/dots.png').default} />
					<img alt="..." className="path" src={require('assets/img/path4.png').default} />
					<Container className="align-items-center">
						<Row>
							<Col lg="6" md="6">
								<h1 className="profile-title text-left">{courseInfo.title}</h1>

								<p className="profile-description">{courseInfo.description}</p>
							</Col>
							<Col className="ml-auto mr-auto" lg="4" md="6">
								<Card className="card-coin card-plain" style={{ width: '38rem' }}>
									<CardBody>
										<Nav className="nav-tabs-primary justify-content-center" tabs>
											<NavItem>
												<NavLink
													className={classnames({
														active: tabs === 1
													})}
													onClick={(e) => {
														e.preventDefault();
														setTabs(1);
													}}
													href="#pablo"
												>
													Virtual Classroom
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													className={classnames({
														active: tabs === 2
													})}
													onClick={(e) => {
														e.preventDefault();
														setTabs(2);
													}}
													href="#pablo"
												>
													Add Student
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													className={classnames({
														active: tabs === 3
													})}
													onClick={(e) => {
														e.preventDefault();
														setTabs(3);
													}}
													href="#pablo"
												>
													Student List
												</NavLink>
											</NavItem>
										</Nav>
										<TabContent className="tab-subcategories" activeTab={'tab' + tabs}>
											<TabPane tabId="tab1">
												<div class="table-wrapper-scroll-y my-custom-scrollbar">
													<Table className="tablesorter" responsive>
														<thead className="text-primary">
															<tr>
																<th className="header">New Virtual Class</th>

																<th>
																	<Button
																		className="btn-simple btn-icon btn-round "
																		color="primary"
																		type="submit"
																		onClick={(e) => {
																			setAddVirtualClassRoom(true);
																		}}
																	>
																		<FaPlus />
																	</Button>
																</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>
																	{' '}
																	{new Intl.DateTimeFormat('en-GB', {
																		year: 'numeric',
																		month: 'long',
																		day: '2-digit'
																	}).format(new Date())}
																</td>
																<td>
																	<Button
																		className=" btn-simple btn-round"
																		width="20px"
																		color="success"
																		type="button"
																	>
																		Join
																	</Button>
																</td>
																<td>
																	<Button
																		className=" btn-simple btn-round"
																		width="20px"
																		color="danger"
																		type="button"
																	>
																		Cancel
																	</Button>
																</td>
															</tr>
															<tr>
																<td>
																	{' '}
																	{new Intl.DateTimeFormat('en-GB', {
																		year: 'numeric',
																		month: 'long',
																		day: '2-digit'
																	}).format(new Date())}
																</td>
																<td>
																	<Button
																		className=" btn-simple btn-round"
																		width="20px"
																		color="success"
																		type="button"
																	>
																		Join
																	</Button>
																</td>
																<td>
																	<Button
																		className=" btn-simple btn-round"
																		width="20px"
																		color="danger"
																		type="button"
																	>
																		Cancel
																	</Button>
																</td>
															</tr>
															<tr>
																<td>
																	{' '}
																	{new Intl.DateTimeFormat('en-GB', {
																		year: 'numeric',
																		month: 'long',
																		day: '2-digit'
																	}).format(new Date())}
																</td>
																<td>
																	<Button
																		className=" btn-simple btn-round"
																		width="20px"
																		color="success"
																		type="button"
																	>
																		Join
																	</Button>
																</td>
																<td>
																	<Button
																		className=" btn-simple btn-round"
																		width="20px"
																		color="danger"
																		type="button"
																	>
																		Cancel
																	</Button>
																</td>
															</tr>
														</tbody>
													</Table>
												</div>
											</TabPane>
											<TabPane tabId="tab2">
												<Form onSubmit={AddStudent}>
													<Row className="pb-3">
														<Label sm="3">Email</Label>
														<Col sm="9">
															<FormGroup>
																<Input
																	placeholder="e.g. sample@gmail.com"
																	type="email"
																	value={studentEmail}
																	onChange={(e) => setStudentEmail(e.target.value)}
																/>
															</FormGroup>
														</Col>
													</Row>

													<Button
														className="btn-simple btn-icon btn-round float-right"
														color="primary"
														type="submit"
													>
														<FaPlus />
													</Button>
												</Form>
											</TabPane>
											<TabPane tabId="tab3">
												<div class="table-wrapper-scroll-y my-custom-scrollbar">
													<Table className="tablesorter" responsive>
														<thead className="text-primary">
															<tr>
																<th className="header">Student List</th>
															</tr>
														</thead>
														<tbody>
															{studentList.map((st) => {
																return (
																	<tr key={st.id}>
																		<td>{st.name} </td>
																		<td>
																			<ImCross
																				color="red"
																				onClick={(e) => {
																					setDeleteModal(true);
																					setDeleteStudent(st.id);
																					console.log(DeleteStudent);
																				}}
																			/>
																		</td>
																	</tr>
																);
															})}
														</tbody>
													</Table>
												</div>
											</TabPane>
										</TabContent>
									</CardBody>
								</Card>
							</Col>
						</Row>
						<Row>
							<Container className="text-info mb-5">
								<Row>
									<Col>
										{' '}
										<h4 className="title text-left">Resources</h4>
									</Col>
									<Col className="text-right">
										<FaPlus
											size={28}
											onClick={() => {
												console.log('CLICKED PLUS');
												setDemoModal(true);
											}}
										/>
									</Col>
								</Row>

								<ListGroup>
									{resourceList.map((rs) => {
										return (
											<ListGroupItem color="info" key={rs.id} className="justify-content-between">
												{rs.filename}
												{'   '}
												<span className="mr-auto">
													<FaTrashAlt color="red" />{' '}
												</span>
											</ListGroupItem>
										);
									})}
								</ListGroup>
							</Container>
						</Row>
					</Container>

					<Modal isOpen={DemoModal} toggle={() => setDemoModal(false)}>
						<div className="modal-header justify-content-center">
							<button className="close" onClick={() => setDemoModal(false)}>
								<i className="tim-icons icon-simple-remove" />
							</button>
							<h4 className="title title-up">Add Resource</h4>
						</div>
						<div className="modal-body">
							<p>
								<Input type="file" name="file" id="exampleFile" />
							</p>
						</div>
						<div className="modal-footer">
							<Button color="default" type="button">
								ADD
							</Button>
							<Button color="danger" type="button" onClick={() => setDemoModal(false)}>
								Cancel
							</Button>
						</div>
					</Modal>

					<Modal isOpen={DeleteModal} toggle={() => setDeleteModal(false)}>
						<div className="modal-header justify-content-center">
							<button className="close" onClick={() => setDeleteModal(false)}>
								<i className="tim-icons icon-simple-remove" />
							</button>
							<h4 className="title title-up">Delete Student</h4>
						</div>
						<div className="modal-body">
							<p>Are you sure You want to delete {DeleteStudent}</p>
						</div>
						<div className="modal-footer">
							<Button color="danger" type="button" onClick={() => setDeleteModal(false)}>
								YES
							</Button>
							<Button color="default" type="button" onClick={() => setDeleteModal(false)}>
								NO
							</Button>
						</div>
					</Modal>

					<Modal isOpen={addVirtualClassRoom} toggle={() => setAddVirtualClassRoom(false)}>
						<div className="modal-header justify-content-center">
							<button className="close" onClick={() => setAddVirtualClassRoom(false)}>
								<i className="tim-icons icon-simple-remove" />
							</button>
							<h4 className="title title-up">Add Virtual ClassRoom</h4>
						</div>
						<div className="modal-body">
							<Container>
								<Row>
									<Col>
										<p>Select Date</p>
									</Col>
									<Col>
										<DatePicker
											selected={startDate}
											onChange={(date) => setStartDate(date)}
											minDate={new Date()}
											className="bg-secondary text-black"
											placeholderText="Date"
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<p>Select Starting Time: </p>
									</Col>
									<Col>
										{showStartTime && (
											<TimeKeeper
												time={StartTime}
												onChange={(newTime) => setStartTime(newTime.formatted12)}
												onDoneClick={() => setShowStartTime(false)}
												switchToMinuteOnHourSelect
											/>
										)}
										{!showStartTime && (
											<button onClick={() => setShowStartTime(true)}>{StartTime}</button>
										)}
									</Col>
								</Row>
								<Row>
									<Col>
										<p>Select Ending Time: </p>
									</Col>

									<Col>
										{showEndTime && (
											<TimeKeeper
												time={EndTime}
												onChange={(newTime) => setEndTime(newTime.formatted12)}
												onDoneClick={() => setShowEndTime(false)}
												switchToMinuteOnHourSelect
											/>
										)}
										{!showEndTime && (
											<button onClick={() => setShowEndTime(true)}>{EndTime}</button>
										)}
									</Col>
								</Row>
								<Row>
									<Col>
										<Button
											className="btn-simple btn-icon btn-round float-right"
											color="success"
											type="submit"
										>
											<FaPlus />
										</Button>
									</Col>
								</Row>
							</Container>
						</div>
						<div className="modal-footer float-right">
							<Button
								color="danger"
								className="float-right"
								type="button"
								onClick={() => setAddVirtualClassRoom(false)}
							>
								Cancel
							</Button>
						</div>
					</Modal>
				</div>
			</div>
		</React.Fragment>
	);
}
