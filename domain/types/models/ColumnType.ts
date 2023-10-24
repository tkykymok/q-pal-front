import {CardStatus} from '@/constant/CardStatus';
import Status = CardStatus.Status;

export interface ColumnType {
  staffId?: number | null;
  status: Status;
  title: string;
}