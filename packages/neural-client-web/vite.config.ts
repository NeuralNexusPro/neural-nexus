import { getDeployConfig } from './config/deploy.config';
import { getViteDevConfig } from './config/dev.config';
import type { ConfigEnv } from 'vite';

export default async ({ command }: ConfigEnv) => {
  // 在 Qi平台部署的配置。 也支持本地build 之后 `vite preview`
  if (command === 'build') return getDeployConfig();
  // 本地运行
  return getViteDevConfig();
};
