import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import 'assets/css/nucleo-icons.css';
import 'assets/scss/blk-design-system-react.scss?v=1.2.0';
import 'assets/demo/demo.css';

import ProtectedStudentRoute from './ProtectedStudentRoute';
import ProtectedInstructorRoute from './ProtectedInstructorRoute';

import NavBar from './components/NavBar.js';
import App from './App';

import RegisterPage from './components/auth/RegisterPage';
import LoginPage from './components/auth/LoginPage';
import StudentHome from './components/student/StudentHome';
import InstructorHome from './components/instructor/InstructorHome';
import CourseDetailInstructor from './components/instructor/courseDetail';
import CreateClass from './components/instructor/CreateClass';
import CourseDetailStudent from './components/student/courseDetail';
import CourseDetail from './components/courseDetail';
import VirtualClassroom from './components/classroom/VirtualClass'

ReactDOM.render(
	<BrowserRouter>
		<NavBar />
		<Switch>
			<Route path="/" exact render={(props) => <App {...props} />} />
			<Route path="/register" render={(props) => <RegisterPage {...props} />} />
			<Route path="/login" render={(props) => <LoginPage {...props} />} />
			<Route path="/course/:id" render={(props) => <CourseDetail {...props} />} />
			<Route path="/join_classroom" render={(props) => <VirtualClassroom {...props} />} />
			{/* Student Routes */}
			<ProtectedStudentRoute exact path="/studenthome" component={StudentHome} />
			<ProtectedStudentRoute exact path="/studentCourse/:id" component={CourseDetailStudent} />
			{/* Insttuctor Routes */}
			<ProtectedInstructorRoute exact path="/instructorhome" component={InstructorHome} />
			<ProtectedInstructorRoute exact path="/instructorCourse/:id" component={CourseDetailInstructor} />
			<ProtectedInstructorRoute exact path="/CreateClass" component={CreateClass} />
			<Redirect to="/" />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);
