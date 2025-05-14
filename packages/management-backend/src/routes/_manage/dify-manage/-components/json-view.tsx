import { FC } from 'react';

interface JsonViewProps {
  data: Record<string, unknown>;
}

export const JsonView: FC<JsonViewProps> = ({ data }) => {
  return (
    <pre className="text-xs p-2 bg-gray-50 rounded">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};
