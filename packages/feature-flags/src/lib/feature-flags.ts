/**
 * Represents a feature flag in a feature management system.
 * A feature flag controls whether a feature should be enabled or not,
 * based on a set of matching rules defined by the `rules` property.
 */

export interface FeatureFlag {
  /**
   * A unique identifier for the feature flag.
   */
  key: string;
  /**
   * The default value of the feature flag if no rules match in evaluation.
   * Can be of any data type depending on the context of the feature.
   */
  defaultValue: any;
  /**
   * A list of targeting rules used to determine the value of the feature flag
   * based on the provided evaluation context.
   */
  rules: TargetingRule[];
}

/**
 * Represents a rule for targeting users or conditions for a feature flag.
 * If all conditions are met, the `value` of the rule is returned during evaluation.
 */
export interface TargetingRule {
  /**
   * A list of conditions that must all evaluate to `true` for the rule to apply.
   */
  conditions: Condition[];
  /**
   * The value to be returned for the feature flag if this rule is matched.
   */
  value: any;
}

/**
 * Represents a condition to be checked during feature flag evaluation.
 */

export interface Condition {
  /**
   * The attribute to check (e.g., `userId`, `country`, `group`).
   * This should match a key in the `EvaluationContext`.
   */
  attribute: string;
  /**
   * The comparison operator to use for evaluating the condition.
   * Examples: 'equals', 'in', 'greaterThan', etc.
   */
  operator: Operator;
  /**
   * The value to compare the attribute against. Can be a single value
   * or an array, depending on the operator.
   */
  value: any;
}

/**
 * Enum representing the comparison operators used in conditions.
 */
export enum Operator {
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  IN = 'in',
  NOT_IN = 'notIn',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
  PERCENTAGE = 'percentage',
}

/**
 * Represents the context for evaluating a feature flag.
 * Can include user-specific attributes (e.g., `userId`, `country`, etc.)
 * as well as custom-defined attributes.
 */
export interface EvaluationContext {
  /**
   * Additional custom attributes available for targeting.
   * These attributes can be matched against `Condition.attribute` in the evaluation.
   */
  [key: string]: any;
}

/**
 * A service for managing and evaluating feature flags.
 * Provides methods to evaluate feature flags against rules and conditions
 * to determine if a feature should be enabled or disabled.
 */
export class FeatureFlagService {
  private flags: FeatureFlag[];

  constructor(flags: FeatureFlag[]) {
    this.flags = flags;
  }
  /**
   * Evaluates the value of a feature flag based on its key and an evaluation context.
   * If no rules match, the flag's default value is returned.
   *
   * @param flagKey - The key of the feature flag to evaluate.
   * @param context - An evaluation context containing attributes for evaluation.
   * @returns The value of the feature flag depending on the matched rules, or the default value.
   */
  evaluate(flagKey: string, context: EvaluationContext): any {
    const flag = this.flags.find((f) => f.key === flagKey);
    if (!flag) {
      // Maybe throw an error?
      return undefined;
    }

    for (const rule of flag.rules) {
      if (this.evaluateConditions(rule.conditions, context)) {
        return rule.value;
      }
    }

    return flag.defaultValue;
  }
  /**
   * Evaluates a list of conditions against the evaluation context.
   * All conditions must evaluate to true for the list to pass.
   *
   * @param conditions - The conditions to evaluate.
   * @param context - The evaluation context providing attribute values.
   * @returns `true` if all conditions match, otherwise `false`.
   */
  private evaluateConditions(conditions: Condition[], context: EvaluationContext): boolean {
    for (const condition of conditions) {
      const attributeValue = context[condition.attribute];
      if (!this.evaluateCondition(condition, attributeValue)) {
        return false;
      }
    }
    return true;
  }
  /**
   * Evaluates a single condition against a specific attribute value.
   *
   * @param condition - The condition to evaluate.
   * @param attributeValue - The value of the attribute to evaluate against.
   * @returns `true` if the condition is met, otherwise `false`.
   */
  private evaluateCondition(condition: Condition, attributeValue: any): boolean {
    switch (condition.operator) {
      case Operator.EQUALS:
        return attributeValue === condition.value;
      case Operator.NOT_EQUALS:
        return attributeValue !== condition.value;
      case Operator.IN:
        return Array.isArray(condition.value) && condition.value.includes(attributeValue);
      case Operator.NOT_IN:
        return Array.isArray(condition.value) && !condition.value.includes(attributeValue);
      case Operator.GREATER_THAN:
        return attributeValue > condition.value;
      case Operator.LESS_THAN:
        return attributeValue < condition.value;
      case Operator.PERCENTAGE:
        if(typeof attributeValue === 'string' && typeof condition.value === 'number'){
          const hash = this.stringHash(attributeValue) % 100;
          return hash < condition.value;
        }
        return false;
      default:
        return false;
    }
  }
  /**
   * Computes a deterministic hash of a string. Used for percentage-based rollouts.
   *
   * @param str - The input string to hash.
   * @returns A non-negative integer representing the hash value.
   */
  private stringHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      // Convert to 32bit integer
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}


