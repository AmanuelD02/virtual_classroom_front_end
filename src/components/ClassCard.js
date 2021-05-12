import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

function ClassCard(props) {
	return (
		<Card>
			<CardImg
				top
				className="img-fluid rounded shadow-lg"
				src="https://i.pinimg.com/236x/c3/6f/53/c36f537877513767ab2535c97c402091.jpg"
				alt="Card image cap"
			/>
			<CardBody>
				<CardTitle tag="h5">{props.title}</CardTitle>
				<CardSubtitle tag="h6" className="mb-2 text-muted">
					{props.instructor}
				</CardSubtitle>
				<CardText>{props.description}</CardText>
				<Button color="default">Open</Button>
			</CardBody>
		</Card>
	);
}

export default ClassCard;
