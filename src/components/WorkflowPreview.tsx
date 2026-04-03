import React from 'react';
import { Workflow, TimeoutValue, ScopeValue, TimeOffTypeValue, StatusConditionValue, ApproversValue } from '../types';
import { displayNodeValue, displayScopeValue, displayTimeOffTypeValue, displayStatusConditionValue, formatOperand } from '../lib/nodes';
import { motion } from 'motion/react';
import { User, Bell, Clock, CheckCircle2, X, UserX } from 'lucide-react';

// ─── Step Types ───────────────────────────────────────────────────────────────

type StepKind = 'start' | 'notify' | 'fork' | 'condition_fork' | 'end';

interface TimelineStep {
  kind: StepKind;
  actor?: string;
  description?: string;
  forkTimeout?: string;
  forkEscalationActor?: string;
  conditionTriggers?: string;
  conditionBackupActor?: string;
  backup?: string;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function formatTimeout(v: TimeoutValue): string {
  const unit = v.amount === 1 ? v.unit.replace(/s$/, '') : v.unit;
  return `${v.amount} ${unit}`;
}

function parseWorkflowSteps(workflow: Workflow): TimelineStep[] {
  const placeholders = (workflow.template.match(/\{([^{}]+)\}/g) ?? []).map((p) => p.slice(1, -1).trim());
  const steps: TimelineStep[] = [];
  let hasRequester = false;

  let i = 0;
  while (i < placeholders.length) {
    const nodeId = placeholders[i];
    const node = workflow.nodes[nodeId];

    if (!node || node.type === 'scope' || node.type === 'time_off_type') { i++; continue; }

    if (node.type === 'approvers' && nodeId === 'requester') {
      hasRequester = true;
      steps.push({ kind: 'start', actor: displayNodeValue(node.type, node.value), description: 'initiates the request' });
      i++; continue;
    }

    if (node.type === 'approvers') {
      const nextId = placeholders[i + 1];
      const nextNode = workflow.nodes[nextId];
      const backup = (node.value as ApproversValue).backup
        ? formatOperand((node.value as ApproversValue).backup!)
        : undefined;

      if (nextNode?.type === 'status_condition') {
        const backupNode = workflow.nodes[placeholders[i + 2]];
        steps.push({
          kind: 'condition_fork',
          actor: displayNodeValue(node.type, node.value),
          conditionTriggers: displayStatusConditionValue(nextNode.value as StatusConditionValue),
          conditionBackupActor: backupNode ? displayNodeValue(backupNode.type, backupNode.value) : undefined,
          backup,
        });
        i += 3; continue;
      }
      if (nextNode?.type === 'timeout') {
        const escalationNode = workflow.nodes[placeholders[i + 2]];
        steps.push({
          kind: 'fork',
          actor: displayNodeValue(node.type, node.value),
          forkTimeout: formatTimeout(nextNode.value as TimeoutValue),
          forkEscalationActor: escalationNode ? displayNodeValue(escalationNode.type, escalationNode.value) : undefined,
          backup,
        });
        i += 3; continue;
      }
      steps.push({ kind: 'notify', actor: displayNodeValue(node.type, node.value), backup });
      i++; continue;
    }
    i++;
  }

  if (!hasRequester) steps.unshift({ kind: 'start', description: 'Employee submits request' });
  const last = steps[steps.length - 1];
  if (last && last.kind !== 'fork') steps.push({ kind: 'end', description: 'Request Approved' });

  return steps;
}

// ─── Animated Timeline ────────────────────────────────────────────────────────

interface StepDelays {
  node: number;
  content: number;
  branch: number;
  line: number;
}

function computeDelays(steps: TimelineStep[]): StepDelays[] {
  let d = 0.12;
  return steps.map((step) => {
    const node = d;
    const content = d + 0.06;
    d += 0.2;
    const branch = d;
    const branchCount =
      step.kind === 'fork' || step.kind === 'condition_fork' ? 2
      : step.kind === 'notify' ? 1
      : 0;
    d += branchCount * 0.14;
    const line = d;
    d += 0.28;
    return { node, content, branch, line };
  });
}

const AnimatedTimeline: React.FC<{ steps: TimelineStep[] }> = ({ steps }) => {
  const delays = computeDelays(steps);
  const isApproverStep = (kind: StepKind) =>
    kind === 'notify' || kind === 'fork' || kind === 'condition_fork';

  return (
    <div className="px-6 py-6">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const d = delays[i];

        const dotBg =
          step.kind === 'start' ? 'bg-indigo-100'
          : step.kind === 'end' ? 'bg-emerald-100'
          : 'bg-slate-100';
        const dotText =
          step.kind === 'start' ? 'text-indigo-600'
          : step.kind === 'end' ? 'text-emerald-600'
          : 'text-slate-500';
        const DotIcon =
          step.kind === 'start' ? User
          : step.kind === 'end' ? CheckCircle2
          : Bell;

        return (
          <div key={i} className="flex gap-4">
            {/* Left column: dot + vertical connector */}
            <div className="flex flex-col items-center" style={{ width: 32, minWidth: 32 }}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: d.node, type: 'spring', stiffness: 380, damping: 22 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${dotBg} ${dotText}`}
              >
                <DotIcon size={14} />
              </motion.div>

              {!isLast && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: d.line, duration: 0.32, ease: 'easeOut' }}
                  style={{ transformOrigin: 'top' }}
                  className="w-px bg-slate-200 flex-1 mt-1"
                />
              )}
            </div>

            {/* Right column: content + outcome branches */}
            <div className={`flex-1 ${isLast ? 'pb-2' : 'pb-5'}`}>
              {/* Node label */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: d.content, duration: 0.22 }}
                className="pt-1"
              >
                {step.kind === 'start' && (
                  <>
                    <p className="text-sm font-semibold text-slate-800">
                      {step.actor ?? 'Employee'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {step.description ?? 'submits request'}
                    </p>
                  </>
                )}

                {isApproverStep(step.kind) && (
                  <>
                    <p className="text-sm font-semibold text-slate-800">{step.actor}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Reviews and approves</p>
                    {step.backup && (
                      <p className="text-xs text-slate-400 mt-0.5">↳ Backup: {step.backup}</p>
                    )}
                  </>
                )}

                {step.kind === 'end' && (
                  <p className="text-sm font-semibold text-emerald-700">{step.description}</p>
                )}
              </motion.div>

              {/* Outcome branches for approver steps */}
              {isApproverStep(step.kind) && (
                <div className="mt-3 space-y-2">
                  {/* Rejection branch — always shown */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: d.branch, duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-5 h-px bg-slate-200 shrink-0" />
                    <div className="flex-1 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
                      <p className="text-xs font-medium text-red-700 flex items-center gap-1.5">
                        <X size={11} className="shrink-0" />
                        Declined — employee notified
                      </p>
                    </div>
                  </motion.div>

                  {/* Timeout escalation branch */}
                  {step.kind === 'fork' && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: d.branch + 0.14, duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-px bg-slate-200 shrink-0" />
                      <div className="flex-1 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-xs text-amber-700 flex items-center gap-1.5">
                          <Clock size={11} className="text-amber-500 shrink-0" />
                          After {step.forkTimeout} → {step.forkEscalationActor}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Status-condition availability branch */}
                  {step.kind === 'condition_fork' && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: d.branch + 0.14, duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-px bg-slate-200 shrink-0" />
                      <div className="flex-1 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-xs text-amber-700 flex items-center gap-1.5">
                          <UserX size={11} className="text-amber-500 shrink-0" />
                          If {step.conditionTriggers} → {step.conditionBackupActor}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Sidebar Panel ────────────────────────────────────────────────────────────

interface WorkflowPreviewProps {
  workflow: Workflow;
  groupName: string;
  onClose: () => void;
}

export const WorkflowPreview: React.FC<WorkflowPreviewProps> = ({ workflow, groupName, onClose }) => {
  const steps = parseWorkflowSteps(workflow);

  const scopeNode = workflow.nodes.scope;
  const timeOffNode = workflow.nodes.time_off_type;
  const scopeLabel = scopeNode ? displayScopeValue(scopeNode.value as ScopeValue) : null;
  const timeOffLabel = timeOffNode ? displayTimeOffTypeValue(timeOffNode.value as TimeOffTypeValue) : null;
  const contextLine = [scopeLabel, timeOffLabel].filter(Boolean).join(' · ');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-0 shrink-0">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
            Preview
          </p>
          <h2 className="text-sm font-bold text-slate-900">{groupName}</h2>
          {contextLine && (
            <p className="text-xs text-slate-400 mt-0.5 capitalize">{contextLine}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 shrink-0 mt-1"
        >
          <X size={14} />
        </button>
      </div>

      <div className="border-b border-slate-100 mt-4 mx-5 shrink-0" />

      {/* Animated timeline — re-mounts (replays animation) when workflow changes */}
      <div className="overflow-y-auto flex-1">
        <AnimatedTimeline key={workflow.id + JSON.stringify(steps)} steps={steps} />
      </div>
    </div>
  );
};
