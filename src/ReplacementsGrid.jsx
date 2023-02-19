import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Card, Col, Descriptions, Empty, Row, Switch, Tooltip } from "antd";
import { IconPayload, renderIcon } from "./Common";

export const ReplacementsGrid = ({
  replacements,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  return (
    <Row gutter={16}>
      {replacements?.length === 0 ? (
        <Col span={8}>
          <Card style={{ marginTop: 16 }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No replacements"
            />
          </Card>
        </Col>
      ) : (
        replacements?.map(({ id, title, iconId, openInNewTab, from, to }) => (
          <Col span={6} key={id}>
            <Card
              style={{ marginTop: 16, minWidth: 300 }}
              actions={[
                <Tooltip title="Edit" trigger="hover">
                  <EditOutlined key="edit" onClick={() => onEdit(id)} />
                </Tooltip>,
                <Tooltip
                  title="Duplicate"
                  trigger="hover"
                  onClick={() => onDuplicate(id)}
                >
                  <CopyOutlined key="duplicate" />
                </Tooltip>,
                <Tooltip
                  title="Delete"
                  trigger="hover"
                  onClick={() => onDelete(id)}
                >
                  <DeleteOutlined style={{ color: "#FF4D4F" }} key="delete" />
                </Tooltip>,
              ]}
            >
              <Descriptions title={title} column={1}>
                <Descriptions.Item label="Icon">
                  <IconPayload>{renderIcon(iconId)}</IconPayload>
                </Descriptions.Item>
                <Descriptions.Item label="From">{from}</Descriptions.Item>
                <Descriptions.Item label="To">{to}</Descriptions.Item>
                <Descriptions.Item label="Open in new tab">
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={openInNewTab}
                    disabled
                  />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );
};
