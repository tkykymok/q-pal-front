import container from '@/config/di';
import { IReservationUsecase } from '@/domain/usecases/ReservationUsecase';
import useSWR, { mutate } from 'swr';
import { Reservation } from '@/domain/types/models/Reservation';
import { useEffect, useMemo, useState } from 'react';
import { CardStatus } from '@/constant/CardStatus';
import DONE = CardStatus.DONE;
import Status = CardStatus.Status;
import UpdateReservation = ReservationRequest.UpdateReservation;

export const useReservation = () => {
  const [reservationUsecase, setReservationUsecase] =
    useState<IReservationUsecase>();
  useEffect(() => {
    const usecase = container.get<IReservationUsecase>('IReservationUsecase');
    setReservationUsecase(usecase);
  }, []);

  /**
   * 今日の予約一覧を取得する
   */
  const fetchTodayReservations = async () => {
    if (!reservationUsecase) return [] as Reservation[]; //
    return await reservationUsecase.getTodayReservations();
  };
  const {
    data: reservations,
  } = useSWR<Reservation[]>(
    reservationUsecase ? 'reservations' : null,
    fetchTodayReservations
  );

  // ステータス毎予約一覧
  const reservationsMap = useMemo(() => {
    if (!reservations) {
      return new Map<CardStatus.Status, Reservation[]>();
    }
    // 並び替えたカードをステータスによってMapに格納します。
    const cardMap = reservations.reduce((map, reservation) => {
      const statusGroup = map.get(reservation.status) || [];
      statusGroup.push(reservation);
      map.set(reservation.status, statusGroup);
      return map;
    }, new Map<CardStatus.Status, Reservation[]>());

    // Mapの各エントリに格納された配列を並べ替えます。
    cardMap.forEach((cardArray, status) => {
      cardMap.set(
        status,
        cardArray.sort((a, b) => {
          if (status === DONE) {
            return b.reservationId - a.reservationId;
          }
          return a.reservationId - b.reservationId;
        })
      );
    });
    return cardMap;
  }, [reservations]);

  // 予約ステータス更新
  const updateReservationStatus = async (
    reservationId: number | null,
    newStatus: Status,
    oldStatus: Status | null,
    staffId: number | null = null,
    menuId: number | null = null
  ) => {
    // reservationIdがnullの場合、何もしない
    if (!reservationId) return;
    // ステータスに変更がないかつスタッフIDが指定されてない場合、何もしない(別のスタッフに移動した場合の考慮)
    if (newStatus === oldStatus && !staffId) return;

    const request: UpdateReservation = {
      reservationId: reservationId,
      status: newStatus,
      staffId: staffId,
      menuId: menuId,
    };

    try {
      await reservationUsecase!.updateReservation(request);
      // 予約一覧を再検索する
      await mutate('reservations');
    } catch (error) {
      // エラーの場合予約一覧を再検索する
      await mutate('reservations');
    }
  };

  return {
    reservations,
    reservationsMap,
    updateReservationStatus,
  };
};
