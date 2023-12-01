import { Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';
import Cookies from 'js-cookie';

export default function Navbar() {
  const user = Cookies.get('user');
  const [isLogged, setIsLogged] = useState(true);
  console.log(user);

  useEffect(() => {
      if(Cookies.get('user') != undefined) {
        setIsLogged(true);
      }
  }, [Cookies.get('user')]);

  return (
    <header className="header">
      <span className="header--text">Casino<span>Web</span></span>
      <div className="section" id="section">
          Section
      </div>
      {user ? 
        (
          <>
            <p className='login'>Welcome back {user}!</p>
            <p
              className="login" 
              onClick={() => {
                Cookies.remove('user');
                Cookies.remove('token');
                setIsLogged(false);
              }}
            >
                Sign out
            </p>
          </>
        ) : 
        (<Link className="login" href="/auth/login">Log In</Link>)
      }
      {isLogged && (<Navigate to='/'/>)}
      {!isLogged && (<Navigate to='/auth/login'/>)}
    </header>
  )
}
