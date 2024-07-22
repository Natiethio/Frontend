import Header from "./Header";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import swal from "sweetalert";

function AddTraffic() {

  useEffect(() => {
    setPagename('Add Traffic')
    fetchData();
    if (!localStorage.getItem('access_token'))//user is logged in so when user try to navigate using a get url typing it redirect it to the /Add url or add page
    {
      navigate("/Login");

    }
  }, [])

//   useEffect(() => {// calles the function only once when this page landed
//     if (!localStorage.getItem('access_token'))//user is logged in so when user try to navigate using a get url typing it redirect it to the /Add url or add page
//     {
//        navigate("/Login");
//     }
//     setPagetitle('Admin')
//     fetchProducts();
//  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pagename, setPagename] = useState("");
  const [location, setLocation] = useState("");
  const [locationtraffic, setLocationTraffic] = useState([]);
  const [error, setError] = useState([]);
  // const [localstorage,setLocalstorage] = useState("");
  const navigate = useNavigate();
 
  
  // async function LocationTraffic() {


  // }
  const getConfig = async () => {
    const response = await fetch('/config.json');
    const config = await response.json();
    return config;
  };
  const fetchData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('access_token'));
      const config = await getConfig();
      // const response = await axios.get(`${config.API_BASE_URL}/GetProduct/${id}`
      const response = await axios.get(`${config.API_BASE_URL}/FindLocation`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const result = response.data;
      console.error(result);
      setLocationTraffic(result);
      //  if (response.ok) {
      //     const data = await response.json();// used to retrive the JSON data from the response body
      //     setLocationTraffic(data);
      //     console.log(data);
      //  } else {
      //     console.error("Error fetching location e:", response.status);
      //  }
    } catch (error) {
       console.error("Error fetching location c:", error);
    };
  };
  // async function LocationTraffic() {
  //   try {
  //      const token = JSON.parse(localStorage.getItem('access_token'));
  //      const config = await getConfig();

  //      const response = await axios.get(`${config.API_BASE_URL}/FindLocation`, {
  //         headers: {
  //            'Authorization': `Bearer ${token}`,
  //         },
  //      });
  //      if (response.ok) {
  //         const data = await response.json();// used to retrive the JSON data from the response body
  //         setLocationTraffic(data);
  //      } else {
  //         console.error("Error fetching location:", response.status);
  //      }
  //   } catch (error) {
  //      console.error("Error fetching location:", error);
  //   }
  //   // finally {
  //   //    setLoading(false);
  //   // }
  // }
  
  async function AddItem() {
    
  // if (localStorage.getItem('user-info')){

    try {
      // console.warn(description, price)
      const formData = new FormData();
      // formData.append('name', name);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('location', location);

      document.getElementById('addbtn').disabled = true
      document.getElementById('addbtn').innerHTML = 'Adding..'

      const token = JSON.parse(localStorage.getItem('access_token'));

      const config = await getConfig();
      console.error(formData)
      const response = await axios.post(`${config.API_BASE_URL}/AddTraffic`,formData,{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
});
      console.warn(response.data)
      if (response.data.status === 200) {
        // alert('Product added successfully!')
        swal({
          title: "Success",
          text: "Traffic added successfully!",
          icon: "success",
          button: "OK",
        });
        // window.location.reload();refresh the entire page
        // setName('')
        setName('')
        setPhone('')
        setLocation('')
        // setLocation('')
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
        setName('')
        setPhone('')
        // setLocation('')
        // setError('')
        // document.getElementById('myimage').value = '';
      }
      else {
        const error_list = response.data.validate_err
        setError(error_list)
      }

    }
    catch (error) {
      console.log(error)
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
    document.getElementById('addbtn').innerHTML = 'Add Traffic'
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
        <h1>Register Traffic Police</h1>
        <hr></hr>
        <div className=' col-sm-6 offset-sm-3'>

        <input
            type="text"
            // value={name}
            name="name"
            onChange={(e) => {
              setName(e.target.value)

            }}
            min="1"
            className="form-control"
            placeholder="Enter Traffic Name"
            required />
            {error.name && (
            <div className="text-danger">{error.name}</div>
          )}
          <br />

          <input
            type="text"
            // value={phone}
            name="phone"
            onChange={(e) => {
              setPhone(e.target.value)

            }}
            className="form-control"
            placeholder="Enter Phone Number"
            required />
             {error.phone && (
            <div className="text-danger">{error.phone}</div>
          )}
          <br />

          {/* <input
            type="text"
            value={location}
            name="location"
            onChange={(e) => {
              setLocation(e.target.value)

            }}
            className="form-control"
            placeholder="Enter Location"
            required />
             {error.location && (
            <div className="text-danger">{error.location}</div>
          )}
          <br /> */}
           <select
              name="location"
              className="form-control"
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">Select Location</option>
              {locationtraffic.map((loc) => (
                <option key={loc.id} value={loc.location}>{loc.location}</option>
              ))}
            </select>

          <button id="addbtn" onClick={AddItem} className="btn btn-success mb-3 mt-3">Add Traffic</button>
        </div>
      </div>
    </>
  );
}
export default AddTraffic