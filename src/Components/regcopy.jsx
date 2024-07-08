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
  const [conpassword, setConpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error ,setError] = useState([]);
  const navigate = useNavigate();

  const clearErrorMessage = () => {
    setErrorMessage(""); //Clear the error message
  };

  async function signUp() {//we use async method because we need to use await inside our function to resolve the promise
    let item = { firstname, lastname, email, phone, password, conpassword };
    try {

      let result = await fetch("http://127.0.0.1:8000/api/Register", {//The await keyword is used to pause the execution of the function until the promise returned by the fetch() call is resolved If the response status of the request is successful (status code 200-299)
        method: 'POST',
        body: JSON.stringify(item),//json string used when an http request existes
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json',
        }
      });
     

        if (result.ok) {
          result = await result.json();//It awaits the response body to be parsed as JSON using result.json() extract the json from the response body
          console.warn('result', result);
          localStorage.setItem("user-info", JSON.stringify(result));//store the result to the local storge of the browser using key "user-info"  JSON.stringfy(item) used when we javascript object or value  serializes it into a JSON-formatted string.
          navigate("/");
        } else {
            const errorResponse = await result.json();
            const errorMessage = errorResponse.error || "else An error occurred.";
          
            console.warn(errorMessage);
          
            setErrorMessage(errorMessage);
        }
      } catch (error) {
        console.warn("An error occurred:", error);
        const errorMessage = "An error occurred. Please try again.";
        setErrorMessage(errorMessage);
      }
    //   if (response.data.status === 200) {
    //         result = response.data.user;//It awaits the response body to be parsed as JSON using result.json() extract the json from the response body
    //         console.warn('result', result);
    //         localStorage.setItem("user-info", JSON.stringify(response.data.user));//store the result to the local storge of the browser using key "user-info"  JSON.stringfy(item) used when we javascript object or value  serializes it into a JSON-formatted string.
    //         navigate("/");
    //   }
    //   else{
    //     error_list =response.data.validate_err
    //     errorMessage = response.data.error
    //     setErrorMessage(errorMessage);
    //     setError(error_list)
    //   }
    // } catch (error) {
    //     console.warn("An error occurreds:", error);
    //     const errorMessage = "An error occurred. Please try again.";
    //     setErrorMessage(errorMessage);
    //   }
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
          <br />

          <input
            type="password"
            value={conpassword}
            name="conpassword"
            onChange={(e) => {
              setConpassword(e.target.value)
              clearErrorMessage();
            }}
            className="form-control"
            placeholder="Confirm Your Password"
            required />
          <br />
          {errorMessage && <div className="error-message text-danger">{errorMessage}</div>}
          <button type onClick={signUp} className="btn btn-success mb-3">Sign Up</button>

        </div>
      </div>
    </>
  );
}

export default Register;