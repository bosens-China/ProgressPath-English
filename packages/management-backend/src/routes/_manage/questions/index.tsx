import { createFileRoute } from '@tanstack/react-router';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  App,
  Form,
  Dropdown,
  Select,
  Input,
  Tag,
} from 'antd';
import type { TableProps } from 'antd';
import { SectionQuestion } from 'backend-services/common/prisma.type.ts';
import dayjs from 'dayjs';
import { useAntdTable, useRequest } from 'ahooks';
import { useList } from '@/hooks/use-list';
import { FindQuestionsQueryDto } from 'backend-services/questions/dto/find-questions-query.dto.js';
import { PlusOutlined } from '@ant-design/icons';
import { getList, deleteQuestion } from '@/api/questions';
import { useState } from 'react';
import { BatchUploadDialog } from './-components/batch-upload-dialog';
import { useStructuralSection } from '@/hooks/use-structural-section';
import { EditQuestionDialog } from './-components/edit-question-dialog';
import { QuestionType } from './-components/question-type';
import { getAllQuestionTypes } from '@/api/question-types';

export const Route = createFileRoute('/_manage/questions/')({
  component: QuestionsPage,
});

function QuestionsPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<FindQuestionsQueryDto>();

  const { tableProps, search, refreshCurrentList, resetList } = useList(
    useAntdTable(getList, {
      form,
      onError(e) {
        message.error(e.message);
      },
    }),
  );
  const { submit, reset } = search;

  const { run: removeRun } = useRequest(deleteQuestion, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      refreshCurrentList();
    },
    onError: (e) => message.error(e.message),
  });

  const { courses, sections } = useStructuralSection();
  const { data: questionTypes } = useRequest(getAllQuestionTypes, {
    onError: (e) => message.error(e.message),
  });

  const columns: TableProps<SectionQuestion>['columns'] = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: '所属小节',
      key: 'sectionId',
      render(_, record) {
        const section =
          sections?.find((f) => f.id === record.sectionId) || null;
        // 所属课程
        const course = courses?.find((f) => f.id === section?.courseId) || null;
        return (
          <span>
            <Tag>{course?.title}</Tag>
            <Tag color="processing">{section?.title}</Tag>
          </span>
        );
      },
    },

    {
      title: '类型',
      key: 'questionTypeId',
      render(_, record) {
        const questionType =
          questionTypes?.find((f) => f.id === record.questionTypeId) || null;
        return <span>{questionType?.name}</span>;
      },
    },
    {
      title: '问题',
      dataIndex: 'questionText',
    },
    {
      title: '正确答案',
      dataIndex: 'correctAnswer',
    },
    {
      title: '解释',
      dataIndex: 'explanation',
    },

    {
      title: '问题选项 (JSON)',
      dataIndex: 'options',
    },
    {
      title: '权重（排序）',
      dataIndex: 'order',
    },

    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: (d) => dayjs(d).format('YYYY-MM-DD HH:mm:ss'),
    },

    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            className="p-0!"
            type="link"
            onClick={() => {
              setData(record);
              setOpenDialog(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此问题吗？"
            onConfirm={() => removeRun(record.id)}
          >
            <Button className="p-0!" type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  const courseId = Form.useWatch('courseId', form);

  const filteringSections =
    sections?.filter((f) => f.courseId === courseId) || [];

  const [data, setData] = useState<SectionQuestion | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <div className="flex mb-4">
        <Form className="flex-1" layout="inline" form={form}>
          <Form.Item<FindQuestionsQueryDto> name="courseId">
            <Select
              className="w-40!"
              placeholder="请选择筛选的课程"
              options={courses.map((f) => {
                return {
                  value: f.id,
                  label: f.title,
                };
              })}
            ></Select>
          </Form.Item>
          <Form.Item<FindQuestionsQueryDto> name="sectionId">
            <Select
              className="w-40!"
              placeholder="请选择筛选的小节"
              options={filteringSections.map((f) => {
                return {
                  value: f.id,
                  label: f.title,
                };
              })}
            ></Select>
          </Form.Item>
          <Form.Item<FindQuestionsQueryDto> name="questionTypeId">
            <QuestionType
              className="w-50!"
              placeholder="请选择筛选的问题类型"
            ></QuestionType>
          </Form.Item>
          <Form.Item<FindQuestionsQueryDto> name="title">
            <Input className="w-40!" placeholder="请输入筛选的问题"></Input>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={submit}>
                搜索
              </Button>
              <Button onClick={reset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <Space>
          <Dropdown
            menu={{
              items: [
                {
                  label: '新建问题',
                  key: 'add',
                  onClick() {
                    setData(null);
                    setOpenDialog(true);
                  },
                },
              ],
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setOpen(true);
              }}
            >
              批量上传
            </Button>
          </Dropdown>
        </Space>
      </div>

      <Table {...tableProps} columns={columns}></Table>

      <BatchUploadDialog
        visible={open}
        resetList={resetList}
        setVisible={setOpen}
      ></BatchUploadDialog>

      <EditQuestionDialog
        data={data}
        open={openDialog}
        setOpen={setOpenDialog}
        refreshCurrentList={refreshCurrentList}
        resetList={resetList}
      ></EditQuestionDialog>
    </div>
  );
}
