import { useState, useEffect } from 'react';
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
// import axios from '../api/axios';
function Login() {
  const [pagetitle,setPagetitle]=useState('')
   useEffect(() => {
    setPagetitle('Login')
    if (localStorage.getItem('access_token'))//user is logged in so when user try to navigate using a get url typing it redirect it to the /Add url or add page
    {
      navigate("/");
    }
  }, [])

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const clearErrorMessage = () => {
    setErrorMessage(""); // Clear the error message
  };
  
  async function signIn() {
    document.getElementById('signbtn').disabled=true
    document.getElementById('signbtn').innerHTML='Signing In...'
    
 
    try {
      if(email === '' || password === ''){
        setErrorMessage("Please fill the required inputs")
        document.getElementById('signbtn').disabled=false
        document.getElementById('signbtn').innerHTML='Sign In'
        return;
      }

      let item = { email, password };
      console.warn(item);
      
      //Using Axios
       const result = await axios.post("http://localhost:8000/api/Login", item);

        if(result.data.status === 200){
            const respones = result.data
            console.warn('result', respones);
            localStorage.setItem('access_token', JSON.stringify(result.data.token));
            // localStorage.setItem("user-info", JSON.stringify(result.data.userlogin));
            // navigate("/");
            handleSubsequentRequests();
      }
   
    else {
      // Handle incorrect credentials
      // const errorResponse =await result.json();for fetch API
      document.getElementById('signbtn').disabled=false
      document.getElementById('signbtn').innerHTML='Sign In'
      const errorResponse = result.data
      const errorMessage = errorResponse.error || "An error occurred.";
      console.error(errorMessage);
      setErrorMessage(errorMessage);
    } 
    
  } catch (error) {
      document.getElementById('signbtn').disabled=false
      document.getElementById('signbtn').innerHTML='Sign In'
      console.error("An error occurred:", error);
      const errorMessage = "An catch error occurred. Please try again.";
      setErrorMessage(errorMessage); // Set the error message in state
   }
  //  document.getElementById('signbtn').disabled=false
  //  document.getElementById('signbtn').innerHTML='Sign In'
 }
 async function handleSubsequentRequests() {
  //sub sequent request to Autorize the autenticated user
  const token = JSON.parse(localStorage.getItem('access_token'));

  await axios.get('http://localhost:8000/api/getUserData', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
     localStorage.setItem("user-info", JSON.stringify(response.data.userlogin));
    })
    .catch(error => {
     console.error('Subsequent request error')
    });
    document.getElementById('signbtn').disabled=true
    document.getElementById('signbtn').innerHTML='Signing In...'

  // Redirect to the desired page if needed
  navigate("/");
};
  return (
    <>
     <Helmet>
        <title>{pagetitle}</title>
      </Helmet>
    <Header/>
    <div className="col-sm-5 offset-sm-4 border mt-5 shadow">
      <h1>Login Here</h1>
      <hr></hr>
      <div className=' col-sm-6 offset-sm-3 '>
       
        <input 
        type="email" 
        value={email} 
        name="email" 
        onChange={(e) => {
           setEmail(e.target.value)
           clearErrorMessage();
          }}
        className="form-control" 
        placeholder="Enter Your Email" required/>
         
        <br/>
        <input 
        type="password" 
        value={password} 
        name="password" 
        onChange={(e) => {
          setPassword(e.target.value)
          clearErrorMessage();
          }} 
          className="form-control" 
          placeholder="Enter Your Password" 
          required/>
            
          <br/>
        {errorMessage && <div className="error-message text-danger">{errorMessage}</div>}
        <button id="signbtn" onClick={signIn} className="btn btn-success mb-3">Sign In</button>
        {/* <button id="signbtn" type='submit' className="btn btn-success mb-3">Sign In</button> */}
       
      </div>
    </div>
    </>
  );
}
export default Login