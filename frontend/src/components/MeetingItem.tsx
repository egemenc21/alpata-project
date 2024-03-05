import axios from "axios";
import {useContext} from "react";
import {MeetingsContext} from "../context/Meeting";

export interface Meeting {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  authorId: number;
}

interface MeetingProps {
  meeting: Meeting;
}

function MeetingItem({meeting}: MeetingProps) {
  const {setMeetings} = useContext(MeetingsContext);

  const fetchMeetings = async () => {
    const response = await axios.get<Meeting[]>(
      `/meetings/${meeting.authorId}`
    );
    setMeetings(response.data);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/meetings/${id}`);
    await fetchMeetings();
  };

  return (
    <li>
      {meeting.title} -{" "}
      {new Date(meeting.startDate).toLocaleDateString("en-GB")} -{" "}
      {new Date(meeting.endDate).toLocaleDateString("en-GB")}
      <button onClick={() => handleDelete(meeting.id)}>Delete</button>
    </li>
  );
}

export default MeetingItem;
