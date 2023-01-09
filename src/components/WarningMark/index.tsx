import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import "./style.css";

export default function WarningMark({ text }: { text: string }) {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip className="tooltip-bigger-text">{text}</Tooltip>}
    >
      <ExclamationTriangleFill color="orange" />
    </OverlayTrigger>
  );
}
