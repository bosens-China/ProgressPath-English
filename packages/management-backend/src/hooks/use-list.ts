import { AntdTableResult } from 'ahooks/lib/useAntdTable/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useList = <T extends AntdTableResult<any, any>>(obj: T) => {
  // 刷新当前列表
  const refreshCurrentList = () => {
    obj.refresh();
  };

  // 重置列表，重置到第一页，但是搜索条件都要保留
  const resetList = () => {
    const currentPagination = obj.pagination;
    // const currentParams = obj.params?.[0] || {};

    // 保持搜索条件，仅重置分页到第一页
    obj.pagination.onChange?.(1, currentPagination.pageSize);
    // obj.search.submit({
    //   ...currentParams,
    //   current: 1,
    //   pageSize: currentPagination.pageSize
    // });
  };

  return {
    ...obj,
    refreshCurrentList,
    resetList,
  };
};
