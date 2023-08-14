'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import Image from 'next/image';
import { Switch } from '@headlessui/react';
import { Sidebar } from 'react-pro-sidebar';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Modal from '@/components/Modal';
import { Staff } from '@/domain/types/models/Staff';
import { KeyedMutator } from 'swr';

interface StaffListAreaProps {
  staffList?: Staff[];
  staffsMutate: KeyedMutator<Staff[]>;
  servingStaffIdList: (number | null)[];
}

const StaffListArea: FC<StaffListAreaProps> = ({
  staffList,
  staffsMutate,
  servingStaffIdList = [],
}) => {
  const [searchName, setSearchName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {}, [collapsed]);

  const toggleWorkingStatus = (staffId: number) => {
    const workingStaffCount = staffList!.filter(
      (staff) => staff.activeFlag
    ).length;

    const newStaffList = staffList!.map((staff) => {
      if (staff.staffId === staffId) {
        return {
          ...staff,
          activeFlag: !staff.activeFlag,
          order: !staff.activeFlag ? workingStaffCount + 1 : null,
        };
      }
      return staff;
    });

    staffsMutate(newStaffList, false).then((r) => {});

  };

  const clearSearch = () => {
    setSearchName('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const isServing = (staffId: number) => {
    return servingStaffIdList.includes(staffId);
  };

  const openModal = (staff: Staff) => {
    if (!staff.activeFlag) {
      return;
    }
    setIsOpenModal(true);
  };

  const ArrowIcon = collapsed ? IoIosArrowBack : IoIosArrowForward;
  const justifyContent = collapsed ? 'justify-center' : 'justify-start';

  return (
    <Sidebar
      collapsed={collapsed}
      collapsedWidth="60px"
      className="bg-blue-300"
    >
      <div className={`flex ${justifyContent}`}>
        <ArrowIcon
          className="h-6 w-6 text-neutral-500 cursor-pointer hover:scale-110"
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {!collapsed && (
        <div className="flex flex-col justify-start">
          <form className="flex items-center justify-between bg-white rounded-md p-2 m-3 shadow-lg flex-1 relative">
            <AiOutlineSearch className="h-6 w-6 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 mx-1 outline-none"
              placeholder="Search"
              onInput={(event) =>
                setSearchName((event.target as HTMLInputElement).value)
              }
            />
            <AiOutlineClose
              onClick={clearSearch}
              className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-500 absolute right-2"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
        </div>
      )}

      {staffList?.length &&
        staffList
          .filter((staff) => {
            if (collapsed) {
              return staff.name.includes(searchName) && staff.activeFlag;
            }
            return staff.name.includes(searchName);
          })
          .map((staff) => (
            <div key={staff.staffId} className="p-3 flex">
              <div className={collapsed ? 'w-full' : 'w-1/5 flex items-center'}>
                <Image
                  className={`rounded-full cursor-pointer transition-transform ${
                    staff.activeFlag ? 'hover:scale-125' : ''
                  }`}
                  height={34}
                  width={34}
                  alt="Avatar"
                  src={'/images/img.png'}
                  priority
                  onClick={() => openModal(staff)}
                />
              </div>

              {!collapsed && (
                <div className="w-4/5 flex items-center justify-between mx-3">
                  <div>{staff.name}</div>
                  <div>
                    <Switch
                      checked={staff.activeFlag}
                      onChange={() => toggleWorkingStatus(staff.staffId)}
                      disabled={isServing(staff.staffId)}
                      className={`${
                        !staff.activeFlag
                          ? 'bg-gray-200'
                          : isServing(staff.staffId)
                          ? 'bg-blue-200'
                          : 'bg-blue-600'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className="sr-only">Enable notifications</span>
                      <span
                        className={`${
                          staff.activeFlag ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </div>
                </div>
              )}

              <Modal
                isOpen={isOpenModal}
                onOk={() => {}}
                onCancel={() => setIsOpenModal(false)}
                title="休憩時間設定"
              >
                <div>Modal Content</div>
              </Modal>
            </div>
          ))}
    </Sidebar>
  );
};

export default StaffListArea;
