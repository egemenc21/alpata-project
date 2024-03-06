// interface DashboardProps {}

import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/User";
import axios from "axios";
import Button, {BUTTON_TYPE_CLASSES} from "../components/Button";
import Navigation from "../components/Navigation";
import MeetingItem, {Meeting} from "../components/MeetingItem";
import {MeetingsContext} from "../context/Meeting";
import ListItem from "../components/ListItem";

const emptyFormFields = {
  id: 0,
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  authorId: 0,
  document: [],
};

function Dashboard() {
  const {userData} = useContext(UserContext);
  const {meetings, setMeetings} = useContext(MeetingsContext);
  
  const [file, setFile] = useState<File>();
  const [formFields, setFormFields] = useState<Meeting>(emptyFormFields);
  const {title, startDate, endDate, description} = formFields;

  useEffect(() => {
    fetchMeetings();
  }, [userData]);

  const fetchMeetings = async () => {
    if (userData && userData.id) {
      const response = await axios.get<Meeting[]>(`/meetings/${userData.id}`);
      console.log(response);
      setMeetings(response.data);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData && userData.id) {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
        formData.append("title", title);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("description", description);
        formData.append("authorId", userData.id.toString());
      }

      await axios.post("/meetings", formData);
      await fetchMeetings();

      setFormFields(emptyFormFields);
    }
  };
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <>
      <Navigation />
      <section className="flex flex-col h-screen mt-[150px] items-center gap-10">
        <div className="flex max-lg:flex-col w-full flex-row gap-10 p-4 justify-center">
          <ul className="flex flex-col gap-2">
            <li className="flex flex-wrap gap-10 p-2 border-b border-black border-solid">
              <ListItem title="Name" />
              <ListItem title="Starting Date" />
              <ListItem title="End Date" />
              <ListItem title="Description" />
              <ListItem title="Document Link" />
              <ListItem title="Update" />
              <ListItem title="Removed" />
            </li>
            {meetings.map((meeting) => (
              <MeetingItem key={meeting.id} meeting={meeting} />
            ))}
          </ul>
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="Meeting Name"
              required
            />
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="Description"
            ></textarea>
            <input type="file" onChange={handleImageChange} name="file" />
            <Button buttonType={BUTTON_TYPE_CLASSES.base}>Add Meeting</Button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
