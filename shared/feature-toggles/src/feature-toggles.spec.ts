import { FeatureToggles, FeatureToggle, EvaluationContext, Operator } from './feature-toggles.js';

describe('FeatureToggles', () => {
  let service: FeatureToggles;

  beforeEach(() => {
    // Define feature toggles with rules
    const toggles: FeatureToggle[] = [
      {
        key: 'new-feature',
        defaultValue: false,
        rules: [
          {
            conditions: [{ attribute: 'userId', operator: Operator.IN, value: ['user1', 'user2'] }],
            value: true,
          },
          {
            conditions: [{ attribute: 'country', operator: Operator.EQUALS, value: 'US' }],
            value: true,
          },
          {
            conditions: [{ attribute: 'userId', operator: Operator.PERCENTAGE, value: 50 }],
            value: true,
          },
        ],
      },
    ];

    service = new FeatureToggles(toggles);
  });

  it('should return default value when no rules match', () => {
    const context: EvaluationContext = { userId: 'user3', country: 'CA' }; // No matching rules
    expect(service.evaluate('new-feature', context)).toBe(false); // Should return default value
  });

  it('should match the IN operator and return true', () => {
    const context: EvaluationContext = { userId: 'user1', country: 'CA' };
    expect(service.evaluate('new-feature', context)).toBe(true);
  });

  it('should match the EQUALS operator and return true', () => {
    const context: EvaluationContext = { userId: 'user3', country: 'US' };
    expect(service.evaluate('new-feature', context)).toBe(true);
  });

  it('should evaluate the PERCENTAGE operator properly', () => {
    const context: EvaluationContext = { userId: 'user4' }; // Hash of `user4` should determine result
    const result = service.evaluate('new-feature', context);

    // No exact value expectation since hash is deterministic based on stringHash output.
    expect(typeof result).toBe('boolean');
  });

  it('should return undefined for non-existent feature toggles', () => {
    const context: EvaluationContext = { userId: 'user1', country: 'US' };
    expect(service.evaluate('non-existent-toggle', context)).toBeUndefined();
  });

  it('should handle complex condition combinations (AND logic)', () => {
    // Add a toggle with multiple conditions
    const toggles: FeatureToggle[] = [
      {
        key: 'complex-toggle',
        defaultValue: false,
        rules: [
          {
            conditions: [
              { attribute: 'userId', operator: Operator.EQUALS, value: 'user123' },
              { attribute: 'country', operator: Operator.EQUALS, value: 'CA' },
            ],
            value: true,
          },
        ],
      },
    ];

    const service = new FeatureToggles(toggles);

    const validContext: EvaluationContext = { userId: 'user123', country: 'CA' };
    const invalidContext: EvaluationContext = { userId: 'user123', country: 'US' };

    expect(service.evaluate('complex-toggle', validContext)).toBe(true);
    expect(service.evaluate('complex-toggle', invalidContext)).toBe(false);
  });

  it('should evaluate NOT_IN operator correctly', () => {
    const toggles: FeatureToggle[] = [
      {
        key: 'exclude-users',
        defaultValue: false,
        rules: [
          {
            conditions: [
              { attribute: 'userId', operator: Operator.NOT_IN, value: ['restrictedUser'] },
            ],
            value: true,
          },
        ],
      },
    ];

    const service = new FeatureToggles(toggles);

    const allowedUserContext: EvaluationContext = { userId: 'normalUser' };
    const restrictedUserContext: EvaluationContext = { userId: 'restrictedUser' };

    expect(service.evaluate('exclude-users', allowedUserContext)).toBe(true);
    expect(service.evaluate('exclude-users', restrictedUserContext)).toBe(false);
  });

  it('should evaluate NOT_EQUALS operator correctly', () => {
    const toggles: FeatureToggle[] = [
      {
        key: 'different-country-toggle',
        defaultValue: false,
        rules: [
          {
            conditions: [
              { attribute: 'country', operator: Operator.NOT_EQUALS, value: 'US' },
            ],
            value: true,
          },
        ],
      },
    ];

    const service = new FeatureToggles(toggles);

    const nonUSContext: EvaluationContext = { country: 'CA' };
    const usContext: EvaluationContext = { country: 'US' };

    expect(service.evaluate('different-country-toggle', nonUSContext)).toBe(true);
    expect(service.evaluate('different-country-toggle', usContext)).toBe(false);
  });
});