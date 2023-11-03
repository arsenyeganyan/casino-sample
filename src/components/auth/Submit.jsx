import { useEffect, useReducer } from 'react';
import '../../styles/Auth.css';
import { useOutletContext, Navigate } from "react-router-dom";

const ACTION_TYPES = { 
  SET_DATA: "DATA",
  SET_FORM: "FORM",
  SET_CHECK: "CHECK",
  SET_CODE: "CODE",
  SET_RETURN_VAL: "RETURN_VAL",
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
    case ACTION_TYPES.SET_RETURN_VAL:
      return {
        ...state,
        returnVal: action.payload
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
    returnVal: {},
  });

  //resolves the code promise
  useEffect(() => {
      dispatch({ type: ACTION_TYPES.SET_CODE, payload: result?.res.code });
    }, [result?.res]);

  //hadnles 2-FA and the outgoing request after submitting
  async function handleCheck() {
    dispatch({ type: ACTION_TYPES.SET_CHECK });

    const dataObj = {
      username: result.username,
      password: result.password,
      email: result.email,
      status: "Verified",
    }
    
    console.log(state.form);
    console.log(state.code);

    if(state.form != state.code) {
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

      if(res2.json()) {
        return { status: res2.status };
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className='code--input--container'>
        {
          result && 
          !result?.hasOwnProperty("msg") && 
          !result?.res?.hasOwnProperty("status") && (
            <form
              id="form"
              onSubmit={(e) => {
                e.preventDefault();

                const returnVal = handleCheck();
                console.log(returnVal);
                returnVal?.then(res => {
                  dispatch({ type: ACTION_TYPES.SET_RETURN_VAL, payload: res });
                  console.log(res);
                })
              }}
            >
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
              {(
                state.check && 
                state.returnVal?.hasOwnProperty("status")
              ) && 
                <Navigate to='/'/>
              }
              {state.returnVal?.hasOwnProperty("msg") &&
                (<div className="msg">{state.returnVal.msg}</div>)}
            </form>
          )
        }
    </div>
  )
}