import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listNews, listNewsType } from "./newsApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface NewsState {
  news: InitState<any[]>;
  totalNews: InitState<any[]>;
  newsTypes: InitState<any[]>;
}

const initialState: NewsState = {
  news: { data: [], loading: false, error: null, status: null },
  totalNews: { data: [], loading: false, error: null, status: null },
  newsTypes: { data: [], loading: false, error: null, status: null },
};
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listNews, ["news", "totalNews"]);
    createAsyncReducer(builder, listNewsType, "newsTypes");
  },
});

export default newsSlice.reducer;
