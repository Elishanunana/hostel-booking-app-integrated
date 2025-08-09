import React, { useState, useEffect } from 'react';
import './style.css';

// Import components
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import RoomDetailsModal from './components/RoomDetailsModal';
import PaymentModal from './components/PaymentModal';
import ProfileModal from './components/ProfileModal';
import BookingHistoryModal from './components/BookingHistoryModal';

// Import services and utilities
import ApiService from './services/api';
import {
  transformRoomsData,
  transformBackendBookingData,
  transformFrontendFilters,
  transformErrorMessage
} from './utils/dataTransformers';

function App() {
  // User state
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  
  // FAQ state
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showHistory, setShowHistory] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Booking history data
  const [bookingHistory, setBookingHistory] = useState([]);

  // Room filter state
  const [roomType, setRoomType] = useState('');
  const [roomFloor, setRoomFloor] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomAvailability, setRoomAvailability] = useState('');
  const [roomSearch, setRoomSearch] = useState('');

  // Room data state and fetching
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize user from token on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser({
        username: 'User',
        email: 'user@example.com',
        bookings: []
      });
    }
  }, []);

  // Fetch rooms data on component mount and when filters change
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters = transformFrontendFilters({
          roomType,
          roomPrice,
          roomAvailability,
          roomSearch,
          location: roomFloor
        });
        
        const backendRooms = await ApiService.getRooms(filters);
        const transformedRooms = transformRoomsData(backendRooms);
        
        setRooms(transformedRooms);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(transformErrorMessage(err));
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [roomType, roomPrice, roomAvailability, roomSearch, roomFloor]);

  // Fetch user's booking history when user logs in
  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (!user) {
        setBookingHistory([]);
        return;
      }

      try {
        const backendBookings = await ApiService.getMyBookings();
        const transformedBookings = backendBookings.map(transformBackendBookingData);
        setBookingHistory(transformedBookings);
        
        setUser(prevUser => ({
          ...prevUser,
          bookings: transformedBookings
        }));
      } catch (err) {
        console.error('Error fetching booking history:', err);
        setBookingHistory([]);
      }
    };

    fetchBookingHistory();
  }, [user?.id]);

  // Navigation handlers
  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Modal handlers
  const openModal = (tab = 'login') => {
    setActiveTab(tab);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleTabSwitch = (tab) => setActiveTab(tab);

  // Authentication success handler
  const handleAuthSuccess = (userData) => {
    setUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      joinedDate: new Date().toISOString().split('T')[0],
      bookings: []
    });
    closeModal();
  };

  // User profile handlers
  const handleProfileClick = () => setShowProfile(true);
  const closeProfile = () => setShowProfile(false);
  
  const handleLogout = async () => {
    try {
      await ApiService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setShowProfile(false);
      setBookingHistory([]);
    }
  };

  // Room handlers
  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };

  const closeRoomDetails = () => setShowRoomDetails(false);

  const openBooking = (room) => {
    setSelectedRoom(room);
    setShowBooking(true);
  };

  const closeBooking = () => {
    setSelectedRoom(null);
    setShowBooking(false);
  };

  const handleBookNow = (room) => {
    if (!user) {
      openModal('register');
      return;
    }
    openBooking(room);
  };

  // Booking success handler
  const handleBookingSuccess = async (bookingResponse) => {
    try {
      const backendBookings = await ApiService.getMyBookings();
      const transformedBookings = backendBookings.map(transformBackendBookingData);
      setBookingHistory(transformedBookings);
      
      setUser(prevUser => ({
        ...prevUser,
        bookings: transformedBookings
      }));

      alert('Booking created successfully! You can view it in your booking history.');
      
      const filters = transformFrontendFilters({
        roomType,
        roomPrice,
        roomAvailability,
        roomSearch,
        location: roomFloor
      });
      
      const backendRooms = await ApiService.getRooms(filters);
      const transformedRooms = transformRoomsData(backendRooms);
      setRooms(transformedRooms);
      
    } catch (err) {
      console.error('Error refreshing data after booking:', err);
      alert('Booking created successfully!');
    }
  };

  // Booking history handlers
  const openHistory = () => setShowHistory(true);
  const closeHistory = () => setShowHistory(false);

  // FAQ handler
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    return (
      (!roomType || room.type === roomType) &&
      (!roomFloor || room.floor === roomFloor) &&
      (!roomPrice || room.price >= parseInt(roomPrice)) &&
      (!roomAvailability || (roomAvailability === 'available' ? room.availableBedspaces > 0 : room.availableBedspaces === 0)) &&
      (!roomSearch || room.name.toLowerCase().includes(roomSearch.toLowerCase()))
    );
  });

  // Sample rooms data for display
  const sampleRooms = [
    {
      id: 1,
      name: "Deluxe Single Room",
      type: "1in1",
      floor: "ground",
      price: 15000,
      availableBedspaces: 2,
      totalBedspaces: 5,
      desc: "Spacious single room with modern amenities",
      img: "/assets/room 1.jpg"
    },
    {
      id: 2,
      name: "Twin Sharing Room",
      type: "2in1",
      floor: "first",
      price: 12000,
      availableBedspaces: 1,
      totalBedspaces: 3,
      desc: "Comfortable twin sharing with study area",
      img: "/assets/room2.JPG"
    },
    {
      id: 3,
      name: "Triple Room",
      type: "3in1",
      floor: "second",
      price: 10000,
      availableBedspaces: 0,
      totalBedspaces: 2,
      desc: "Affordable triple sharing room",
      img: "/assets/room3.JPG"
    }
  ];

  const displayRooms = filteredRooms.length > 0 ? filteredRooms : sampleRooms;

  return (
    <div className="App">
      {/* Header */}
      <header className="header" id="home">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">
              <img src="/assets/logo.png" alt="Twelve Hostel" />
            </div>
            
            <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
              <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
              <li><a href="#rooms" onClick={(e) => handleNavClick(e, 'rooms')}>Rooms</a></li>
              <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')}>Services</a></li>
              <li><a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')}>Reviews</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
            </ul>

            <div className="nav-buttons">
              {user ? (
                <>
                  <button className="btn btn-outline" onClick={handleProfileClick}>
                    {user.username}
                  </button>
                  <button className="btn btn-secondary" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline" onClick={() => openModal('login')}>
                    Login
                  </button>
                  <button className="btn btn-secondary" onClick={() => openModal('register')}>
                    Book Now
                  </button>
                </>
              )}
            </div>

            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <p className="hero-subtitle">Welcome to Twelve Hostel – Your Student Home</p>
            <h1 className="hero-title">
              Book Your Room at
              <span className="highlight">Twelve Hostel</span>
              Today!
            </h1>
            <p className="hero-description">
              Experience comfortable, secure, and affordable student accommodation with modern amenities and a vibrant community atmosphere.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-secondary" onClick={() => openModal('register')}>
                Book Your Room
              </button>
              <button className="btn btn-outline" onClick={(e) => handleNavClick(e, 'about')}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="section about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <div className="section-subtitle">About Twelve Hostel</div>
              <h3>A Vibrant Student Community</h3>
              <p>
                Discover a lively environment where students from all backgrounds come together. 
                Enjoy events, study groups, and a supportive network that makes your university 
                experience unforgettable.
              </p>
              <p>
                Twelve Hostel is dedicated to providing students with a safe, affordable, and 
                vibrant living experience right on campus. Choose from a range of room options, 
                enjoy modern facilities, and become part of a welcoming student community.
              </p>
              <button className="btn btn-primary" onClick={() => openModal('register')}>
                Join Our Community
              </button>
            </div>
            <div className="about-image">
              <img src="/assets/about.jpg" alt="About Twelve Hostel" />
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="section rooms-section" id="rooms">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Our Rooms</div>
            <h2 className="section-title">Find Your Perfect Room</h2>
            <p className="section-description">
              Choose from our variety of comfortable and affordable room options, 
              each designed to provide the perfect environment for your studies and rest.
            </p>
          </div>

          {/* Room Filters */}
          <div className="room-filters">
            <select 
              className="filter-select" 
              value={roomType} 
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">All Room Types</option>
              <option value="1in1">Single Room</option>
              <option value="2in1">Twin Sharing</option>
              <option value="3in1">Triple Sharing</option>
              <option value="4in1">Quad Sharing</option>
            </select>

            <select 
              className="filter-select" 
              value={roomFloor} 
              onChange={(e) => setRoomFloor(e.target.value)}
            >
              <option value="">All Floors</option>
              <option value="ground">Ground Floor</option>
              <option value="first">First Floor</option>
              <option value="second">Second Floor</option>
              <option value="third">Third Floor</option>
            </select>

            <select 
              className="filter-select" 
              value={roomPrice} 
              onChange={(e) => setRoomPrice(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="15000">₵15,000+</option>
              <option value="12000">₵12,000+</option>
              <option value="10000">₵10,000+</option>
              <option value="8000">₵8,000+</option>
            </select>

            <input
              type="text"
              className="filter-search"
              placeholder="Search rooms..."
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
            />
          </div>

          {/* Rooms Grid */}
          <div className="rooms-grid">
            {loading ? (
              <div className="text-center">Loading rooms...</div>
            ) : error ? (
              <div className="text-center" style={{color: 'var(--error)'}}>{error}</div>
            ) : displayRooms.length === 0 ? (
              <div className="text-center">No rooms found matching your criteria.</div>
            ) : (
              displayRooms.map(room => (
                <div key={room.id || room.name} className="room-card">
                  <div className="room-image">
                    <img src={room.img} alt={room.name} />
                  </div>
                  <div className="room-content">
                    <h4 className="room-title">{room.name}</h4>
                    <p className="room-description">{room.desc}</p>
                    <div className="room-price">₵{room.price?.toLocaleString()}/year</div>
                    <div className={`room-availability ${room.availableBedspaces > 0 ? 'available' : 'unavailable'}`}>
                      {room.availableBedspaces > 0 
                        ? `${room.availableBedspaces} of ${room.totalBedspaces} available`
                        : 'Fully Occupied'
                      }
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleBookNow(room)}
                        disabled={room.availableBedspaces === 0}
                        style={{
                          opacity: room.availableBedspaces === 0 ? 0.6 : 1,
                          cursor: room.availableBedspaces === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {room.availableBedspaces > 0 ? 'Book Now' : 'Fully Occupied'}
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={() => openRoomDetails(room)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {user && (
            <div className="text-center mt-8">
              <button className="btn btn-secondary" onClick={openHistory}>
                View Booking History
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="section services-section" id="services">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Our Services</div>
            <h2 className="section-title">World-Class Facilities</h2>
            <p className="section-description">
              Experience premium amenities designed to enhance your student life and academic success.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🛡️</div>
              <h4 className="service-title">24/7 Security</h4>
              <p className="service-description">
                Round-the-clock security with CCTV surveillance and professional security staff 
                to ensure your safety and peace of mind.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">📶</div>
              <h4 className="service-title">High-Speed WiFi</h4>
              <p className="service-description">
                Lightning-fast fiber internet connection throughout the building for seamless 
                online learning and entertainment.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">📚</div>
              <h4 className="service-title">Study Areas</h4>
              <p className="service-description">
                Quiet study lounges and collaborative spaces designed to boost your academic 
                performance and productivity.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🍽️</div>
              <h4 className="service-title">Dining Facilities</h4>
              <p className="service-description">
                Modern cafeteria with nutritious meals and comfortable dining spaces for 
                socializing with fellow students.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🧺</div>
              <h4 className="service-title">Laundry Service</h4>
              <p className="service-description">
                Convenient laundry facilities with modern washing machines and dryers 
                available 24/7 for your convenience.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🏃</div>
              <h4 className="service-title">Recreation</h4>
              <p className="service-description">
                Fitness center, game room, and outdoor spaces for relaxation and maintaining 
                an active lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Student Testimonials</div>
            <h2 className="section-title">What Our Residents Say</h2>
            <p className="section-description">
              Hear from our satisfied students about their experience living at Twelve Hostel.
            </p>
          </div>

          <div className="testimonials-grid">
            {[
              {
                name: 'Ama K.',
                role: 'Level 200, Business Administration',
                image: '/src/assets/ama.PNG',
                text: 'Twelve Hostel made my first year at university so much easier. The staff are friendly, rooms are super comfortable, and the study areas are perfect for focused learning. The sense of community here is incredible!',
                rating: 5,
                badge: 'Comfortable Living'
              },
              {
                name: 'Kwame B.',
                role: 'Level 300, Computer Science',
                image: '/src/assets/kwame.PNG',
                text: 'As a tech student, reliable internet is crucial. The Wi-Fi here is lightning fast, and the study lounges are perfect for group projects. Plus, the social events help maintain a great work-life balance.',
                rating: 5,
                badge: 'Perfect for Studies'
              },
              {
                name: 'Linda O.',
                role: 'Level 100, Engineering',
                image: '/src/assets/Linda.PNG',
                text: 'Coming from another city, I was worried about accommodation. Twelve Hostel exceeded my expectations with its security, cleanliness, and wonderful community. It truly feels like a home away from home!',
                rating: 5,
                badge: 'Safe & Welcoming'
              },
              {
                name: 'Samuel A.',
                role: 'Level 400, Mechanical Engineering',
                image: '/src/assets/Samuel A.png',
                text: 'Four years at Twelve Hostel and I can confidently say it\'s the best decision I made. The maintenance team is always responsive, and the community events helped me build lifelong friendships. Highly recommend!',
                rating: 5,
                badge: 'Long-term Resident'
              },
              {
                name: 'Grace M.',
                role: 'Level 200, Medicine',
                image: '/src/assets/Linda.PNG',
                text: 'As a medical student, I need a quiet environment for studying. Twelve Hostel provides exactly that with their dedicated study areas and strict noise policies. The location is also perfect for accessing the hospital.',
                rating: 5,
                badge: 'Study-Friendly'
              },
              {
                name: 'Joseph T.',
                role: 'Level 300, Architecture',
                image: '/src/assets/Joseph T.jpg',
                text: 'The design and layout of Twelve Hostel is impressive. As an architecture student, I appreciate the thoughtful space planning and modern amenities. The rooftop terrace is perfect for relaxation after long studio sessions.',
                rating: 5,
                badge: 'Modern Design'
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-badge">{testimonial.badge}</div>
                <div className="testimonial-header">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-footer">
                  <div className="testimonial-rating">
                    {'★'.repeat(testimonial.rating)}
                  </div>
                  <div className="testimonial-verified">Verified Resident</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">
              Find answers to common questions about living at Twelve Hostel.
            </p>
          </div>

          <div className="faq-container">
            {[
              {
                question: "How do I book a room?",
                answer: "Simply click the 'Book Your Room' button and follow these steps: 1. Create an account or log in, 2. Select your preferred room type, 3. Fill out the booking form, 4. Submit your application. Our team will review and confirm your reservation within 24 hours."
              },
              {
                question: "What documents do I need?",
                answer: "For registration and booking, you need: Valid email address for account creation, Phone number for verification, Username and secure password, Personal information (name, date of birth for students), Program of study (for students). No physical documents required - everything is done online!"
              },
              {
                question: "Are visitors allowed?",
                answer: "Yes, we allow visitors during these hours: Weekdays: 10:00 AM - 8:00 PM, Weekends: 10:00 AM - 10:00 PM. All visitors must sign in at the security desk and follow hostel guidelines. Overnight guests are not permitted for security reasons."
              },
              {
                question: "Is there 24/7 security?",
                answer: "Yes, we maintain comprehensive security measures: 24/7 security personnel, CCTV surveillance throughout the premises, Electronic access cards for all entrances, Emergency response system, Regular security patrols."
              },
              {
                question: "What amenities are included?",
                answer: "Your room fee includes access to: High-speed Wi-Fi, Study lounges on each floor, Fully equipped kitchen facilities, Laundry room, Common room with TV, Bicycle storage, Regular cleaning service."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-content">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <div className="logo mb-4">
                <img src="/assets/logo.png" alt="Twelve Hostel" />
              </div>
              <p>
                At Twelve Hostel, we help students find the perfect room for their campus journey. 
                Enjoy comfort, security, and a vibrant student life – all in one place!
              </p>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
                <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
                <li><a href="#rooms" onClick={(e) => handleNavClick(e, 'rooms')}>Rooms</a></li>
                <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')}>Services</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Services</h4>
              <ul className="footer-links">
                <li><a href="#services">24/7 Security</a></li>
                <li><a href="#services">High-Speed WiFi</a></li>
                <li><a href="#services">Study Areas</a></li>
                <li><a href="#services">Laundry Service</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact Info</h4>
              <ul className="footer-links">
                <li><a href="mailto:contact@twelvehostel.com">contact@twelvehostel.com</a></li>
                <li><a href="tel:+233123456789">+233 123 456 789</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Twelve Hostel. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        show={showModal}
        activeTab={activeTab}
        onTabSwitch={handleTabSwitch}
        onSuccess={handleAuthSuccess}
        onClose={closeModal}
      />

      <BookingModal
        show={showBooking}
        room={selectedRoom}
        user={user}
        onClose={closeBooking}
        onSuccess={handleBookingSuccess}
      />

      <RoomDetailsModal
        show={showRoomDetails}
        room={selectedRoom}
        onClose={closeRoomDetails}
        onBook={handleBookNow}
      />

      <BookingHistoryModal
        show={showHistory}
        bookings={bookingHistory}
        onClose={closeHistory}
      />

      <ProfileModal
        show={showProfile}
        user={user}
        onClose={closeProfile}
      />
    </div>
  );
}

export default App;
