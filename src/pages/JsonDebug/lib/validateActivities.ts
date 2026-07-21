import { ComponentRegistry } from '@lawlietfeng/faui';
import type { Activity } from '@lawlietfeng/faui';

export type DebugIssueSeverity = 'error' | 'warning';
export type DebugIssueCategory = 'json' | 'activity' | 'schema' | 'registry';

export interface DebugIssue {
  severity: DebugIssueSeverity;
  category: DebugIssueCategory;
  message: string;
  location: string;
}

export interface DebugResult {
  activities: Activity[];
  issues: DebugIssue[];
  formattedJson: string;
  canRender: boolean;
}

const FORM_COMPONENT_TYPES = new Set(Object.keys(ComponentRegistry));

function createIssue(
  severity: DebugIssueSeverity,
  category: DebugIssueCategory,
  message: string,
  location: string,
): DebugIssue {
  return { severity, category, message, location };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sortIssues(issues: DebugIssue[]): DebugIssue[] {
  const severityRank: Record<DebugIssueSeverity, number> = {
    error: 0,
    warning: 1,
  };

  return [...issues].sort((left, right) => {
    const severityDiff = severityRank[left.severity] - severityRank[right.severity];
    if (severityDiff !== 0) {
      return severityDiff;
    }

    return left.location.localeCompare(right.location);
  });
}

function getJsonErrorLocation(raw: string, error: unknown): string {
  if (!(error instanceof Error)) {
    return '输入内容';
  }

  const match = error.message.match(/position (\d+)/i);
  if (!match) {
    return '输入内容';
  }

  const position = Number(match[1]);
  if (!Number.isFinite(position) || position < 0) {
    return '输入内容';
  }

  const safePosition = Math.min(position, raw.length);
  const before = raw.slice(0, safePosition);
  const lines = before.split('\n');
  const line = lines.length;
  const column = (lines.at(-1)?.length ?? 0) + 1;

  return `第 ${line} 行，第 ${column} 列`;
}

function validateSnapshotContent(
  content: Record<string, unknown>,
  snapshotIndex: number,
  issues: DebugIssue[],
) {
  const components = content.components;
  const componentsLocation = `$[${snapshotIndex}].content.components`;

  if (!Array.isArray(components)) {
    issues.push(
      createIssue(
        'error',
        'schema',
        '第一个 ACTIVITY_SNAPSHOT 的 content.components 必须是数组。',
        componentsLocation,
      ),
    );
    return;
  }

  const componentIds = new Set<string>();
  const validComponents: Array<{ component: Record<string, unknown>; location: string; index: number }> = [];

  components.forEach((component, componentIndex) => {
    const location = `${componentsLocation}[${componentIndex}]`;

    if (!isRecord(component)) {
      issues.push(
        createIssue('error', 'schema', '组件必须是对象。', location),
      );
      return;
    }

    const rawId = component.id;
    const rawType = component.component;
    const componentId = typeof rawId === 'string' ? rawId.trim() : '';
    const componentType = typeof rawType === 'string' ? rawType.trim() : '';

    if (!componentId) {
      issues.push(
        createIssue('error', 'schema', '组件缺少 id。', `${location}.id`),
      );
    } else if (componentIds.has(componentId)) {
      issues.push(
        createIssue('error', 'schema', `发现重复组件 id: "${componentId}"。`, `${location}.id`),
      );
    } else {
      componentIds.add(componentId);
    }

    validComponents.push({ component, location, index: componentIndex });

    if (!componentType) {
      issues.push(
        createIssue('error', 'schema', '组件缺少 component 字段。', `${location}.component`),
      );
    } else if (!FORM_COMPONENT_TYPES.has(componentType)) {
      const message = `组件 "${componentId || `索引 ${componentIndex}`}" 使用了当前表单站点不支持的组件类型 "${componentType}"。`;
      issues.push(
        createIssue('error', 'registry', message, `${location}.component`),
      );
    }

  });

  validComponents.forEach(({ component, location, index }) => {
    if (!('children' in component)) {
      return;
    }

    if (!Array.isArray(component.children)) {
      issues.push(
        createIssue('error', 'schema', 'children 必须是字符串数组。', `${location}.children`),
      );
      return;
    }

    const rawId = component.id;
    const componentId = typeof rawId === 'string' && rawId.trim()
      ? rawId.trim()
      : `索引 ${index}`;

    component.children.forEach((childId, childIndex) => {
      if (typeof childId !== 'string' || !childId.trim()) {
        issues.push(
          createIssue(
            'error',
            'schema',
            'children 中的子组件引用必须是非空字符串。',
            `${location}.children[${childIndex}]`,
          ),
        );
        return;
      }

      if (!componentIds.has(childId)) {
        issues.push(
          createIssue(
            'error',
            'schema',
            `组件 "${componentId}" 引用了不存在的子组件 "${childId}"。`,
            `${location}.children[${childIndex}]`,
          ),
        );
      }
    });
  });

  if (!componentIds.has('root')) {
    issues.push(
      createIssue('error', 'schema', '缺少 id 为 "root" 的根组件。', componentsLocation),
    );
  }
}

export function validateActivitiesInput(rawInput: string): DebugResult {
  const trimmedInput = rawInput.trim();

  if (!trimmedInput) {
    return {
      activities: [],
      issues: [
        createIssue('error', 'json', '请输入 Activity[] JSON 数组。', '$'),
      ],
      formattedJson: '',
      canRender: false,
    };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawInput);
  } catch (error) {
    return {
      activities: [],
      issues: [
        createIssue(
          'error',
          'json',
          error instanceof Error ? error.message : 'JSON 解析失败。',
          getJsonErrorLocation(rawInput, error),
        ),
      ],
      formattedJson: '',
      canRender: false,
    };
  }

  const formattedJson = JSON.stringify(parsed, null, 2);
  const issues: DebugIssue[] = [];

  if (!Array.isArray(parsed)) {
    return {
      activities: [],
      issues: [
        createIssue('error', 'activity', '根输入必须是 Activity[] 数组。', '$'),
      ],
      formattedJson,
      canRender: false,
    };
  }

  let firstSnapshotIndex = -1;
  let firstSnapshotContent: Record<string, unknown> | null = null;

  parsed.forEach((activity, index) => {
    const location = `$[${index}]`;

    if (!isRecord(activity)) {
      issues.push(
        createIssue('error', 'activity', '每一项 Activity 都必须是对象。', location),
      );
      return;
    }

    const activityType = activity.type;

    if (activityType === 'ACTIVITY_SNAPSHOT') {
      if (firstSnapshotIndex === -1) {
        firstSnapshotIndex = index;

        if (!isRecord(activity.content)) {
          issues.push(
            createIssue(
              'error',
              'activity',
              'ACTIVITY_SNAPSHOT 缺少 content 对象。',
              `${location}.content`,
            ),
          );
        } else {
          firstSnapshotContent = activity.content;
        }
      } else {
        issues.push(
          createIssue(
            'warning',
            'activity',
            '当前站点的 Renderer 只会使用第一个 ACTIVITY_SNAPSHOT，后续 snapshot 会被忽略。',
            location,
          ),
        );
      }

      return;
    }

    if (activityType === 'ACTIVITY_DELTA') {
      if (!Array.isArray(activity.patch)) {
        issues.push(
          createIssue(
            'error',
            'activity',
            'ACTIVITY_DELTA.patch 必须是数组。',
            `${location}.patch`,
          ),
        );
      }
      return;
    }

    issues.push(
      createIssue(
        'error',
        'activity',
        `仅支持 ACTIVITY_SNAPSHOT 和 ACTIVITY_DELTA，当前 type 为 "${String(activityType)}"。`,
        `${location}.type`,
      ),
    );
  });

  if (firstSnapshotIndex === -1) {
    issues.push(
      createIssue('error', 'activity', '缺少 ACTIVITY_SNAPSHOT。', '$'),
    );
  } else if (firstSnapshotContent) {
    validateSnapshotContent(firstSnapshotContent, firstSnapshotIndex, issues);
  }

  const sortedIssues = sortIssues(issues);
  const canRender = !sortedIssues.some((issue) => issue.severity === 'error');

  return {
    activities: canRender ? (parsed as Activity[]) : [],
    issues: sortedIssues,
    formattedJson,
    canRender,
  };
}
