import { SettingOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Typography } from "antd";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { THEME_RED_OPTIONS } from "./constants";
import { Replacement } from "./Replacement";

const { Text, Title } = Typography;

const PageLayout = styled.div`
  width: 260px;
  border-radius: 8px;
  padding: 16px 16px 24px;
`;

const FloatButtonsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 20px;
  box-sizing: border-box;
  border-top: 1px solid rgba(5, 5, 5, 0.06);
  margin-top: 30px;
`;

const StyledTitle = styled(Title)`
  margin-top: 20px;
  margin-bottom: 10px !important;
  color: #d34e44 !important;
`;

const NoDataMessage = styled(Text).attrs({
  type: "secondary",
})``;

const Section = styled.div``;

const ReplacementWrapper = styled.div`
  border-radius: 8px;
  border: 1px solid rgba(5, 5, 5, 0.06);
`;

const PopupPage = () => {
  const [replacements, setReplacements] = useState([]);
  const [toggles, setToggles] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(["toggles", "replacements"]).then((result) => {
      console.log(result);
      setToggles(result?.toggles);
      setReplacements(result?.replacements || []);
    });
  }, []);

  const handleGoToSetting = () => {
    window.open(`${window.location.origin}/options.html`);
  };

  return (
    <ConfigProvider theme={THEME_RED_OPTIONS}>
      <PageLayout>
        <Section>
          <StyledTitle level={5}>Replacements</StyledTitle>
          {replacements.length ? (
            <ReplacementWrapper>
              {replacements.map((replacement) => {
                return <Replacement key={replacement.id} {...replacement} />;
              })}
            </ReplacementWrapper>
          ) : (
            <NoDataMessage>No replacements</NoDataMessage>
          )}
        </Section>

        <Section>
          <StyledTitle level={5}>Toggles</StyledTitle>
          {toggles ? (
            toggles.map((toggle) => {
              return <div>{toggle.content}</div>;
            })
          ) : (
            <NoDataMessage>No toggles</NoDataMessage>
          )}
        </Section>
      </PageLayout>
      <FloatButtonsBar>
        <Button
          shape="circle"
          type="text"
          icon={<SettingOutlined />}
          size="small"
          onClick={handleGoToSetting}
        />
      </FloatButtonsBar>
    </ConfigProvider>
  );
};

const rootElement = document.getElementById("popup_container");
const root = createRoot(rootElement);
root.render(<PopupPage />);
