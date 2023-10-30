export type CreateReservationReq = {
  storeId: number;
};

export type UpdateReservationReq = {
  reservationId: number;
  status: string;
  staffId?: number | null;
  menuId?: number | null;
};

export type GetMyWaitingInfoReq = {
  encryptedText: string;
};
