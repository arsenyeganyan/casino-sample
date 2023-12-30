import '../styles/Panel.css';
import { useParams, Link } from "react-router-dom";
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
  const [status, setStatus] = useState('');

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
    const name = formData.get('name');

    if(!stripe || !elements) {
      return;
    }

    const res = await fetch('http://localhost:4400/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: amount * 100, currency: 'usd' })
    })

    const { clientSecret } = await res.json();

    setClientSecret(clientSecret);

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    if(error) {
      console.error(error);
      setStatus('Something went wrong!');
    } else {
      console.log(token);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement
        }
      })

      if (result.error) {
        console.error(result.error);
        setStatus('Something went wrong!');
      } else {
        setStatus('Payment successful!');
        console.log(result.paymentIntent);

        const data = await fetch('http://localhost:8000/account/payments/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${Cookies.get('token')}`
          },
          body: JSON.stringify({
            holder: name,
            id: result.paymentIntent.id,
            client_secret: clientSecret
          })
        })

        const apply = await data.json();
      }
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        color: 'white',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
  };

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
            <input type="number" placeholder='Amount' name='amount'/>
            <input type="text" placeholder='John Doe' name='name'/>
            <div className='card--element--container'>
              <CardElement options={cardElementOptions}/>
            </div>
            <button disabled={!stripe}>Checkout</button>
          </form>
          {(status != '') && (<div className='bet--msg'>{status} <Link className='bet--link' to='/'>Return home</Link></div>)}
        </div>
      )}
      {(outlet == 'detail') && (
        <PlayerDetail playerId={panelId} token={Cookies.get('token')}/>
      )}
    </div>
  )
}
