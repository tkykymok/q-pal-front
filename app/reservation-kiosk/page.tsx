import RootLayout from '@/app/layout';

export default function ReservationKiosk() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 w-full m-5">
        <div className="rounded-md bg-white shadow-xl ">
          <div className="w-24 p-2">
            <div className="flex justify-center rounded-xl bg-green-300 py-2 text-neutral-700">
              案内中
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 p-2">
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">1</div>
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">2</div>
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">3</div>
          </div>
        </div>

        <div className="rounded-md bg-white shadow-xl">
          <div className="w-24 p-2">
            <div className="flex justify-center rounded-xl bg-gray-400 py-2 text-white">
              保留
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 p-2">
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">4</div>
          </div>
        </div>

        <div className="rounded-md col-span-2 bg-white shadow-xl">
          <div className="w-24 p-2">
            <div className="flex justify-center rounded-xl bg-blue-200 py-2 text-neutral-700">
              案内待ち
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2 p-2">
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">5</div>
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">6</div>
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">7</div>
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">8</div>
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">9</div>
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">10</div>
            <div className="flex justify-center items-center w-14 h-14 rounded-md bg-orange-100 text-2xl">11</div>
          </div>
        </div>

        <div className="flex justify-center col-span-4">
          <div className="flex flex-col justify-center w-1/3">
            <div className="flex flex-col items-center space-y-12 py-10 bg-white">
              <div className="text-3xl">次の予約番号</div>
              <div className="text-5xl font-bold">12</div>
              <div className="flex flex-col items-center">
                <p className="text-3xl">8番目のご案内です</p>
                <p className="text-xl mt-2 text-neutral-600">待ち時間目安：30分〜45分</p>
              </div>

              <div className="flex justify-center w-2/3 p-5 bg-blue-700 rounded-lg shadow-2xl hover:bg-blue-600 cursor-pointer">
                <p className="text-white text-2xl">発券する</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
