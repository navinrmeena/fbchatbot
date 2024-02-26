import "./App.css";
import Login from "./pages/login/login";
import Fb from "./pages/fb-connect/fb";
import SignUp from "./pages/singup/signup";
import FbDelete from "./pages/fb-delete/fb-delete";
import {Link,BrowserRouter as Router,Route,Routes} from "react-router-dom"

function App() {
  return (
   
    <Router
>
  <div>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/fb" element={<Fb/>}/>
      <Route path="/fb-delete" element={<FbDelete/>}/>
    </Routes>
    
  </div>
</Router>    
  );
}

export default App;
