import { Context, useContext } from "react";

const useContextSafe = <T>(context: Context<T>) => {
  const value = useContext(context);

  if (value === undefined) {
    throw new Error(`${context.displayName}.value is \`undefined\`!`);
  }

  if (value === null) {
    throw new Error(`${context.displayName}.value is \`null\`!`);
  }

  return value as NonNullable<T>;
};

export default useContextSafe;
