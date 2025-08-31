import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-view">
      <h2>About WebMap</h2>
      
      <div className="about-content">
        <section className="about-section">
          <h3>What is WebMap?</h3>
          <p>
            WebMap is an interactive location explorer that helps you discover and navigate 
            various points of interest. Built with modern web technologies, it provides 
            a seamless experience for exploring locations through an interactive map interface.
          </p>
        </section>

        <section className="about-section">
          <h3>Features</h3>
          <ul>
            <li><strong>Interactive Map:</strong> Explore locations with an intuitive map interface</li>
            <li><strong>Category Filtering:</strong> Filter locations by categories and subcategories</li>
            <li><strong>Real-time Data:</strong> Location data is loaded from Google Sheets for easy updates</li>
            <li><strong>Responsive Design:</strong> Works seamlessly on desktop and mobile devices</li>
            <li><strong>Detailed Information:</strong> Get comprehensive details about each location</li>
          </ul>
        </section>

        <section className="about-section">
          <h3>How to Use</h3>
          <div className="usage-steps">
            <div className="step">
              <h4>1. Map View</h4>
              <p>Browse locations on the interactive map. Click markers to see details in popups.</p>
            </div>
            <div className="step">
              <h4>2. Category View</h4>
              <p>Explore locations organized by categories. Click on categories to see subcategories and detailed listings.</p>
            </div>
            <div className="step">
              <h4>3. Filtering</h4>
              <p>Use the filter panel to show only specific categories of locations on the map.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h3>Technology</h3>
          <p>
            WebMap is built with React, Leaflet mapping library, and integrates with Google Sheets 
            for dynamic data management. The application uses OpenStreetMap tiles for the base map.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;