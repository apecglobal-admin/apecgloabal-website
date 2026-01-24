import { createSlice } from "@reduxjs/toolkit";

import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listAchivementById, listAchivementCategory, listAchivements } from "./achievementsApi";

// Kiểu dữ liệu InitState (giống các slice khác)
interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

// Kiểu dữ liệu cho AchieventmentState
interface AchieventmentState {
  achievements: InitState<any[]>;
  totalAchievements: InitState<any[]>;
  achievementById: InitState<any | null>;
  listAchivementCategories: InitState<any[]>;
}

// Trạng thái khởi tạo
const initialState: AchieventmentState = {
  achievements: { data: [], loading: false, error: null, status: null },
  totalAchievements: { data: [], loading: false, error: null, status: null },
  achievementById: { data: null, loading: false, error: null, status: null },
  listAchivementCategories: { data: [], loading: false, error: null, status: null },
};

const achievementSlice = createSlice({
  name: "achievement",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Dùng helper cho các async thunk có payload
    createAsyncReducer(builder, listAchivements, ["achievements", "totalAchievements"]);
    createAsyncReducer(builder, listAchivementById, "achievementById");
    createAsyncReducer(builder, listAchivementCategory, "listAchivementCategories");

    // Dùng helper cho API chỉ cần status (không cần lưu payload)

  },
});

export default achievementSlice.reducer;
