import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listImage, listImageType, listPageImage } from "./imageApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface ImageState {
  images: InitState<any[]>;
  totalImage: InitState<any[]>;
  imageTypes: InitState<any[]>;
  pageImages: InitState<any[]>;
}

const initialState: ImageState = {
  images: { data: [], loading: false, error: null, status: null },
  totalImage: { data: [], loading: false, error: null, status: null },
  imageTypes: { data: [], loading: false, error: null, status: null },
  pageImages: { data: [], loading: false, error: null, status: null },
};
const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listImage, ["images", "totalImage"]);
    createAsyncReducer(builder, listImageType, "imageTypes");
    createAsyncReducer(builder, listPageImage, "pageImages");
  },
});

export default imageSlice.reducer;
