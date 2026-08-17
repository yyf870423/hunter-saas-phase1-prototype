import { createContext, useContext, useMemo, useState } from "react";

const StoreContext = createContext(null);

const initial = {
  theme: "light",
  notifications: 6,
  selectedCandidateIds: [],
  archivedWorkstreams: [],
  importedPaperIds: [],
  platform: { liepin: "healthy", maimai: "expired" },
  taskStatus: { "task-sourcing": "运行中", "task-platform": "失败" },
  rules: [
    {
      id: "rule-1",
      name: "高置信候选人自动进入待审核",
      type: "自动确认",
      status: "生效",
    },
    {
      id: "rule-2",
      name: "客户开发确认后发送联系邮件",
      type: "外部联系",
      status: "暂停",
    },
    {
      id: "rule-3",
      name: "确认招聘机会后启动公司摸排",
      type: "任务联动",
      status: "生效",
    },
  ],
};

export function PrototypeProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      return {
        ...initial,
        ...JSON.parse(localStorage.getItem("hunter-prototype-state") || "{}"),
      };
    } catch {
      return initial;
    }
  });
  const update = (patch) =>
    setState((current) => {
      const next =
        typeof patch === "function" ? patch(current) : { ...current, ...patch };
      localStorage.setItem("hunter-prototype-state", JSON.stringify(next));
      return next;
    });
  const reset = () => {
    localStorage.removeItem("hunter-prototype-state");
    setState(initial);
  };
  const value = useMemo(() => ({ state, update, reset }), [state]);
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function usePrototype() {
  return useContext(StoreContext);
}
