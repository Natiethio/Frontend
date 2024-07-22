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
import api from '../api/Api';

function Flagged() {

   const [products, setProducts] = useState([]);
   const [searchdata, setSearchdata] = useState('');
   const [loading, setLoading] = useState(true);
   const [pagetitle, setPagetitle] = useState('');
   const navigate = useNavigate();

   useEffect(() => {// calls the function only once when this page is landed
      if (!localStorage.getItem('access_token'))//user is logged in so when user tries to navigate using a get URL typing it redirects it to the /Add URL or add page
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
         const response = await fetch(`${config.API_BASE_URL}/Flagged`, {
            headers: {
               'Authorization': `Bearer ${token}`,
            },
         });
         if (response.ok) {
            const data = await response.json();// used to retrieve the JSON data from the response body
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
               const token = JSON.parse(localStorage.getItem('access_token'));
               const config = await getConfig();
               const response = await axios.delete(`${config.API_BASE_URL}/DeleteFlagged/${id}`, {
                  headers: {
                     'Authorization': `Bearer ${token}`,
                  },
               });

               console.log(response.data);
               if (response.data.status === 200) {
                  Swal.fire({
                     title: "Deleted!",
                     text: "Violation has been deleted.",
                     icon: "success",
                  }).then(() => {
                     fetchProducts();
                  });
               } else {
                  Swal.fire("Oops!", "An error occurred while deleting the violation.", "error");
               }

            } catch (error) {
               console.error("Error deleting product:", error);
               Swal.fire("Oops!", "An error occurred while deleting the violation.", "error");
            }
         }
      } else {
         navigate('/Login');
      }
   }

   async function Search() {
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
            const response = await axios.get(`${config.API_BASE_URL}/SearchFlagged/${searchdata}`, {
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
               console.error('Catch request error', error);
               console.error("Error fetching products:", response.status);
               toast.error('Error fetching products!', {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
               });
            });

         } catch (error) {
            console.error("Error fetching products:", error);
            toast.error('Error while searching!', {
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

      } else {
         navigate('/Login');
      }
   }

   return (
      <>
         <Helmet>
            <title>{pagetitle}</title>
         </Helmet>

         <Header />

         <div>
            <h1 className="pt-4">Flagged List</h1>
            <Container>
               <div className="input-group mb-3">
                  <input type="text" name="name" className="form-control" value={searchdata} placeholder="Search here by license..." onChange={(e) => setSearchdata(e.target.value)} required />
                  <div className="input-group-append">
                     <button onClick={Search} className="btn btn-outline-primary">Search</button>
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
                        <th>Reported by</th>
                        <th>Phone</th>
                        <th>License plate</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr>
                           <td colSpan="7" className="text-center">
                              <Spinner animation="border" /> Loading... 
                           </td>
                        </tr>
                     ) : (
                        products.map((product) => (//it is like @foreach($products as $product)
                           <tr key={product.id}> {/* Add key prop to the parent element */}
                              <td><p>{product.flagged_by}</p></td>
                              <td><p>{product.phone}</p></td>
                              <td><p>{product.license_plate}</p></td>
                              <td><p>{product.description}</p></td>
                              <td><p>{product.image}</p></td>
                              {/* <td><p>{product.status}</p></td> */}
                              <td>
                              <td>
                             <div 
                               style={{
                                 width: '90px', 
                                 height: '30px', 
                                 backgroundColor: product.status === 0 ? 'red' : 'green',
                                 color: 'white',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 borderRadius: '4px'
                               }}>
                               {product.status === 0 ? 'Not Found' : 'Found'}
                                                        </div>
                             </td>
                            </td>

                              <td className="d-flex gap-2">
                                 <button id="delbtn" onClick={() => deleteproduct(product.id)} className="btn btn-danger">Delete</button>
                                 {/* <Link to={`/UpdateFlagged/${product.id}`}>
                                    <span className="btn btn-success">Update</span>
                                 </Link> */}
                                 {product.status === 0 ? (
                                    <button id="smsbtn" className="btn btn-primary" disabled>SMS</button>
                                 ) : (
                                    <Link to={`/MessageFlagged/${product.id}`}>
                                       <span id="smsbtn" className="btn btn-primary">SMS</span>
                                    </Link>
                                 )}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </Table>
            </Container>
         </div>
      </>
   );
}
export default Flagged;
