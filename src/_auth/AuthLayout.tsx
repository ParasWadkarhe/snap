import { Outlet,Navigate } from "react-router-dom"
import sideImg from './assets/images/side-img.png';

const AuthLayout = () => {

  const isAuthenticated = false;

  return (
    <>
    {isAuthenticated?(
      <Navigate to='/'/>
    ):(
      <>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet/>
      </section>
      <img src={sideImg} alt="side-img" className="hidden sm:block h-screen w-1/2 object-cover bg-no-repeat" />

      </>
    )}
    </>
  )
}

export default AuthLayout

// 34:00