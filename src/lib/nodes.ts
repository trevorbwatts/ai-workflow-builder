import { NodeType, NodeValue, ApproversValue, TimeoutValue, AdvanceNoticeValue } from '../types';

export const APPROVAL_ROLES = [
  'CEO', 'CFO', 'COO',
  'Full Admin',
  'VP of Engineering', 'VP of Sales', 'VP of Marketing', 'VP of HR',
  'Director of Engineering', 'Director of Sales', 'Director of Marketing', 'Director of HR',
  'Engineering Manager', 'Sales Manager', 'Marketing Manager', 'HR Manager', 'Team Lead',
];

export function formatOperand(op: string): string {
  if (op === 'manager') return 'Manager';
  if (op === 'managers manager') return "Manager's Manager";
  if (op.startsWith('role:')) return op.slice(5);
  if (op.startsWith('person:')) return op.slice(7);
  return op;
}

export function displayNodeValue(type: NodeType, value: NodeValue): string {
  if (type === 'approvers') {
    const v = value as ApproversValue;
    if (!v.operands || v.operands.length === 0) return '—';
    const formatted = v.operands.map(formatOperand);
    const joiner = v.operator === 'AND' ? ' and ' : ' or ';
    return formatted.join(joiner);
  }
  if (type === 'timeout') {
    const v = value as TimeoutValue;
    const unitLabel = v.amount === 1 ? v.unit.replace(/s$/, '') : v.unit;
    return `${v.amount} ${unitLabel}`;
  }
  if (type === 'advance_notice') {
    const v = value as AdvanceNoticeValue;
    const unitLabel = v.amount === 1 ? v.unit.replace(/s$/, '') : v.unit;
    return `${v.amount} ${unitLabel}`;
  }
  return '';
}

export const NODE_LIBRARY_DESCRIPTION = `
AVAILABLE NODE TYPES (you may ONLY use these):

1. "approvers" — Defines who approves or receives a request.
   value shape: { operator: "AND" | "OR", operands: string[] }
   Operand values: "manager", "managers manager", "role:CEO", "role:HR Manager", "person:Jane Smith", etc.
   For sequential approvals, use multiple approver nodes in the template with ", then " between them.

2. "timeout" — A duration before the next step triggers (e.g. escalation).
   value shape: { amount: number, unit: "hours" | "days" | "weeks" }

3. "advance_notice" — A time threshold for a conditional branch (e.g. "if requested less than 1 day in advance").
   value shape: { amount: number, unit: "hours" | "days", comparison: "less_than" | "greater_than" }
`;
