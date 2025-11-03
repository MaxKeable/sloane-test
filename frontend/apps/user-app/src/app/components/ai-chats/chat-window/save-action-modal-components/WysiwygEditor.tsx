import React from "react";
// @ts-ignore
// import ReactQuillImport from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// const ReactQuill = ReactQuillImport as any;

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
}) => (
  <div>TODO: FIX THIS</div>
  // <ReactQuill value={value} onChange={onChange} theme="snow" />
);
