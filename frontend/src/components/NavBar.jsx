import React from 'react';

const NavBar = ({ user, onNavClick, onProfileClick, onLogout, onBookRoom, onLogin }) => {
  return (
    <nav>
      <div className="nav__bar">
        <div className="logo">
          <a href="#" onClick={e => onNavClick(e, 'home')}>
            <img src="/assets/logo.png" alt="Twelve Hostel Logo" />
          </a>
        </div>
        <div className="nav__menu__btn" id="menu-btn">
          <i className="ri-menu-line"></i>
        </div>
      </div>
      <ul className="nav__links" id="nav-links">
        <li><a href="#home" onClick={e => onNavClick(e, 'home')}>Home</a></li>
        <li><a href="#about" onClick={e => onNavClick(e, 'about')}>About</a></li>
        <li><a href="#service" onClick={e => onNavClick(e, 'service')}>Facilities</a></li>
        <li><a href="#contact" onClick={e => onNavClick(e, 'contact')}>Contact</a></li>
      </ul>
      {user ? (
        <>
          <button className="btn nav__btn" onClick={onProfileClick} style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <i className="ri-user-line"></i>
            {user.username}
          </button>
          <button className="btn nav__btn" onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <button className="btn nav__btn" id="book-room-btn" type="button" onClick={onBookRoom}>Book Your Room</button>
          <button className="btn nav__btn" id="login-btn" type="button" onClick={onLogin}>Login / Register</button>
        </>
      )}
    </nav>
  );
};

export default NavBar;
