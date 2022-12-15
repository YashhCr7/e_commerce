import './App.css';
import Home from './components/Home.js'
import Cart from './components/Cart'
import Placeorder from './components/Placeorder';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="*" element={<Home />} /> 
      <Route path="/cart" exactMatch element = {<Cart />}/>
      <Route path="/place_order" element = {<Placeorder />}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;