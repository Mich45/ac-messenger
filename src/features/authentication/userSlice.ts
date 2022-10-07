import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { User } from "interfaces";
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleAuthProvider } from "services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

type InitialStateType = {
  user: User | {};
  status: string;
  errorMsg: string;
};

type loginInfoType = {
  email: string;
  password: string;
};

type signUpInfoType = {
  email: string;
  password: string;
  displayName: string;
  photoURL: string;
};

type editInfoType = {
  displayName?: string;
  bio?: string;
  location?: string;
};

const initialState: InitialStateType = {
  user: {},
  status: "idle", // 'pending' | 'failed' | 'successful'
  errorMsg: "",
};

const setUserInfoDoc = async () => {
  if (!auth.currentUser) return;

  const userDocRef = doc(db, "users", auth.currentUser.uid);
  const userDocData = await getDoc(userDocRef);
  const userChatsDocRef = doc(db, "userChats", auth.currentUser.uid);
  const userChatsDocData = await getDoc(userChatsDocRef);

  if (!userDocData.exists()) {
    setDoc(userDocRef, {
      uid: auth.currentUser.uid,
      photoURL: auth.currentUser.photoURL,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      bio: "A Bio.",
      status: "off",
      location: "Earth",
      contacts: [],
    });
  }

  if (!userChatsDocData.exists()) {
    setDoc(userChatsDocRef, {});
  }
};

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (editInfo: editInfoType) => {
    try {
      if (!auth.currentUser) return;

      const userDocRef = doc(db, "users", auth.currentUser.uid);

      if (editInfo.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: editInfo.displayName,
        });
        updateDoc(userDocRef, {
          displayName: editInfo.displayName,
        });
      }
    } catch (error) {
      throw error;
    }
  }
);

export const emailLogin = createAsyncThunk(
  "user/emailLogin",
  async (loginInfo: loginInfoType) => {
    try {
      await signInWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.password
      );

      setUserInfoDoc();
    } catch (error) {
      throw error;
    }
  }
);

export const googleLogin = createAsyncThunk("user/googleLogin", async () => {
  try {
    await signInWithPopup(auth, googleAuthProvider);
    setUserInfoDoc();
  } catch (error) {
    throw error;
  }
});

export const signUp = createAsyncThunk(
  "user/googleLogin",
  async (signUpInfo: signUpInfoType) => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        signUpInfo.email,
        signUpInfo.password
      );

      if (!auth.currentUser) return;

      await updateProfile(auth.currentUser, {
        displayName: signUpInfo.displayName,
        photoURL: signUpInfo.photoURL,
      });
      setUserInfoDoc();
    } catch (error) {
      throw error;
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = initialState;
      signOut(auth);
      console.log(state.user);
    },
    clearUserStateErr: (state) => {
      state.errorMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        emailLogin.fulfilled,
        googleLogin.fulfilled,
        signUp.fulfilled,
        editProfile.fulfilled
      ),
      (state) => {
        state.status = "successful";
      }
    );
    builder.addMatcher(
      isAnyOf(
        emailLogin.pending,
        googleLogin.pending,
        signUp.pending,
        editProfile.pending
      ),
      (state) => {
        state.status = "pending";
      }
    );
    builder.addMatcher(
      isAnyOf(
        emailLogin.rejected,
        googleLogin.rejected,
        signUp.rejected,
        editProfile.fulfilled
      ),
      (state, action) => {
        state.status = "failed";
        state.errorMsg = action.error.message || "";
      }
    );
  },
});

export const getUserState = (state: any) => state.user;

export const { login, logout, clearUserStateErr } = userSlice.actions;

export default userSlice.reducer;
