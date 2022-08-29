const { deterministicPartitionKey } = require('./dpk');
const crypto = require('crypto');

describe('deterministicPartitionKey', () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe('0');
  });

  it('Returns partitionKey of string < 256', () => {
    const event = {
      partitionKey: 'Testing 123',
    };
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe(JSON.stringify(event.partitionKey));
  });

  it('Returns partitionKey of string > 256', () => {
    const event = {
      partitionKey:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    };

    const expectation = crypto
      .createHash('sha3-512')
      .update(JSON.stringify(event.partitionKey))
      .digest('hex');
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe(JSON.stringify(expectation));
  });

  it('Returns stringified JSON of partitionKey is not a string and < 256', () => {
    const event = {
      partitionKey: { foo: 'bar' },
    };
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe(JSON.stringify(event.partitionKey));
  });

  it('Returns partitionKey of stringified JSON is not a string and > 256', () => {
    // Here it is 329
    const event = {
      partitionKey: {
        foo: `You've been asked to refactor the attached function to make it easier to read and understand without changing its functionality. For this task, you should:`,
        bar: `You've been asked to refactor the attached function to make it easier to read and understand without changing its functionality. For this task, you should:`,
      },
    };
    const partitionKey = deterministicPartitionKey(event);
    const expectation = crypto
      .createHash('sha3-512')
      .update(JSON.stringify(event.partitionKey))
      .digest('hex');
    expect(partitionKey).toBe(JSON.stringify(expectation));
  });

  it('Returns partitionKey for a large string', () => {
    const event =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    const partitionKey = deterministicPartitionKey(event);
    const expectation = crypto
      .createHash('sha3-512')
      .update(JSON.stringify(event))
      .digest('hex');
    expect(partitionKey).toBe(JSON.stringify(expectation));
  });
});
