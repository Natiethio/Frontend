import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem('user-info'));

  const getConfig = async () => {
    const response = await fetch('/config.json');
    const config = await response.json();
    return config;
  };

  async function Logout() {

    try {
      const config = await getConfig();
      const token = JSON.parse(localStorage.getItem('access_token'));
      const response = await axios.post(`${config.API_BASE_URL}/Logout`,{},{
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      // const response = await axios.post('http://localhost:8000/api/Logout', {}, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
      if (response.data.status === 200) {
        localStorage.clear();
        navigate('/Login');
      } else {
        console.error('else error cant logout');
      }
    } catch (error) {
      console.error(error);
      console.error('else error cant logout');
    }
  }

  const userRole = user ? user.role : null;

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/Admin">TMS</Navbar.Brand>
          <Nav className="mr-auto navbar-wrapper">
            {
              localStorage.getItem('access_token') ?
                <>
                  {userRole === 1 ? (
                    <>
                      <Link to="/Flagged">Flagged</Link>
                      <Link to="/AddTraffic">Add Traffic</Link>
                    </>
                  ) : (
                    <>
                     
                    </>
                  )} 
                   {/* <>
                      <Link to="User">Users</Link>
                    </> */}
                  <NavDropdown className="navbar-wrapper2" title={user && user.firstname}>
                    <NavDropdown.Item onClick={Logout}>Logout</NavDropdown.Item>
                    <NavDropdown.Item ></NavDropdown.Item>
                  </NavDropdown>
                </>
                :
                <>
                  <Link to="/Login">Login</Link>
                  <Link to="/Register">Register</Link>
                </>
            }
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
