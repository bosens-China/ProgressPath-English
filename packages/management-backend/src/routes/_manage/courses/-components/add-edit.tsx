import { addCourse, editCourse } from '@/api/courses';
import { pictureBedUpload } from '@/api/upload';
import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Switch,
  Upload,
  UploadFile,
} from 'antd';
import { Course } from 'backend-services/common/prisma.type.js';
import { CreateCourseDto } from 'backend-services/courses/dto/create-course.dto.js';
import { FC, useEffect } from 'react';

interface Props {
  editForm: Course | null;
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  resetList: () => void;
  refreshCurrentList: () => void;
}

export const AddEdit: FC<Props> = ({
  editForm,
  isModalVisible,
  setIsModalVisible,
  refreshCurrentList,
  resetList,
}) => {
  const [form] = Form.useForm<CreateCourseDto>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const { message } = App.useApp();

  const { run: addCourseRun } = useRequest(addCourse, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      message.success('添加成功');
      handleCancel();
      resetList();
    },
  });

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 编辑课程
  const { run: editCourseRun } = useRequest(editCourse, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      message.success('编辑成功');
      handleCancel();
      refreshCurrentList();
    },
  });

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

  useEffect(() => {
    if (editForm && isModalVisible) {
      form.resetFields();
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
    <>
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
    </>
  );
};
