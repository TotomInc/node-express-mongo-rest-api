/**
 * Find an argument value based on its name or prefix.
 *
 * @param {string} argName Name of the argument.
 * @param {string} argPrefix Prefix of the argument.
 * @param {boolean} valueRequired True if the argument require a value.
 * @return {string}
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = function findArgumentValue(argName, argPrefix, valueRequired) {
  const args = process.argv.slice(2);
  const argIndex = args.findIndex((arg) => arg === argName || arg === argPrefix);

  if (argIndex === -1) {
    throw new Error(`Unable to find argument ${argName}:${argPrefix}.`);
  }

  const argValue = args[argIndex + 1];

  if (!argValue && valueRequired) {
    throw new Error(`Expected a value for argument ${argName}:${argPrefix}.`);
  }

  return argValue;
};
