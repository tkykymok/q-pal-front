namespace ReservationRequest {
  export type CreateReservation = {
    storeId: number;
  }

  export type UpdateReservation = {
    reservationId: number;
    status: string;
    staffId?: number | null;
    menuId?: number | null;
  }

  export type GetMyWaitingInfo = {
    encryptedText: string;
  }
}
