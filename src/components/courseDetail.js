import React from 'react';
import { Redirect } from 'react-router-dom';

function validator(id) {
	if (localStorage.getItem('user') && localStorage.getItem('userType') === 'instructor') {
		return <Redirect to={`/instructorCourse/${id}`} />;
	} else if (localStorage.getItem('user') && localStorage.getItem('userType') === 'student') {
		return <Redirect to={`/studentCourse/${id}`} />;
	} else {
		return <Redirect to={`/login`} />;
	}
}

export default function courseDetail(props) {
	let id = props.match.params.id;

	return <React.Fragment>{validator(id)}</React.Fragment>;
}
