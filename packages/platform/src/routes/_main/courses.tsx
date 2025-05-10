import { createFileRoute } from '@tanstack/react-router';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  App,
  Switch,
  Image,
  Popconfirm,
} from 'antd';
import type { TableProps, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { FindCoursesQueryDto } from 'backend-services/courses/dto/find-courses-query.dto.ts';
import { useAntdTable, useRequest } from 'ahooks';
import { addCourse, deleteCourse, editCourse, getList } from '@/api/courses';
import { Course } from 'backend-services/common/prisma.type.ts';
import { CreateCourseDto } from 'backend-services/courses/dto/create-course.dto.js';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { pictureBedUpload } from '@/api/upload';
import dayjs from 'dayjs';

export const Route = createFileRoute('/_main/courses')({
  component: CoursesPage,
});

function CoursesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<CreateCourseDto>();

  const { message } = App.useApp();

  const { run: addCourseRun } = useRequest(addCourse, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      message.success('添加成功');
      handleCancel();
      setRefreshDeps((prev) => prev + 1);
    },
  });

  // 编辑课程
  const { run: editCourseRun } = useRequest(editCourse, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      message.success('编辑成功');
      handleCancel();
      refresh();
    },
  });

  // 删除课程
  const { run: deleteCourseRun } = useRequest(deleteCourse, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      message.success('删除成功');
      refresh();
    },
  });

  const showAddModal = () => {
    form.resetFields();
    setIsModalVisible(true);
    setEditForm(null);
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    const coverImageForm = values.coverImageUrl as unknown as UploadFile[];
    const coverImageUrl = (coverImageForm?.[0]?.response ||
      coverImageForm?.[0]?.url) as string;

    if (editForm) {
      editCourseRun(editForm.id, {
        ...values,
        coverImageUrl,
      });
      return;
    }

    addCourseRun({
      ...values,
      coverImageUrl,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: TableProps<Course>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '略缩图',
      render: (_, record) => {
        if (!record.coverImageUrl) {
          return null;
        }
        return <Image src={record.coverImageUrl} width={48}></Image>;
      },
      key: 'coverImageUrl',
    },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? 'green' : 'volcano'}>
          {isPublished ? '已发布' : '未发布'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            className="p-0!"
            type="link"
            onClick={() => {
              showAddModal();
              setEditForm(record);
            }}
          >
            编辑
          </Button>
          {record.isPublished ? (
            <Button type="link" className="p-0!">
              停用
            </Button>
          ) : (
            <Button type="link" className="p-0!">
              启用
            </Button>
          )}

          <Popconfirm
            title="确定删除吗？"
            description="删除后将无法恢复，请谨慎操作。"
            onConfirm={() => {
              deleteCourseRun(record.id);
            }}
          >
            <Button type="link" danger className="p-0!">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [queryForm] = Form.useForm<FindCoursesQueryDto>();

  // 刷新标识，用于触发查询
  const [refreshDeps, setRefreshDeps] = useState(0);

  const { tableProps, search, refresh } = useAntdTable(getList, {
    form: queryForm,
    refreshDeps: [refreshDeps],
  });
  const { submit, reset } = search;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // 编辑的表单数据
  const [editForm, setEditForm] = useState<Course | null>(null);

  useEffect(() => {
    if (editForm && isModalVisible) {
      form.setFieldsValue({
        ...editForm,
        coverImageUrl: [
          {
            uid: `${editForm.id}`,
            name: editForm.coverImageUrl?.split('/').pop() || '',
            status: 'done',
            url: editForm.coverImageUrl,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any,
        description: editForm.description || '',
      });
    }
  }, [editForm, form, isModalVisible]);

  return (
    <div>
      {/* <h1 className="text-2xl font-semibold mb-4">课程管理</h1>
      <div className="mb-4">
        <Button type="primary" onClick={showAddModal}>
          创建课程
        </Button>
      </div> */}

      <div className="flex items-center py-6">
        <Form
          layout="inline"
          className="flex-1"
          initialValues={{ isPublished: 'all' }}
          form={queryForm}
        >
          <Form.Item<FindCoursesQueryDto> name="title">
            <Input className="w-60" placeholder="请输入课程名称"></Input>
          </Form.Item>
          <Form.Item<FindCoursesQueryDto> name="isPublished">
            <Select
              className="w-30!"
              options={[
                { label: '全部', value: 'all' },

                {
                  label: '启用',
                  value: `true`,
                },
                {
                  label: '禁用',
                  value: `false`,
                },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => submit()}>
                搜索
              </Button>
              <Button onClick={() => reset()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <Button type="primary" onClick={showAddModal} icon={<PlusOutlined />}>
          创建课程
        </Button>
      </div>

      <Table columns={columns} rowKey="id" {...tableProps} />
      <Modal
        title={editForm ? '编辑课程' : '创建课程'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editForm ? '保存' : '创建'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item<CreateCourseDto>
            name="title"
            label="课程标题"
            rules={[{ required: true, message: '请输入课程标题!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<CreateCourseDto> name="description" label="课程描述">
            <Input.TextArea />
          </Form.Item>
          <Form.Item<CreateCourseDto>
            name="isPublished"
            label="是否发布"
            valuePropName="checked"
          >
            <Switch></Switch>
          </Form.Item>
          <Form.Item<CreateCourseDto>
            name="coverImageUrl"
            label="课程封面"
            valuePropName="fileList"
            rules={[{ required: true, message: '请上传课程封面!' }]}
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              accept="image/*"
              customRequest={async (f) => {
                try {
                  const data = await pictureBedUpload(f.file as File);
                  f.onSuccess?.(data.original || '');
                } catch (e) {
                  f.onError?.(e as Error);
                }
              }}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>点击上传图片</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
