/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { renderIcon } from "./Common";

const disabledStyle = css`
  cursor: not-allowed;
  /* background: #f4f4f4; */
  color: rgba(0, 0, 0, 0.25);
`;
const normalStyle = css`
  cursor: pointer;
  background: #fff;
  color: #333;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ReplacementOuter = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 20px;
  box-sizing: border-box;
  gap: 10px;

  ${(props) => (props.disabled ? disabledStyle : normalStyle)}

  & + & {
    border-top: 1px solid rgba(5, 5, 5, 0.06);
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  transition: background-color 0.2s linear;
`;

const Title = styled.div`
  font-size: 16px;
`;

export const Replacement = ({ iconId, title, from, to, openInNewTab }) => {
  const [currentURL, setCurrentURL] = useState("");
  const [currentTabId, setCurrentTabId] = useState(null);
  const available = currentURL ? currentURL?.includes(from) : false;

  useEffect(() => {
    const getCurrentTab = async () => {
      const queryOptions = { active: true, lastFocusedWindow: true };
      // eslint-disable-next-line no-undef
      const [tab] = await chrome.tabs.query(queryOptions);
      console.log(tab);
      setCurrentURL(tab?.url || "");
      setCurrentTabId(tab?.id || null);
    };
    getCurrentTab();
  }, []);

  const handleReplace = async () => {
    if (!available) return;
    const newURL = currentURL?.replace(from, to);
    console.log(newURL);
    if (openInNewTab) {
      window.open(newURL);
      return;
    }

    // eslint-disable-next-line no-undef
    await chrome.tabs.update(currentTabId, { url: newURL });
  };

  return (
    <ReplacementOuter disabled={!available} onClick={handleReplace}>
      {renderIcon(iconId)}
      <Title>{title}</Title>
    </ReplacementOuter>
  );
};
