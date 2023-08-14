namespace ReservationResponse {
  type Staff = {
    storeId: number;
    staffId: number;
    order: number | null;
    name: string;
    breakStartDatetime: string;
    breakEndDatetime: string;
    activeFlag: boolean;
  };


  export type GetStaffs = Staff[];
}
