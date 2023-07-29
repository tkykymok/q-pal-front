import useSWR, { mutate } from 'swr';
import container from '@/config/di';
import { IReservationUsecase } from '@/core/usecases/ReservationUsecase';
import { Reservation, WaitTime } from '@/types/models/Reservation';
import { useCallback, useEffect, useMemo } from 'react';
import { CardStatus } from '@/constant/CardStatus';
import getCardStatus = CardStatus.getCardStatus;
import useWebSocket from 'react-use-websocket';
import CreateReservation = ReservationRequest.CreateReservation;
import useAppStore from '@/store/AppStore';

const reservationUsecase = container.get<IReservationUsecase>(
  'IReservationUsecase'
);

/**
 * 今日の予約一覧を取得する
 */
const fetchTodayReservations = async () => {
  const res = await reservationUsecase.getTodayReservations();
  return res.reservations;
};

/**
 * 最後尾の待ち時間を取得する
 */
const fetchLineEndWaitTime = async () => {
  const res = await reservationUsecase.getLineEndWaitTime();
  return res.data;
};

export const useReservationKiosk = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const setLoading = useAppStore((state) => state.setLoading);

  const { data: reservations, error: reservationsError, isLoading: reservationsLoading } = useSWR<
    Reservation[]
  >('reservations', fetchTodayReservations);

  const { data: waitTime } = useSWR<WaitTime>(
    'lineEndWaitTime',
    fetchLineEndWaitTime
  );

  const wsReservation = useWebSocket(
    process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL + `/reservation?storeId=2`
  );

  useEffect(() => {
    if (wsReservation.lastMessage?.data) {
      setLoading(true)
      mutate('reservations').then(() => {
        setLoading(false)
      });
      mutate('lineEndWaitTime').then(() => {});
    }
  }, [setLoading, wsReservation.lastMessage]);

  /**
   * ステータス毎予約一覧Map
   */
  const reservationsMap = useMemo(() => {
    // 予約一覧をステータス毎にMapに格納します。
    return reservations?.reduce((map, reservation) => {
      const statusGroup = map.get(getCardStatus(reservation.status)!) || [];
      statusGroup.push(reservation);
      map.set(getCardStatus(reservation.status)!, statusGroup);
      return map;
    }, new Map<CardStatus.Status, Reservation[]>());
  }, [reservations]);

  /**
   * 新規予約
   */
  const createReservation = async () => {
    setLoading(true);
    const request: CreateReservation = { storeId: 2 };
    await reservationUsecase.createReservation(request);
    setLoading(false)
  };

  return {
    isLoading,
    reservationsMap,
    waitTime,
    createReservation,
  };
};
