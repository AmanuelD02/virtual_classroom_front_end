import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedStudentRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				if (localStorage.getItem('user') && localStorage.getItem('userType') === 'student') {
					return <Component {...rest} {...props} />;
				} else {
					return <Redirect to="/login" />;
				}
			}}
		/>
	);
};

export default ProtectedStudentRoute;
