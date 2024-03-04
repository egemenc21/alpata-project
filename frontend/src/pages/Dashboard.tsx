// interface DashboardProps {}

import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/User";
import axios from "axios";
import Button, {BUTTON_TYPE_CLASSES} from "../components/Button";

interface Meeting {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  authorId: number;
}

function Dashboard() {
  const {userData} = useContext(UserContext);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
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
    const response = await axios.get<Meeting[]>("/meetings");
    setMeetings(response.data);
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

  const handleDelete = async (id: number) => {
    await axios.delete(`/meetings/${id}`);
    await fetchMeetings();
  };

  // const newStartDate = new Date(formData.startDate)
  //   console.log(newStartDate)
  return (
    <>
      <div className="text-center mt-5">
        {" "}
        {userData?.name ? userData?.name : "loading"}{" "}
      </div>
      <section className="flex flex-col h-screen justify-center items-center">
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
        <ul>
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              {meeting.title} -{" "}
              {new Date(meeting.startDate).toLocaleDateString("en-GB")} -{" "}
              {new Date(meeting.endDate).toLocaleDateString("en-GB")}
              <button onClick={() => handleDelete(meeting.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Dashboard;
