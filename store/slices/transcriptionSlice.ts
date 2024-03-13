import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    id: 1,
    name: "Record1",
    size: "1MB",
    format: "srt",
    audiofile: "record1.mp4",
  },
  {
    id: 2,
    name: "Record2",
    size: "2MB",
    format: "srt",
    audiofile: "record2.mp4",
  },
];

const transcriptionSlice = createSlice({
  name: "transcriptions",
  initialState,
  reducers: {
    transcriptionAdded(state, action) {
      state.push(action.payload);
    },
  },
});

export const { transcriptionAdded } = transcriptionSlice.actions;

export default transcriptionSlice.reducer;
