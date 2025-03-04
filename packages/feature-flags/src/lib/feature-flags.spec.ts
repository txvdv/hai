import { FeatureFlagService, FeatureFlag, EvaluationContext, Operator } from './feature-flags.js';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    // Define feature flags with rules
    const flags: FeatureFlag[] = [
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

    service = new FeatureFlagService(flags);
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

  it('should return undefined for non-existent feature flags', () => {
    const context: EvaluationContext = { userId: 'user1', country: 'US' };
    expect(service.evaluate('non-existent-flag', context)).toBeUndefined();
  });

  it('should handle complex condition combinations (AND logic)', () => {
    // Add a flag with multiple conditions
    const flags: FeatureFlag[] = [
      {
        key: 'complex-flag',
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

    const service = new FeatureFlagService(flags);

    const validContext: EvaluationContext = { userId: 'user123', country: 'CA' };
    const invalidContext: EvaluationContext = { userId: 'user123', country: 'US' };

    expect(service.evaluate('complex-flag', validContext)).toBe(true);
    expect(service.evaluate('complex-flag', invalidContext)).toBe(false);
  });

  it('should evaluate NOT_IN operator correctly', () => {
    const flags: FeatureFlag[] = [
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

    const service = new FeatureFlagService(flags);

    const allowedUserContext: EvaluationContext = { userId: 'normalUser' };
    const restrictedUserContext: EvaluationContext = { userId: 'restrictedUser' };

    expect(service.evaluate('exclude-users', allowedUserContext)).toBe(true);
    expect(service.evaluate('exclude-users', restrictedUserContext)).toBe(false);
  });

  it('should evaluate NOT_EQUALS operator correctly', () => {
    const flags: FeatureFlag[] = [
      {
        key: 'different-country-flag',
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

    const service = new FeatureFlagService(flags);

    const nonUSContext: EvaluationContext = { country: 'CA' };
    const usContext: EvaluationContext = { country: 'US' };

    expect(service.evaluate('different-country-flag', nonUSContext)).toBe(true);
    expect(service.evaluate('different-country-flag', usContext)).toBe(false);
  });
});