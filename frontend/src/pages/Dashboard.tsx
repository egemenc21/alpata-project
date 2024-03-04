
// interface DashboardProps {}

import { useContext } from "react";
import { UserContext } from "../context/User";

function Dashboard() {
    const { userData } = useContext(UserContext)
  return <div> {userData?.name} </div>
}

export default Dashboard;