import '../styles/Home.css';
import Cookies from 'js-cookie';

export default function Navbar() {
  const user = Cookies.get('user');
  console.log(user);

  return (
    <header className="header">
      <span className="header--text">Casino<span>Web</span></span>
      <div className="section" id="section">
          Section
      </div>
      {user ? 
        (<p className='login'>Welcome back {user}!</p>) : 
        (<a className="login" href="/auth/login">Log In</a>)
      }
    </header>
  )
}
