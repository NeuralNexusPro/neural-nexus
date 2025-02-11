import React, { useEffect, useRef } from 'react';
import Runtime from '@neural-nexus/neural-client-runtime';
import { useMount } from 'ahooks';
import { Button } from 'antd';

export default function () {
  const runtimeRef = useRef<Runtime>();
  useMount(() => {
    runtimeRef.current = new Runtime('custom-component');
  });


  const testRuntime = function () {
    runtimeRef.current?.application.openApp('https://baidu.com', '百度');
  }
  return (
    <div>
      <Button onClick={testRuntime}>点击</Button>
    </div>
  )
}