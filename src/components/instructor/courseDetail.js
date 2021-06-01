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
	UncontrolledAlert,
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
import { useHistory } from 'react-router-dom';

// core components

let ps = null;

export default function CourseDetailInstructor(props) {
	let { id } = useParams();
	const history = useHistory();

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

	const [ classRoomTitle, setClassRoomTitle ] = useState('');
	const [ startDate, setStartDate ] = useState(new Date());
	const [ StartTime, setStartTime ] = useState('12:00');
	const [ showStartTime, setShowStartTime ] = useState(false);

	const [ EndTime, setEndTime ] = useState('13:00');
	const [ showEndTime, setShowEndTime ] = useState(false);

	const [ tabs, setTabs ] = React.useState(1);
	const [ DemoModal, setDemoModal ] = React.useState(false);
	const [ DeleteStudent, setDeleteStudent ] = React.useState(0);
	const [ DeleteModal, setDeleteModal ] = React.useState(false);
	const [ addVirtualClassRoom, setAddVirtualClassRoom ] = React.useState(false);

	const [ studentEmail, setStudentEmail ] = useState('');
	const [ studentEmailNotification, setStudentEmailNotification ] = useState({ title: '', msg: '' });

	// COURSE DETAILS
	useEffect(
		() => {
			async function fetchData() {
				const request = await axios.get(`Course/${id}`);

				setCourseInfo(request.data);

				return request;
			}

			fetchData();
		},
		[ id ]
	);
	// LIST OF STUDENTS
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

	// FETCH CLASSROOMS
	useEffect(
		() => {
			async function fetchData() {
				const request = await axios.get(`Course/${id}/Classrooms`);

				setClassRoomList(request.data);
				return request;
			}
			fetchData();
		},
		[ id ]
	);

	function AddStudent(e) {
		e.preventDefault();

		async function fetchStudentId() {
			console.log('Student Email is ' + studentEmail);
			const request = await axios.get(`authenticate/Students/StudentEmail/${studentEmail}`);
			const res = await request.data;

			const req = await axios
				.post(`Course/student/${id}`, {
					studentId: res.id,
					courseId: id
				})
				.then((res) => {
					setStudentEmail('');
					setStudentEmailNotification({ title: 'Success', msg: 'Student Added to Course!' });

					console.log(res);
				})
				.catch((e) => {
					console.log(e);
					setStudentEmailNotification({ title: 'Error', msg: 'Student Added to Course!' });
				});
		}

		fetchStudentId();
	}

	function submitVirtualClassRoom() {
		if (new Date(`01/01/2000 ${StartTime}`) >= new Date(`01/01/2000 ${EndTime}`)) {
			console.log('ERROR');
			console.log(StartTime + '  ' + EndTime);
		} else {
			console.log('SENDING..');

			axios
				.post(`Course/${id}/Classrooms`, {
					classRoomName: classRoomTitle,
					date: startDate.toJSON(),
					startTime: StartTime,
					endTime: EndTime,
					courseId: id
				})
				.then((res) => {
					setClassRoomTitle('');
					setStartTime('12:00');
					setEndTime('13:00');
					setStartDate(new Date());
					setAddVirtualClassRoom(false);
					console.log('RESPONSE IS');
					console.log(res.data);
				})
				.catch((e) => {
					console.log('E');
					console.log(e);
				});
		}
	}
	// UI
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
												<div className="table-wrapper-scroll-y my-custom-scrollbar">
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
															{classRoomList.map((clas) => {
																return (
																	<tr key={clas.classRoomId}>
																		<td>
																			<p>{clas.classRoomName}</p>
																		</td>
																		<td>
																			{' '}
																			{clas.date &&
																				new Date(clas.date).toDateString()}
																		</td>
																		<td>
																			<p>
																				{clas.startTime.substr(0, 5)} -{' '}
																				{clas.endTime.substr(0, 5)}{' '}
																			</p>
																		</td>

																		<td>
																			<Button
																				className=" btn-simple btn-round"
																				width="20px"
																				onClick={(e) => {
																					history.push(
																						`/join_classroom/${id}`
																					);
																				}}
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
																				onClick={(e) => {
																					axios.delete(
																						`Course/${id}/Classrooms/${clas.classRoomId}`
																					);
																				}}
																				type="button"
																			>
																				Cancel
																			</Button>
																		</td>
																	</tr>
																);
															})}
														</tbody>
													</Table>
												</div>
											</TabPane>
											<TabPane tabId="tab2">
												<Form onSubmit={AddStudent}>
													<Row className="pb-3">
														<Label sm="3">Email</Label>
														<Col sm="9">
															<UncontrolledAlert
																className="alert-with-icon"
																isOpen={studentEmailNotification.title}
																toggle={() =>
																	setStudentEmailNotification({ title: '', msg: '' })}
																color="danger"
															>
																<span
																	data-notify="icon"
																	className="tim-icons icon-support-17"
																/>
																<span>
																	<b>{studentEmailNotification.title}</b> {':  '}
																	{studentEmailNotification.msg}
																</span>
															</UncontrolledAlert>
															<FormGroup>
																<Input
																	placeholder="e.g. sample@gmail.com"
																	type="email"
																	required
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
												<div className="table-wrapper-scroll-y my-custom-scrollbar">
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
							<p>Are you sure You want to Delete Student</p>
						</div>
						<div className="modal-footer">
							<Button
								color="danger"
								type="button"
								onClick={() => {
									axios.delete(`Course/${id}/Student/${DeleteStudent}`).then((res) => {
										console.log('DELETED');
										console.group(res);
									});
									setDeleteModal(false);
								}}
							>
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
								<Row className="pb-2">
									<Col>
										<p>Title Name:</p>
									</Col>
									<Col>
										<Input
											placeholder="ClassRoom Name"
											name="lname"
											required
											value={classRoomTitle}
											onChange={(e) => {
												setClassRoomTitle(e.target.value);
											}}
											className="text-light border"
											id="lname"
											type="text"
										/>
									</Col>
								</Row>
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
												hour24Mode
												onChange={(newTime) => setStartTime(newTime.formatted24)}
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
												hour24Mode
												onChange={(newTime) => setEndTime(newTime.formatted24)}
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
											onClick={submitVirtualClassRoom}
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
								onClick={() => {
									setClassRoomTitle('');
									setStartTime('12:00');
									setEndTime('13:00');
									setStartDate(new Date());
									setAddVirtualClassRoom(false);
								}}
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
