export type CreateActiveStaffReq = {
  staffId: number;
};

export type UpdateActiveStaffsData = {
  staffId: number;
  order: number;
};

export type UpdateActiveStaffsReq = {
  data: UpdateActiveStaffsData[];
};

export type RemoveActiveStaffReq = {
  staffId: number;
};
