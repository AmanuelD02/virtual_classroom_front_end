import '../../assets/css/createCourse.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FormGroup, Form, Input, Row, Col, Container, Card, CardBody, CardFooter, Button, Label } from 'reactstrap';
import axios from '../../axios';

function CreateClass() {
	const [ formValues, setFormValues ] = useState({});
	const history = useHistory();

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormValues({ ...formValues, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormValues({});
		let instructorId = localStorage.getItem('user');
		axios
			.post('Course', {
				title: formValues.title,
				description: formValues.description,
				instructorId: instructorId
			})
			.then((res) => {
				history.push('/instructorhome');
			});
	};
	return (
		<React.Fragment>
			<div className="wrapper">
				<div className="page-header">
					<img alt="..." className="dots" src={require('assets/img/dots.png').default} />
					<img alt="..." className="path" src={require('assets/img/path4.png').default} />
					<div className="content">
						<Container>
							<Card className="card-register">
								<Form onSubmit={handleSubmit}>
									<CardBody>
										<div className="pl-lg-4 pb-3">
											<Row>
												<Col lg="6">
													<FormGroup>
														<label className="form-control-label" htmlFor="input-username">
															Course Title
														</label>
														<Input
															className="form-control-alternative"
															id="title"
															required
															name="title"
															placeholder="Title"
															onChange={handleChange}
															value={formValues.title}
															type="text"
														/>
													</FormGroup>
												</Col>
											</Row>
										</div>

										<div className="pl-lg-4 pb-3">
											<Row>
												<Col lg="6">
													<FormGroup>
														<label>Description</label>
														<Input
															className="form-control-alternative"
															placeholder="Course Description.."
															required
															onChange={handleChange}
															id="description"
															name="description"
															value={formValues.description}
															rows="4"
															type="textarea"
														/>
													</FormGroup>
												</Col>
											</Row>
											{/* <Row className="pb-3">
												<Col sm="9">
													<FormGroup className="border">
														<label className="form-control-label" htmlFor="input-students">
															Add Students
														</label>
														<Input type="file" name="file" accept=".xlsx" width="50%" />
													</FormGroup>
												</Col>
											</Row> */}
										</div>
									</CardBody>
									<CardFooter>
										<Button className="btn-round" color="primary" size="lg" type="submit">
											Create
										</Button>
									</CardFooter>
								</Form>
							</Card>
						</Container>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default CreateClass;
