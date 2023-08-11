import {CardStatus} from '@/constant/CardStatus';
import Status = CardStatus.Status;

export type Reservation = {
  reservationId: number;
  customerId: number;
  customerName: string;
  storeId: number;
  staffId: number | null;
  reservationNumber: number;
  reservedDatetime: string;
  holdStartDatetime: string;
  serviceStartDatetime: string;
  serviceEndDatetime: string;
  status: Status;
  arrivalFlag: boolean;
  cancelType: number | null;
  menuId: number;
  menuName: string;
  price: number;
  content: string
}

export type WaitingInfo = {
  reservationNumber: number;
  position: number;
  time: number;
};
