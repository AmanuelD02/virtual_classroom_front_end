import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ClassCard from '../ClassCard';
import axios from '../../axios';

function InstructorHome() {
	const [ courses, setCourses ] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const token = localStorage.getItem('REACT_TOKEN_AUTH') || '';
			const request = await axios.get('Course/instructorCourses', {
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			console.log('REQuest');
			console.log(request);
			setCourses(request.data);

			return request;
		}

		fetchData();
	}, []);
	return (
		<React.Fragment>
			<div className="wrapper">
				<div className="page-header">
					<div className="content">
						<div className="typography">
							<h1>Instructor Home Page</h1>
						</div>
						<Container>
							<Row>
								{courses.map((card) => {
									return (
										<Col md="4" key={card.courseId} className="mx-auto">
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

export default InstructorHome;
