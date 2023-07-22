namespace ReservationResponse {
  export type GetReservation = {
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

  export type GetWaitTime = {
    data: {
      reservationNumber: number;
      position: number;
      time: number;
    }
  };

  export type GetReservations = {
    reservations: GetReservation[];
  };
}
