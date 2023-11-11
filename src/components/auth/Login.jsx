import '../../styles/Auth.css';
import { useState } from 'react';
import { useActionData, Form, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/fontawesome-free-solid";

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
    localStorage.setItem("token", result?.token);
    return result;
  } catch(err) {
    // console.error(err);
    throw err;
  }
}

export default function Auth() {
  const result = useActionData();
  console.log(result);
  
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
      </div>
      {result && <Navigate to='/'/>}
    </div>
  )
}
