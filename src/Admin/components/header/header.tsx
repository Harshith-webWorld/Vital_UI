import React from 'react';
import '../../assets/scss/admin.scss';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import { onSignout, signout } from '../../components/Login/loginslice';
import { useDispatch } from 'react-redux';

const Header: React.FC = () => {
    let history = useHistory();
    const dispatch = useDispatch();
    const data : any = useSelector((state: any) => state);
    function Logout() {
        dispatch(signout());
        sessionStorage.removeItem('userToken');
        localStorage.clear();
        history.push('/admin')
      }
    
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div className='ad-header'>
        <Navbar collapseOnSelect variant='dark' className='headmenu'>
          <Container>
            <div className='mob-menu'>
              <button
                aria-controls='simple-menu'
                aria-haspopup='true'
                onClick={handleClick}
                className='btn'>
                Menu <i className='fas fa-bars'></i>
              </button>
              <Menu
                id='admin-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={handleClose} key='admin-menu'>
                  <div className='sidebar-mob-wrapper'>
                    <ul className='nav'>
                      <Link
                        key='dashboardadmin'
                        style={{ textDecoration: 'none' }}
                        to='/dashboardadmin'
                        className='nav-link'>
                        <li className='active'>Dashboard</li>
                      </Link>
                      <Link
                        key='users'
                        style={{ textDecoration: 'none' }}
                        to='/users'
                        className='nav-link'>
                        <li className='active'>User</li>
                      </Link>
                      <Link
                        key='newsList'
                        style={{ textDecoration: 'none' }}
                        to='/newsList'
                        className='nav-link'>
                        <li>Website Content News</li>
                      </Link>
                      <Link
                        key='imageList'
                        style={{ textDecoration: 'none' }}
                        to='/imageList'
                        className='nav-link'>
                        <li>Website Content Images</li>
                      </Link>

                      <Link
                        key='programInfosList'
                        style={{ textDecoration: 'none' }}
                        to='/programInfosList'
                        className='nav-link'>
                        <li>Website Content ProgramInfos</li>
                      </Link>
                      <Link
                        key='videoList'
                        style={{ textDecoration: 'none' }}
                        to='/videoList'
                        className='nav-link'>
                        <li>Website Content Videos</li>
                      </Link>
                      <Link
                        key='faqsList'
                        style={{ textDecoration: 'none' }}
                        to='/faqsList'
                        className='nav-link'>
                        <li>Website Content FAQs</li>
                      </Link>
                    </ul>
                  </div>
                </MenuItem>
              </Menu>
            </div>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse
              id='responsive-navbar-nav'
              className='justify-content-end'>
              <Nav className='admin-head'>
                <i className='fas fa-user'></i>
                <NavDropdown
                  title={
                    data.Admin &&
                    data.Admin.login &&
                    data.Admin.login.entities &&
                    data.Admin.login.entities.fullName
                  }
                  id='collasible-nav-dropdown'>
                  <NavDropdown.Item href='#action/3.2' key='admin'>
                    <i className='fas fa-user-circle'></i>
                    {data.Admin &&
                      data.Admin.login &&
                      data.Admin.login.entities &&
                      data.Admin.login.entities.userName}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    href='#action/3.4'
                    onClick={Logout}
                    key='logout'>
                    <i className='fas fa-sign-out-alt'></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};

export default Header;
