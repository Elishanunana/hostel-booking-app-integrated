import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="section__container footer__container">
        <div className="footer__col">
          <div className="footer__logo">
            <img src="/assets/logo.png" alt="Twelve Hostel Logo" />
          </div>
          <p>Your student home away from home.</p>
          <div className="footer__socials">
            <a href="#"><img src="/assets/facebook.png" alt="facebook" /></a>
            <a href="#"><img src="/assets/instagram.png" alt="instagram" /></a>
            <a href="#"><img src="/assets/twitter.png" alt="twitter" /></a>
            <a href="#"><img src="/assets/youtube.png" alt="youtube" /></a>
          </div>
        </div>
        <div className="footer__col">
          <h4>Company</h4>
          <a href="#about">About</a>
          <a href="#rooms">Rooms</a>
          <a href="#service">Services</a>
          <a href="#testimonial">Reviews</a>
        </div>
        <div className="footer__col">
          <h4>Support</h4>
          <a href="#faq">FAQs</a>
          <a href="#terms">Terms & Conditions</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#contact">Contact Us</a>
        </div>
        <div className="footer__col">
          <h4>Contact</h4>
          <a href="mailto:info@twelvehostel.com">info@twelvehostel.com</a>
          <a href="tel:+233123456789">+233 123 456 789</a>
          <a href="#location">KNUST Campus, Kumasi</a>
        </div>
      </div>
      <div className="footer__bar">
        Copyright © {new Date().getFullYear()} Twelve Hostel. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
