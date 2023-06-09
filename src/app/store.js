import { configureStore } from "@reduxjs/toolkit";
import formSlice from "../features/formSlice";
import loggedInUserSlice from "../features/loggedInUserSlice";
import jobListingsSlice from "../features/jobListingsSlice";
import searchSlice from "../features/searchSlice";
import searchWordSlice from "../features/searchWordSlice";

export const store = configureStore({
  reducer: {
    form: formSlice,
    user: loggedInUserSlice,
    listings: jobListingsSlice,
    search: searchSlice,
    searchWord: searchWordSlice
  },
});
