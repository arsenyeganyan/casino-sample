import { Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';
import Cookies from 'js-cookie';

export default function Navbar() {
  const token = Cookies.get('token');
  const profilePic = Cookies.get('profilePic');
  // console.log(profilePic);
  const user = Cookies.get('user');
  // console.log(user);

  const [isLogged, setIsLogged] = useState(true);
  const [isPopped, setIsPopped] = useState(false);
  const [username, setUsername] = useState(false);
  const [pp, setPp] = useState(false);
  const [file, setFile] = useState(null);
  const [change, setChange] = useState({
    status: 'unchanged',
    msg: '',
  });
  
  // console.log(change);
  console.log(file);

  const status = 'status';
  const msg = 'msg';
  
  useEffect(() => {
    if(Cookies.get('user') != undefined) {
      setIsLogged(true);
    }
  }, [Cookies.get('user')]);

  function handleFile(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  }

  async function handleChange(e) {
    try {
      e.preventDefault();
      
      //gathering data from the form + file input implementation
      const formData = new FormData(e.currentTarget);
      // const username = formData.get('usernameChange');

      if(file) {
        formData.append('profile_picture', file);
        formData.delete('ppChange');

        const res = await fetch('http://localhost:8000/account/edit/', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`
          },
          body: formData
        })

        if(!res.ok) {
          console.log('Status code: ' + res.status);

          setChange((prevChange) => ({
            ...prevChange,
            [status]: 'unchanged',
            [msg]: "Somthing went wrong, please try again!"
          }));

          return 0;
        }

        const result = await res.json();
        setChange((prevChange) => ({
          ...prevChange, 
          [status]: 'changed',
          [msg]: ''
        }));

        return result;
      }

      setChange((prevChange) => ({
        ...prevChange,
        [msg]: "Please update at least one setting!"
      }));
    } catch(e) {
      throw e;
    }
  }

  return (
    <header className="header">
      <span className="header--text">Casino<span>Web</span></span>
      <div className="section" id="section">
          Section
      </div>
      {user ?
        (
          <div className='settings--panel'>
            <img 
              src={profilePic} 
              onClick={() => setIsPopped(!isPopped)}
              className='profile--pic'
            />
            <div className={isPopped ? "settings" : "dont--pop"}>
              <div onClick={() => setUsername(!username)}>Change username</div>
              <div onClick={() => setPp(!pp)}>Change profile picture</div>
              <form onSubmit={handleChange}>
                {/* <input 
                  className={username ? "username" : "dont"}
                  placeholder='Enter new username'
                  type='text'
                  name='usernameChange'
                /> */}
                <input 
                  className={pp ? "" : "dont"} 
                  type="file" 
                  name='ppChange' 
                  onChange={handleFile} 
                  accept='.jpg, .png'
                />
                <button className={(username || pp) ? "submit" : "dont"}>
                  Confirm changes
                </button>
              </form>
              <div className='change--warning'>
                {(change.status != 'unchanged' && (change.msg == '')) && 
                  <div>Applied all changes!</div>
                }
                {(change.msg != '') && <div>{change.msg}</div>}
              </div>
              <p
                className="login"
                onClick={() => {
                  Cookies.remove('user');
                  Cookies.remove('token');
                  Cookies.remove('profilePic');
                  setIsLogged(false);
                }}
              >
                Sign out
              </p>
            </div>
          </div>
        ) : 
        (<Link className="login" to="/auth/login">Log In</Link>)
      }
      {isLogged && (<Navigate to='/'/>)}
      {!isLogged && (<Navigate to='/auth/login'/>)}
    </header>
  )
}
