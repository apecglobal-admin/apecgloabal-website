export const createAsyncReducer = (builder: any, thunk: any, stateKey?: string) => {
  builder
    .addCase(thunk.pending, (state: any) => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    })
    .addCase(thunk.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = "succeeded";
      if (stateKey) state[stateKey] = action.payload;
      state.error = null;
    })
    .addCase(thunk.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = "failed";
      state.error = action.payload?.message;
    });
};