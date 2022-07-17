import React from 'react';
import './Footer.css';
import { Button } from './Button';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Join the Stolid newsletter to get latest information on making our justice system better
        </p>
        <p className='footer-subscription-text'>
          You can unsubscribe at any time.
        </p>
        <div className='input-areas'>
          <form>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Your Email'
            />
            <Button buttonStyle='btn--outline'>Subscribe</Button>
          </form>
        </div>
      </section>
      <div class='footer-links'>
        <div className='footer-link-wrapper'>
          <div class='footer-link-items'>
            <h2>About Us</h2>
              <a href='https://github.com/Dayo-Adewuyi' target='_blank' rel='noopener norefferer'>How it works</a>
            
          </div>
          <div class='footer-link-items'>
            <h2>Contact Us</h2>
            <a href='https://github.com/Dayo-Adewuyi' target='_blank' rel='noopener norefferer'>Contact</a>
            <a href='https://github.com/Dayo-Adewuyi' target='_blank' rel='noopener norefferer'>Support</a>
            
          </div>
        </div>
        <div className='footer-link-wrapper'>
         
          <div class='footer-link-items'>
            <h2>Join The Conversation</h2>
          
            <a href='https://twitter.com/wandeoki' target='_blank' rel='noopener norefferer'>Twitter</a>
          </div>
        </div>
      </div>
      <section class='social-media'>
        <div class='social-media-wrap'>
          <div class='footer-logo'>
            <Link to='/' className='social-logo'>
              STOLID
              <i class='fab fa-typo3' />
            </Link>
          </div>
          <small class='website-rights'>STOLID © 2022</small>
          <div class='social-icons'>
           
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
