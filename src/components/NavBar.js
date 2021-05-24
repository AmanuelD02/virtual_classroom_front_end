import React from 'react';
import { Link } from 'react-router-dom';
// reactstrap components
import {
	Button,
	Collapse,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	NavbarBrand,
	Navbar,
	NavItem,
	NavLink,
	Nav,
	Container,
	Row,
	Col,
	UncontrolledTooltip
} from 'reactstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';

const logout = () => {
	localStorage.removeItem('user');
	localStorage.removeItem('userType');
};

function authCheck() {
	if (localStorage.getItem('user') && localStorage.getItem('userType') === 'student') {
		return (
			<React.Fragment>
				<NavItem className="p-0" />
				<NavItem>
					<Button className="nav-link d-none d-lg-block" color="default" onClick={(e) => logout()} href="/">
						<FaSignOutAlt /> Logout
					</Button>
				</NavItem>
			</React.Fragment>
		);
	}
	if (localStorage.getItem('user') && localStorage.getItem('userType') === 'instructor') {
		return (
			<React.Fragment>
				<NavItem className="p-0">
					<Button className="nav-link d-none d-lg-block" color="primary" href="/CreateClass">
						Create Class
					</Button>
				</NavItem>
				<NavItem>
					<Button className="nav-link d-none d-lg-block" color="default" onClick={(e) => logout()} href="/">
						<FaSignOutAlt /> Logout
					</Button>
				</NavItem>
			</React.Fragment>
		);
	}
	return (
		<React.Fragment>
			<NavItem className="p-0">
				<Button className="nav-link d-none d-lg-block" color="primary" href="/login">
					Login
				</Button>
			</NavItem>
			<NavItem>
				<Button className="nav-link d-none d-lg-block" color="default" href="/register">
					<FaSignInAlt /> Register
				</Button>
			</NavItem>
		</React.Fragment>
	);
}

export default function NavBar() {
	const [ collapseOpen, setCollapseOpen ] = React.useState(false);
	const [ collapseOut, setCollapseOut ] = React.useState('');
	const [ color, setColor ] = React.useState('navbar-transparent');
	React.useEffect(() => {
		window.addEventListener('scroll', changeColor);
		return function cleanup() {
			window.removeEventListener('scroll', changeColor);
		};
	}, []);
	const changeColor = () => {
		if (document.documentElement.scrollTop > 99 || document.body.scrollTop > 99) {
			setColor('bg-info');
		} else if (document.documentElement.scrollTop < 100 || document.body.scrollTop < 100) {
			setColor('navbar-transparent');
		}
	};
	const toggleCollapse = () => {
		document.documentElement.classList.toggle('nav-open');
		setCollapseOpen(!collapseOpen);
	};
	const onCollapseExiting = () => {
		setCollapseOut('collapsing-out');
	};
	const onCollapseExited = () => {
		setCollapseOut('');
	};
	const scrollToDownload = () => {
		document.getElementById('download-section').scrollIntoView({ behavior: 'smooth' });
	};
	return (
		<Navbar className={'fixed-top ' + color} color-on-scroll="100" expand="lg">
			<Container>
				<div className="navbar-translate">
					<NavbarBrand to="/" tag={Link} id="navbar-brand">
						<span>Nile• </span>
						Virtual Class Room
					</NavbarBrand>

					<button
						aria-expanded={collapseOpen}
						className="navbar-toggler navbar-toggler"
						onClick={toggleCollapse}
					>
						<span className="navbar-toggler-bar bar1" />
						<span className="navbar-toggler-bar bar2" />
						<span className="navbar-toggler-bar bar3" />
					</button>
				</div>
				<Collapse
					className={'justify-content-end ' + collapseOut}
					navbar
					isOpen={collapseOpen}
					onExiting={onCollapseExiting}
					onExited={onCollapseExited}
				>
					<div className="navbar-collapse-header">
						<Row>
							<Col className="collapse-brand" xs="6">
								<a href="#pablo" onClick={(e) => e.preventDefault()}>
									BLK•React
								</a>
							</Col>
							<Col className="collapse-close text-right" xs="6">
								<button
									aria-expanded={collapseOpen}
									className="navbar-toggler"
									onClick={toggleCollapse}
								>
									<i className="tim-icons icon-simple-remove" />
								</button>
							</Col>
						</Row>
					</div>
					<Nav navbar>{authCheck()}</Nav>
				</Collapse>
			</Container>
		</Navbar>
	);
}
