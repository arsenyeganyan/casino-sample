import { useEffect, useReducer } from 'react';
import '../../styles/Auth.css';
import { useOutletContext, Navigate } from "react-router-dom";

const ACTION_TYPES = { 
  SET_DATA: "DATA",
  SET_FORM: "FORM",
  SET_CHECK: "CHECK",
  SET_CODE: "CODE",
};

const reducer = (state, action) => {
  switch(action.type) {
    case ACTION_TYPES.SET_DATA:
      return {
        ...state,
        data: action.payload
      }
    case ACTION_TYPES.SET_FORM:
      return {
        ...state,
        form: action.payload
      }
    case ACTION_TYPES.SET_CHECK:
      return {
        ...state,
        check: true
      }
    case ACTION_TYPES.SET_CODE:
      return {
        ...state,
        code: action.payload
      }
  }
}
  
  export default function Submit() {
  const { result } = useOutletContext();
  const [state, dispatch] = useReducer(reducer, {
    data: {},
    form: '',
    check: false,
    code: null,
  });

  useEffect(() => {
    result?.result1.then(res => {
      dispatch({ type: ACTION_TYPES.SET_CODE, payload: res.code });
    })
  }, [result]);

  async function handleCheck(e) {
    e.preventDefault();
    dispatch({ type: ACTION_TYPES.SET_CHECK });

    const dataObj = {
      username: result.username,
      password: result.password,
      email: result.email,
      status: "Verified",
    }
    
    if(Number(state.form) === state.code) {
      return { msg: "Code provided is invalid!" };
    }

    try {
      const res2 = await fetch('http://localhost:8000/account/registrate/', {
        method: 'POST',
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(dataObj)
      });

      if(!res2.ok) {
        throw new Error(`HTTP error! Status: ${res2.status}`);
      }

      const result2 = res2.json();
      console.log(result2);
      return result2;
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className='code--input--container'>
        {result && (
          <form id="form" onSubmit={handleCheck}>
              <div className="input--field">
                <input
                    type="text"
                    required 
                    name="code"
                    placeholder=""
                    value={state.form}
                    onChange={(e) =>
                      dispatch({ type: ACTION_TYPES.SET_FORM, payload: e.target.value })
                    }
                />
                <label htmlFor="code">6-digit number</label>
              </div>
              {((Number(state.form) === state.code) && state.check) && <Navigate to='/'/>}
          </form>
        )}
    </div>
  )
}