import {useContext, useEffect, useState} from "react";
import Button, {BUTTON_TYPE_CLASSES} from "../components/Button";
import axios from "axios";
import {UserContext} from "../context/User";
import {Link, useNavigate} from "react-router-dom";

const defaultFormFields = {
  name: "",
  surname: "",
  phone: "",
  email: "",
  password: "",
  image: "",
};

function Register() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [file, setFile] = useState<File>();
  const {userData, setUserData} = useContext(UserContext);

  useEffect(() => {
    if (userData && userData.id) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  const {name, surname, phone, email, password, image} = formFields;

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append("name", name)
      formData.append("surname", surname)
      formData.append("phone", phone)
      formData.append("email", email)
      formData.append("password", password)
    }    
    const {data} = await axios.post("/register", formData);    
    setUserData({id: data.id, name, surname, email, profile_picture:data.profile_picture});
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = e.target;
    setFormFields({...formFields, [name]: value});
  }

  // function convertToBase64(e: React.ChangeEvent<HTMLInputElement>) {
  //   const {name} = e.target;
  //   const reader = new FileReader()
  //   if(e.target.files)
  //       reader.readAsDataURL(e.target.files[0])
  //       reader.onload = () => {
  //           console.log(reader.result) // base64encoded string
  //           setFormFields({...formFields, [name]: reader.result});
  //       }
  //       reader.onerror = error => {
  //           console.log("Error", error)
  //       }
  // }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
    // convertToBase64(e)
  }

  return (
    <section className="flex flex-col h-screen justify-center items-center gap-5 bg-blue-500 text-gray-100">
      <h2 className="text-lg">Please register!</h2>
      <form
        className="flex flex-col gap-5 text-gray-700"
        onSubmit={handleSubmit}
      >
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
        <input type="file" onChange={handleImageChange} name="file" />
        {image == "" ? null : (
          <img
            src={image}
            alt="Your profile picture"
            width={100}
            height={100}
          />
        )}

        <Button type="submit" buttonType={BUTTON_TYPE_CLASSES.inverted}>
          {" "}
          Register{" "}
        </Button>
      </form>
      <div className="flex flex-col items-center gap-2">
        <h3>Already have an account ? </h3>
        <Link to="/" className="underline">
          Go to sign-in page
        </Link>
      </div>
    </section>
  );
}

export default Register;
