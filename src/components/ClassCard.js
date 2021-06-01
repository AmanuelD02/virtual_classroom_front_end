import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

function ClassCard(props) {
	return (
		<Card>
			<CardBody>
				<CardTitle tag="h5">{props.title}</CardTitle>
				<CardSubtitle tag="h6" className="mb-2 text-muted">
					{props.instructor}
				</CardSubtitle>
				<CardText>{props.description}</CardText>
				<Button color="default" href={`/course/${props.id}`}>
					Open
				</Button>
			</CardBody>
		</Card>
	);
}

export default ClassCard;
