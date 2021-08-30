import { $, nothrow } from "zx";

const findSomething = async (something: string) => {
  const res = await nothrow($`which ${something}`)
  return res.exitCode === 0 ? res.stdout : false
}

export { findSomething }