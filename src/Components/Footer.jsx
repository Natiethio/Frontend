import React from 'react'
import '../css/Footer.css'
const Footer = () => {
  return (
    <footer className='footer'>
      <div className="container">
        <div className="row2">
            <div className="footer-col">
                <div className="h4te">
                <h4>
                   Dashboard
                </h4>
                </div>
                <ul>
                    <li><a href="#">Home</a> </li>
                    <li><a href="#">Add Products</a> </li>
                    <li><a href="#">Contact us</a> </li>
                    <li><a href="#">About us</a> </li>
                </ul>
            </div>
            <div className="footer-col">
                <div className="h4te">
                <h4>
                   Get help
                </h4>
                </div>
                <ul>
                    <li><a href="#">FAQ</a> </li>
                    <li><a href="#">Shipping</a> </li>
                    <li><a href="#">Returns</a> </li>
                    <li><a href="#">Order Status</a></li>
                    <li><a href="#">Payement Option</a> </li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>
                    follow us
                </h4>
                <div className='social-medialinks'>
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
