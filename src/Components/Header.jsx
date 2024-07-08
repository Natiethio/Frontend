import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
function Header() {
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem('user-info'))

 

  async function Logout() {

    const token = JSON.parse(localStorage.getItem('access_token'));
    try {
      const response = await axios.post('http://localhost:8000/api/Logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        localStorage.clear();
        navigate('/Login')
      }
      else {
        console.error('else error cant logout');
      }
    }
    catch (error) {
      console.error(error);
      console.error('else error cant logout');
    }
  }
  return (
    
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Dashboard</Navbar.Brand>
          <Nav className="mr-auto navbar-wrapper">
            {
              localStorage.getItem('access_token') ?
                <>
                  <Link to="/">Products List</Link>
                  <Link to="/Add">Add Products</Link>

                  <NavDropdown className="navbar-wrapper2" title={user && user.firstname}>
                    <NavDropdown.Item onClick={Logout}>Logout</NavDropdown.Item>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
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
export default Header