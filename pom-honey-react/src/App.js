import pomHoneyLogo from './assets/logo.png';
import './App.css';
import { useState } from 'react';


const callAPI = (setApiResponse) => {
  fetch("http://localhost:8080/manager/orders")
    .then(res => res.text())
    .then(res => setApiResponse(res));
    
}

function App() {
  const [apiResponse, setApiResponse] = useState("");
  callAPI(setApiResponse);

  return (
    <div>
      <header>
        <img src={pomHoneyLogo} className="App-logo" alt="logo"/>
        <p>Howdy</p>
        <p><b>Server side stuff:</b> {apiResponse}</p>
      </header>
    </div>
  );
}

export default App;
