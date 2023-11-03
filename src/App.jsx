import "./styles/App.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Submit from "./components/auth/Submit";
import Home from "./components/Home";
import { 
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements, 
  Route 
} from "react-router-dom";
import { action as signupAction } from "./components/auth/Signup";
import { action as loginAction } from "./components/auth/Login";

export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />}/>
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
        <RouterProvider router={router}/>
    </div>
  )
}
