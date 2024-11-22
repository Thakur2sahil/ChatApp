import { useState } from 'react'
import UserDashboard from './UserDashboard'
import { Myprovider } from './contextapi'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Myprovider>
    <UserDashboard/>
    </Myprovider>
  )
}

export default App
