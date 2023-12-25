import '../styles/Panel.css';
import { useParams, Form, useActionData } from "react-router-dom";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import PlayerDetail from './PlayerDetail';

export async function action({ params, request }) {
  try {
    // const formData = await request.formData();

    // const name = await formData.get("name");
    // const card = await formData.get("card");
    // const pass = await formData.get("pass");
    // const month = await formData.get("month");
    // const year = await formData.get("year");
    // const amount = await formData.get("amount");

    const res = await fetch(`http://localhost:4400/create-checkout-session`);

    const result = await res.json();
    console.log(result);
    return result;
  } catch(e) {
    console.error("An error occured: " + e.error);
  }
}

export default function Panel() {
  const { panelId } = useParams();
  console.log(Number(panelId));

  const result = useActionData();
  console.log(result);

  const [outlet, setOutlet] = useState('');
  console.log(outlet);

  useEffect(() => {
    if(!isNaN(Number(panelId))) {
      setOutlet('bet');
    } else {
      setOutlet('detail');
    }
  }, [panelId]);

  if(Cookies.get('token') === undefined) {
    return (<Navigate to="/auth/login"/>);
  }
  return (
    <div className="panel--container">
      {(outlet == 'bet') && (
        <div className='bet--placing--container'>
          <div className='bet--title'>Enter payment details and place a bet</div>
          <div className='bet--detail'>Payment for bet x{panelId}</div>
          <Form method='post' className='form'>
            <input type='text' placeholder='John Doe' name='name'/>
            <input type='text' placeholder='Card Number' name='card'/>
            <input type='text' placeholder='CVV' name='pass'/>
            <div className='expiration--date'>
              <input type='number' placeholder='MM' name='month'/>
              <input type='number' placeholder='YY' name='year'/>
            </div>
            <input type="number" placeholder='Amount' name='amount'/>
            <button>Checkout</button>
          </Form>
        </div>
      )}
      {(outlet == 'detail') && (<PlayerDetail playerId={panelId}/>)}
    </div>
  )
}
