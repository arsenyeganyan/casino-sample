import '../styles/PlaceBet.css';
import { useParams, Form, useActionData } from "react-router-dom";
import Cookies from 'js-cookie';

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

export default function PlaceBet() {
  const params = useParams();

  const result = useActionData();
  console.log(result);

  if(Cookies.get('token') === undefined) {
    return (<Navigate to="/auth/login"/>);
  }
  return (
    <div className="bet--placing--container">
      {params.hasOwnProperty('betId') && (
        <>
          <div className='bet--title'>Enter payment details and place a bet</div>
          <div className='bet--detail'>Payment for bet x{betId}</div>
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
        </>
      )}
    </div>
  )
}
