import "./styles/App.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Submit from "./components/auth/Submit";
import Home from "./components/Home";
import DetailView from "./components/DetailView";
import Panel from "./components/Panel";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import { action as signupAction } from "./components/auth/Signup";
import { action as loginAction } from "./components/auth/Login";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';

const key = import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(key);

export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      <Route path=":gameId" element={<DetailView />}>
        <Route path=":panelId" element={<Panel />}/>
      </Route>
      <Route path="auth">
        <Route path="login" element={<Login />} action={loginAction}/>
        <Route path="signup" element={<Signup />} action={signupAction}>
          <Route index element={<Submit />}/>
        </Route>
      </Route>
    </Route>
  ))

  return (
    <div>
      <Elements stripe={stripePromise}>
        <RouterProvider router={router}/>
      </Elements>
    </div>
  )
}
