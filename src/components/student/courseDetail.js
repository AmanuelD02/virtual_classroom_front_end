import React from 'react';
import classnames from 'classnames';

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

// core components

let ps = null;

let resourceList = [
	{
		id: 1,
		filename: 'C# Essentials',
		downloadLink: ''
	},
	{
		id: 2,
		filename: 'Intorduction to C#',
		downloadLink: ''
	},
	{
		id: 3,
		filename: 'Advanced C# ',
		downloadLink: ''
	}
];

export default function CourseDetailStudent(props) {
	let { id } = useParams();

	const [ tabs, setTabs ] = React.useState(1);

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
			{console.log(id)}
			<div className="wrapper">
				<div className="page-header">
					<img alt="..." className="dots" src={require('assets/img/dots.png').default} />
					<img alt="..." className="path" src={require('assets/img/path4.png').default} />
					<Container className="align-items-center">
						<Row>
							<Col lg="6" md="6">
								<h1 className="profile-title text-left">Mike Scheinder</h1>

								<p className="profile-description">
									Offices parties lasting outward nothing age few resolve. Impression to discretion
									understood to we interested he excellence. Him remarkably use projection collecting.
									Going about eat forty world has round miles.
								</p>
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
																<td />
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
																		disabled={true}
																		type="button"
																	>
																		Join
																	</Button>
																</td>
																<td />
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
																		disabled={true}
																		type="button"
																	>
																		Join
																	</Button>
																</td>
																<td />
															</tr>
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
																	<tr>
																		<td
																			color="info"
																			width="100%"
																			key={rs.id}
																			className="justify-content-between p-3 border-bottom border-warning mw-100"
																		>
																			{rs.filename}
																		</td>
																		<td
																			color="info"
																			width="100%"
																			key={rs.id}
																			className="justify-content-between p-3 border-bottom border-warning mw-100"
																		>
																			<span className="mr-auto">
																				<FaDownload color="green" />{' '}
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
