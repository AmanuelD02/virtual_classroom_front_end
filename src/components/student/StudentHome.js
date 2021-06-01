import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ClassCard from '../ClassCard';
import axios from '../../axios';

function StudentHome() {
	const [ courses, setCourses ] = useState([]);
	const token = localStorage.getItem('REACT_TOKEN_AUTH') || '';

	useEffect(() => {
		async function fetchData() {
			const request = await axios.get('Course/studentCourses');

			console.log('REQuest');
			console.log(request);
			setCourses(request.data);

			return request;
		}
		console.log('token');
		console.log(token);
		fetchData();
	}, []);
	return (
		<React.Fragment>
			<div className="wrapper">
				<div className="page-header">
					<div className="content">
						<div className="typography">
							<h1>Student Home Page</h1>
						</div>
						<Container>
							<Row>
								{courses.map((card) => {
									return (
										<Col md="4" key={card.courseId}>
											<ClassCard
												id={card.courseId}
												title={card.title}
												instructor={card.instructor}
												description={card.description}
											/>
										</Col>
									);
								})}
							</Row>
						</Container>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default StudentHome;
