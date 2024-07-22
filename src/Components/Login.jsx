import { useState, useEffect } from 'react';
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';

function Login() {
  const [pagetitle, setPagetitle] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setPagetitle('Login');
    if (localStorage.getItem('access_token')) {
      navigate("/");
    }
  }, [navigate]);

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  const getConfig = async () => {
    const response = await fetch('/config.json');
    const config = await response.json();
    return config;
  };

  async function signIn() {
    document.getElementById('signbtn').disabled = true;
    document.getElementById('signbtn').innerHTML = 'Signing In...';

    try {
      if (email === '' || password === '') {
        setErrorMessage("Please fill the required inputs");
        document.getElementById('signbtn').disabled = false;
        document.getElementById('signbtn').innerHTML = 'Sign In';
        return;
      }

      let item = { email, password };
      console.warn(item);
      // const ipAddress = '192.168.1.10'; // Replace with your server's IP address
      const config = await getConfig();
      const result = await axios.post(`${config.API_BASE_URL}/Login`,item);
      // const result = await axios.post(`http://localhost:8000/api/Login`, item);

      if (result.data.status === 200) {
        const response = result.data;
        console.log(response.role);
        console.warn('result', response);

        localStorage.setItem('access_token', JSON.stringify(response.token));
        handleSubsequentRequests(response.token);
      } else {
        document.getElementById('signbtn').disabled = false;
        document.getElementById('signbtn').innerHTML = 'Sign In';
        const errorResponse = result.data;
        const errorMessage = errorResponse.error || "An error occurred.";
        console.error(errorMessage);
        setErrorMessage(errorMessage);
      }

    } catch (error) {
      document.getElementById('signbtn').disabled = false;
      document.getElementById('signbtn').innerHTML = 'Sign In';
      console.error("An error occurred:", error);
      const errorMessage = "An error occurred. Please try again.";
      setErrorMessage(errorMessage);
    }
  }

  async function handleSubsequentRequests(token) {
    try {
      const config = await getConfig();
      // const result = await axios.post(`${config.API_BASE_URL}/Login`,item);
      const response = await axios.get(`${config.API_BASE_URL}/getUserData`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const userLogin = response.data.userlogin;
      setRole(userLogin.role);
      localStorage.setItem("user-info", JSON.stringify(userLogin));

      if (userLogin.role === 1) {
        navigate("/Admin");
      } else {
        navigate("/Add");
      }
    } catch (error) {
      console.error('Subsequent request error:', error);
    } finally {
      document.getElementById('signbtn').disabled = false;
      document.getElementById('signbtn').innerHTML = 'Sign In';
    }
  }

  return (
    <>
      <Helmet>
        <title>{pagetitle}</title>
      </Helmet>
      <Header />
      <div className="col-sm-5 offset-sm-4 border mt-5 shadow">
        <h1>Login Here</h1>
        <hr />
        <div className='col-sm-6 offset-sm-3'>
          <input
            type="email"
            value={email}
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
              clearErrorMessage();
            }}
            className="form-control"
            placeholder="Enter Your Email"
            required
          />
          <br />
          <input
            type="password"
            value={password}
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
              clearErrorMessage();
            }}
            className="form-control"
            placeholder="Enter Your Password"
            required
          />
          <br />
          {errorMessage && <div className="error-message text-danger">{errorMessage}</div>}
          <button id="signbtn" onClick={signIn} className="btn btn-success mb-3">Sign In</button>
        </div>
      </div>
    </>
  );
}

export default Login;
