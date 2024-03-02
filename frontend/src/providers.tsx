import {BrowserRouter} from "react-router-dom";


function Providers({children}: {children: React.ReactNode}) {
  return (
    <BrowserRouter>
          {children}
    </BrowserRouter>
  );
}

export default Providers;
