import Header from "./Header";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import swal from "sweetalert";


function AddProduct() {

  useEffect(() => {
    setPagename('Add violations')
    if (!localStorage.getItem('access_token'))//user is logged in so when user try to navigate using a get url typing it redirect it to the /Add url or add page
    {
      navigate("/Login");
    }
 
  }, [])

  // const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  // const [image, setImage] = useState("");
  const [pagename, setPagename] = useState("");
  const [error, setError] = useState([]);
  const [localstorage,setLocalstorage] = useState("");
  const navigate = useNavigate();
 

 const getConfig = async () => {
    const response = await fetch('/config.json');
    const config = await response.json();
    return config;
  };
  async function AddItem() {
    
  // if (localStorage.getItem('user-info')){

    try {
      console.warn(description, price)
      const formData = new FormData();
      // formData.append('name', name);
      formData.append('description', description);
      formData.append('License_plate', price);
      // formData.append('image', image);

      document.getElementById('addbtn').disabled = true
      document.getElementById('addbtn').innerHTML = 'Reporting..'

      const token = JSON.parse(localStorage.getItem('access_token'));

      const config = await getConfig();
  
      const response = await axios.post(`${config.API_BASE_URL}/AddFlagged`, formData,{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
     });
      console.warn(response.data)
      if (response.data.status === 200) {
        // alert('Product added successfully!')
        swal({
          title: "Success",
          text: "Issue Reported Successfully!",
          icon: "success",
          button: "OK",
        });
        // window.location.reload();refresh the entire page
        // setName('')
        setDescription('')
        setPrice('')
        // setImage('')
        setError('')
        // document.getElementById('myimage').value = '';//set the html element input to null
      }
      else if(response.data.status === 500){
        swal({
          title: "Failed",
          text: "Failed to add the item else!",
          icon: "error",
          button: "OK",
        });
        // window.location.reload();refresh the entire page
        // setName('')
        setDescription('')
        setPrice('')
        // setImage('')
        // setError('')
        document.getElementById('myimage').value = '';
      }
      else {
        const error_list = response.data.validate_err
        setError(error_list)
      }

    }
    catch (error) {
      // alert('catch Error while adding the data!!')
      console.error(error)
      swal({
        title: "Failed",
        text: "Failed to add the item catch!!",
        icon: "error",
        buttons: {
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
            dangerMode: true,
          }
        },
        html: true
      });
    }
    document.getElementById('addbtn').disabled = false
    document.getElementById('addbtn').innerHTML = 'Report'
  // else{
  //   navigate("/Login");
  //  }
  }

  return (
    <>
      <Helmet>
        <title>{pagename}</title>
      </Helmet>

      <Header />

      <div className="col-sm-5 offset-sm-4 border mt-5 shadow">
        <h1>Report Your Issue</h1>
        <hr></hr>
        <div className=' col-sm-6 offset-sm-3'>

        <input
            type="text"
            value={price}
            name="price"
            onChange={(e) => {
              setPrice(e.target.value)

            }}
            min="1"
            className="form-control"
            placeholder="Enter license plate"
            required />
            {error.License_plate && (
            <div className="text-danger">{error.License_plate}</div>
          )}
          <br />

          {/* <input
            type="text"
            value={name}
            name="name"

            onChange={(e) => {
              setName(e.target.value)
            }}

            className="form-control"
            placeholder="Enter violation type"
            required /> */}
          {/* {error.name && (
            <div className="text-danger">{error.name}</div>
          )} */}
          
          {/* Display if any validaton error occurd */}
          <br />

          <input
            type="text"
            value={description}
            name="description"
            onChange={(e) => {
              setDescription(e.target.value)

            }}
            className="form-control"
            placeholder="Enter violation Description"
            required />
             {error.description && (
            <div className="text-danger">{error.description}</div>
          )}
          <br />
          <button id="addbtn" onClick={AddItem} className="btn btn-success mb-3">Report</button>
        </div>
      </div>
    </>
  );
}
export default AddProduct