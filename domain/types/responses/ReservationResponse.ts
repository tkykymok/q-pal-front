namespace ReservationResponse {
  type Reservation = {
    reservationId: number;
    customerId: number;
    storeId: number;
    staffId: number | null;
    reservationNumber: number;
    reservedDatetime: string;
    holdStartDatetime: string;
    serviceStartDatetime: string;
    serviceEndDatetime: string;
    status: string;
    arrivalFlag: boolean;
    cancelType: number | null;
    content: string;
  };

  type WaitingInfo = {
    reservationNumber: number;
    position: number;
    time: number;
  };

  export type GetReservations = Reservation[];

  export type GetWaitingInfo = WaitingInfo;

  export type CreateReservation = {
    reservationNumber: number;
    content: string;
  };

  export type UpdateReservation = Reservation
}
