export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
export interface JsonObject { [key: string]: JsonValue | undefined }

export type ConditionOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
export interface AutomationCondition {
  field: string;
  operator: ConditionOperator;
  value: JsonValue;
}

export type AutomationAction =
  | { type: 'award_lp'; amount: number; reason?: string }
  | { type: 'send_inbox_message'; message: string }
  | { type: 'update_entity_status'; status: string }
  | { type: 'create_referral'; referredUserId: string };

export interface Automation {
  id: string;
  name: string;
  enabled: boolean;
  trigger: { event: string; entity?: string };
  conditions: AutomationCondition[];
  action: AutomationAction;
  runCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ExecutionStatus = 'success' | 'skipped' | 'failed';
export interface AutomationLog {
  id: string;
  automationId: string;
  event: string;
  entityId?: string;
  status: ExecutionStatus;
  message: string;
  createdAt: string;
}

export interface AutomationEvent {
  event: string;
  entity?: string;
  entityId?: string;
  data: Record<string, JsonValue>;
}

export interface AutomationStore {
  automations: Automation[];
  logs: AutomationLog[];
  entities: Record<string, Record<string, JsonValue>>;
}
