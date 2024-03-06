import axios from "axios";
import {useContext} from "react";
import {MeetingsContext} from "../context/Meeting";
import ListItem from "./ListItem";
import {FaExternalLinkAlt} from "react-icons/fa";
import {Link} from "react-router-dom";
import Button, {BUTTON_TYPE_CLASSES} from "./Button";

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
    <li className="flex flex-wrap gap-10 p-2 ">
      <ListItem title={meeting.title} />
      <ListItem
        title={new Date(meeting.startDate).toLocaleDateString("en-GB")}
      />
      <ListItem title={new Date(meeting.endDate).toLocaleDateString("en-GB")} />
      <ListItem title={meeting.description} />
      {meeting.document.map((item) => (
        <a
          href={`http://localhost:4000/public/files/${item.filename}`}
          target="_blank"
          className="flex items-center justify-center gap-2 w-[150px]"
          key={item.id}
        >
          Document <FaExternalLinkAlt size={20} />
        </a>
      ))}
      <Link to={`/dashboard/${meeting.id}`} className="w-[150px] flex justify-center">
        <Button buttonType={BUTTON_TYPE_CLASSES.base} className="p-1 text-sm">
          Update
        </Button>
      </Link>
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
