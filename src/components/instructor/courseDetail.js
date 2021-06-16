import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import classnames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';
import { FaPlus } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';

import VirtualClassRoom from './VirtualClassRoom';
import Resource from './Resource';
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
	Col
} from 'reactstrap';

import '../../assets/css/courseDetail.css';
// core components

let ps = null;

export default function CourseDetailInstructor() {
	let { id } = useParams();
	const [ ForceRender, setForceRender ] = useState(0);

	const [ courseInfo, setCourseInfo ] = useState({});
	const [ studentList, setStudentList ] = useState([]);

	const [ tabs, setTabs ] = React.useState(1);
	const [ DeleteStudent, setDeleteStudent ] = React.useState(0);
	const [ DeleteStudentModal, setDeleteStudentModal ] = React.useState(false);

	const [ studentEmail, setStudentEmail ] = useState('');
	const [ studentEmailNotification, setStudentEmailNotification ] = useState({ title: '', msg: '' });

	//create your forceUpdate hook
	// COURSE DETAILS
	useEffect(
		() => {
			async function fetchData() {
				const request = await axios.get(`courses/${id}`);
				console.log('REQ');
				console.log(request.data);
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
				const request = await axios.get(`courses/${id}/students`);
				setStudentList(request.data);
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
				const request = await axios.get(`authenticate/students/studentByEmail/${studentEmail}`);
				const res = await request.data;
				console.log(" STUDNET")
				console.log(res.userid)

				const req = await axios
					.post(`courses/${id}`, {
						StudentID: res.userid,
						CourseID: id
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

	function DeleteStudentFunc() {

		axios.delete(`courses/${id}/student/${DeleteStudent}`).then((res) => {
			console.log('DELETED');
			console.group(res);
			setForceRender(ForceRender + 1);
		});
		setDeleteStudentModal(false);
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
								<h1 className="profile-title text-left">{courseInfo.CourseTitle}</h1>

								<p className="profile-description">{courseInfo.CourseDescription}</p>
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
													<VirtualClassRoom courseId={id} />
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
															{console.log("STUDENT")}
															{console.log(studentList)}
															{studentList.map((st) => {
																return (
																	<tr key={st.userid}>
																		<td>{st.name} </td>
																		<td>
																			<ImCross
																				color="red"
																				onClick={(e) => {
																					setDeleteStudentModal(true);
																					setDeleteStudent(st.userid);
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
							{/* Resources */}
							<Resource courseId={id} />
						</Row>
					</Container>

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
							<Button color="danger" type="button" onClick={DeleteStudentFunc}>
								YES
							</Button>
							<Button color="default" type="button" onClick={() => setDeleteStudentModal(false)}>
								NO
							</Button>
						</div>
					</Modal>
				</div>
			</div>
		</React.Fragment>
	);
}
