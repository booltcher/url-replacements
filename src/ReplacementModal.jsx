import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  message,
  Modal,
  Space,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";

export const ReplacementModal = ({
  isModalOpen,
  onModalClose,
  replacements,
  activeId,
}) => {
  const [replacementForm] = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const isEditMode = activeId !== null;

  useEffect(() => {
    replacementForm.setFieldsValue(
      activeId
        ? replacements.find((r) => r.id === activeId)
        : { title: "", icon: "", from: "", to: "", openInNewTab: false }
    );
  }, [isModalOpen]);

  const handleCancel = () => {
    onModalClose();
  };

  const handleFormSubmit = (values) => {
    const newReplacements = activeId
      ? replacements.map((r) =>
          r.id === activeId ? { ...values, id: new Date().getTime() } : r
        )
      : [
          ...replacements,
          {
            ...values,
            openInNewTab: !!values.openInNewTab,
            id: new Date().getTime(),
          },
        ];

    // eslint-disable-next-line no-undef
    chrome.storage.local
      .set({
        replacements: newReplacements,
      })
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Successful",
        });
        onModalClose();
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "Failed, please try it again",
        });
      });
  };

  const handleOk = () => {
    replacementForm.validateFields().then((values) => {
      handleFormSubmit(values);
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={isEditMode ? "Edit replacement" : "Create replacement"}
        open={isModalOpen}
        closable={false}
        maskClosable={false}
        keyboard={false}
        destroyOnClose
        okText="Submit"
        onOk={handleOk}
        onCancel={handleCancel}
        forceRender
      >
        <Form
          form={replacementForm}
          onFinish={handleOk}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input style={{ width: 300 }} placeholder="Please input title" />
          </Form.Item>

          <Form.Item label="Icon">
            <Space>
              <Form.Item
                name="iconId"
                noStyle
                rules={[{ message: "icon is required" }]}
              >
                <Input style={{ width: 200 }} placeholder="ExportOutlined" />
              </Form.Item>
              <Tooltip title="To Antd icon components page">
                <Typography.Link
                  href="https://ant.design/components/icon"
                  target="_blank"
                >
                  View icons list
                </Typography.Link>
              </Tooltip>
            </Space>
          </Form.Item>

          <Form.Item
            label="From"
            name="from"
            rules={[{ required: true, message: "From is required" }]}
          >
            <Input style={{ width: 300 }} placeholder="URL to be replaced" />
          </Form.Item>

          <Form.Item
            label="To"
            name="to"
            rules={[{ required: true, message: "To is required" }]}
          >
            <Input style={{ width: 300 }} placeholder="Redirect to..." />
          </Form.Item>

          <Form.Item
            name="openInNewTab"
            label="Open in new tab"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
