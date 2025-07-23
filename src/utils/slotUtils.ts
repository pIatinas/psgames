
import { Account, AccountSlot } from '@/types';

export const getSlotByNumber = (account: Account, slotNumber: number): AccountSlot | undefined => {
  return account.slots?.find(slot => slot.slot_number === slotNumber);
};

export const getAvailableSlots = (account: Account): number => {
  return 2 - (account.slots?.length || 0);
};

export const isSlotOccupied = (account: Account, slotNumber: number): boolean => {
  return !!getSlotByNumber(account, slotNumber);
};

export const getUserSlot = (account: Account, userId: string): AccountSlot | undefined => {
  return account.slots?.find(slot => slot.user_id === userId);
};
