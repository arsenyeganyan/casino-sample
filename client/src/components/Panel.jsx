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
  const [secret, setSecret] = useState('');

  useEffect(() => {
    if(!isNaN(Number(panelId))) {
      setOutlet('bet');
    } else {
      setOutlet('detail');
    }
  }, [panelId]);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const amount = formData.get('amount');

    if(!stripe || !elements) {
      return;
    }

    const res = await fetch('http://localhost:4400/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: amount * 1000, currency: 'usd' })
    })

    const { clientSecret } = await res.json();

    setSecret(clientSecret);

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    if(error) {
      console.error(error);
    } else {
      console.log(token);

      const result = await stripe.confirmCardPayment(secret, {
        payment_method: {
          card: cardElement
        }
      })

      if (result.error) {
        console.error(result.error);
      } else {
        console.log(result.paymentIntent);
      }
    }
  }

  if(Cookies.get('token') === undefined) {
    return (<Navigate to="/auth/login"/>);
  }
  return (
    <div className="panel--container">
      {(outlet == 'bet') && (
        <div className='bet--placing--container'>
          <div className='bet--title'>Enter payment details and place a bet</div>
          <div className='bet--detail'>Payment for bet x{panelId}</div>
          <form className='form' onSubmit={handleSubmit}>
            <input type='text' placeholder='John Doe' name='name'/>
            <input type='cardnumber' placeholder='Card Number' name='card'/>
            <input type='text' placeholder='CVV' name='pass'/>
            <div className='expiration--date'>
              <input type='number' placeholder='MM' name='month'/>
              <input type='number' placeholder='YY' name='year'/>
            </div>
            <input type="number" placeholder='Amount' name='amount'/>
            <button disabled={!stripe}>Checkout</button>
          </form>
          <CardElement />
        </div>
      )}
      {(outlet == 'detail') && (
        <PlayerDetail playerId={panelId} token={Cookies.get('token')}/>
      )}
    </div>
  )
}
