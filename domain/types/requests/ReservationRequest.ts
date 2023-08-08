namespace ReservationRequest {
  export type CreateReservation = {
    storeId: number;
  }

  export type GetMyWaitingInfo = {
    encryptedText: string;
  }
}
