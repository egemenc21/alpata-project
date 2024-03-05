import axios from "axios";
import {useContext} from "react";
import {MeetingsContext} from "../context/Meeting";
import ListItem from "./ListItem";

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
    <li className="flex gap-10 p-2">
      <ListItem title={meeting.title}/>
      <ListItem title={new Date(meeting.startDate).toLocaleDateString("en-GB")}/>
      <ListItem title={new Date(meeting.endDate).toLocaleDateString("en-GB")}/>
      <ListItem title={meeting.description}/>

      <button onClick={() => handleDelete(meeting.id)} className="w-[100px] text-start">X</button>
    </li>
  );
}

export default MeetingItem;
