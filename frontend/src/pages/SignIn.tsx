
// interface SignInProps {}

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/User";
import axios from "axios";

const defaultFormFields = { 
  email: "",
  password: "", 
};

function SignIn() {
  const navigate = useNavigate()
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { userData } = useContext(UserContext)
  if(userData) navigate('/dashboard')

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>){
    e.preventDefault();
    const { data } = await axios.post('/sign-in', formFields);

  }
  console.log(userData)

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = e.target;
    setFormFields({...formFields, [name]: value});
  }


  return <section className="flex flex-col h-screen justify-center items-center gap-5 bg-blue-500 text-gray-100">
  <h2 className="text-lg">Already have an account? Please sign in!</h2>
  <form className="flex flex-col gap-5 text-gray-700" onSubmit={handleSubmit}>
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
    <div className="text-gray-100">Upload a profile photo </div>
    <input type="file" onChange={handleImageChange} name="image"/>
    {image == "" ? null : <img src={image} alt="Your profile picture" width={100} height={100}  />}
    
    <Button type="submit" buttonType={BUTTON_TYPE_CLASSES.inverted}> Register </Button>
    
  </form>
</section>
}

export default SignIn;