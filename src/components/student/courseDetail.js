import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import axios from '../../axios';

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';

import { FaDownload } from 'react-icons/fa';
// reactstrap components
import {
	Button,
	Card,
	CardBody,
	NavItem,
	NavLink,
	Nav,
	Table,
	TabContent,
	TabPane,
	Container,
	Row,
	Col
} from 'reactstrap';

import '../../assets/css/courseDetail.css';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';

// core components

let ps = null;

export default function CourseDetailStudent(props) {
	let { id } = useParams();
	const history = useHistory();
	const [ courseInfo, setCourseInfo ] = useState({});
	const [ classRoomList, setClassRoomList ] = useState([]);
	const [ tabs, setTabs ] = React.useState(1);
	const [ resourceList, setResourceList ] = useState([]);

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
	// Course Detail
	useEffect(
		() => {
			async function fetchData() {
				const request = await axios.get(`Course/studentCourses/${id}`);
				console.log('REQUESt');
				console.log(request.data);
				setCourseInfo(request.data);

				return request;
			}

			fetchData();
		},
		[ id ]
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
		[ id ]
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
		[ id ]
	);

	return (
		<React.Fragment>
			<div className="wrapper">
				<div className="page-header">
					<img alt="..." className="dots" src={require('assets/img/dots.png').default} />
					<img alt="..." className="path" src={require('assets/img/path4.png').default} />
					<Container className="align-items-center">
						<Row>
							<Col lg="6" md="6">
								{console.log(courseInfo)}
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
													Resources
												</NavLink>
											</NavItem>
										</Nav>
										<TabContent className="tab-subcategories" activeTab={'tab' + tabs}>
											<TabPane tabId="tab1">
												<div class="table-wrapper-scroll-y my-custom-scrollbar">
													<Table className="tablesorter" responsive>
														<thead className="text-primary">
															<tr>
																<th className="header">Virtual Class Schedules</th>
															</tr>
														</thead>
														<tbody>
															{classRoomList.map((clas) => {
																return (
																	<tr key={clas.classRoomId}>
																		<td>
																			<p>{clas.classRoomName}</p>
																		</td>
																		<td> {new Date(clas.date).toDateString()}</td>
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
																				color="success"
																				onClick={(e) => {
																					history.push(
																						`/join_classroom/${clas.classRoomId}`
																					);
																				}}
																				type="button"
																			>
																				Join
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
												<div class="table-wrapper-scroll-y my-custom-scrollbar">
													<Table className="tablesorter" responsive>
														<tbody>
															{resourceList.map((rs) => {
																return (
																	<tr key={rs.resourceId}>
																		<td
																			color="info"
																			width="100%"
																			key={rs.id}
																			className="justify-content-between p-3 border-bottom border-warning mw-100"
																		>
																			{rs.fileName}
																		</td>
																		<td>
																			<span className="text-muted">
																				Created at{' '}
																				{new Date(rs.creationDate).toDateString()}
																			</span>
																		</td>
																		<td
																			color="info"
																			width="100%"
																			className="justify-content-between p-3 border-bottom border-warning mw-100"
																		>
																			<span className="mr-auto">
																				<FaDownload
																					color="green"
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
																									new Blob([
																										response.data
																									])
																								);
																								const link = document.createElement(
																									'a'
																								);
																								link.href = url;
																								link.setAttribute(
																									'download',
																									rs.fileName
																								);
																								document.body.appendChild(
																									link
																								);
																								link.click();
																							});
																					}}
																				/>{' '}
																			</span>
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
					</Container>
				</div>
			</div>
		</React.Fragment>
	);
}
