import React, { useContext, useMemo, useState } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { App, Button, Modal, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { useRequest } from 'ahooks';
import { sectionAll, updateSections } from '@/api/sections';
import { UpdateSectionOrderDto } from 'backend-services/sections/dto/update-section-order.dto.js';

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const columns: TableColumnsType = [
  { key: 'sort', align: 'center', width: 80, render: () => <DragHandle /> },
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '标题', dataIndex: 'title', key: 'title' },
];

interface Props {
  refreshCurrentList: () => void;
}

export const Sort: React.FC<Props> = ({ refreshCurrentList }) => {
  const [dataSource, setDataSource] = useState<
    Awaited<ReturnType<typeof sectionAll>>
  >([]);

  const { message } = App.useApp();
  const { run } = useRequest(updateSections, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      refreshCurrentList();
    },
  });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.id === active?.id,
        );
        const overIndex = prevState.findIndex(
          (record) => record.id === over?.id,
        );
        const newArr = arrayMove(prevState, activeIndex, overIndex);
        return newArr;
      });
    }
  };

  const [open, setOpen] = useState(false);

  const onCancel = () => {
    setOpen(false);
    /*
     * 发送排序后的字段到后台
     */
    const orders: UpdateSectionOrderDto = {
      items: dataSource.map((item, index) => ({
        id: item.id,
        order: dataSource.length - index - 1,
      })),
    };

    run(orders);
  };

  const { loading } = useRequest(sectionAll, {
    ready: !!open,
    refreshDeps: [open],
    onError(e) {
      message.error(e.message);
    },
    onSuccess(data) {
      setDataSource(data);
    },
  });

  return (
    <>
      <Button
        color="default"
        variant="filled"
        onClick={() => {
          setOpen(true);
        }}
      >
        整体排序
      </Button>

      <Modal
        title="整体排序"
        open={open}
        onCancel={onCancel}
        width={600}
        centered
      >
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={dataSource.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              rowKey="id"
              components={{ body: { row: Row } }}
              columns={columns}
              loading={loading}
              dataSource={dataSource}
              pagination={false}
              scroll={{ y: `calc(100vh - 400px)` }}
            />
          </SortableContext>
        </DndContext>
      </Modal>
    </>
  );
};
