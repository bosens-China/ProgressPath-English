import Editor, { EditorProps } from '@monaco-editor/react';
import { FC } from 'react';

export const CodeEditor: FC<EditorProps> = (props) => {
  return (
    <Editor height="500px" defaultLanguage="json" theme="vs-light" {...props} />
  );
};
