import './App.css'
import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import ProfilePage from './pages/ProfilePage';
import EventFormPage from './forms/EventFormPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import BadgeFromPage from './forms/BadgeFormPage.jsx';

axios.defaults.baseURL= "http://localhost:4000";
axios.defaults.withCredentials = true;


function App() {
  
  return (
    <UserContextProvider>

    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<MainPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/profilepage/:subpage?' element={<ProfilePage/>}/>
        <Route path='/profilepage/:subpage/:action' element={<ProfilePage/>}/>
        <Route path='/profilepage/eventpage/:action/:id' element={<EventFormPage/>}/>
        <Route path='/profilepage/badgepage/:action/:id' element={<BadgeFromPage/>}/>
        <Route path='/eventpage/:id' element={<EventDetailPage/>}/>
        
        
        
      </Route>
    </Routes>

    </UserContextProvider>
   

  )
}

export default App

