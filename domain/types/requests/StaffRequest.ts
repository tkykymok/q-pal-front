namespace StaffRequest {
  export type CreateActiveStaff = {
    staffId: number;
  };

  export type UpdateActiveStaffsData = {
    staffId: number;
    order: number;
  };

  export type UpdateActiveStaffs = {
    data: UpdateActiveStaffsData[];
  };

  export type RemoveActiveStaff = {
    staffId: number;
  };
}
