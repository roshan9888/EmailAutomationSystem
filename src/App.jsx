import './App.css';
// import Auth from './componenets/Auth';
import { Route, Routes } from 'react-router-dom';
import Signup from './componenets/Signup';
import GoogleCallback from './componenets/GoogleCallback';

function App() {
  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      {/* <Auth/> */}
      <Routes>
        {/* <Route path="/" element={<Auth />} /> */}
        <Route path="/" element={<Signup />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Routes>
    </div>
  );
}

export default App;
