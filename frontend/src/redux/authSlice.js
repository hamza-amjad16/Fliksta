import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,            // logged in user
    suggestedUsers: [],    // right sidebar ke liye
    userProfile: null,     // kisi aur user ka profile
    selectedUser: null,    // agar direct select kiya ho
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    // ✅ Follow/Unfollow ka main reducer
    toggleFollow: (state, action) => {
      const targetUserId = action.payload; // jisko follow/unfollow karna hai
      const loggedInUser = state.user;
      
      if (!loggedInUser) return;

      // Agar already follow kiya hua hai → unfollow
      const isFollowing = loggedInUser.following?.includes(targetUserId);

      if (isFollowing) {
        // 1) Logged In User ke following se hatao
        state.user.following = state.user.following.filter(
          (id) => id !== targetUserId
        );

        // 2) Agar profile khula hai to uske followers se hatao
        if (state.userProfile?._id === targetUserId) {
          state.userProfile.followers = state.userProfile.followers.filter(
            (id) => id !== loggedInUser._id
          );
        }

        // 3) Suggested users update karo (optional: unfollow show karao)
        state.suggestedUsers = state.suggestedUsers.map((u) =>
          u._id === targetUserId
            ? { ...u, followers: u.followers.filter((id) => id !== loggedInUser._id) }
            : u
        );
      } else {
        // ✅ Follow logic
        // 1) Logged In User ke following me add karo
        state.user.following.push(targetUserId);

        // 2) Profile page update
        if (state.userProfile?._id === targetUserId) {
          state.userProfile.followers.push(loggedInUser._id);
        }

        // 3) Suggested users update
        state.suggestedUsers = state.suggestedUsers.map((u) =>
          u._id === targetUserId
            ? { ...u, followers: [...u.followers, loggedInUser._id] }
            : u
        );
      }
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  toggleFollow,
} = authSlice.actions;

export default authSlice.reducer;
