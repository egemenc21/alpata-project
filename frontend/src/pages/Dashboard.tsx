// interface DashboardProps {}

import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/User";
import axios from "axios";
import Button, {BUTTON_TYPE_CLASSES} from "../components/Button";
import Navigation from "../components/Navigation";
import MeetingItem, {Meeting} from "../components/MeetingItem";
import {MeetingsContext} from "../context/Meeting";
import ListItem from "../components/ListItem";

function Dashboard() {
  const {userData} = useContext(UserContext);
  const {meetings, setMeetings} = useContext(MeetingsContext);
  const [formData, setFormData] = useState<Meeting>({
    id: 0,
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    authorId: 0,
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    if (userData && userData.id) {
      const response = await axios.get<Meeting[]>(`/meetings/${userData.id}`);
      setMeetings(response.data);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData && userData.id) {
      const newFormData = {...formData, authorId: userData.id};

      await axios.post("/meetings", newFormData);
      await fetchMeetings();

      setFormData({
        id: 0,
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        authorId: 0,
      });
    }
  };


  return (
    <>
      <Navigation />
      <section className="flex flex-col h-screen mt-[150px] items-center gap-10">
        <div className="flex max-lg:flex-col w-full flex-row gap-10 p-4 justify-center">
        <ul className="">
            <li className="flex flex-wrap gap-10 p-2 border-b border-black border-solid">
              <ListItem title="Name"/>
              <ListItem title="Starting Date"/>
              <ListItem title="End Date"/>
              <ListItem title="Description"/>
              <ListItem title="Removed"/>
            </li>
            {meetings.map((meeting) => (
              <MeetingItem key={meeting.id} meeting={meeting} />
            ))}
          </ul>
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Meeting Name"
              required
            />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            ></textarea>
            <Button buttonType={BUTTON_TYPE_CLASSES.base}>Add Meeting</Button>
          </form>
         

        </div>
      </section>
    </>
  );
}

export default Dashboard;
