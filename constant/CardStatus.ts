import Status = CardStatus.Status;

export interface CardType {
  reservationNo: number;
  customerId: number;
  staffId: number | null;
  status: Status;
  name: string;
  menu: string;
  pendingStartTime?: string;
}

export interface ColumnType {
  staffId?: number | null;
  status: Status;
  title: string;
}

export namespace CardStatus {
  export const IN_PROGRESS = 'inProgress';
  export const WAITING = 'waiting';
  export const PENDING = 'pending';
  export const DONE = 'done';

  export type Status =
    | typeof IN_PROGRESS
    | typeof WAITING
    | typeof PENDING
    | typeof DONE;

  const statusMapping = new Map<Status, { status: string; title: string }>([
    [IN_PROGRESS, { status: IN_PROGRESS, title: '案内中' }],
    [WAITING, { status: WAITING, title: '案内待ち' }],
    [PENDING, { status: PENDING, title: '保留' }],
    [DONE, { status: DONE, title: '案内済み' }],
  ]);

  export const getCardStatus = (str: string): Status | undefined => {
    return statusMapping.get(str as Status)?.status as Status;
  };

  export const getCardStatusTitle = (status: Status): string => {
    return statusMapping.get(status)?.title ?? '';
  };
}
