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

ReactDOM.render(
	<BrowserRouter>
		<NavBar />
		<Switch>
			<Route path="/" exact render={(props) => <App {...props} />} />

			<Route path="/register" render={(props) => <RegisterPage {...props} />} />
			<Route path="/login" render={(props) => <LoginPage {...props} />} />
			<ProtectedStudentRoute exact path="/studenthome" component={StudentHome} />
			<ProtectedInstructorRoute exact path="/instructorhome" component={InstructorHome} />

			<Redirect to="/" />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);
