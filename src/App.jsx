import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Button} from 'react-bootstrap'
import Header from './Components/Header'
import Login from './Components/Login'
import Register from './Components/Register'
import AddProduct from './Components/AddProduct'
import UpdateProduct from './Components/UpdateProduct'
import Protected from './Components/Protected'
import Home from './Components/Home'
import './App.css'
function App() {
  return (
    <div className='App'>
        <Router>
            <Routes>
               <Route path="/" element= {<Protected Cmp = {Home}/>}/>
               <Route path="/Login" element={<Login/>}/>
               <Route path="/Register" element={<Register/>}/>
               <Route path="/Add" element= {<Protected Cmp = {AddProduct}/>}/> {/*send AddProduct element to Protected element as a property*/}
               <Route path="/Update/:id" element={<Protected Cmp = {UpdateProduct}/>}/> {/*send UpdateProduct element to Protected element as a property*/}
            </Routes>
          </Router>
      </div>
    
  );
}
export default App;
