'use client';

import React, { useEffect } from 'react';
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import DraggableCard from '@/components/features/DndBoard/DraggableCard';
import DroppableColumn from '@/components/features/DndBoard/DroppableColumn';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableColumn from '@/components/features/DndBoard/SortableColumn';
import StaffListArea from '@/components/StaffListArea';
import { useDndBoard } from '@/hooks/useDndBoard';
import CardContext from '@/components/features/DndBoard/CardContext';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import Modal from '@/components/Modal';
import { CardStatus } from '@/constant/CardStatus';

export interface StaffType {
  staffId: number;
  name: string;
  isWorking: boolean;
  order?: number | null;
}

const DndBoard = () => {
  const {
    activeCard,
    isMounted,
    setIsMounted,
    shouldSwitchColumn,
    setShouldSwitchColumn,
    isModalOpen,
    beforeUpdate,
    setIsModalOpen,
    staffList,
    setStaffList,
    columns,
    cardsMap,
    servingStaffIdList,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleConfirm,
    handleCancel,
  } = useDndBoard();

  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);
  if (!isMounted) return null;

  // カラムのレンダリングを一つの関数にまとめる
  const renderInProgressColumns = () => {
    return columns.map((column) => {
      const ColumnComponent = shouldSwitchColumn
        ? SortableColumn
        : DroppableColumn;
      return (
        <ColumnComponent
          key={column.staffId}
          status={column.status}
          staffId={column.staffId}
          title={column.title}
          onClickHeader={() => setShouldSwitchColumn(true)}
          cardsList={cardsMap.get(CardStatus.IN_PROGRESS)}
        />
      );
    });
  };

  const renderColumnsContext = () => {
    if (!shouldSwitchColumn) {
      // ドロップカラム
      return (
        <div className="flex flex-col space-y-10">
          {renderInProgressColumns()}
        </div>
      );
    } else {
      return (
        // 並び替えカラム
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          autoScroll={false}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext
            items={columns.map((col) => `${col.status}-${col.staffId}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col space-y-10">
              {renderInProgressColumns()}
            </div>
          </SortableContext>
        </DndContext>
      );
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <DragOverlay>
        {activeCard && (
          <DraggableCard
            key={activeCard.reservationNo}
            id={`card-${activeCard.customerId}`}
            isDraggable={true}
          >
            <CardContext
              card={activeCard}
              isDraggable={false}
              forOverlay={true}
            />
          </DraggableCard>
        )}
      </DragOverlay>

      <Modal
        isOpen={isModalOpen}
        onOk={() => handleConfirm()}
        onCancel={() => handleCancel(beforeUpdate!)}
      >
        content
      </Modal>

      <div className="flex h-screen space-x-5">
        {/* 保留カラム & 案内待ちカラム */}
        <div className="flex-1 flex-col space-y-7 mt-3">
          <div>
            {/* 保留カラム */}
            <DroppableColumn
              status={CardStatus.PENDING}
              title={CardStatus.getCardStatusTitle(CardStatus.PENDING)}
              cardsList={cardsMap.get(CardStatus.PENDING)}
            />
          </div>
          <div>
            {/* 案内待ちカラム */}
            <DroppableColumn
              status={CardStatus.WAITING}
              title={CardStatus.getCardStatusTitle(CardStatus.WAITING)}
              cardsList={cardsMap.get(CardStatus.WAITING)}
            />
          </div>
        </div>

        {/* スタッフカラム */}
        <div className="flex-1 flex flex-col mt-3 overflow-y-auto">
          {renderColumnsContext()}
        </div>

        {/* 案内済みカラム */}
        <div className="flex-1 flex flex-col mt-3">
          <DroppableColumn
            status={CardStatus.DONE}
            title={CardStatus.getCardStatusTitle(CardStatus.DONE)}
            cardsList={cardsMap.get(CardStatus.DONE)}
          />

          {/* 確認用 */}
          {/*<table>*/}
          {/*  <thead>*/}
          {/*    <tr>*/}
          {/*      <th>customerId</th>*/}
          {/*      <th>staffId</th>*/}
          {/*      <th>title</th>*/}
          {/*      <th>status</th>*/}
          {/*    </tr>*/}
          {/*  </thead>*/}
          {/*  <tbody className="text-center">*/}
          {/*    {cards.map((card) => (*/}
          {/*      <tr key={card.reservationNo}>*/}
          {/*        <td>{card.customerId}</td>*/}
          {/*        <td>{card.staffId}</td>*/}
          {/*        <td>{card.title}</td>*/}
          {/*        <td>*/}
          {/*          {card.status}: {getCardStatusTitle(card.status)}*/}
          {/*        </td>*/}
          {/*      </tr>*/}
          {/*    ))}*/}
          {/*  </tbody>*/}
          {/*</table>*/}
          {/*<hr className="my-2" />*/}
          {/*<table>*/}
          {/*  <thead>*/}
          {/*    <tr>*/}
          {/*      <th>staffId</th>*/}
          {/*      <th>name</th>*/}
          {/*      <th>order</th>*/}
          {/*    </tr>*/}
          {/*  </thead>*/}

          {/*  <tbody className="text-center">*/}
          {/*    {staffList.map((staff) => (*/}
          {/*      <tr key={staff.staffId}>*/}
          {/*        <td>{staff.staffId}</td>*/}
          {/*        <td>{staff.name}</td>*/}
          {/*        <td>{staff.order}</td>*/}
          {/*      </tr>*/}
          {/*    ))}*/}
          {/*  </tbody>*/}
          {/*</table>*/}
        </div>

        {/* スタッフ一覧 */}
        <StaffListArea
          staffList={staffList}
          setStaffList={setStaffList}
          servingStaffIdList={servingStaffIdList}
        />
      </div>
    </DndContext>
  );
};

export default DndBoard;
