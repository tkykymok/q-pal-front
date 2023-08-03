'use client';

import { useReservationKiosk } from '@/hooks/useReservationKiosk';
import { CardStatus } from '@/constant/CardStatus';
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import PENDING = CardStatus.PENDING;
import WAITING = CardStatus.WAITING;
import useAppStore from '@/store/AppStore';
import Loading from '@/components/Loading';
import ReservationCard from '@/components/features/ReservationKiosk/ReservationCard';
import { useQRCode } from 'next-qrcode';
import Modal from '@/components/Modal';

export default function ReservationKiosk() {
  const {
    isLoading,
    reservationNumber,
    setReservationNumber,
    qrUrl,
    setQrUrl,
    reservationsMap,
    waitTime,
    createReservation,
  } = useReservationKiosk();

  const { Image } = useQRCode();

  const getPrintWindow = (html: any) => {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    printWindow!.document.write(
      '<html><head><title>Print</title><style>' +
        // ここに元のページのスタイルを書く
        '* { box-sizing: border-box; }' +
        'body { font-family: Arial, sans-serif; }' +
        '.flex-col {flex-direction: column;}' +
        '.flex { display: flex; }' +
        '.items-center { align-items: center; }' +
        '.w-full { width: 100%; }' +
        '.text-3xl { font-size: 1.875rem; }' +
        '.text-5xl { font-size: 3.25rem; }' +
        '.font-bold { font-weight: bold; }' +
        '</style></head><body>'
    );
    printWindow!.document.write(html);
    printWindow!.document.write('</body></html>');
    printWindow!.document.close();
    return printWindow;
  };

  const handlePrint = () => {
    console.log('handlePrint');
    const printContent = document.getElementById('printContent');
    const printWindow = getPrintWindow(printContent!.innerHTML);
    if (printWindow) {
      printWindow.print();
      printWindow.close();
    }
    setQrUrl(undefined)
  };

  return (
    <>
      {!reservationsMap && <Loading />}
      <div className="grid grid-cols-4 gap-4 w-full m-5">
        <div className="rounded-md bg-white border border-gray-200 shadow-xl ">
          <div className="w-24 p-2">
            <div className="flex justify-center rounded-xl bg-green-300 py-2 text-neutral-700">
              案内中
            </div>
          </div>
          <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-2 p-2">
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

        <div className="rounded-md bg-white border border-gray-200 shadow-xl">
          <div className="w-24 p-2">
            <div className="flex justify-center rounded-xl bg-gray-400 py-2 text-white">
              保留
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 p-2">
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

        <div className="rounded-md col-span-2 bg-white border border-gray-200 shadow-xl overflow-y-auto">
          <div className="sticky top-0 w-24 p-2">
            <div className="flex justify-center rounded-xl bg-blue-200 py-2 text-neutral-700">
              案内待ち
            </div>
          </div>

          <div className="grid xl:grid-cols-10 md:grid-cols-6 sm:grid-cols-5 gap-2 p-2">
            {reservationsMap &&
              reservationsMap
                .get(WAITING)
                ?.map((reservation) => (
                  <ReservationCard
                    key={reservation.reservationId}
                    reservation={reservation}
                    backgroundColor="bg-blue-100"
                  />
                ))}
          </div>
        </div>

        <div className="flex justify-center col-span-4">
          <div className="flex flex-col justify-center xl:w-1/3 md:w-1/2 sm:w-4/5">
            <div className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow-2xl space-y-12 py-10">
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
                className="flex justify-center w-2/3 p-5 bg-blue-700 rounded-lg shadow-2xl hover:bg-blue-600 active:bg-blue-900 cursor-pointer"
                onClick={createReservation}
              >
                <p className="text-white text-2xl">発券する</p>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={!!qrUrl} onOk={handlePrint}>
          <div id="printContent">
            <div className="flex flex-col w-full items-center">
              {reservationNumber && qrUrl && (
                <>
                  <div className="text-3xl">予約番号</div>
                  <div className="text-5xl font-bold">{reservationNumber}</div>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image
                    text={qrUrl}
                    options={{
                      type: 'image/jpeg',
                      quality: 0.3,
                      level: 'M',
                      margin: 3,
                      scale: 1,
                      width: 200,
                      color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                      },
                    }}
                  />
                </>
              )}
            </div>
          </div>
          {/*<p className="break-words">{qrUrl}</p>*/}
        </Modal>
      </div>
    </>
  );
}
