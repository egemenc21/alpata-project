// interface UpdateMeetingProps {}

import {useContext, useEffect, useMemo, useState} from "react";
import Navigation from "../components/Navigation";
import {UserContext} from "../context/User";
import {MeetingsContext} from "../context/Meeting";
import {Meeting} from "../components/MeetingItem";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import Button, {BUTTON_TYPE_CLASSES} from "../components/Button";

const emptyFormFields = {
  id: 0,
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  authorId: 0,
  document: [],
};

function UpdateMeeting() {
  const {userData} = useContext(UserContext);
  const {meetingID} = useParams();
  const {meetings, setMeetings} = useContext(MeetingsContext);
  const navigate = useNavigate()

  useEffect(() => {
    fetchMeetings();
  }, [userData]);

  const fetchMeetings = async () => {
    if (userData && userData.id) {
      const response = await axios.get<Meeting[]>(`/meetings/${userData.id}`);
      setMeetings(response.data);
    }
  };

  console.log(meetings);
  const toBeUpdated = useMemo(() => {
    return meetingID && meetings
      ? meetings.filter((meeting) => meeting.id === parseInt(meetingID))
      : [];
  },[meetingID, meetings])
    

  console.log({toBeUpdated});

  const toBeUpdatedFormFields = useMemo(() => {
    return Array.isArray(toBeUpdated) && toBeUpdated.length !== 0
      ? {
          id: 0,
          title: toBeUpdated[0].title,
          startDate: new Date(toBeUpdated[0].startDate).toISOString().split('T')[0],
          endDate: new Date(toBeUpdated[0].endDate).toISOString().split('T')[0] ,
          description: toBeUpdated[0].description,
          authorId: 0,
          document: toBeUpdated[0].document,
        }
      : emptyFormFields;
  }, [toBeUpdated]);

  const [file, setFile] = useState<File>();
  const [formFields, setFormFields] = useState<Meeting>(toBeUpdatedFormFields);
  const {title, startDate, endDate, description, document} = formFields;

  useEffect(() => {
    if (toBeUpdatedFormFields) {
      setFormFields(toBeUpdatedFormFields);
    }
  }, [toBeUpdatedFormFields]);

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
        formData.append("documentId", document[0].id.toString());
        formData.append("documentName", document[0].filename.toString());

        
      }

      await axios.put(`/meetings/${meetingID}`, formData);
      await fetchMeetings();

      setFormFields(emptyFormFields);
      navigate('/dashboard')
    }
  };
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }
  if (title == "") return <p>Loading...</p>;

  return (
    <>
      <Navigation />
      <section className="flex h-screen justify-center pt-[150px] ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-[50%] ">
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
        <Button buttonType={BUTTON_TYPE_CLASSES.base}>
          Update the Meeting
        </Button>
      </form>
      </section>
      
    </>
  );
}

export default UpdateMeeting;
