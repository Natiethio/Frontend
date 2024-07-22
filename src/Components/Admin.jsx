import Header from "./Header";
import { useState, useEffect } from "react";
import { Container, Table, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../css/Home.css';
import '../css/ReactToastify.css';
import api from '../api/Api'
function Admin() {

   const [products, setProducts] = useState([]);
   const [searchdata, setSearchdata] = useState('');
   const [loading, setLoading] = useState(true);
   const [pagetitle, setPagetitle] = useState('');
   const navigate = useNavigate();

   useEffect(() => {// calles the function only once when this page landed
      if (!localStorage.getItem('access_token'))//user is logged in so when user try to navigate using a get url typing it redirect it to the /Add url or add page
      {
         navigate("/Login");
      }
      setPagetitle('Admin')
      fetchProducts();
   }, []);

   const getConfig = async () => {
      const response = await fetch('/config.json');
      const config = await response.json();
      return config;
    };
  

   async function fetchProducts() {
      try {
         const token = JSON.parse(localStorage.getItem('access_token'));
         const config = await getConfig();
         const response = await fetch(`${config.API_BASE_URL}/Productlist`, {
            headers: {
               'Authorization': `Bearer ${token}`,
            },
         });
         if (response.ok) {
            const data = await response.json();// used to retrive the JSON data from the response body
            setProducts(data);
         } else {
            console.error("Error fetching products:", response.status);
         }
      } catch (error) {
         console.error("Error fetching products:", error);
      }
      finally {
         setLoading(false);
      }
   }

   // async function deleteproduct(id) {
   //    document.getElementById('delbtn').disabled=true
   //    document.getElementById('delbtn').innerHTML='Deleting..'

   //    let result = await fetch("http://127.0.0.1:8000/api/Delete/" + id, {
   //       method: "DELETE"
   //    });
   //    result = await result.json();
   //    console.warn(result);
   //    alert('Product deleted successfully!!')
   //    document.getElementById('delbtn').disabled=false
   //    document.getElementById('delbtn').innerHTML='Delete'

   //    fetchProducts();
   // }
   async function deleteproduct(id) {
      if (localStorage.getItem('access_token')) {

         const confirmResult = await Swal.fire({
            title: "Delete this violation",
            text: "Are you sure you want to clear this history?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete!",
         });

         if (confirmResult.isConfirmed) {
            // User confirmed the deletion
            
            try {
               const config = await getConfig();
               const token = JSON.parse(localStorage.getItem('access_token'));
               const response = await axios.delete(`${config.API_BASE_URL}/Delete/${id}`, {
                  headers: {
                     'Authorization': `Bearer ${token}`,
                  },
               });

               // let response = await fetch("http://127.0.0.1:8000/api/Delete/" + id, {
               //    method: "DELETE",
               //    headers: {
               //       'Authorization': `Bearer ${token}`,
               //     },
               // });
               console.log(response.data);
               if (response.data.status === 200) {
                  Swal.fire({
                     title: "Deleted!",
                     text: "violation  has been deleted.",
                     icon: "success",
                  }).then(() => {
                     fetchProducts();
                  });
               }
               else {
                  Swal.fire("Oops!", "An error occurred while deleting the violation.", "error");
               }

            } catch (error) {
               console.error("Error deleting product:", error);
               Swal.fire("Oops!", "An error occurred while deleting the violation.", "error");
            }
         }
      }
      else {
         navigate('/Login')
      }
   }

   async function Search() {
      // let result = await fetch("http://127.0.0.1:8000/api/Search/" + searchdata, {
      //    method: "POST"
      // });
      // result = await result.json();
      // console.warn(result);
      // alert('Product deleted successfully!!')
      // fetchProducts();
      if (localStorage.getItem('access_token')) {
         if (searchdata === '') {
            toast.error('No search data entered!!', {
               position: "top-right",
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "colored",
            });
            return;
         }
         try {
            const token = JSON.parse(localStorage.getItem('access_token'));
           
             const config = await getConfig();
           
            // let response = await axios.post(`${config.API_BASE_URL}/Search/${searchdata}`)
            const response = await axios.get(`${config.API_BASE_URL}/Search/${searchdata}`, {
               headers: {
                  'Authorization': `Bearer ${token}`,
               },
            })
            .then(response => {
               if(response){
                  setProducts(response.data.result);
               }
               else{
                  toast.error('No Result Found!!', {
                     position: "top-right",
                     autoClose: 3000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                     theme: "colored",
                  });
               }

             })
             .catch(error => {
               console.error('Catch request error',error)
               console.error("Error fetching products:", result.status);
               toast.error('Else Error!!', {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
               });
             })

         } catch (error) {
            console.error("Error fetching products:", error);
            toast("Error while searching!");
            // alert('error catch');
         }

      }
      else {
         navigate('/Login')
      }
   }

   return (
      <>
         <Helmet>
            <title>{pagetitle}</title>
         </Helmet>

         <Header />

         <div>

            <h1 className="pt-4">violation List</h1>
            <Container>
               <div class="input-group mb-3">
                  <input type="text" name="name" class="form-control" value={searchdata} placeholder="Search here by licence.." onChange={(e) => setSearchdata(e.target.value)} required />
                  <div class="input-group-append">
                     <button onClick={Search} class="btn btn-outline-primary">Search</button>
                     <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                     />
                  </div>
               </div>

               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>violation type</th>
                        <th>Description</th>
                        <th>license plate</th>
                        <th>Image</th>
                        <th>Actions</th>
                     </tr>
                  </thead>
                  <tbody>

                     {
                        loading ? (
                           <tr>
                              <td colSpan="5" className="text-center">
                                 <Spinner animation="border" /> Loading... 
                              </td>
                           </tr>
                        ) : (

                           products.map((product) => (//it is like @foreach($products as $product)
                              <tr key={product.id}> {/* Add key prop to the parent element */}
                                 <td><h6>{product.violation_type}</h6></td>
                                 <td><p>{product.description}</p></td>
                                 <td><p>{product.License_plate} <span className="text-warning">AA</span></p></td>
                                 <td>
                                    <div className="image-container">
                                       <img src={`http://192.168.0.8:8000/products/${product.image}`}
                                           alt={product.name} /> 
                                    </div>
                                 </td>
                                 <td className="d-flex gap-2">
                                    <button id="delbtn" onClick={() => deleteproduct(product.id)} className="btn btn-danger">Delete</button>
                                    <Link to={`/Update/${product.id}`}>
                                       <span className="btn btn-success">Update</span>
                                    </Link>
                                    <Link to={`/Message/${product.id}`}>
                                       <span className="btn btn-primary">SMS</span>
                                    </Link>
                                 </td>
                              </tr>
                            )
                           ))
                     }
                  </tbody>               </Table>
            </Container>
         </div>
      </>
   );
}
export default Admin