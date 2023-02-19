import { ExclamationCircleFilled, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  ConfigProvider,
  Divider,
  message,
  Modal,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { THEME_OPTIONS } from "./constants";
import { ReplacementModal } from "./ReplacementModal";
import { ReplacementsGrid } from "./ReplacementsGrid";

const { Title } = Typography;
const { confirm } = Modal;

const PageLayout = styled.div`
  width: 90%;
  min-width: 300px;
  border-radius: 8px;
  padding: 0 16px 32px;
`;

const OptionsPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReplacementId, setActiveReplacementId] = useState(null);
  const [replacements, setReplacements] = useState([]);
  const [toggles, setToggles] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(["toggles", "replacements"]).then((result) => {
      setToggles(result?.toggles);
      setReplacements(result?.replacements || []);
    });
  }, [isModalOpen]);

  const handleAddReplacementClick = () => {
    setActiveReplacementId(null);
    setIsModalOpen(true);
  };

  const onReplacementModalClose = () => {
    setIsModalOpen(false);
    setActiveReplacementId(null);
  };

  const onReplacementEdit = (id) => {
    setActiveReplacementId(id);
    setIsModalOpen(true);
  };

  const handleDeleteReplacement = (id) => {
    const newReplacements = replacements.filter(
      (replacement) => replacement.id !== id
    );
    chrome.storage.local
      .set({
        replacements: newReplacements,
      })
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Successful",
        });
        setReplacements(newReplacements);
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "Failed, please try it again",
        });
      });
  };

  const onReplacementDelete = (id) => {
    const replacement = replacements.find((r) => r.id === id) || {};
    confirm({
      title: "Are you sure delete this item?",
      icon: <ExclamationCircleFilled />,
      content: `Replacement: ${replacement?.title}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteReplacement(id);
      },
    });
  };

  const onReplacementDuplicate = (id) => {
    const newReplacements = [
      ...replacements,
      {
        ...replacements.find((r) => r.id === id),
        id: new Date().getTime(),
      },
    ];
    chrome.storage.local
      .set({
        replacements: newReplacements,
      })
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Successful",
        });
        setReplacements(newReplacements);
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "Failed, please try it again",
        });
      });
  };

  return (
    <>
      {contextHolder}

      <ConfigProvider theme={THEME_OPTIONS}>
        <PageLayout>
          <Title>Setting</Title>
          <Divider />
          <Title level={3}>Replacements</Title>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={handleAddReplacementClick}
          >
            Add
          </Button>
          <ReplacementsGrid
            replacements={replacements}
            onEdit={onReplacementEdit}
            onDelete={onReplacementDelete}
            onDuplicate={onReplacementDuplicate}
          />

          <Divider />
          <Title level={3}>Toggles</Title>
          <Card title="Toggles for URL">
            <Tag color="volcano">volcano</Tag>
          </Card>
        </PageLayout>

        <ReplacementModal
          isModalOpen={isModalOpen}
          onModalClose={onReplacementModalClose}
          replacements={replacements}
          activeId={activeReplacementId}
        />
      </ConfigProvider>
    </>
  );
};

const rootElement = document.getElementById("options_container");
const root = createRoot(rootElement);
root.render(<OptionsPage />);
