import React, { useState, useEffect } from 'react';
import Header from "./Header";
import { useNavigate } from 'react-router-dom';//you can't use useHistory Hook b/c this react app is installed using vite
import { Helmet } from 'react-helmet';
import axios from 'axios';

function Register() {
  const [pagetitle, setPagetitle] = useState('')
  useEffect(() => { //By using the useEffect hook with an empty dependency array, you ensure that the conditional check is only performed once, after the initial render of the component
    setPagetitle('Register')
    if (localStorage.getItem('user-info'))//user is logged in so when user try to navigate using a get url typing it redirect it to the /Add url or add page
    {
      navigate("/");
    }
  }, [])

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error ,setError] = useState([]);
  const navigate = useNavigate();

  const clearErrorMessage = () => {
    setErrorMessage(""); //Clear the error message
    // setError([]);
  };

  async function signUp() {//we use async method because we need to use await inside our function to resolve the promise
    document.getElementById('signupbtn').disabled=true
    document.getElementById('signupbtn').innerHTML='Signing Up...'
    try {

      if (password !== confirmpassword) {
        setErrorMessage("Passwords do not match.");
        setError([]);
        document.getElementById('signupbtn').disabled=false
        document.getElementById('signupbtn').innerHTML='Register'
        return;
      }

      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("confirmpassword", confirmpassword);
    
      const response = await axios.post('http://localhost:8000/api/Register', formData)
      
      if (response.data.status === 200) {
            const result = response.data.user;//It awaits the response body to be parsed as JSON using result.json() extract the json from the response body
            console.warn('result', result);
            localStorage.setItem("user-info", JSON.stringify(response.data.user));//store the result to the local storge of the browser using key "user-info"  JSON.stringfy(item) used when we javascript object or value  serializes it into a JSON-formatted string.
            navigate("/");
      }
      else{
        const errorList = response.data.validate_err;
        setError(errorList);
      }
    } catch (error) {
        console.warn("An error occurreds:", error);
        const errorMessage = "An catch occurred. Please try again.";
        setErrorMessage(errorMessage);
      }
      document.getElementById('signupbtn').disabled=false
      document.getElementById('signupbtn').innerHTML='Register'
  }

  return (
    <>
      <Helmet>
        <title>{pagetitle}</title>
      </Helmet>
      <Header />
      <div className="col-sm-5 offset-sm-4 border mt-5 shadow">
        <h1>Register Here</h1>
        <hr></hr>
        <div className=' col-sm-6 offset-sm-3 ' >

          <input
            type="text"
            value={firstname}
            name="firstname"
            onChange={(e) => {
              setFirstname(e.target.value)
              clearErrorMessage();
            }}
            className="form-control"
            placeholder="Enter Your First Name"
            required />
             {error.firstname && (
                <div className="text-danger">{error.firstname}</div>
              )}
          <br />

          <input
            type="text"
            value={lastname}
            name="lastname"
            onChange={(e) => {
              setLastname(e.target.value)
              clearErrorMessage();
            }}
            className="form-control"
            placeholder="Enter Your Last Name"
            required />
             {error.lastname && (
                <div className="text-danger">{error.lastname}</div>
              )}
          <br />

          <input
            type="email"
            value={email}
            name="email"
            onChange={(e) => {
              setEmail(e.target.value)
              clearErrorMessage();
            }}
            className="form-control"
            placeholder="Enter Your Email"
            required />
             {error.email && (
                <div className="text-danger">{error.email}</div>
              )}
          <br />

          <input
            type="number"
            value={phone}
            name="phone"
            onChange={(e) => {
              setPhone(e.target.value)
              clearErrorMessage();
            }}
            className="form-control"
            placeholder="Enter Your phone"
            required />
            {error.phone && (
                <div className="text-danger">{error.phone}</div>
              )}
          <br />

          <input
            type="password"
            value={password}
            name="password"
            onChange={(e) => {
              setPassword(e.target.value)
              clearErrorMessage()
            }}
            className="form-control"
            placeholder="Enter Your Password"
            required />
             {error.password && (
                <div className="text-danger">{error.password}</div>
              )}
          <br />

          <input
            type="password"
            value={confirmpassword}
            name="confirmpassword"
            onChange={(e) => {
              setConfirmpassword(e.target.value)
              clearErrorMessage();
            }}
            className="form-control"
            placeholder="Confirm Your Password"
            required />
              {error.confirmpassword && (
                <div className="text-danger">{error.confirmpassword}</div>
              )}
          <br />
          {errorMessage && <div className="error-message text-danger">{errorMessage}</div>}
          <button id='signupbtn' onClick={signUp} className="btn btn-success mb-3">Register</button>

        </div>
      </div>
    </>
  );
}

export default Register;