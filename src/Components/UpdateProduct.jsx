import Header from "./Header";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import '../css/Home.css';


function UpdateProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagetitle, setPagetitle] = useState('');
  const [error, setError] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('access_token')){
      setPagetitle('Update violation')
      
      fetchData();
    }
    else{
      navigate('/Login')
    }
   
  }, [id]);

  const getConfig = async () => {
    const response = await fetch('/config.json');
    const config = await response.json();
    return config;
  };

  const fetchData = async () => {

    try {
      const token = JSON.parse(localStorage.getItem('access_token'));
      //const response = await fetch(`http://127.0.0.1:8000/api/GetProduct/${id}`);
      const config = await getConfig();
      const response = await axios.get(`${config.API_BASE_URL}/GetProduct/${id}`, {
         headers: {
            'Authorization': `Bearer ${token}`,
         },
      });
      // const response = await axios.get(`http://127.0.0.1:8000/api/GetProduct/${id}`,{
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   }
      // });
      const result = response.data;
      setProduct(result.product);
      setName(result.product.violation_type);
      setDescription(result.product.description);
      setPrice(result.product.License_plate);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    // if (localStorage.getItem('access_token')){

    if (
      name === product.violation_type &&
      description === product.description &&
      price === product.License_plate &&
      !image
    ) {
      setError('')
      // alert("No changes made to the product.");
      swal({
        title: "Change Required",
        text: "No changes made to this violation",
        icon: "info",
        buttons: {
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-info",
            closeModal: true,
            dangerMode: true,
          }
        },
        html: true
      });
      return;
    }
    try {
      document.getElementById('updbtn').disabled = true
      document.getElementById('updbtn').innerHTML = 'Updating..'

      const formData = new FormData();
      formData.append("violation_type", name);
      formData.append("description", description);
      formData.append("License_plate", price);
      formData.append("image", image);
      console.warn(formData)

      //Using Fetch API

      // const response = await fetch(`http://127.0.0.1:8000/api/UpdateProduct/${id}`, {
      //   method: "POST",
      //   body: formData,
      // });
      const token = JSON.parse(localStorage.getItem('access_token'));
      const config = await getConfig();
      const response = await axios.post(`${config.API_BASE_URL}/UpdateProduct/${id}`, formData, {
      headers: {
      'Authorization': `Bearer ${token}`,
      },
    })
      // const response = await axios.post(`http://127.0.0.1:8000/api/UpdateProduct/${id}`, formData,{
      //   headers: {
      //     'Authorization': `Bearer ${token}`,//sending the token with Bearer header to autorize the request if the token doesnt match it will be un autorized
      //   },
      // })
      if (response.data.status === 200) {
        const result = response.data
        console.log(result);
        fetchData();
        setError('')
        // alert("Product Updated Successfully!!");
        swal({
          title: "Success",
          text: "Violation Updated Successfully!!",
          icon: "success",
          buttons: {
            confirm: {
              text: "OK",
              value: true,
              visible: true,
              className: "btn btn-success",
              closeModal: true,
              dangerMode: true,
            }
          },
          html: true
        });
      }
      else {
        const error_list = response.data.validate_err
        setError(error_list)
      }


      document.getElementById('updbtn').disabled = false
      document.getElementById('updbtn').innerHTML = 'Update'

    } catch (error) {
      console.error(error);
      // alert("Product Update Failed!!");
      swal({
        title: "Failed",
        text: "Failed to update the item!!",
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
  // }
  // else{
  //   navigate('/Login')
  // }
  };

  return (
    <>
      <Helmet>
        <title>{pagetitle}</title>
      </Helmet>
      <Header />
      <div className="col-sm-5 offset-sm-4 border mt-5 shadow">
        <h1>Update violation </h1>
        <hr></hr>

        {
          loading ? (
            <div className=' col-sm-6 offset-sm-5'>
              <tr className="">
                <td colSpan="5" className="text-center offset-sm-3">
                  <Spinner animation="border" /> Loading...
                </td>
              </tr>
            </div>
          ) : (product && (
            <div className=' col-sm-6 offset-sm-3'>
              <input
                type="text"
                name="name"
                value={name}
                className="form-control"
                placeholder="Enter violation type"
                required
                onChange={(e) => setName(e.target.value)}
              />
              {error.violation_type && (
                <div className="text-danger">{error.violation_type}</div>
              )}
              <br />

              <input
                type="text"
                name="description"
                value={description}
                className="form-control"
                placeholder="Enter violation Description"
                required
                onChange={(e) => setDescription(e.target.value)}
              />
              {error.description && (
                <div className="text-danger">{error.description}</div>
              )}
              <br />

              <input
                type="text"
                value={price}
                name="price"
                min="1"
                className="form-control"
                placeholder="Enter violatated car licence plate"
                required
                onChange={(e) => setPrice(e.target.value)}
              />
              {error.License_plate && (
                <div className="text-danger">{error.License_plate}</div>
              )}
              <br />

              {/* <input
                type="file"
                name="image"
                className="form-control"
                placeholder="tracced car Image"
                required
                onChange={(e) => setImage(e.target.files[0])}
              />
              {error.image && (
                <div className="text-danger">{error.image}</div>
              )}
              <br/> */}

              {/* <img className="image-update" src={`http://localhost:8000/products/${product.image}`} alt={product.violation_type} /><br /><br /> */}
              <img className="image-update" src={`http://192.168.234.199:8000/violation/${product.image}`}
                                           alt={product.violation_type} /> <br /><br />
              
              <button id="updbtn" onClick={handleUpdate} className="btn btn-success mb-3">Update</button>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default UpdateProduct;