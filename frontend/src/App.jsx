import { useState } from 'react';
import './style.scss';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider, } from "react-router-dom";
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Single } from './pages/Single'
import { Write } from './pages/Write'
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
// import Register from './pages/Register';


const Layout =()=>{
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path: "/",
        element:<Home />
      },
      {
        path: "/post/:id",
        element:<Single />
      },
      {
        path: "/write",
        element:<Write />
      },
    ]
  },
  {
    path: "/login",
    element: <div><Login/></div>
  },
  // {
  //   path: "/register",
  //   element: <Register />,
  // },
  {
    path: "/",
    element: <div><Single/></div>
  },
]);

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <div className="container">
        <RouterProvider router={router}/>
      </div>
    </div>
    
  )
}

export default App
