export const getArgs = (argv) => {
  const result = {};
  const args = argv.slice(2);

  args.forEach((value, index) => {
    if (!value.startsWith("-")) {
      return;
    }

    const key = value.slice(1);
    const next = args[index + 1];
    result[key] = next === undefined || next.startsWith("-") ? true : next;
  });

  return result;
};
