'use client'

import axios from 'axios'
import { createContext, useEffect, useState } from 'react'


export interface UserProps {
  id: number | null
  email: string | null
  name: string | null
  surname: string | null
  profile_picture:string | null

}

interface UserContextProps {
  userData: UserProps | null
  setUserData: React.Dispatch<React.SetStateAction<UserProps | null>>
}

const defaultUserData: UserProps = {
  id: 0,
  email: '',
  name: '',
  surname: '',
  profile_picture:''
}

export const UserContext = createContext<UserContextProps>({
  userData: defaultUserData,
  setUserData: () => {},
})

function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserProps | null>(null)

  //User data is fetched from the token after refresh
  useEffect(() => {
    axios.get('/me').then((response) => {
        setUserData(response.data)
        console.log(response.data)
    })
  }, [])

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
