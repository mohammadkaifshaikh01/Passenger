import React, { createContext } from 'react'
import { useState } from 'react'
export const ContextProvider = createContext()

const ContextApi = ({children}) => {
   const [formData , setFormData] = useState({})

   console.log("Form Data",formData)
   const value = {
       formData,
       setFormData,
       
   }
  return (
    <ContextProvider.Provider value={value} >
      {children}
    </ContextProvider.Provider>
  )
}

export default ContextApi
