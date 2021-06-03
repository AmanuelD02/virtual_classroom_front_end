import React from 'react';
import { Redirect } from 'react-router-dom';
// reactstrap components
import { Container } from 'reactstrap';

export default function LandingPage() {
	if (localStorage.getItem('user') && localStorage.getItem('userType') === 'instructor') {
		return <Redirect to="/instructorhome" />;
	} else if (localStorage.getItem('user') && localStorage.getItem('userType') === 'student') {
		return <Redirect to="/studenthome" />;
	} else {
		return (
			<div className="page-header header-filter">
				<div className="squares square1" />
				<div className="squares square2" />
				<div className="squares square3" />
				<div className="squares square4" />
				<div className="squares square5" />
				<div className="squares square6" />
				<div className="squares square7" />
				<Container>
					<div className="content-center brand">
						<h1 className="h1-seo">Nile Classroom</h1>
						<h3 className="d-none d-sm-block">
							Space for teachers to connect with their students.
						</h3>
					</div>
				</Container>
			</div>
		);
	}
}
