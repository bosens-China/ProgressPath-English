import { useState } from 'react';
import {
  Modal,
  Form,
  Select,
  Upload,
  Button,
  App,
  Spin,
  UploadFile,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getAllCourses } from '@/api/courses';
import Papa from 'papaparse';
import { CourseSection } from 'backend-services/common/prisma.type.ts';
import { addSections } from '@/api/sections';
import { transform } from 'lodash-es';
import { CreateSectionDto } from 'backend-services/sections/dto/create-section.dto.js';

type CSVData = Pick<CourseSection, 'courseId' | 'title' | 'content' | 'order'>;

type FormValues = Pick<CourseSection, 'courseId'> & {
  csv: UploadFile<CSVData[]>[];
};

interface Props {
  resetList: () => void;
}

const UploadDialog = ({ resetList }: Props) => {
  const { message } = App.useApp();

  const [visible, setVisible] = useState(false);

  const { loading: uploadLoading, run: addSectionsRun } = useRequest(
    addSections,
    {
      manual: true,
      onError(e) {
        message.error(e.message);
      },
      onSuccess() {
        message.success('上传成功');
        onCancel();
        resetList();
      },
    },
  );

  const { data: courses, loading: coursesLoading } = useRequest(getAllCourses, {
    ready: !!visible,
    refreshDeps: [visible],
    onError(e) {
      message.error(e.message);
    },
  });

  const [form] = Form.useForm<FormValues>();

  const handleOk = async () => {
    const values = await form.validateFields();
    const json =
      values.csv[0]?.response?.map((f) => {
        return {
          ...transform(
            f,
            (obj, value, key) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (obj as any)[key] = value || undefined;

              return obj;
            },
            {} as CreateSectionDto,
          ),
          courseId: values.courseId,
        };
      }) || [];

    if (!json.length) {
      message.warning(`请上传正确的CSV文件`);
      return;
    }
    addSectionsRun(json);
  };

  const onCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        icon={<UploadOutlined></UploadOutlined>}
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        上传文件（csv）
      </Button>

      <Modal
        title="上传课程全部小节"
        open={visible}
        onCancel={onCancel}
        onOk={handleOk}
        destroyOnClose
        loading={uploadLoading}
      >
        <Spin spinning={coursesLoading}>
          <Form form={form} layout="vertical">
            <Form.Item<FormValues>
              name="courseId"
              label="关键课程ID"
              rules={[{ required: true, message: '请输入关键课程ID!' }]}
            >
              <Select
                options={courses?.map((f) => {
                  return { label: f.title, value: f.id };
                })}
              ></Select>
            </Form.Item>
            <Form.Item<FormValues>
              name="csv"
              label="上传文件"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              rules={[{ required: true, message: '请上传CSV文件!' }]}
            >
              <Upload
                name="file"
                customRequest={(e) => {
                  const file = e.file as File;
                  Papa.parse(file, {
                    header: true,
                    complete: (results) => {
                      const { errors, data } = results;
                      if (errors.length) {
                        e.onError?.(new Error(errors.join('\n')));
                        return;
                      }

                      e.onSuccess?.(data);
                    },
                  });
                }}
                maxCount={1}
                accept=".csv"
              >
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default UploadDialog;
