import { useState } from 'react';

interface Environment {
  os?: string;
  nginxPath?: string[];
  isRunningNginx?: boolean;
}

export default () => {
  const [env, setEnv] = useState<Environment>();
  return { env, setEnv };
};
