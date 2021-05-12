import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import ClassCard from '../ClassCard';

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
		instructor: 'Amanuel Negash',
		description: 'Android with Kotlin'
	},
	{
		id: 3,
		title: 'Networking',
		instructor: 'Dr. Seleshi',
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
		instructor: 'Amanuel Negash',
		description: 'Android with Kotlin'
	},
	{
		id: 6,
		title: 'Networking',
		instructor: 'Dr. Seleshi',
		description: 'Networking '
	}
];

function studentHome() {
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
								{sampleData.map((card) => {
									return (
										<Col md="4" key={card.id}>
											<ClassCard
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

export default studentHome;
