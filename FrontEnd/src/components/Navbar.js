import React, { useState, useEffect, useContext } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import {ConnectContext} from '../context/ConnectContext'

function Navbar() {
  const {currentAccount, connectWallet} = useContext(ConnectContext)

  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            STOLID
            <i class='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/services'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Archives
              </Link>
            </li>
            <li className='nav-item'>
              
                <a className = 'nav-links' href="https://stolid-staff-portal.vercel.app/" >Staff Portal</a>
              
            </li>

            <li>
            
            </li>
          </ul>
          {button && <button className='navbtn' onClick={connectWallet}>{currentAccount ? `${currentAccount.slice(0, 6)} ... ${currentAccount.slice(-4)}` : "CONNECT WALLET"}</button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
