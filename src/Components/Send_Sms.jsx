import Header from "./Header";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import swal from "sweetalert";
import '../css/Home.css';

function Send_Sms() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState([]);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagetitle, setPagetitle] = useState('');
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setPagetitle('Send SMS');
      fetchData();
    } else {
      navigate('/Login');
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
      const config = await getConfig();
      // const response = await axios.get(`${config.API_BASE_URL}/GetProduct/${id}`
      const response = await axios.get(`${config.API_BASE_URL}/GetProduct/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const result = response.data;
      setProduct(result);
      setName(result.product.violation_type);
      setDescription(result.product.description);
      setPrice(result.product.License_plate);
      setLocation(result.location); // Assuming location is an array of objects with phone numbers
      console.log(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSms = async () => {
    try {
      document.getElementById('sendbtn').disabled = true;
      document.getElementById('sendbtn').innerHTML = 'Sending...';

      const formData = new FormData();
      formData.append("message", message);
      // formData.append("recipient_phone", recipientPhone);

      const token = JSON.parse(localStorage.getItem('access_token'));
      const config = await getConfig();
      // const response = await axios.get(`${config.API_BASE_URL}/GetProduct/${id}`
      // const response = await axios.get(`${config.API_BASE_URL}/GetProduct/${id}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   }
      // });
      
      const response = await axios.post(`${config.API_BASE_URL}/SendSms/${id}`, formData,{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log(response.data);
      if (response.data.status === 200) {
        swal({
          title: "Success",
          text: "Sent Successfully!",
          icon: "success",
          button: "OK",
        });
      } else if(response.data.status === 500) {
        swal({
          title: "Failed",
          text: "Failed Send SMS",
          icon: "error",
          button: "OK",
        });
      }

      document.getElementById('sendbtn').disabled = false;
      document.getElementById('sendbtn').innerHTML = 'Send';
    } catch (error) {
      console.error(error);
      console.error("catch error");
      toast.error("Failed to send SMS!!");
    }
  };

  return (
    <>
      <Helmet>
        <title>{pagetitle}</title>
      </Helmet>
      <Header />
      <div className="col-sm-5 offset-sm-4 border mt-5 shadow">
        <h1>Send SMS</h1>
        <hr />
        {loading ? (
          <div className='col-sm-6 offset-sm-5'>
            <Spinner animation="border" /> Loading...
          </div>
        ) : (product && (
          <div className='col-sm-6 offset-sm-3'>
            <input
              type="text"
              name="name"
              value={name}
              className="form-control"
              placeholder="Enter violation type"
              required
              onChange={(e) => setName(e.target.value)}
            />
            {error.name && (
              <div className="text-danger">{error.name}</div>
            )}
            <br />
            <input
              type="text"
              name="description"
              value={description}
              className="form-control"
              placeholder="Enter violation description"
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
              placeholder="Enter violated car license plate"
              required
              onChange={(e) => setPrice(e.target.value)}
            />
            {error.price && (
              <div className="text-danger">{error.price}</div>
            )}
            <br />
            <textarea
              name="message"
              className="form-control"
              placeholder="Enter your message"
              required
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <br />
            {/* <select
              name="recipient_phone"
              className="form-control"
              onChange={(e) => setRecipientPhone(e.target.value)}
              required
            >
              <option value="">Select Recipient Phone</option>
              {location.map((loc) => (
                <option key={loc.id} value={loc.phone}>{loc.phone}</option>
              ))}
            </select> */}
            <br />
            <button id="sendbtn" onClick={handleSendSms} className="btn btn-primary mb-3">Send</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Send_Sms;
