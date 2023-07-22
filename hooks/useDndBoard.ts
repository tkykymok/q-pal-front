import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { StaffType } from '@/components/features/DndBoard/DndBoard';
import {
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { DragStartEvent } from '@dnd-kit/core/dist/types/events';
import { arrayMove } from '@dnd-kit/sortable';
import { CardStatus, CardType, ColumnType } from '@/constant/CardStatus';

interface UseDndBoardReturn {
  activeCard: CardType | null;
  setActiveCard: Dispatch<SetStateAction<CardType | null>>;
  isMounted: boolean;
  setIsMounted: Dispatch<SetStateAction<boolean>>;
  shouldSwitchColumn: boolean;
  staffList: StaffType[];
  setStaffList: Dispatch<SetStateAction<StaffType[]>>;
  setShouldSwitchColumn: Dispatch<SetStateAction<boolean>>;
  columns: ColumnType[];
  setColumns: Dispatch<SetStateAction<ColumnType[]>>;
  cards: CardType[];
  isModalOpen: boolean;
  beforeUpdate: CardType | null;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  cardsMap: Map<CardStatus.Status, CardType[]>;
  servingStaffIdList: (number | null)[];
  sensors: ReturnType<typeof useSensors>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleConfirm: () => void;
  handleCancel: (beforeUpdate: CardType) => void;
}

export const useDndBoard = (): UseDndBoardReturn => {
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [shouldSwitchColumn, setShouldSwitchColumn] = useState(false);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [staffList, setStaffList] = useState<StaffType[]>([
    {
      staffId: 1,
      name: '山田',
      isWorking: true,
      order: 2,
    },
    {
      staffId: 2,
      name: '鈴木',
      isWorking: true,
      order: 1,
    },
    {
      staffId: 3,
      name: '坂本',
      isWorking: false,
      order: null,
    },
    {
      staffId: 4,
      name: '田中',
      isWorking: true,
      order: 3,
    },
    {
      staffId: 5,
      name: '小島',
      isWorking: false,
      order: null,
    },
    {
      staffId: 6,
      name: '後藤',
      isWorking: false,
      order: null,
    },
  ]);
  const [cards, setCards] = useState<CardType[]>([
    {
      reservationNo: 1,
      customerId: 1,
      staffId: null,
      status: 'Waiting',
      name: '顧客A',
      menu: 'カット',
    },
    {
      reservationNo: 2,
      customerId: 2,
      staffId: null,
      status: 'Waiting',
      name: '顧客B',
      menu: 'カット',
    },
    {
      reservationNo: 3,
      customerId: 3,
      staffId: null,
      status: 'Waiting',
      name: '顧客C',
      menu: 'カット',
    },
    {
      reservationNo: 4,
      customerId: 4,
      staffId: null,
      status: 'Waiting',
      name: '顧客D',
      menu: 'カット',
    },
    {
      reservationNo: 5,
      customerId: 5,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 6,
      customerId: 6,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 7,
      customerId: 7,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 8,
      customerId: 8,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 9,
      customerId: 9,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 10,
      customerId: 10,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 11,
      customerId: 11,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 12,
      customerId: 12,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 13,
      customerId: 13,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 14,
      customerId: 14,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 15,
      customerId: 15,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 16,
      customerId: 16,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 17,
      customerId: 17,
      staffId: null,
      status: 'Waiting',
      name: '顧客E',
      menu: 'カット',
    },
    {
      reservationNo: 18,
      customerId: 18,
      staffId: null,
      status: 'Waiting',
      name: '顧客Z',
      menu: 'カット',
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beforeUpdate, setBeforeUpdate] = useState<CardType | null>(null);

  useEffect(() => {
    const workingStaff = staffList
      .filter((staff) => staff.isWorking)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    setColumns(
      workingStaff.map((staff) => ({
        staffId: staff.staffId,
        status: CardStatus.IN_PROGRESS,
        title: staff.name,
      }))
    );
  }, [setColumns, staffList]);

  const cardsMap = useMemo(() => {
    // 並び替えたカードをステータスによってMapに格納します。
    const cardMap = cards.reduce((map, card) => {
      const statusGroup = map.get(card.status) || [];
      statusGroup.push(card);
      map.set(card.status, statusGroup);
      return map;
    }, new Map<CardStatus.Status, CardType[]>());

    // Mapの各エントリに格納された配列を並べ替えます。
    cardMap.forEach((cardArray, status) => {
      cardMap.set(
        status,
        cardArray.sort((a, b) => {
          if (status === CardStatus.DONE) {
            return b.reservationNo - a.reservationNo;
          }
          return a.reservationNo - b.reservationNo;
        })
      );
    });

    return cardMap;
  }, [cards]);

  // 接客中スタッフID一覧
  const servingStaffIdList = useMemo(() => {
    return cards
      .filter((card) => card.staffId !== null)
      .map((card) => card.staffId);
  }, [cards]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = ({ active }: DragStartEvent) => {
    const { type: activeType, id: activeId } = extractInfo(
      active.id.toString()
    );

    if (activeType === 'card') {
      // @ts-ignore
      setActiveCard(cards.find((card) => card.customerId === activeId));
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const { type: activeType, id: activeId } = extractInfo(
      active.id.toString()
    );

    if (activeType === 'card' && over) {
      // For card dragging
      const { type: overType, id: overId } = extractInfo(over.id.toString());

      if (overType === CardStatus.DONE && activeId) {
        if (activeCard?.status !== CardStatus.IN_PROGRESS) {
          return;
        }
        setBeforeUpdate(activeCard);

        setTimeout(() => {
          setIsModalOpen(true);
        }, 300);
      }

      updateCardStatus(
        activeId,
        CardStatus.getCardStatus(overType.toString())!,
        overId ? Number(overId) : null
      );
      // @ts-ignore
      setActiveCard(null);
    } else if (activeType === 'inProgress' && over) {
      // For column dragging
      const { id: overId } = extractInfo(over.id.toString());
      const oldIndex = columns.findIndex((col) => col.staffId === activeId);
      const newIndex = columns.findIndex((col) => col.staffId === overId);

      setColumns((columns) => {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        // Update the 'order' field of each staff in the staffList
        const newStaffList = staffList.map((staff) => {
          const newOrder = newColumns.findIndex(
            (column) => column.staffId === staff.staffId
          );
          // If the staff is found in the columns, update its order
          if (newOrder !== -1) {
            return { ...staff, order: newOrder + 1 };
          }
          // If the staff is not found in the columns (not working), keep its original data
          return staff;
        });
        setStaffList(newStaffList);

        return newColumns;
      });
      setActiveCard(null);
      setShouldSwitchColumn(false);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleCancel = (beforeUpdate: CardType) => {
    updateCardStatus(
      beforeUpdate.customerId,
      CardStatus.getCardStatus(beforeUpdate.status)!,
      beforeUpdate.staffId ? Number(beforeUpdate.staffId) : null
    );
    setIsModalOpen(false);
  };

  const updateCardStatus = (
    customerId: number | null,
    newStatus: CardStatus.Status,
    staffId: number | null = null
  ) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.customerId === customerId
          ? { ...card, status: newStatus, staffId: staffId }
          : card
      )
    );
  };

  const extractInfo = (str: string) => {
    const parts = str.split('-');
    const type = parts[0];
    const id = parts.length < 2 ? null : parseInt(parts[1]);

    return {
      type: type,
      id: id,
    };
  };

  return {
    activeCard,
    setActiveCard,
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
    setColumns,
    cards,
    cardsMap,
    servingStaffIdList,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleConfirm,
    handleCancel,
  };
};
