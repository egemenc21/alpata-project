import {BrowserRouter} from "react-router-dom";
import UserProvider from "./context/User";

function Providers({children}: {children: React.ReactNode}) {
  return (
    <BrowserRouter>
      <UserProvider>{children}</UserProvider>
    </BrowserRouter>
  );
}

export default Providers;
