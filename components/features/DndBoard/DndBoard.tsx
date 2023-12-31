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
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import { ColumnType } from '@/domain/types/models/ColumnType';

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
    staffs,
    menus,
    columns,
    reservationsMap,
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
    const filteredReservations = (column: ColumnType) => {
      return reservationsMap
        .get(IN_PROGRESS)
        ?.filter((reservation) => reservation.staffId === column.staffId);
    };

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
          reservations={filteredReservations(column)}
          activeCard={activeCard}
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
    <div className="w-full h-full flex">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <DragOverlay>
          {activeCard && (
            <DraggableCard
              key={activeCard.reservationId}
              id={`card-${activeCard.reservationId}`}
              isDraggable={true}
            >
              <CardContext
                reservation={activeCard}
                isDraggable={false}
                forOverlay={true}
              />
            </DraggableCard>
          )}
        </DragOverlay>

        {/* 案内済みモーダル */}
        <Modal
          isOpen={isModalOpen}
          onOk={() => handleConfirm()}
          onCancel={() => handleCancel(beforeUpdate!)}
        >
          {menus?.map((menu) => (
            <div key={menu.menuId}>{menu.manuName}</div>
          ))}
          content
        </Modal>

        <div className="w-full flex h-full space-x-10">
          <div className="flex-1 flex-col mt-3 space-y-7 overflow-y-auto">
            <div>
              {/* 保留カラム */}
              <DroppableColumn
                status={CardStatus.PENDING}
                title={CardStatus.getCardStatusTitle(CardStatus.PENDING)}
                reservations={reservationsMap.get(CardStatus.PENDING)}
                activeCard={activeCard}
              />
            </div>

            <div>
              {/* 案内待ちカラム */}
              <DroppableColumn
                status={CardStatus.WAITING}
                title={CardStatus.getCardStatusTitle(CardStatus.WAITING)}
                reservations={reservationsMap.get(CardStatus.WAITING)}
                activeCard={activeCard}
              />
            </div>
          </div>

          {/* スタッフカラム */}
          <div className="flex-1 flex flex-col mt-3 overflow-y-auto">
            {renderColumnsContext()}
          </div>

          <div className="flex-1 flex-col mt-3 space-y-7 overflow-y-auto">
            <div>
              {/* 取消カラム */}
              <DroppableColumn
                status={CardStatus.CANCELED}
                title={CardStatus.getCardStatusTitle(CardStatus.CANCELED)}
                reservations={reservationsMap.get(CardStatus.CANCELED)}
                activeCard={activeCard}
              />
            </div>
            <div>
              {/* 案内済みカラム */}
              <DroppableColumn
                status={CardStatus.DONE}
                title={CardStatus.getCardStatusTitle(CardStatus.DONE)}
                reservations={reservationsMap.get(CardStatus.DONE)}
                activeCard={activeCard}
              />
            </div>
          </div>

          {/* スタッフ一覧 */}
          <div className="flex">
            <StaffListArea
              staffList={staffs}
              servingStaffIdList={servingStaffIdList}
            />
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default DndBoard;
