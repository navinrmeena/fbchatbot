import "./App.css";
import Login from "./pages/login/login";
import Fb from "./pages/fb-connect/fb";
import SignUp from "./pages/singup/signup";
import FbDelete from "./pages/fb-delete/fb-delete";
import {BrowserRouter as Router,Route,Switch} from "react-router-dom"

function App() {
  return (
    
    <div>
      <SignUp/>
    </div>
  );
}

export default App;
