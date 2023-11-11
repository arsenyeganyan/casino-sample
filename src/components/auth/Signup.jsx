import '../../styles/Auth.css';
import { useState } from "react";
import { Form, useActionData, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/fontawesome-free-solid";

export async function action({ params, request }){
  try {
    const formData = await request.formData();
  
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const rePassword = formData.get('re-password');
  
    const dataObj = {
      username: username,
      email: email,
      password: password,
      status: "Pending"
    }
  
    if(password !== rePassword) {
      return { msg: "Passwords do not match!" };
    }
    
    //first outgoing request to get the status code
    //submission handled in the Submit component
    const res1 = await fetch('http://localhost:8000/account/registrate/', {
      method: 'POST',
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(dataObj)
    });

    if(!res1.ok) {
      throw new Error(`HTTP error! Status: ${res1.status}`);
    }
  
    const result1 = await res1.json();
    return {
      ...dataObj,
      result1,
    };
  } catch(err) {
    // console.error("An error occured: ", err);
    throw err;
  }
}

export default function Signup() {
  const result = useActionData();
  console.log(result);

  const [eye, setEye] = useState(false);

  return (
    <div className="auth">
      <div className="auth--page">
        <div className="auth--title">Sign up</div>
        {(result === undefined || 
          result?.hasOwnProperty("msg") || 
          result?.result1?.hasOwnProperty("status")) && (
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
                  type="email"
                  required
                  name="email"
                  placeholder=""
                />
                <label htmlFor="email">Email</label>
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
              <div className="input--field">
                <input 
                  type={eye ? "password" : "text"}
                  required 
                  name="re-password"
                  minLength="8"
                  maxLength="20"
                  placeholder=""
                />
                <label htmlFor="re-password">Re-enter password</label>
                <div onClick={() => setEye(!eye)}>
                  {eye ? 
                    (<FontAwesomeIcon icon={faEyeSlash} className="eye--slash"/>) :
                    (<FontAwesomeIcon icon={faEye} className="eye--slash"/>)
                  }
                </div>
              </div>
              {result?.hasOwnProperty("msg") && (<div className="msg">{result.msg}</div>)}
              {result?.result1?.hasOwnProperty("status") && 
                (<div className="msg">User already exists! Try another usename.</div>)
              }
              <button>Continue</button>
            </Form>
          )
        }
        <Outlet context={{ result }}/>
      </div>
    </div>
  )
}