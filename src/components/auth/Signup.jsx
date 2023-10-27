import { Form, useActionData, Outlet } from "react-router-dom";
import '../../styles/Auth.css';

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
  
    console.log(dataObj);
  
    if(password !== rePassword) {
      return { msg: "Passwords do not match" };
    }
  
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
  
    const result1 = res1.json();
    console.log(result1);
    return {
      ...dataObj,
      result1,
    };
  } catch(err) {
    console.error("An error occured: ", err);
  }
}

export default function Signup() {
  const result = useActionData();
  console.log(result);

  return (
    <div className="auth">
      <div className="auth--page">
        <div className="auth--title">Sign up</div>
        {(result === undefined) && (
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
                type="password"
                required
                name="password"
                placeholder=""
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="input--field">
              <input 
                type="password"
                required 
                name="re-password"
                placeholder=""
              />
              <label htmlFor="re-password">Re-enter password</label>
            </div>
            <button>Continue</button>
          </Form>
        )}
        <Outlet context={{ result }}/>
      </div>
    </div>
  )
}