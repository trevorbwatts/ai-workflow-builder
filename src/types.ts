export interface ApproversValue {
  operator: 'AND' | 'OR';
  operands: string[]; // 'manager', 'managers manager', 'role:CEO', 'person:Jane Smith'
}

export interface TimeoutValue {
  amount: number;
  unit: 'hours' | 'days' | 'weeks';
}

export interface AdvanceNoticeValue {
  amount: number;
  unit: 'hours' | 'days';
  comparison: 'less_than' | 'greater_than';
}

export type NodeType = 'approvers' | 'timeout' | 'advance_notice';
export type NodeValue = ApproversValue | TimeoutValue | AdvanceNoticeValue;

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  value: NodeValue;
}

export interface Workflow {
  id: string;
  name: string;
  template: string; // e.g. "Requests are sent to {approvers} for approval..."
  nodes: Record<string, WorkflowNode>;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
