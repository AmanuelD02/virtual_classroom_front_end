import React from 'react';
import { FormGroup, Form, Input, Row, Col, Container, Card, CardBody, CardFooter, Button } from 'reactstrap';
import '../../assets/css/createCourse.css';
function CreateClass() {
	return (
		<React.Fragment>
			<div className="wrapper">
				<div className="page-header">
					<div className="content">
						<Container>
							<Card className="card-register ">
								<Form>
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
															id="input-username"
															placeholder="Title"
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
															rows="4"
															type="textarea"
														/>
													</FormGroup>
												</Col>
											</Row>
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
