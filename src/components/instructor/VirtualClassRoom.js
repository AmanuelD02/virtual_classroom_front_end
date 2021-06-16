import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import swal from 'sweetalert';

import { FaPlus } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import TimeKeeper from 'react-timekeeper';

import moment from 'moment';

import { useHistory } from 'react-router-dom';

// reactstrap components
import { Button, Input, Table, Container, Row, Modal, ListGroupItem, ListGroup, Col } from 'reactstrap';

function VirtualClassroom(props) {
	let courseId = props.courseId;

	const history = useHistory();

	const [ classRoomList, setClassRoomList ] = useState([]);
	const [ classRoomTitle, setClassRoomTitle ] = useState('');
	const [ ForceRender, setForceRender ] = useState(0);

	const [ attendanceList, setAttendanceList ] = useState([]);
	const [ attendanceModal, setAttendanceModal ] = useState(false);

	const [ StartDate, setStartDate ] = useState(new Date());
	const [ StartTime, setStartTime ] = useState('12:00');
	const [ showStartTime, setShowStartTime ] = useState(false);

	const [ EndTime, setEndTime ] = useState('13:00');
	const [ showEndTime, setShowEndTime ] = useState(false);

	const [ addVirtualClassRoom, setAddVirtualClassRoom ] = React.useState(false);

	// FETCH CLASSROOMS
	useEffect(
		() => {
			async function fetchData() {
				const request = await axios.get(`courses/${courseId}/classrooms`);
				

				console.log("CLASSROOM:")
				console.log(request.data)
				setClassRoomList(request.data);
				return request;
			}
			fetchData();
		},
		[ courseId,ForceRender ]
	);

	function submitVirtualClassRoom() {
		if (new Date(`01/01/2000 ${StartTime}`) >= new Date(`01/01/2000 ${EndTime}`)) {
			swal({
				title: 'Invalid Time',
				text: 'Check startTime',
				icon: 'warning',
				dangerMode: true
			});

			console.log('ERROR');

			console.log(StartTime + '  ' + EndTime);
		} else {
			console.log('SENDING..');
			console.log(StartDate.toJSON())
			var datee = `${StartDate.getDay()}/${StartDate.getMonth()}/${StartDate.getFullYear().toString().substring(2,4)}`
			var s = moment(StartDate.toJSON())
			console.log(moment(StartDate).format('d/M/YY'))
			console.log("startDAte")
			console.log(StartDate.getDay())

			axios
				.post(`courses/${courseId}/classrooms`, {
					ClassroomName: classRoomTitle,
					// Date: `${StartDate.getDay()}/${StartDate.getMonth()}/${StartDate.getFullYear().toString().substring(2,4)}`,
					Date: StartDate.toJSON(),
					StartTime: StartTime,
					EndTime: EndTime
				})
				.then((res) => {
					setClassRoomTitle('');
					setStartTime('12:00');
					setEndTime('13:00');
					setStartDate(new Date());
					setAddVirtualClassRoom(false);
					setForceRender(ForceRender + 1);

					console.log('RESPONSE IS');
					console.log(res.data);
				})
				.catch((e) => {
					console.log(e.response)
					swal({
						title: 'Error',
						text: e.response.data.title,
						icon: 'warning',
						dangerMode: true
					});
				});
		}
	}

	function deleteClassRoom(ClassroomID) {
		swal({
			title: 'Are you sure You want to Delete?',
			text: ' ',
			icon: 'warning',
			buttons: true,
			dangerMode: true
		}).then((willDelete) => {
			if (willDelete) {
				axios.delete(`courses/${courseId}/classrooms/${ClassroomID}`).then((res) => {
					setForceRender(ForceRender + 1);

					console.log(res);
				});
			}
		});
	}

	// function fetchAttendance(ClassroomID) {
	// 	e.preventDefault();
	// 	axios.get(`courses/${courseId}/classrooms/${ClassroomID}/attendance`).then((res) => {
	// 		setAttendanceList(res.data);
	// 		setAttendanceModal(true);
	// 	});
	// }

	return (
		<React.Fragment>
			<Table className="tablesorter" responsive>
				<thead className="text-primary">
					<tr>
						<th className="header">New Virtual Class</th>

						<th>
							<Button
								className="btn-simple btn-icon btn-round "
								color="primary"
								type="submit"
								onClick={(e) => {
									setAddVirtualClassRoom(true);
								}}
							>
								<FaPlus />
							</Button>
						</th>
					</tr>
					<tr>
						<td>Name:</td>
						<td>Date</td>
						<td>Time</td>
					</tr>
				</thead>
				<tbody>
					{console.log(classRoomList	)}
					{classRoomList.map((clas) => {
						return (
							<tr key={clas.ClassroomID}>
								<td>
									<p>{clas.ClassroomName}</p>
								</td>
								<td> {clas.Date && new Date(clas.Date).toDateString()}</td>
								<td>
									<p>
										{clas.StartTime.substr(0, 5)} - {clas.EndTime.substr(0, 5)}{' '}
									</p>
								</td>

								<td>
									{new Date() > new Date(clas.Date).setHours(clas.EndTime.substr(0, 2)) && (
										<Button
											className=" btn-simple btn-round"
											width="20px"
											color="success"
											// onClick={fetchAttendance(clas.ClassroomID)}
											onClick={(e)=>{
												axios.get(`courses/${courseId}/classrooms/${clas.ClassroomID}/attendance`).then((res) => {
													setAttendanceList(res.data);
														setAttendanceModal(true);
																		});
											}}
											type="button"
										>
											Attendace
										</Button>
									)}

									{new Date() <= new Date(clas.Date).setHours(clas.EndTime.substr(0, 2)) && (
										<Button
											className=" btn-simple btn-round"
											width="20px"
											onClick={(e) => {
												history.push(`/join_classroom/${clas.ClassroomID}`);
											}}
											color="success"
											type="button"
										>
											Join
										</Button>
									)}
								</td>
								<td>
									<Button
										className=" btn-simple btn-round"
										width="20px"
										color="danger"
										onClick={(e) => {
											deleteClassRoom(clas.ClassroomID);
										}}
										type="button"
									>
										Cancel
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>

			{/* Modals  */}
			<Modal isOpen={addVirtualClassRoom} toggle={() => setAddVirtualClassRoom(false)}>
				<div className="modal-header justify-content-center">
					<button className="close" onClick={() => setAddVirtualClassRoom(false)}>
						<i className="tim-icons icon-simple-remove" />
					</button>
					<h4 className="title title-up">Add Virtual ClassRoom</h4>
				</div>
				<div className="modal-body">
					<Container>
						<Row className="pb-2">
							<Col>
								<p>Title Name:</p>
							</Col>
							<Col>
								<Input
									placeholder="ClassRoom Name"
									name="lname"
									required
									value={classRoomTitle}
									onChange={(e) => {
										setClassRoomTitle(e.target.value);
									}}
									className="text-light border"
									id="lname"
									type="text"
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<p>Select Date</p>
							</Col>
							<Col>
								<DatePicker
									selected={StartDate}
									onChange={(date) => {
										setStartDate(date)
										console.log("SET")
										console.log(date)
										console.log(moment(StartDate).format('d/M/YY'))}}
									
									minDate={new Date()}
									className="bg-secondary text-black"
									placeholderText="Date"
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<p>Select Starting Time: </p>
							</Col>
							<Col>
								{showStartTime && (
									<TimeKeeper
										time={StartTime}
										hour24Mode
										onChange={(newTime) => setStartTime(newTime.formatted24)}
										onDoneClick={() => setShowStartTime(false)}
										switchToMinuteOnHourSelect
									/>
								)}
								{!showStartTime && <button onClick={() => setShowStartTime(true)}>{StartTime}</button>}
							</Col>
						</Row>
						<Row>
							<Col>
								<p>Select Ending Time: </p>
							</Col>

							<Col>
								{showEndTime && (
									<TimeKeeper
										time={EndTime}
										hour24Mode
										onChange={(newTime) => setEndTime(newTime.formatted24)}
										onDoneClick={() => setShowEndTime(false)}
										switchToMinuteOnHourSelect
									/>
								)}
								{!showEndTime && <button onClick={() => setShowEndTime(true)}>{EndTime}</button>}
							</Col>
						</Row>
						<Row>
							<Col>
								<Button
									className="btn-simple btn-icon btn-round float-right"
									color="success"
									onClick={submitVirtualClassRoom}
									type="submit"
								>
									<FaPlus />
								</Button>
							</Col>
						</Row>
					</Container>
				</div>
				<div className="modal-footer float-right">
					<Button
						color="danger"
						className="float-right"
						type="button"
						onClick={() => {
							setClassRoomTitle('');
							setStartTime('12:00');
							setEndTime('13:00');
							setStartDate(new Date());
							setAddVirtualClassRoom(false);
						}}
					>
						Cancel
					</Button>
				</div>
			</Modal>
			<Modal isOpen={attendanceModal} toggle={() => setAttendanceModal(false)}>
				<div className="modal-header justify-content-center">
					<button className="close" onClick={() => setAttendanceModal(false)}>
						<i className="tim-icons icon-simple-remove" />
					</button>
					<h4 className="title title-up">Virtual ClassRoom</h4>
				</div>
				<div className="modal-body">
					<Container>
						<Row>List Of Students</Row>
						<Row>
							<ListGroup>
								{attendanceList.map((st) => {
									return (
										<ListGroupItem>
											{st.name} {st.email}
										</ListGroupItem>
									);
								})}
							</ListGroup>
						</Row>
					</Container>
				</div>
			</Modal>
		</React.Fragment>
	);
}

export default VirtualClassroom;
