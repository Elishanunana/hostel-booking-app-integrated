import React from 'react';

const ExploreSection = ({ onMoreInfo, onBookNow }) => {
  return (
    <section className="section__container explore__container" id="explore">
      <div className="explore__image">
        <img src="/assets/explore.jpg" alt="Explore Hostels" />
      </div>
      <div className="explore__content">
        <p className="section__subheader">EXPLORE TWELVE HOSTEL</p>
        <h2 className="section__header">A Vibrant Student Community</h2>
        <p className="section__description">
          Discover a lively environment where students from all backgrounds come together. 
          Enjoy events, study groups, and a supportive network that makes your university 
          experience unforgettable.
        </p>
        <div className="explore__btn">
          <button className="btn" type="button" onClick={() => onMoreInfo('explore')}>
            Explore More
          </button>
          <button className="btn" type="button" onClick={onBookNow} style={{marginLeft: '1rem'}}>
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
