/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';

interface UseDynamicFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: BodyInit | null;
  onMessage?: (data: string) => void;
}

interface Props {
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export function useDynamicFetch({ onError, onSuccess }: Props = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSSE, setIsSSE] = useState<boolean>(false);
  const controller = useRef<AbortController | null>(null);

  const run = async (url: string, options: UseDynamicFetchOptions = {}) => {
    controller.current = new AbortController();
    const { method = 'GET', headers = {}, body = null, onMessage } = options;

    setLoading(true);
    setError(null);
    setIsSSE(false);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: 'text/event-stream, application/json',
          ...headers,
        },
        body,
        signal: controller.current.signal,
      });

      const contentType = response.headers.get('Content-Type') || '';
      const isStream = contentType.includes('text/event-stream');

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} ${response.statusText}`,
        );
      }

      if (isStream && response.body) {
        setIsSSE(true);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let str = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            console.log(str);
            debugger;

            break;
          }

          const chunk = decoder.decode(value, { stream: true });

          // 将 SSE 消息逐行处理（以换行分割）
          const messages = chunk.split('\n').filter(Boolean);
          const arr = messages.map((msg) => {
            try {
              const obj = JSON.parse(msg.slice(6));

              if (obj.event === 'agent_message') {
                return obj.answer;
              }
              return null;
            } catch {
              return msg;
            }
          });
          str += arr.filter((f) => f).join('');

          for (const msg of messages) {
            if (onMessage) {
              onMessage(msg);
            } else {
              setData((prev: string[]) => {
                const arr = [...(prev || []), msg];
                onSuccess?.(arr);
                return arr;
              });
            }
          }
        }
      } else {
        const json = await response.json();
        setData(json);
        onSuccess?.(json);
      }
    } catch (err) {
      if ((err as any).name !== 'AbortError') {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      controller.current?.abort();
    };
  }, []);

  return { data, loading, error, isSSE, run };
}
