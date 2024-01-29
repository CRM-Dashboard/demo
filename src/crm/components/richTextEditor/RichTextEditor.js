import React from "react";
import { useState, useMemo } from "react";
import {
  MaterialSlate,
  MaterialEditable,
  createMaterialEditor,
  Toolbar,
} from "@unicef/material-slate";

export default function RTEditor() {
  const [value, setValue] = useState("");

  // An instance of material editor. It is an slate editor with a few more functions
  const editor = useMemo(() => createMaterialEditor(), []);

  return (
    <MaterialSlate
      editor={editor}
      value={value}
      onChange={(value) => setValue(value)}
    >
      <Toolbar />
      <MaterialEditable />
    </MaterialSlate>
  );
}
