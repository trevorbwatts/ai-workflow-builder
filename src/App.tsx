import { useState, useCallback } from 'react';
import { Workflow } from './types';
import { WorkflowCard } from './components/WorkflowCard';
import { motion } from 'motion/react';
import { GitBranch, Home, User, Users, IdCard, PieChart, FileText, CircleDollarSign, Banknote, Zap, Menu } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Home' },
  { icon: User, label: 'Profile' },
  { icon: Users, label: 'Team' },
  { icon: IdCard, label: 'Directory' },
  { icon: PieChart, label: 'Reports' },
  { icon: FileText, label: 'Documents' },
  { icon: CircleDollarSign, label: 'Payroll' },
  { icon: Banknote, label: 'Expenses' },
  { icon: Zap, label: 'Automations', active: true },
];

const WORKFLOWS: Workflow[] = [
  {
    id: 'information-updates',
    name: 'Information Updates',
    template:
      'Employee information updates are approved by {approvers}, then {secondary_approver}.',
    nodes: {
      approvers: { id: 'approvers', type: 'approvers', label: 'Approvers', value: { operator: 'AND', operands: ['manager'] } },
      secondary_approver: { id: 'secondary_approver', type: 'approvers', label: 'Secondary Approver', value: { operator: 'AND', operands: ['managers manager'] } },
    },
  },
  {
    id: 'time-off',
    name: 'Time Off Requests',
    template:
      'Time off requests are sent to {approvers} for approval. If it is not approved within {timeout}, it is forwarded to {escalation}.',
    nodes: {
      approvers: { id: 'approvers', type: 'approvers', label: 'Approvers', value: { operator: 'AND', operands: ['manager'] } },
      timeout: { id: 'timeout', type: 'timeout', label: 'Timeout', value: { amount: 3, unit: 'days' } },
      escalation: { id: 'escalation', type: 'approvers', label: 'Escalation', value: { operator: 'AND', operands: ['managers manager'] } },
    },
  },
  {
    id: 'timesheet',
    name: 'Timesheet',
    template:
      'Timesheets are submitted to {approvers} for approval. If not approved within {timeout}, they are escalated to {escalation}.',
    nodes: {
      approvers: { id: 'approvers', type: 'approvers', label: 'Approvers', value: { operator: 'AND', operands: ['manager'] } },
      timeout: { id: 'timeout', type: 'timeout', label: 'Timeout', value: { amount: 2, unit: 'days' } },
      escalation: { id: 'escalation', type: 'approvers', label: 'Escalation', value: { operator: 'AND', operands: ['managers manager'] } },
    },
  },
  {
    id: 'compensation',
    name: 'Compensation',
    template:
      'Compensation change requests can be made by {requester}, and are approved by {approvers}.',
    nodes: {
      requester: { id: 'requester', type: 'approvers', label: 'Requester', value: { operator: 'AND', operands: ['manager'] } },
      approvers: { id: 'approvers', type: 'approvers', label: 'Approvers', value: { operator: 'AND', operands: ['role:Full Admin'] } },
    },
  },
  {
    id: 'employment-status',
    name: 'Employment Status',
    template:
      'Employment status change requests can be made by {requester}, and are approved by {approvers}.',
    nodes: {
      requester: { id: 'requester', type: 'approvers', label: 'Requester', value: { operator: 'AND', operands: ['manager'] } },
      approvers: { id: 'approvers', type: 'approvers', label: 'Approvers', value: { operator: 'AND', operands: ['role:Full Admin'] } },
    },
  },
  {
    id: 'job-information',
    name: 'Job Information',
    template:
      'Job information change requests can be made by {requester}, and are approved by {approvers}.',
    nodes: {
      requester: { id: 'requester', type: 'approvers', label: 'Requester', value: { operator: 'AND', operands: ['manager'] } },
      approvers: { id: 'approvers', type: 'approvers', label: 'Approvers', value: { operator: 'AND', operands: ['role:Full Admin'] } },
    },
  },
  {
    id: 'promotion',
    name: 'Promotion',
    template:
      'Promotion requests can be made by {requester}, and are approved by {approvers}.',
    nodes: {
      requester: { id: 'requester', type: 'approvers', label: 'Requester', value: { operator: 'AND', operands: ['manager'] } },
      approvers: { id: 'approvers', type: 'approvers', label: 'Approvers', value: { operator: 'AND', operands: ['role:Full Admin'] } },
    },
  },
];

export default function App() {
  const [workflows, setWorkflows] = useState<Workflow[]>(WORKFLOWS);
  const [selectedId, setSelectedId] = useState(WORKFLOWS[0].id);

  const workflow = workflows.find((w) => w.id === selectedId)!;

  const handleUpdateLiveNode = useCallback((nodeId: string, newValue: any) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === selectedId
          ? { ...w, nodes: { ...w.nodes, [nodeId]: { ...w.nodes[nodeId], value: newValue } } }
          : w
      )
    );
  }, [selectedId]);

  const handleApply = useCallback((updatedWorkflow: Workflow) => {
    setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)));
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F9FAFB]">
      {/* Global Nav */}
      <nav className="w-14 bg-white border-r border-slate-200 flex flex-col items-center py-4 sticky top-0 h-screen z-20 shrink-0">
        <div className="flex-1 flex flex-col items-center gap-1 mt-2">
          {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              title={label}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              }`}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://i.pravatar.cc/32" alt="avatar" className="w-full h-full object-cover" />
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Menu size={18} />
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GitBranch className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Automations</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {workflow.name}
            </p>
          </div>
        </div>

      </header>

      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar */}
        <div className="w-56 border-r border-slate-200 bg-white hidden lg:flex flex-col p-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Your Workflows
          </h3>
          <div className="space-y-0.5">
            {workflows.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedId(w.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  w.id === selectedId
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {w.name}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl space-y-8"
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-xs font-medium">Workflows</span>
                <span className="text-xs">/</span>
                <span className="text-xs font-semibold text-slate-600">{workflow.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500"
                    >
                      U{i}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  3 collaborators active
                </span>
              </div>
            </div>

            <WorkflowCard
              key={selectedId}
              liveWorkflow={workflow}
              onUpdateLiveNode={handleUpdateLiveNode}
              onApply={handleApply}
            />
          </motion.div>
        </div>
      </main>
      </div>
    </div>
  );
}
