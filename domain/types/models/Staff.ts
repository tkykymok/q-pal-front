export type Staff = {
  storeId: number;
  staffId: number;
  order: number | null;
  name: string;
  breakStartDatetime: string;
  breakEndDatetime: string;
  activeFlag: boolean;
};