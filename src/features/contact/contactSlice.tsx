import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listContactInfo } from "./contactApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface ContactState {
  contacts: InitState<any[]>;
}

const initialState: ContactState = {
  contacts: { data: [], loading: false, error: null, status: null },
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listContactInfo, "contacts");
  },
});

export default contactSlice.reducer;
