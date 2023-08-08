'use client';

import { useMyReservation } from '@/hooks/useMyReservation';
import { CardStatus } from '@/constant/CardStatus';
import ReservationCard from '@/components/features/ReservationKiosk/ReservationCard';
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import PENDING = CardStatus.PENDING;
import WAITING = CardStatus.WAITING;
import Loading from '@/components/Loading';

export default function MyReservation() {
  const { isLoading, reservationsMap, waitingInfo } = useMyReservation();

  return (
    <>
      {isLoading || !waitingInfo && <Loading />}
      {waitingInfo && !waitingInfo.reservationNumber ? (
        <div>このURLは無効です</div>
      ) : (
        <div className="grid grid-cols-4 gap-4 w-full p-5">
          <div className="flex justify-center col-span-4">
            <div className="flex flex-col justify-center w-full sm:w-2/3 xl:w-1/3">
              <div className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow-2xl space-y-12 py-10">
                <div className="text-3xl">予約番号</div>
                <div className="text-5xl font-bold">
                  {waitingInfo?.reservationNumber}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-3xl">
                    {waitingInfo?.position}番目のご案内です
                  </p>
                  <p className="text-xl mt-2 text-neutral-600">
                    待ち時間目安：{waitingInfo?.time} 分
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md col-span-4 md:col-span-1 bg-white border border-gray-200 shadow-xl ">
            <div className="w-24 p-2">
              <div className="flex justify-center rounded-xl bg-green-300 py-2 text-neutral-700">
                案内中
              </div>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-1 xl:grid-cols-5 gap-2 p-2">
              {reservationsMap &&
                reservationsMap
                  .get(IN_PROGRESS)
                  ?.map((reservation) => (
                    <ReservationCard
                      key={reservation.reservationId}
                      reservation={reservation}
                      backgroundColor="bg-green-100"
                    />
                  ))}
            </div>
          </div>

          <div className="rounded-md col-span-4 md:col-span-1 bg-white border border-gray-200 shadow-xl">
            <div className="w-24 p-2">
              <div className="flex justify-center rounded-xl bg-gray-400 py-2 text-white">
                保留
              </div>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-1 xl:grid-cols-3 gap-2 p-2">
              {reservationsMap &&
                reservationsMap
                  .get(PENDING)
                  ?.map((reservation) => (
                    <ReservationCard
                      key={reservation.reservationId}
                      reservation={reservation}
                      backgroundColor="bg-gray-100"
                    />
                  ))}
            </div>
          </div>

          <div className="rounded-md col-span-4 md:col-span-2 bg-white border border-gray-200 shadow-xl xl:overflow-y-auto">
            <div className="sticky top-0 w-24 p-2">
              <div className="flex justify-center rounded-xl bg-blue-200 py-2 text-neutral-700">
                案内待ち
              </div>
            </div>

            <div className="grid grid-cols-5 xl:grid-cols-10 gap-2 p-2">
              {reservationsMap &&
                reservationsMap
                  .get(WAITING)
                  ?.map((reservation) => (
                    <ReservationCard
                      key={reservation.reservationId}
                      reservation={reservation}
                      waitingInfo={waitingInfo}
                      backgroundColor="bg-blue-100"
                    />
                  ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
