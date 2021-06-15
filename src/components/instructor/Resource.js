import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import swal from 'sweetalert';

import { FaTrashAlt, FaPlus } from 'react-icons/fa';

// reactstrap components
import { Button, Form, Input, Container, Row, Modal, ListGroupItem, ListGroup, Col } from 'reactstrap';

function Resources(props) {
	let courseId = props.courseId;
	const [ ForceRender, setForceRender ] = useState(0);

	const [ resourceList, setResourceList ] = useState([]);
	const [ ResourceUploadModal, setResourceUploadModal ] = React.useState(false);
	const [ resourceToUpload, setResourceToUpload ] = useState(null);

	// FEtch Resources
	useEffect(
		() => {
			axios.get(`Courses/${courseId}/Resources`).then((res) => {
				console.log('REsource');
				console.log(res);
				setResourceList(res.data);
			});
		},
		[ courseId, ForceRender ]
	);

	// Resource Upload
	function uploadResource() {
		const data = new FormData();
		data.append('file', resourceToUpload);
		axios
			.post(`/Courses/${courseId}/Resources`, data, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((res) => {
				setResourceUploadModal(false);
				setForceRender(ForceRender + 1);

				console.log(res);
			});
	}

	return (
		<React.Fragment>
			<Container className="text-info mb-5">
				<Row>
					<Col>
						{' '}
						<h4 className="title text-left">Resources</h4>
					</Col>
					<Col className="text-right">
						<FaPlus
							size={28}
							onClick={() => {
								console.log('CLICKED PLUS');
								setResourceUploadModal(true);
							}}
						/>
					</Col>
				</Row>

				<ListGroup>
					{resourceList.map((rs) => {
						return (
							<ListGroupItem color="white" key={rs.resourceId} className="justify-content-between mt-2">
								<Row>
									<Col>
										<span
											onClick={(e) => {
												axios
													.get(`Courses/${courseId}/Resources/${rs.resourceId}/Download`, {
														responseType: 'blob'
													})
													.then((response) => {
														const url = window.URL.createObjectURL(
															new Blob([ response.data ])
														);
														const link = document.createElement('a');
														link.href = url;
														link.setAttribute('download', rs.fileName); //or any other extension
														document.body.appendChild(link);
														link.click();
													});
											}}
										>
											{rs.fileName}
										</span>
									</Col>
									<Col>
										<span className="text-muted">
											Created at {new Date(rs.creationDate).toDateString()}
										</span>
									</Col>
									<Col sm="1">
										<span className="ml-auto">
											<FaTrashAlt
												color="red"
												onClick={(e) => {
													swal({
														title: 'Are you sure?',
														text: 'Once deleted, you will not be able to recover this ',
														icon: 'warning',
														buttons: true,
														dangerMode: true
													}).then((willDelete) => {
														if (willDelete) {
															console.log('WILL DELETE');
															axios
																.delete(
																	`Courses/${courseId}/Resources/${rs.resourceId}`
																)
																.then((res) => {
																	setForceRender(ForceRender + 1);

																	console.log(res);
																});
														}
													});
												}}
											/>{' '}
										</span>
									</Col>
								</Row>
							</ListGroupItem>
						);
					})}
				</ListGroup>
			</Container>

			{/* Modal */}
			<Modal isOpen={ResourceUploadModal} toggle={() => setResourceUploadModal(false)}>
				<Form onSubmit={uploadResource}>
					<div className="modal-header justify-content-center">
						<button className="close" onClick={() => setResourceUploadModal(false)}>
							<i className="tim-icons icon-simple-remove" />
						</button>
						<h4 className="title title-up">Add Resource</h4>
					</div>
					<div className="modal-body">
						<p>
							<Input
								type="file"
								required
								onChange={(e) => {
									setResourceToUpload(e.target.files[0]);
								}}
								name="file"
								id="exampleFile"
							/>
						</p>
					</div>
					<div className="modal-footer">
						<Button color="default" type="submit">
							ADD
						</Button>
						<Button color="danger" type="button" onClick={() => setResourceUploadModal(false)}>
							Cancel
						</Button>
					</div>
				</Form>
			</Modal>
		</React.Fragment>
	);
}

export default Resources;
