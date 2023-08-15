import useSWR from 'swr';
import container from '@/config/di';
import { IReservationUsecase } from '@/domain/usecases/ReservationUsecase';
import { Reservation, WaitingInfo } from '@/domain/types/models/Reservation';
import { useEffect, useMemo, useState } from 'react';
import { CardStatus } from '@/constant/CardStatus';
import useAppStore from '@/store/AppStore';
import GetMyWaitingInfo = ReservationRequest.GetMyWaitingInfo;
import { useSearchParams } from 'next/navigation';

const reservationUsecase = container.get<IReservationUsecase>(
  'IReservationUsecase'
);

/**
 * 今日の予約一覧を取得する
 */
const fetchTodayReservations = async () => {
  return await reservationUsecase.getTodayReservations();
};

/**
 * 最後尾の待ち時間を取得する
 */
const fetchMyWaitingInfo = async (encryptedText: string) => {
  const request: GetMyWaitingInfo = {
    encryptedText: encodeURIComponent(encryptedText),
  };
  return await reservationUsecase.getMyWaitingInfo(request);
};

export const useMyReservation = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const setLoading = useAppStore((state) => state.setLoading);
  const [waitingInfo, setWaitingInfo] = useState<WaitingInfo>();
  const [reservationNumber, setReservationNumber] = useState<number>();
  const searchParams = useSearchParams();

  const queryParam = useMemo(() => {
    return searchParams.get('data') ?? null;
  }, [searchParams]);

  const {
    data: reservations,
    error: reservationsError,
    isLoading: reservationsLoading,
  } = useSWR<Reservation[]>('reservations', fetchTodayReservations);

  useEffect(() => {
    const fetchData = async () => {
      if (queryParam) {
        try {
          const result = await fetchMyWaitingInfo(queryParam);
          setWaitingInfo(result);
        } catch (err) {}
      }
    };
    setLoading(true);
    fetchData()
      .then((r) => {})
      .finally(() => setLoading(false));
  }, [setLoading, queryParam]);

  /**
   * ステータス毎予約一覧Map
   */
  const reservationsMap = useMemo(() => {
    // 予約一覧をステータス毎にMapに格納します。
    return reservations?.reduce((map, reservation) => {
      const statusGroup = map.get(reservation.status) || [];
      statusGroup.push(reservation);
      map.set(reservation.status, statusGroup);
      return map;
    }, new Map<CardStatus.Status, Reservation[]>());
  }, [reservations]);

  return {
    isLoading,
    reservationNumber,
    setReservationNumber,
    reservationsMap,
    waitingInfo,
  };
};
