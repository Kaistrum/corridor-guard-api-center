import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  IconButton,
  Input,
  Modal,
  Select,
  cn,
} from "@kaistrum/stratum-ui";
import {
  INITIAL_KEYS,
  LIMIT_OPTIONS,
  TEAM,
  generateSecret,
  maskSecret,
  type ApiKey,
  type TeamMember,
} from "@/lib/data";
import { Dropdown } from "./Dropdown";
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  MoreIcon,
  PlusIcon,
  TrashIcon,
} from "./icons";

function membersFor(ids: string[]): TeamMember[] {
  return TEAM.filter((m) => ids.includes(m.id));
}

/** Stacked avatars for the people with access to a key. */
function AccessAvatars({ ids }: { ids: string[] }) {
  const members = membersFor(ids);
  const shown = members.slice(0, 3);
  const extra = members.length - shown.length;
  return (
    <span className="flex items-center -space-x-2">
      {shown.map((m) => (
        <Avatar key={m.id} size="sm" name={m.name} />
      ))}
      {extra > 0 && (
        <span className="grid size-7 place-items-center rounded-radius-full bg-bg-surface text-xs font-medium text-text-dim">
          +{extra}
        </span>
      )}
      {members.length === 0 && (
        <span className="text-sm text-text-muted">No access</span>
      )}
    </span>
  );
}

/** Access control: avatars + chevron that opens a multi-select member list. */
function AccessControl({
  ids,
  onToggle,
}: {
  ids: string[];
  onToggle: (memberId: string) => void;
}) {
  return (
    <Dropdown
      align="start"
      panelClassName="min-w-56"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label="Edit access"
          aria-expanded={open}
          className="flex items-center gap-1.5 rounded-radius-md px-1.5 py-1 transition-colors hover:bg-bg-surface"
        >
          <AccessAvatars ids={ids} />
          <ChevronDownIcon
            width={16}
            height={16}
            className={cn("text-text-dim transition-transform", open && "rotate-180")}
          />
        </button>
      )}
    >
      {TEAM.map((m) => {
        const checked = ids.includes(m.id);
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onToggle(m.id)}
            className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-bg-surface"
          >
            <Checkbox
              checked={checked}
              readOnly
              tabIndex={-1}
              className="pointer-events-none"
            />
            <Avatar size="sm" name={m.name} />
            <span
              className={cn(
                "text-sm",
                checked ? "font-medium text-text" : "text-text-dim",
              )}
            >
              {m.name}
            </span>
          </button>
        );
      })}
    </Dropdown>
  );
}

/** Masked secret with reveal + copy affordances. */
function SecretField({ secret }: { secret: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <span className="flex items-center gap-2">
      <code className="rounded-radius-md bg-bg-surface px-3 py-1.5 font-mono text-sm text-text">
        {revealed ? secret : maskSecret(secret)}
      </code>
      <IconButton
        aria-label={revealed ? "Hide key" : "Reveal key"}
        variant="ghost"
        size="sm"
        onClick={() => setRevealed((v) => !v)}
        icon={
          revealed ? (
            <EyeOffIcon width={17} height={17} />
          ) : (
            <EyeIcon width={17} height={17} />
          )
        }
      />
      <IconButton
        aria-label={copied ? "Copied" : "Copy key"}
        variant="ghost"
        size="sm"
        onClick={copy}
        icon={
          copied ? (
            <CheckIcon width={17} height={17} className="text-success" />
          ) : (
            <CopyIcon width={17} height={17} />
          )
        }
      />
    </span>
  );
}

/** Compact inline limit selector. */
function LimitControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Usage limit"
        className="cursor-pointer appearance-none rounded-radius-md bg-transparent py-1 pl-2 pr-7 text-sm text-text transition-colors hover:bg-bg-surface focus:outline-none"
      >
        {LIMIT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        width={15}
        height={15}
        className="pointer-events-none absolute right-2 text-text-dim"
      />
    </div>
  );
}

/** Per-row "..." overflow menu. */
function RowMenu({ onDelete }: { onDelete: () => void }) {
  return (
    <Dropdown
      align="end"
      trigger={({ toggle }) => (
        <IconButton
          aria-label="Key actions"
          variant="ghost"
          size="sm"
          onClick={toggle}
          icon={<MoreIcon width={18} height={18} />}
        />
      )}
    >
      <button
        type="button"
        onClick={onDelete}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-danger transition-colors hover:bg-danger-faint"
      >
        <TrashIcon width={16} height={16} />
        Delete key
      </button>
    </Dropdown>
  );
}

export function ApiKeysView() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLimit, setNewLimit] = useState(LIMIT_OPTIONS[0].value);

  const nextKeyNumber = useMemo(() => keys.length + 1, [keys.length]);

  const toggleAccess = (keyId: string, memberId: string) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === keyId
          ? {
              ...k,
              access: k.access.includes(memberId)
                ? k.access.filter((id) => id !== memberId)
                : [...k.access, memberId],
            }
          : k,
      ),
    );
  };

  const setLimit = (keyId: string, limit: string) => {
    setKeys((prev) => prev.map((k) => (k.id === keyId ? { ...k, limit } : k)));
  };

  const deleteKey = (keyId: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== keyId));
  };

  const openCreate = () => {
    setNewName(`Secret key ${nextKeyNumber}`);
    setNewLimit(LIMIT_OPTIONS[0].value);
    setCreateOpen(true);
  };

  const createKey = () => {
    const name = newName.trim() || `Secret key ${nextKeyNumber}`;
    const created = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setKeys((prev) => [
      ...prev,
      {
        id: `key-${Date.now()}`,
        name,
        secret: generateSecret(),
        access: ["john"],
        limit: newLimit,
        created,
      },
    ]);
    setCreateOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">API keys</h1>
        <Button
          variant="primary"
          icon={<PlusIcon width={18} height={18} />}
          onClick={openCreate}
        >
          Create new key
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-radius-lg border border-border bg-bg-card lg:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border text-xs font-medium uppercase tracking-wider text-text-muted">
                <th className="px-5 py-3.5 font-medium">Name</th>
                <th className="px-5 py-3.5 font-medium">API key</th>
                <th className="px-5 py-3.5 font-medium">Created</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr
                  key={k.id}
                  className="border-b border-border-subtle last:border-0 transition-colors hover:bg-bg-surface/60"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium text-text">
                    {k.name}
                  </td>
                  <td className="px-5 py-3.5">
                    <SecretField secret={k.secret} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-text-dim">
                    {k.created}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <RowMenu onDelete={() => deleteKey(k.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {keys.length === 0 && <EmptyState onCreate={openCreate} />}
      </div>

      {/* Mobile / tablet cards */}
      <div className="flex flex-col gap-4 lg:hidden">
        {keys.map((k) => (
          <div
            key={k.id}
            className="rounded-radius-lg border border-border bg-bg-card p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">Name</p>
                <p className="font-semibold text-text">{k.name}</p>
              </div>
              <RowMenu onDelete={() => deleteKey(k.id)} />
            </div>

            <div className="mt-4">
              <p className="mb-1.5 text-xs uppercase tracking-wider text-text-muted">
                API key
              </p>
              <SecretField secret={k.secret} />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-text-muted">
                  Access
                </p>
                <AccessControl
                  ids={k.access}
                  onToggle={(memberId) => toggleAccess(k.id, memberId)}
                />
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-text-muted">
                  Limits
                </p>
                <LimitControl
                  value={k.limit}
                  onChange={(limit) => setLimit(k.id, limit)}
                />
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-text-muted">
                  Created
                </p>
                <Badge variant="neutral">{k.created}</Badge>
              </div>
            </div>
          </div>
        ))}
        {keys.length === 0 && (
          <div className="rounded-radius-lg border border-border bg-bg-card">
            <EmptyState onCreate={openCreate} />
          </div>
        )}
      </div>

      {/* Create key modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create new key"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Key name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Production server"
          />
          <Select
            label="Usage limit"
            options={LIMIT_OPTIONS}
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={createKey}>
              Create key
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="text-sm text-text-dim">You don&apos;t have any API keys yet.</p>
      <Button
        variant="outline"
        icon={<PlusIcon width={16} height={16} />}
        onClick={onCreate}
      >
        Create your first key
      </Button>
    </div>
  );
}
