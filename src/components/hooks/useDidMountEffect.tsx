import { useEffect, useRef } from 'react';

const useDidMountEffect = (func:any, deps:any) => {
  const didMount = useRef(false);

//  처음 렌더링 될때는 useEffect()가 작동되지 않고 이후에 
// State가 변경될 때 작동되도록 커스텀
  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidMountEffect;