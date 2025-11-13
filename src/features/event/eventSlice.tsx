import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { createEvent, deleteEvents, listEvent, updateEvent } from "./eventApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface EventState {
  events: InitState<any[]>;
  totalEvents: InitState<any[]>;
}

const initialState: EventState = {
  events: { data: [], loading: false, error: null, status: null },
  totalEvents: { data: [], loading: false, error: null, status: null },
};
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listEvent, ["events", "totalEvents"]);
    createAsyncReducer(builder, createEvent);
    createAsyncReducer(builder, updateEvent);
    createAsyncReducer(builder, deleteEvents);
  },
});

export default eventSlice.reducer;
