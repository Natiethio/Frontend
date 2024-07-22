import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Button} from 'react-bootstrap'
import Header from './Components/Header'
import Login from './Components/Login'
import Register from './Components/Register'
import AddProduct from './Components/AddProduct'
import AddTraffic from './Components/AddTraffic'
import UpdateProduct from './Components/UpdateProduct'
import UpdateProductflagged from './Components/UpdateProductflagged'
import Protected from './Components/Protected'
import Home from './Components/Home'
import Admin from './Components/Admin'
import Flagged from './Components/Flagged'
import './App.css'
import Send_Sms from './Components/Send_Sms';
import Send_SmsFlagged from './Components/Send_SmsFlagged';
function App() {
  return (
    <div className='App'>
        <Router>
            <Routes>
               <Route path="/" element= {<Protected Cmp = {Home}/>}/>
               <Route path="/Admin" element= {<Protected Cmp = {Admin}/>}/>
               <Route path="/Flagged" element= {<Protected Cmp = {Flagged}/>}/>
               <Route path="/Login" element={<Login/>}/>
               <Route path="/Register" element={<Register/>}/>
               {/* <Route path="/Register" element={<Register/>}/> */}
               <Route path="/Add" element= {<Protected Cmp = {AddProduct}/>}/>
               <Route path="/AddTraffic" element= {<Protected Cmp = {AddTraffic}/>}/> {/*send AddProduct element to Protected element as a property*/}
               <Route path="/Update/:id" element={<Protected Cmp = {UpdateProduct}/>}/> {/*send UpdateProduct element to Protected element as a property*/}
               <Route path="/UpdateFlagged/:id" element={<Protected Cmp = {UpdateProductflagged}/>}/> {/*send UpdateProduct element to Protected element as a property*/}
               <Route path="/Message/:id" element={<Protected Cmp = {Send_Sms}/>}/> {/*send UpdateProduct element to Protected element as a property*/}
               <Route path="/MessageFlagged/:id" element={<Protected Cmp = {Send_SmsFlagged}/>}/> 
            </Routes>
          </Router>
      </div>
    
  );
}
export default App;
