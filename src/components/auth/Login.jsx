import { Form } from "react-router-dom";
import '../../styles/Auth.css';

export default function Auth() {
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
                type="password"
                required 
                name="password"
                placeholder=""
              />
              <label htmlFor="password">Password</label>
            </div>
            <button>Continue</button>
          </Form>
      </div>
    </div>
  )
}
