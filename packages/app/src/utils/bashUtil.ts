import { $, nothrow } from "zx";

const exec = async (cmd: string) => {
  const res = await nothrow($`${cmd}`)
  return res.exitCode === 0 ? res.stdout : res.stderr 
}

export { exec }