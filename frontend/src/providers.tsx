import {BrowserRouter} from "react-router-dom";
import UserProvider from "./context/User";
import MeetingsProvider from "./context/Meeting";

function Providers({children}: {children: React.ReactNode}) {
  return (
    <BrowserRouter>
      <UserProvider>
        <MeetingsProvider>{children}</MeetingsProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default Providers;
