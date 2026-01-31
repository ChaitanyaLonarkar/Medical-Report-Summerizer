import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col"> {/* Added flex flex-col for flex-grow to work */}
        <Navbar />



        <Footer /> {/* Ensure Footer is at the bottom */}
      </div>
    </>
  )
}

export default App
