import { useState } from 'react'
import './App.css'
import Weather from './weather'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     {/* <h1 className=''>Hello world</h1> */}
     <Weather />
    </>
  )
}

export default App
