import { GoogleGenAI, Type } from "@google/genai";
import { Workflow } from "../types";
import { NODE_LIBRARY_DESCRIPTION } from "./nodes";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function processWorkflowEdit(
  currentWorkflow: Workflow,
  userMessage: string,
  history: { role: 'user' | 'model'; content: string }[]
): Promise<{ updatedWorkflow: Workflow; explanation: string }> {
  const model = "gemini-2.0-flash";

  const systemInstruction = `
You are an expert HR Workflow Architect for BambooHR. You help HR administrators customize their approval workflows using plain language.

A workflow has:
- A "template" string with {nodeId} placeholders that form a readable sentence
- A "nodes" map where each key matches a placeholder in the template

${NODE_LIBRARY_DESCRIPTION}

Current workflow state:
${JSON.stringify(currentWorkflow, null, 2)}

When the user asks to change something, you may:
1. Update the value of an existing node
2. Add new nodes — add entries to "nodes" AND update "template" to include the new {nodeId} placeholders with natural surrounding text
3. Remove nodes — remove from "nodes" AND remove the placeholder and its surrounding clause from "template"

Rules:
- Every {placeholder} in the template MUST have a matching key in "nodes"
- Node IDs must be lowercase_with_underscores (e.g. "ceo_approver", "escalation_timeout")
- Template text must read as a natural, complete sentence
- Be concise in your explanation (1-2 sentences)
- NEVER use {placeholder} syntax in your explanation text — use plain descriptions
`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      ...history.map((h) => ({ role: h.role, parts: [{ text: h.content }] })),
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          updatedWorkflow: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              template: { type: Type.STRING },
              nodes: {
                type: Type.OBJECT,
                description: "Map of nodeId to WorkflowNode. Keys MUST match {placeholders} in the template.",
                additionalProperties: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: {
                      type: Type.STRING,
                      enum: ["approvers", "timeout", "advance_notice"],
                    },
                    label: { type: Type.STRING },
                    value: {
                      type: Type.OBJECT,
                      description:
                        "For approvers: { operator, operands }. For timeout: { amount, unit }. For advance_notice: { amount, unit, comparison }.",
                    },
                  },
                  required: ["id", "type", "label", "value"],
                },
              },
            },
            required: ["id", "name", "template", "nodes"],
          },
          explanation: { type: Type.STRING },
        },
        required: ["updatedWorkflow", "explanation"],
      },
    },
  });

  const result = JSON.parse(response.text || '{}');

  // Normalize: ensure each node's id matches its key
  if (result.updatedWorkflow?.nodes) {
    const normalized: Record<string, any> = {};
    Object.entries(result.updatedWorkflow.nodes).forEach(([key, node]: [string, any]) => {
      if (node) {
        normalized[key] = { ...node, id: node.id || key };
      }
    });
    result.updatedWorkflow.nodes = normalized;
  }

  return result;
}
