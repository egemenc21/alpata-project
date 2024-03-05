// interface SignInProps {}

import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "../context/User";
import axios from "axios";
import Button, {BUTTON_TYPE_CLASSES} from "../components/Button";

const defaultFormFields = {
  email: "",
  password: "",
};

function SignIn() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {email, password} = formFields;
  const {userData, setUserData} = useContext(UserContext);

  useEffect(() => {
    if (userData && userData.id) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const {data} = await axios.post("/sign-in", formFields);
    setUserData(data);
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = e.target;
    setFormFields({...formFields, [name]: value});
  }

  return (
    <section className="flex flex-col h-screen justify-center items-center gap-5 bg-blue-500 text-gray-100">
      <h2 className="text-lg">Already have an account? Please sign in!</h2>
      <form
        className="flex flex-col gap-5 text-gray-700"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          value={email}
          required
          placeholder="Your email"
          className="p-3 rounded-lg"
          onChange={handleOnChange}
        />
        <input
          type="password"
          name="password"
          value={password}
          required
          placeholder="Your password"
          className="p-3 rounded-lg"
          onChange={handleOnChange}
        />
        <Button type="submit" buttonType={BUTTON_TYPE_CLASSES.inverted}>          
          Sign in
        </Button>
      </form>
      <div className="flex flex-col items-center gap-2">
        <h3>You want to register ? </h3>
        <Link to="/register" className="underline">
          Go to register page
        </Link>
      </div>
    </section>
  );
}

export default SignIn;
