/* eslint-disable no-restricted-syntax */
import * as Icons from "@ant-design/icons";
import React from "react";
import styled from "styled-components";

export const renderIcon = (iconString) =>
  iconString ? React.createElement(Icons[iconString]) : null;

export const IconPayload = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
