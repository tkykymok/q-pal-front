import useSWR from 'swr';
import container from '@/config/di';
import { IReservationUsecase } from '@/core/usecases/ReservationUsecase';
import {Reservation, WaitTime} from '@/types/models/Reservation';
import { useMemo } from 'react';
import { CardStatus } from '@/constant/CardStatus';
import getCardStatus = CardStatus.getCardStatus;

const reservationUsecase = container.get<IReservationUsecase>(
  'IReservationUsecase'
);

const fetchTodayReservations = async () => {
  const res = await reservationUsecase.getTodayReservations();
  return res.reservations;
};

const fetchLineEndWaitTime = async () => {
  const res = await reservationUsecase.getLineEndWaitTime();
  return res.data;
};
export const useReservationKiosk = () => {
  const { data: reservations, mutate } = useSWR<Reservation[]>(
    'reservations',
    fetchTodayReservations
  );

  const { data: waitTime } = useSWR<WaitTime>(
    'lineEndWaitTime',
    fetchLineEndWaitTime
  );

  const reservationsMap = useMemo(() => {
    // 予約一覧をステータス毎にMapに格納します。
    return reservations?.reduce((map, reservation) => {
      const statusGroup = map.get(getCardStatus(reservation.status)!) || [];
      statusGroup.push(reservation);
      map.set(getCardStatus(reservation.status)!, statusGroup);
      return map;
    }, new Map<CardStatus.Status, Reservation[]>());
  }, [reservations]);

  return {
    reservationsMap,
    waitTime
  };
};
