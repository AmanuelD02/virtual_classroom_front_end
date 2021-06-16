import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ClassCard from '../ClassCard';
import axios from '../../axios';

function InstructorHome() {
	const [ courses, setCourses ] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const token = localStorage.getItem('REACT_TOKEN_AUTH') || '';
			const request = await axios.get('courses/instructorcourses', {
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
										<Col md="4" key={card.userid} className="mx-auto">
											<ClassCard
												id={card.userid}
												title={card.CourseTitle}
												instructor={card.InstructorID}
												description={card.CourseDescription}
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
