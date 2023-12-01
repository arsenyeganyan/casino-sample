import '../../styles/Auth.css';
import { useState, useEffect } from 'react';
import { useActionData, Form, Navigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/fontawesome-free-solid";
import Cookies from 'js-cookie';

export async function action({ params, request }) {
  try {
    const formData = await request.formData();

    const username = formData.get('username');
    const password = formData.get('password');

    const res = await fetch('http://localhost:8000/account/login/', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({ username, password })
    })

    const result = await res.json();

    if(result?.token) {
      const now = new Date();
      const expirationTime = new Date(now.getTime() + 15 * 60 * 1000);

      Cookies.set("user", username, { secure: true, expires: expirationTime });
      Cookies.set("token", result?.token, { secure: true, expires: expirationTime });
    }
    
    return result;
  } catch(err) {
    throw err;
  }
}
//
export default function Auth() {
  const result = useActionData();
  const [eye, setEye] = useState(false);
  
  return (
    <div className="auth">
      <div className="auth--page">
          <div className="auth--title">Log in</div>
          <Form id="form" method="POST">
            <div className="input--field">
              <input
                type="text"
                required
                name="username"
                placeholder=""
              />
              <label htmlFor="username">Username</label>
            </div>
            <div className="input--field">
              <input 
                type={eye ? "password" : "text"}
                required
                name="password"
                minLength="8"
                maxLength="20"
                placeholder=""
              />
              <label htmlFor="password">Password</label>
              <div onClick={() => setEye(!eye)}>
                {eye ? 
                  (<FontAwesomeIcon icon={faEyeSlash} className="eye--slash"/>) :
                  (<FontAwesomeIcon icon={faEye} className="eye--slash"/>)
                }
              </div>
            </div>
            <button>Continue</button>
          </Form>
          {result?.hasOwnProperty("msg") && (<div className="msg">{result.msg}</div>)}
          <div className="msg">
            Don't have an account? <Link className="msg" to='/auth/signup'>Sign up</Link>
          </div>
      </div>
      {(result && Cookies.get('token')) && <Navigate to='/'/>}
    </div>
  )
}
