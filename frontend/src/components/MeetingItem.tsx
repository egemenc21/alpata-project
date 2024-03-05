import axios from "axios";
import {useContext} from "react";
import {MeetingsContext} from "../context/Meeting";
import ListItem from "./ListItem";

interface Document {
  id: number;
  filename: string;
  link: string;
  meetingId: number;
}

export interface Meeting {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  authorId: number;
  document: Document[];
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
    <li className="flex flex-wrap gap-10 p-4 ">
      <ListItem title={meeting.title} />
      <ListItem
        title={new Date(meeting.startDate).toLocaleDateString("en-GB")}
      />
      <ListItem title={new Date(meeting.endDate).toLocaleDateString("en-GB")} />
      <ListItem title={meeting.description} />
      <a href={`http://localhost:4000/${meeting.document[0].filename}`} target="_blank">Go to document</a>

      <button
        onClick={() => handleDelete(meeting.id)}
        className="w-[100px] text-center"
      >
        X
      </button>
    </li>
  );
}

export default MeetingItem;
