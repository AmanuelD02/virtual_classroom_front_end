import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ClassCard from '../ClassCard';
import axios from '../../axios';

const sampleData = [
	{
		id: 1,
		title: 'Web Programming',
		instructor: 'Fitsum Alemu',
		description: 'HTML5/CSS3/JS'
	},
	{
		id: 2,
		title: 'Mobile Programming',
		instructor: 'Fitsum Alemu',
		description: 'Android with Kotlin'
	},
	{
		id: 3,
		title: 'Networking',
		instructor: 'Fitsum Alemu',
		description: 'Networking '
	},
	{
		id: 4,
		title: 'Web Programming',
		instructor: 'Fitsum Alemu',
		description: 'HTML5/CSS3/JS'
	},
	{
		id: 5,
		title: 'Mobile Programming',
		instructor: 'Fitsum Alemu',
		description: 'Android with Kotlin'
	},
	{
		id: 6,
		title: 'Networking',
		instructor: 'Fitsum Alemu',
		description: 'Networking '
	}
];

function InstructorHome() {
	const [ courses, setCourses ] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const request = await axios.get('Course/instructorCourses');

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

export default InstructorHome;
