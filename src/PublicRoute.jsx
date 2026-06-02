import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API } from "./lib/api";

function PublicRoute({ children }) {
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    fetch(`${API}/user/me`, {
      credentials: 'include'
    })
    .then(res => res.ok ? setAuth(true) : setAuth(false))
    .catch(() => setAuth(false))
  }, [])

  if (auth === null) return null
  if (auth === true) return <Navigate to='/dashboard' />
  return children
}

export default PublicRoute
