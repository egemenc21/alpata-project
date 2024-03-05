// interface NavigationProps {}

import {useContext, useEffect} from "react";
import {UserContext} from "../context/User";
import Button, {BUTTON_TYPE_CLASSES} from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MeetingsContext } from "../context/Meeting";

function Navigation() {
    const navigate = useNavigate()
  const {userData, setUserData} = useContext(UserContext);
  const {setMeetings} = useContext(MeetingsContext);

  useEffect(() => {
    if(userData && userData.id == 0)
        navigate('/')
  }, [userData])
  

  async function handleOnClick() {
    const {data} = await axios.post("/sign-out");
    setUserData({id: 0, email: "", name: "", surname: ""});
    setMeetings([])
    console.log(data);
  }

  return (
    <nav className="p-4 flex gap-5 justify-evenly items-center bg-blue-700 text-gray-100 flex-wrap">
      <div className="flex flex-wrap gap-5">
        <div>
          {userData?.name} {userData?.surname}
        </div>
        <div>{userData?.email}</div>
      </div>
      <Button
        type="button"
        buttonType={BUTTON_TYPE_CLASSES.inverted}
        className="p-2"
        onClick={handleOnClick}
      >
        Sign out
      </Button>
    </nav>
  );
}

export default Navigation;
