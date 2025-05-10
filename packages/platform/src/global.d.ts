// 接口类型
interface GlobalApiTypes<T = unknown> {
  code: number;
  msg: string;
  data: T;
}
