import { createSlice } from "@reduxjs/toolkit";
import { User } from "interfaces";
import { auth } from "services/firebase";

// type InitialStateType = {
//   user: User | {};
// };

const initialState = {
  chatId: "",
  recipient: {},
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    changeChat: (state, action) => {
      if (!auth.currentUser || !action.payload) return;

      const currentUser: any = auth.currentUser.uid;
      const recipient = action.payload.uid;

      state.recipient = action.payload;
      state.chatId =
        currentUser.uid > recipient.uid
          ? currentUser.uid + recipient.uid
          : recipient.uid + currentUser.uid;

      console.log(state.recipient);
    },
  },
});

export const getChatState = (state: any) => state.chat;

export const { changeChat } = chatSlice.actions;

export default chatSlice.reducer;