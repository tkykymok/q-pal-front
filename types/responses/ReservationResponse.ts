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
  };

  type WaitTime = {
    reservationNumber: number;
    position: number;
    time: number;
  }

  export type GetWaitTime = {
    data: WaitTime
  };

  export type GetReservations = {
    reservations: Reservation[];
  };
}