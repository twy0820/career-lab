// 项目/竞赛 解锁与推荐
// 规则：
//  1) 段位（等级）是"允许报名"的门槛；
//  2) 知识前置是"真正做得动"的门槛——至少掌握/学习 prereqSkills 中的 1 个；
//  3) 推荐按 overlap 打分：极力推荐 / 适合入门 / 还差点知识。
import type { IProject, IArena, IProgressState, ISkillStatus } from '@/data/types';
import { requiredLevelForDifficulty } from '@/data/ranks';

export interface GateResult {
  levelOk: boolean;
  reqLevel: number;
  knowOk: boolean;
  missing: string[]; // 还没学的前置技能 id
  hit: string[]; // 已经学了的前置技能 id
  tier: 'recommended' | 'starter' | 'gap' | 'locked';
  reason: string;
}

function statusOf(state: IProgressState, skillId: string): ISkillStatus | undefined {
  return state.skillStatus[skillId];
}

export function gateProject(p: IProject, state: IProgressState): GateResult {
  const diff = p.difficulty ?? 2;
  const reqLevel = requiredLevelForDifficulty(diff);
  const levelOk = false;
  // level passed in from provider; here we approximate via XP not available — caller will override
  const prereq = p.prereqSkills ?? p.skills ?? [];
  const hit = prereq.filter((id) => {
    const s = statusOf(state, id);
    return s === 'mastered' || s === 'learning';
  });
  const missing = prereq.filter((id) => !hit.includes(id));
  const knowOk = prereq.length === 0 || hit.length >= Math.min(2, Math.max(1, Math.ceil(prereq.length / 2)));
  let tier: GateResult['tier'] = 'gap';
  let reason = '';
  if (levelOk && knowOk && hit.length >= 2) {
    tier = 'recommended';
    reason = '前置技能已具备，和你当前方向最对口';
  } else if (levelOk && knowOk && (diff <= 2 || hit.length === 1)) {
    tier = 'starter';
    reason = '难度低、有一个前置已学，适合刚步入';
  } else if (levelOk) {
    tier = 'gap';
    reason = `段位够了，但还差点知识：${missing.join('、') || '见技能图谱'}`;
  } else {
    tier = 'locked';
    reason = `段位未到（需 Lv.${reqLevel}）`;
  }
  return { levelOk, reqLevel, knowOk, missing, hit, tier, reason };
}

// 由外部传入 level，避免重复算 XP
export function gateProjectWithLevel(
  p: IProject,
  state: IProgressState,
  level: number,
): GateResult {
  const base = gateProject(p, state);
  const levelOk = level >= base.reqLevel;
  let tier: GateResult['tier'] = base.tier;
  let reason = base.reason;
  if (!levelOk) {
    tier = 'locked';
    reason = `段位未到（需 Lv.${base.reqLevel}）`;
  } else if (base.knowOk && base.hit.length >= 2) {
    tier = 'recommended';
    reason = '前置技能已具备，和你当前方向最对口';
  } else if (base.knowOk) {
    tier = 'starter';
    reason = '难度低、有一个前置已学，适合刚步入';
  } else {
    tier = 'gap';
    reason = `段位够了，但还差点知识：${base.missing.join('、') || '见技能图谱'}`;
  }
  return { ...base, levelOk, tier, reason };
}

export function gateArenaWithLevel(
  a: IArena,
  state: IProgressState,
  level: number,
): GateResult {
  const reqLevel = requiredLevelForDifficulty(a.difficulty);
  const levelOk = level >= reqLevel;
  const prereq = a.prereqSkills ?? a.skills ?? [];
  const hit = prereq.filter((id) => {
    const s = state.skillStatus[id];
    return s === 'mastered' || s === 'learning';
  });
  const missing = prereq.filter((id) => !hit.includes(id));
  const knowOk = prereq.length === 0 || hit.length >= 1;
  let tier: GateResult['tier'] = 'gap';
  let reason = '';
  if (!levelOk) {
    tier = 'locked';
    reason = `段位未到（需 Lv.${reqLevel}）`;
  } else if (knowOk && hit.length >= 2) {
    tier = 'recommended';
    reason = '前置已具备，和你当前方向最对口';
  } else if (knowOk) {
    tier = 'starter';
    reason = '适合刚步入，难度低';
  } else {
    tier = 'gap';
    reason = `段位够了，但还差点知识：${missing.join('、') || '见技能图谱'}`;
  }
  return { levelOk, reqLevel, knowOk, missing, hit, tier, reason };
}

// 推荐排序：recommended > starter > gap > locked
export function sortByTier<T extends { gate: GateResult }>(arr: T[]): T[] {
  const order = { recommended: 0, starter: 1, gap: 2, locked: 3 } as const;
  return [...arr].sort((a, b) => order[a.gate.tier] - order[b.gate.tier]);
}
