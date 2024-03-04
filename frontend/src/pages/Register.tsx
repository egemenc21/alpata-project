import {useState} from "react";
import Button, { BUTTON_TYPE_CLASSES } from "../components/Button";
import axios from "axios";

const defaultFormFields = {
  name: "",
  surname: "",
  phone: "",
  email: "",
  password: "",
  image:""
};

function Register() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [file, setFile] = useState<File>()
  const {name, surname, phone, email, password,image} = formFields;

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>){
    e.preventDefault();
    const newFormFields = { name, surname, phone, email, password }

    const { data } = await axios.post('/register', newFormFields);
    const formData = new FormData()
    if (file) {
      formData.append('file', file);
   }   
    const res = await axios.post('/register/profile',formData)
    const data2 = res.data
    console.log(data, data2)
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = e.target;
    setFormFields({...formFields, [name]: value});
  }

  function convertToBase64(e: React.ChangeEvent<HTMLInputElement>) {
    const {name} = e.target;
    const reader = new FileReader()
    if(e.target.files)
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            console.log(reader.result) // base64encoded string
            setFormFields({...formFields, [name]: reader.result});
        }
        reader.onerror = error => {
            console.log("Error", error)
        }
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>){
    if(e.target.files){
      setFile(e.target.files[0])
      console.log(e.target.files[0])}
      convertToBase64(e)
  }
  

  return (
    <section className="flex flex-col h-screen justify-center items-center gap-5 bg-blue-500 text-gray-100">
      <h2 className="text-lg">Do you have an account? Please register!</h2>
      <form className="flex flex-col gap-5 text-gray-700" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          required
          placeholder="Your name"
          className="p-3 rounded-lg"
          onChange={handleOnChange}
        />
        <input
          type="text"
          name="surname"
          value={surname}
          required
          placeholder="Your surname"
          className="p-3 rounded-lg"
          onChange={handleOnChange}
        />
        <input
          type="text"
          name="phone"
          value={phone}
          required
          placeholder="Your phone number"
          className="p-3 rounded-lg"
          onChange={handleOnChange}
        />
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
  );
}

export default Register;
