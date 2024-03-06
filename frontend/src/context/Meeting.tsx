"use client";
import {createContext, useState} from "react";
import {Meeting} from "../components/MeetingItem";

interface MeetingsContextProps {
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
}

const defaultMeetingsData: Meeting[] = [];

export const MeetingsContext = createContext<MeetingsContextProps>({
  meetings: defaultMeetingsData,
  setMeetings: () => {},
});


function MeetingsProvider({children}: {children: React.ReactNode}) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  return (
    <MeetingsContext.Provider value={{meetings, setMeetings}}>
      {children}
    </MeetingsContext.Provider>
  );
}

export default MeetingsProvider;
