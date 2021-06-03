import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeKeeper from 'react-timekeeper';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import swal from 'sweetalert';

import axios from '../../axios';

// reactstrap components
import {
	Button,
	Card,
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

// core components

let ps = null;

export default function CourseDetailInstructor(props) {
	let { id } = useParams();
	const history = useHistory();
	const [ ForceRender, setForceRender ] = useState(0);

	const [ courseInfo, setCourseInfo ] = useState({});
	const [ studentList, setStudentList ] = useState([]);
	const [ resourceList, setResourceList ] = useState([]);
	const [ classRoomList, setClassRoomList ] = useState([]);
	const [ attendanceList, setAttendanceList ] = useState([]);

	const [ classRoomTitle, setClassRoomTitle ] = useState('');
	const [ startDate, setStartDate ] = useState(new Date());
	const [ StartTime, setStartTime ] = useState('12:00');
	const [ showStartTime, setShowStartTime ] = useState(false);

	const [ EndTime, setEndTime ] = useState('13:00');
	const [ showEndTime, setShowEndTime ] = useState(false);

	const [ tabs, setTabs ] = React.useState(1);
	const [ ResourceUploadModal, setResourceUploadModal ] = React.useState(false);
	const [ DeleteStudent, setDeleteStudent ] = React.useState(0);
	const [ DeleteStudentModal, setDeleteStudentModal ] = React.useState(false);
	const [ attendanceModal, setAttendanceModal ] = useState(false);
	const [ addVirtualClassRoom, setAddVirtualClassRoom ] = React.useState(false);

	const [ studentEmail, setStudentEmail ] = useState('');
	const [ studentEmailNotification, setStudentEmailNotification ] = useState({ title: '', msg: '' });

	const [ resourceToUpload, setResourceToUpload ] = useState(null);
	//create your forceUpdate hook

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
		[ id, ForceRender ]
	);
	// FEtch Resources
	useEffect(
		() => {
			axios.get(`Courses/${id}/Resources`).then((res) => {
				console.log('REsource');
				console.log(res);
				setResourceList(res.data);
			});
		},
		[ id, ForceRender ]
	);

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
		[ id, ForceRender ]
	);

	function AddStudent(e) {
		e.preventDefault();

		async function fetchStudentId() {
			console.log('Student Email is ' + studentEmail);
			try {
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
						setForceRender(ForceRender + 1);
						console.log(res);
					})
					.catch((e) => {
						setStudentEmailNotification({
							title: `${Object.keys(e.response.data.errors)[0]}`,
							msg: e.response.data.errors[Object.keys(e.response.data.errors)][0]
						});
					});
			} catch (e) {
				setStudentEmailNotification({
					title: 'Error',
					msg: 'Student Not Found'
				});
			}
		}

		fetchStudentId();
	}

	function submitVirtualClassRoom() {
		if (new Date(`01/01/2000 ${StartTime}`) >= new Date(`01/01/2000 ${EndTime}`)) {
			swal({
				title: 'Invalid Time',
				text: 'Check startTime',
				icon: 'warning',
				dangerMode: true
			});

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
					setForceRender(ForceRender + 1);

					console.log('RESPONSE IS');
					console.log(res.data);
				})
				.catch((e) => {
					swal({
						title: 'Error',
						text: e.response.data.title,
						icon: 'warning',
						dangerMode: true
					});
				});
		}
	}
	// Resource Upload
	function uploadResource() {
		const data = new FormData();
		data.append('file', resourceToUpload);
		axios
			.post(`/Courses/${id}/Resources`, data, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((res) => {
				setResourceUploadModal(false);
				setForceRender(ForceRender + 1);

				console.log(res);
			});
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
			{console.log(localStorage.getItem('REACT_TOKEN_AUTH'))}
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
															<tr>
																<td>Name:</td>
																<td>Date</td>
																<td>Time</td>
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
																			{new Date() >=
																				new Date(clas.date).setHours(
																					clas.endTime.substr(0, 2)
																				) && (
																				<Button
																					className=" btn-simple btn-round"
																					width="20px"
																					color="success"
																					onClick={(e) => {
																						axios
																							.get(
																								`Course/${id}/Classrooms/${clas.classRoomId}/attendance`
																							)
																							.then((res) => {
																								setAttendanceList(
																									res.data
																								);
																								setAttendanceModal(
																									true
																								);
																							});
																					}}
																					type="button"
																				>
																					Attendace
																				</Button>
																			)}

																			{new Date() <=
																				new Date(clas.date).setHours(
																					clas.endTime.substr(0, 2)
																				) && (
																				<Button
																					className=" btn-simple btn-round"
																					width="20px"
																					onClick={(e) => {
																						history.push(
																							`/join_classroom/${clas.classRoomId}`
																						);
																					}}
																					color="success"
																					type="button"
																				>
																					Join
																				</Button>
																			)}
																		</td>
																		<td>
																			<Button
																				className=" btn-simple btn-round"
																				width="20px"
																				color="danger"
																				onClick={(e) => {
																					swal({
																						title:
																							'Are you sure You want to Delete?',
																						text: ' ',
																						icon: 'warning',
																						buttons: true,
																						dangerMode: true
																					}).then((willDelete) => {
																						if (willDelete) {
																							axios
																								.delete(
																									`Course/${id}/Classrooms/${clas.classRoomId}`
																								)
																								.then((res) => {
																									setForceRender(
																										ForceRender + 1
																									);

																									console.log(res);
																								});
																						}
																					});
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
																					setDeleteStudentModal(true);
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
												setResourceUploadModal(true);
											}}
										/>
									</Col>
								</Row>

								<ListGroup>
									{resourceList.map((rs) => {
										return (
											<ListGroupItem
												color="white"
												key={rs.resourceId}
												className="justify-content-between mt-2"
											>
												<Row>
													<Col>
														<span
															onClick={(e) => {
																axios
																	.get(
																		`Courses/${id}/Resources/${rs.resourceId}/Download`,
																		{
																			responseType: 'blob'
																		}
																	)
																	.then((response) => {
																		const url = window.URL.createObjectURL(
																			new Blob([ response.data ])
																		);
																		const link = document.createElement('a');
																		link.href = url;
																		link.setAttribute('download', rs.fileName); //or any other extension
																		document.body.appendChild(link);
																		link.click();
																	});
															}}
														>
															{rs.fileName}
														</span>
													</Col>
													<Col>
														<span className="text-muted">
															Created at {new Date(rs.creationDate).toDateString()}
														</span>
													</Col>
													<Col sm="1">
														<span className="ml-auto">
															<FaTrashAlt
																color="red"
																onClick={(e) => {
																	swal({
																		title: 'Are you sure?',
																		text:
																			'Once deleted, you will not be able to recover this ',
																		icon: 'warning',
																		buttons: true,
																		dangerMode: true
																	}).then((willDelete) => {
																		if (willDelete) {
																			console.log('WILL DELETE');
																			axios
																				.delete(
																					`Courses/${id}/Resources/${rs.resourceId}`
																				)
																				.then((res) => {
																					setForceRender(ForceRender + 1);

																					console.log(res);
																				});
																		}
																	});
																}}
															/>{' '}
														</span>
													</Col>
												</Row>
											</ListGroupItem>
										);
									})}
								</ListGroup>
							</Container>
						</Row>
					</Container>

					<Modal isOpen={ResourceUploadModal} toggle={() => setResourceUploadModal(false)}>
						<Form onSubmit={uploadResource}>
							<div className="modal-header justify-content-center">
								<button className="close" onClick={() => setResourceUploadModal(false)}>
									<i className="tim-icons icon-simple-remove" />
								</button>
								<h4 className="title title-up">Add Resource</h4>
							</div>
							<div className="modal-body">
								<p>
									<Input
										type="file"
										required
										onChange={(e) => {
											setResourceToUpload(e.target.files[0]);
										}}
										name="file"
										id="exampleFile"
									/>
								</p>
							</div>
							<div className="modal-footer">
								<Button color="default" type="submit">
									ADD
								</Button>
								<Button color="danger" type="button" onClick={() => setResourceUploadModal(false)}>
									Cancel
								</Button>
							</div>
						</Form>
					</Modal>

					<Modal isOpen={DeleteStudentModal} toggle={() => setDeleteStudentModal(false)}>
						<div className="modal-header justify-content-center">
							<button className="close" onClick={() => setDeleteStudentModal(false)}>
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
										setForceRender(ForceRender + 1);
									});
									setDeleteStudentModal(false);
								}}
							>
								YES
							</Button>
							<Button color="default" type="button" onClick={() => setDeleteStudentModal(false)}>
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
					<Modal isOpen={attendanceModal} toggle={() => setAttendanceModal(false)}>
						<div className="modal-header justify-content-center">
							<button className="close" onClick={() => setAttendanceModal(false)}>
								<i className="tim-icons icon-simple-remove" />
							</button>
							<h4 className="title title-up">Add Virtual ClassRoom</h4>
						</div>
						<div className="modal-body">
							<Container>
								<Row>List Of Students</Row>
								<Row>
									<ListGroup>
										{attendanceList.map((st) => {
											return (
												<ListGroupItem>
													{st.name} {st.email}
												</ListGroupItem>
											);
										})}
									</ListGroup>
								</Row>
							</Container>
						</div>
					</Modal>
				</div>
			</div>
		</React.Fragment>
	);
}
