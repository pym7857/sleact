import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from 'react';

// 가독성을 위해 type부분을 변수로 이렇게 따로 만들 수 있음
type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

// 중복되는것들 hook으로..
const useInput = <T>(initialData: T): ReturnTypes<T> => { // 왠만하면 any안쓰고 이렇게 Generic 사용하는게 나음 
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue((e.target.value as unknown) as T);
  }, []);
  return [value, handler, setValue]; // 순서
};

export default useInput;


// import { useCallback, useState } from 'react';

// const useInput = (initialData) => {
//   const [value, setValue] = useState(initialData);
//   const handler = useCallback((e) => {
//     setValue((e.target.value));
//   }, []);
//   return [value, handler, setValue];
// };

// export default useInput;
