import '../styles/Panel.css';
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import PlayerDetail from './PlayerDetail';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function Panel() {
  const { panelId } = useParams();
  console.log(Number(panelId));

  const [outlet, setOutlet] = useState('');
  console.log(outlet);

  //stripe
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if(!isNaN(Number(panelId))) {
      setOutlet('bet');
    } else {
      setOutlet('detail');
    }
  }, [panelId]);

  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await fetch('http://localhost:4400/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setClientSecret(data.client_secret);
    };

    fetchClientSecret();
  }, [])

  if(Cookies.get('token') === undefined) {
    return (<Navigate to="/auth/login"/>);
  }
  return (
    <div className="panel--container">
      {(outlet == 'bet') && (
        <div className='bet--placing--container'>
          <div className='bet--title'>Enter payment details and place a bet</div>
          <div className='bet--detail'>Payment for bet x{panelId}</div>
          <form className='form'>
            <input type='text' placeholder='John Doe' name='name'/>
            <input type='number' placeholder='Card Number' name='card'/>
            <input type='text' placeholder='CVV' name='pass'/>
            <div className='expiration--date'>
              <input type='number' placeholder='MM' name='month'/>
              <input type='number' placeholder='YY' name='year'/>
            </div>
            <input type="number" placeholder='Amount' name='amount'/>
            <button>Checkout</button>
          </form>
        </div>
      )}
      {(outlet == 'detail') && (
        <PlayerDetail playerId={panelId} token={Cookies.get('token')}/>
      )}
    </div>
  )
}
