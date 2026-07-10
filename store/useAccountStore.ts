import { create } from "zustand";
import type { BufferAccountStatus } from "@/lib/types";
import { bufferApi } from "@/lib/api/buffer";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface AccountState {
  accounts: BufferAccountStatus[];
  selectedAccountId: number | null;
  loading: boolean;
  fetchAccounts: () => Promise<void>;
  selectAccount: (id: number | null) => void;
  updateAccount: (id: number, data: { name?: string; api_url?: string }) => Promise<void>;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  selectedAccountId: null,
  loading: false,

  fetchAccounts: async () => {
    set({ loading: true });
    try {
      const accounts = await bufferApi.listAccounts();
      set({ accounts });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load accounts"));
    } finally {
      set({ loading: false });
    }
  },

  selectAccount: (id) => {
    set({ selectedAccountId: id });
  },

  updateAccount: async (id, data) => {
    try {
      const updated = await bufferApi.updateAccount(id, data);
      set({
        accounts: get().accounts.map((a) => (a.id === id ? updated : a)),
      });
      toast.success("Account updated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update account"));
    }
  },
}));
