'use client';

import { useReservationKiosk } from '@/hooks/useReservationKiosk';
import { CardStatus } from '@/constant/CardStatus';
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import PENDING = CardStatus.PENDING;
import WAITING = CardStatus.WAITING;

export default function ReservationKiosk() {
  const { reservationsMap, waitTime, createReservation } =
    useReservationKiosk();

  return (
    <div className="grid grid-cols-4 gap-4 w-full m-5">
      <div className="rounded-md bg-white shadow-xl ">
        <div className="w-24 p-2">
          <div className="flex justify-center rounded-xl bg-green-300 py-2 text-neutral-700">
            案内中
          </div>
        </div>
        <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-2 p-2">
          {reservationsMap &&
            reservationsMap.get(IN_PROGRESS)?.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl"
              >
                {reservation.reservationNumber}
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-md bg-white shadow-xl">
        <div className="w-24 p-2">
          <div className="flex justify-center rounded-xl bg-gray-400 py-2 text-white">
            保留
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 p-2">
          {reservationsMap &&
            reservationsMap.get(PENDING)?.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl"
              >
                {reservation.reservationNumber}
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-md col-span-2 bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 w-24 p-2">
          <div className="flex justify-center rounded-xl bg-blue-200 py-2 text-neutral-700">
            案内待ち
          </div>
        </div>

        <div className="grid xl:grid-cols-10 md:grid-cols-6 sm:grid-cols-5 gap-2 p-2">
          {reservationsMap &&
            reservationsMap.get(WAITING)?.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl"
              >
                {reservation.reservationNumber}
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center col-span-4">
        <div className="flex flex-col justify-center xl:w-1/3 md:w-1/2 sm:w-4/5">
          <div className="flex flex-col items-center space-y-12 py-10 bg-white">
            <div className="text-3xl">次の予約番号</div>
            <div className="text-5xl font-bold">
              {waitTime?.reservationNumber}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-3xl">{waitTime?.position}番目のご案内です</p>
              <p className="text-xl mt-2 text-neutral-600">
                待ち時間目安：{waitTime?.time} 分
              </p>
            </div>

            <div
              className="flex justify-center w-2/3 p-5 bg-blue-700 rounded-lg shadow-2xl hover:bg-blue-600 cursor-pointer"
              onClick={createReservation}
            >
              <p className="text-white text-2xl">発券する</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
