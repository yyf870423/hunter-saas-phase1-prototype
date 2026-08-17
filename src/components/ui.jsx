import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Icon } from "./Icon";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const toast = (message, tone = "success") => {
    const id = crypto.randomUUID();
    setItems((current) => [...current, { id, message, tone }]);
    window.setTimeout(
      () => setItems((current) => current.filter((item) => item.id !== id)),
      2800,
    );
  };
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {items.map((item) => (
          <div className={`toast toast-${item.tone}`} key={item.id}>
            <Icon
              name={
                item.tone === "error"
                  ? "warning"
                  : item.tone === "info"
                    ? "info"
                    : "check"
              }
            />
            <span>{item.message}</span>
            <button
              aria-label="关闭提示"
              onClick={() =>
                setItems((current) =>
                  current.filter((entry) => entry.id !== item.id),
                )
              }
            >
              <Icon name="close" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

export function Button({
  children,
  icon,
  tone = "secondary",
  size = "md",
  className = "",
  loading = false,
  ...props
}) {
  return (
    <button
      className={`button button-${tone} button-${size} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="spinner" />
      ) : icon ? (
        <Icon name={icon} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export function IconButton({
  icon,
  label,
  tone = "ghost",
  className = "",
  ...props
}) {
  return (
    <button
      className={`icon-button icon-button-${tone} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}

export function Status({ children, tone = "neutral", dot = true }) {
  return (
    <span className={`status status-${tone}`}>
      {dot && <i />}
      <span>{children}</span>
    </span>
  );
}

export function Input({
  label,
  help,
  error,
  prefix,
  className = "",
  ...props
}) {
  return (
    <label className={`field ${error ? "field-error" : ""} ${className}`}>
      {label && <span className="field-label">{label}</span>}
      <span className="input-shell">
        {prefix && <Icon name={prefix} />}
        <input {...props} />
      </span>
      {error ? (
        <span className="field-message">
          <Icon name="warning" />
          {error}
        </span>
      ) : help ? (
        <span className="field-help">{help}</span>
      ) : null}
    </label>
  );
}

export function Textarea({ label, help, error, ...props }) {
  return (
    <label className={`field ${error ? "field-error" : ""}`}>
      {label && <span className="field-label">{label}</span>}
      <textarea {...props} />
      {error ? (
        <span className="field-message">
          <Icon name="warning" />
          {error}
        </span>
      ) : help ? (
        <span className="field-help">{help}</span>
      ) : null}
    </label>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "搜索",
  onSubmit,
  className = "",
  shortcut = false,
}) {
  return (
    <form
      className={`search-input ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <Icon name="search" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {shortcut && <kbd>Ctrl K</kbd>}
    </form>
  );
}

function useOutside(ref, close) {
  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) close();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [close, ref]);
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "请选择",
  label,
  width,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();
  useOutside(ref, () => setOpen(false));
  const selected = options.find((option) => option.value === value);
  return (
    <label
      className="field compact-field"
      style={width ? { width } : undefined}
    >
      {label && <span className="field-label">{label}</span>}
      <span className={`select ${open ? "is-open" : ""}`} ref={ref}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          aria-label={label || selected?.label || placeholder}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
        >
          <span className={selected ? "" : "placeholder"}>
            {selected?.label || placeholder}
          </span>
          <Icon name="chevronDown" />
        </button>
        {open && (
          <span className="select-panel" id={id}>
            {options.map((option) => (
              <button
                type="button"
                className={option.value === value ? "is-selected" : ""}
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {option.value === value && <Icon name="check" />}
              </button>
            ))}
          </span>
        )}
      </span>
    </label>
  );
}

export function MultiSelect({
  values,
  onChange,
  options,
  placeholder = "请选择",
  label,
  searchable = true,
  width,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );
  const toggle = (value) =>
    onChange(
      values.includes(value)
        ? values.filter((entry) => entry !== value)
        : [...values, value],
    );
  return (
    <label
      className="field compact-field"
      style={width ? { width } : undefined}
    >
      {label && <span className="field-label">{label}</span>}
      <span className={`multi-select ${open ? "is-open" : ""}`} ref={ref}>
        <button
          type="button"
          aria-expanded={open}
          aria-label={
            label || (values.length ? `已选 ${values.length} 项` : placeholder)
          }
          onClick={() => setOpen((current) => !current)}
        >
          <span className={values.length ? "" : "placeholder"}>
            {values.length ? `已选 ${values.length} 项` : placeholder}
          </span>
          <Icon name="chevronDown" />
        </button>
        {open && (
          <span className="multi-panel">
            {searchable && (
              <span className="multi-search">
                <Icon name="search" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索选项"
                />
              </span>
            )}
            <span className="multi-options">
              {filtered.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => toggle(option.value)}
                >
                  <span
                    className={`checkbox-box ${values.includes(option.value) ? "is-checked" : ""}`}
                  >
                    {values.includes(option.value) && <Icon name="check" />}
                  </span>
                  <span>{option.label}</span>
                </button>
              ))}
            </span>
            <span className="multi-footer">
              <span>已选 {values.length} 项</span>
              <button type="button" onClick={() => onChange([])}>
                清空
              </button>
            </span>
          </span>
        )}
      </span>
    </label>
  );
}

export function Cascader({ value, onChange, label = "方向", width }) {
  const [open, setOpen] = useState(false);
  const [parent, setParent] = useState("人工智能");
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));
  const tree = {
    人工智能: ["具身智能", "自动驾驶", "大模型"],
    机器人: ["灵巧手", "运动控制", "机器人平台"],
    半导体: ["机器人芯片", "边缘计算", "SoC"],
  };
  return (
    <label
      className="field compact-field"
      style={width ? { width } : undefined}
    >
      <span className="field-label">{label}</span>
      <span className={`cascader ${open ? "is-open" : ""}`} ref={ref}>
        <button type="button" onClick={() => setOpen(!open)}>
          <span className={value ? "" : "placeholder"}>
            {value || "请选择方向"}
          </span>
          <Icon name="chevronDown" />
        </button>
        {open && (
          <span className="cascade-panel">
            <span>
              {Object.keys(tree).map((item) => (
                <button
                  type="button"
                  className={item === parent ? "is-selected" : ""}
                  key={item}
                  onClick={() => setParent(item)}
                >
                  {item}
                  <Icon name="chevronRight" />
                </button>
              ))}
            </span>
            <span>
              {tree[parent].map((item) => (
                <button
                  type="button"
                  className={item === value ? "is-selected" : ""}
                  key={item}
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  {item}
                  {item === value && <Icon name="check" />}
                </button>
              ))}
            </span>
          </span>
        )}
      </span>
    </label>
  );
}

export function DateRange({ value, onChange, label, width }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));
  return (
    <label
      className="field compact-field"
      style={width ? { width } : undefined}
    >
      {label && <span className="field-label">{label}</span>}
      <span className="date-range" ref={ref}>
        <button type="button" onClick={() => setOpen(!open)}>
          <Icon name="calendar" />
          <span>{value || "选择时间范围"}</span>
          <Icon name="chevronDown" />
        </button>
        {open && (
          <span className="date-panel">
            <header>
              <IconButton icon="chevronLeft" label="上个月" />
              <b>2026 年 8 月</b>
              <IconButton icon="chevronRight" label="下个月" />
            </header>
            <div className="weekdays">
              {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="days">
              {Array.from({ length: 35 }, (_, index) => index - 1).map(
                (day, index) => (
                  <button
                    type="button"
                    disabled={day < 1 || day > 31}
                    className={day >= 11 && day <= 17 ? "in-range" : ""}
                    key={index}
                    onClick={() => {
                      onChange("2026-08-11 至 2026-08-17");
                      setOpen(false);
                    }}
                  >
                    {day > 0 && day < 32 ? day : ""}
                  </button>
                ),
              )}
            </div>
            <footer>
              <button type="button" onClick={() => onChange("")}>
                清空
              </button>
              <span>北京时间</span>
            </footer>
          </span>
        )}
      </span>
    </label>
  );
}

export function Checkbox({ checked, onChange, children, disabled = false }) {
  return (
    <button
      type="button"
      className="check-control"
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span className={`checkbox-box ${checked ? "is-checked" : ""}`}>
        {checked && <Icon name="check" />}
      </span>
      <span>{children}</span>
    </button>
  );
}

export function Radio({ checked, onChange, children }) {
  return (
    <button
      type="button"
      className="radio-control"
      aria-pressed={checked}
      onClick={onChange}
    >
      <span className={`radio-dot ${checked ? "is-checked" : ""}`}>
        <i />
      </span>
      <span>{children}</span>
    </button>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className="switch-row"
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span>
        <b>{label}</b>
        {description && <small>{description}</small>}
      </span>
      <span className={`switch ${checked ? "is-on" : ""}`}>
        <i />
      </span>
    </button>
  );
}

export function Tabs({ value, onChange, items, counts }) {
  return (
    <nav className="tabs" aria-label="页面视图">
      {items.map((item) => (
        <button
          type="button"
          className={value === item.value ? "is-active" : ""}
          key={item.value}
          onClick={() => onChange(item.value)}
        >
          <span>{item.label}</span>
          {counts?.[item.value] !== undefined && <em>{counts[item.value]}</em>}
        </button>
      ))}
    </nav>
  );
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  danger = false,
  size = "md",
  preventClose = false,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (event) => {
      if (event.key === "Escape" && !preventClose) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose, preventClose]);
  if (!open) return null;
  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !preventClose) onClose();
      }}
    >
      <section
        className={`modal modal-${size} ${danger ? "modal-danger" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header>
          <span className="modal-symbol">
            <Icon name={danger ? "trash" : "info"} />
          </span>
          <div>
            <h2 id="modal-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {!preventClose && (
            <IconButton icon="close" label="关闭" onClick={onClose} />
          )}
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </section>
    </div>
  );
}

export function Drawer({ open, onClose, title, children, width = "420px" }) {
  if (!open) return null;
  return (
    <div
      className="overlay drawer-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className="drawer"
        style={{ width }}
        role="dialog"
        aria-modal="true"
      >
        <header>
          <h2>{title}</h2>
          <IconButton icon="close" label="关闭" onClick={onClose} />
        </header>
        <div className="drawer-body">{children}</div>
      </aside>
    </div>
  );
}

export function Tooltip({ text, children }) {
  return (
    <span className="tooltip">
      <span>{children}</span>
      <span className="tooltip-content" role="tooltip">
        {text}
      </span>
    </span>
  );
}

export function Pagination({ page, pages = 5, total = 46, onChange }) {
  return (
    <nav className="pagination" aria-label="分页">
      <span>共 {total} 条</span>
      <div>
        <IconButton
          icon="chevronLeft"
          label="上一页"
          disabled={page === 1}
          onClick={() => onChange(Math.max(1, page - 1))}
        />
        {Array.from(
          { length: Math.min(pages, 5) },
          (_, index) => index + 1,
        ).map((item) => (
          <button
            type="button"
            className={page === item ? "is-active" : ""}
            key={item}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ))}
        <IconButton
          icon="chevronRight"
          label="下一页"
          disabled={page === pages}
          onClick={() => onChange(Math.min(pages, page + 1))}
        />
      </div>
    </nav>
  );
}

export function Progress({ value, label, tone = "blue" }) {
  return (
    <span className="progress">
      <span>
        {label && <b>{label}</b>}
        <em>{value}%</em>
      </span>
      <i>
        <i className={`progress-${tone}`} style={{ width: `${value}%` }} />
      </i>
    </span>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <section className="empty-state">
      <Icon name="database" size={28} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  status,
  actions,
  back,
}) {
  return (
    <header className="page-header">
      <div>
        {back && (
          <button type="button" className="back-link" onClick={back}>
            <Icon name="chevronLeft" />
            返回
          </button>
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <div className="title-row">
          <h1>{title}</h1>
          {status}
        </div>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function FilterBar({ children, onClear, resultText }) {
  return (
    <section className="filter-bar">
      <div className="filter-controls">{children}</div>
      <div className="filter-meta">
        <span>{resultText}</span>
        {onClear && (
          <button type="button" onClick={onClear}>
            清空筛选
          </button>
        )}
      </div>
    </section>
  );
}

export function DataTable({
  columns,
  rows,
  onRowClick,
  selected,
  onSelect,
  actions,
  empty,
}) {
  if (!rows.length)
    return (
      empty || (
        <EmptyState
          title="没有符合条件的数据"
          description="调整筛选条件，或创建一条新记录。"
        />
      )
    );
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {onSelect && (
              <th className="select-cell">
                <Checkbox
                  checked={selected.length === rows.length}
                  onChange={(checked) =>
                    onSelect(checked ? rows.map((row) => row.id) : [])
                  }
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </th>
            ))}
            {actions && <th className="action-cell">操作</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} onClick={() => onRowClick?.(row)}>
              {onSelect && (
                <td
                  className="select-cell"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Checkbox
                    checked={selected.includes(row.id)}
                    onChange={(checked) =>
                      onSelect(
                        checked
                          ? [...selected, row.id]
                          : selected.filter((id) => id !== row.id),
                      )
                    }
                  />
                </td>
              )}
              {columns.map((column) => (
                <td data-label={column.label} key={column.key}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
              {actions && (
                <td
                  className="action-cell"
                  onClick={(event) => event.stopPropagation()}
                >
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Segmented({ value, onChange, items }) {
  return (
    <div className="segmented">
      {items.map((item) => (
        <button
          type="button"
          className={value === item.value ? "is-active" : ""}
          key={item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
