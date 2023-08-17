import React, { useContext } from 'react';
import Logo from "../img/stilr-logo.png"
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export const Navbar = () => {

  const { currentUser, logout} =useContext(AuthContext);

  return (
    <div className='navbar'>
        <div className="container">
            <div className="logo">
              <Link to="/">
                <img src={Logo} alt="" />
              </Link>
            </div>
            <div className="links">
                <Link className="link" to="/?subject=physics">
                  <h6>PHYSICS</h6>
                </Link>
                <Link className="link" to="/?subject=generalScience">
                  <h6>GENERAL SCIENCE</h6>
                </Link>
                <Link className="link" to="/?subject=chemistry">
                  <h6>CHEMISTRY</h6>
                </Link>
                <Link className="link" to="/?subject=biology">
                  <h6>BIOLOGY</h6>
                </Link>
                
                <span>{currentUser?.username}</span>
                {currentUser ? (
                    <span onClick={logout}>Logout</span>
                  ) : (
                    <Link className="link" to="/login">
                      Login
                    </Link>
                )}
                <span className="write">
                <Link className="link" to="/write">
                  Create
                </Link>
                </span>
            </div>
        </div>
    </div>
  )
}
