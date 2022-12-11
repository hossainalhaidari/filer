import create from "zustand";

import { AuthStatus } from "~/utils/types";

interface AuthContext {
  authStatus: AuthStatus;
  setAuthStatus: (authStatus: AuthStatus) => void;
}

export const useAuthContext = create<AuthContext>((set) => ({
  authStatus: AuthStatus.AUTHORIZING,
  setAuthStatus: (authStatus: AuthStatus) =>
    set((state) => ({ ...state, authStatus })),
}));
