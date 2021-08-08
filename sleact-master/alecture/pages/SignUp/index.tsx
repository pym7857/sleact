import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState, VFC } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from './styles';
import { Link, Redirect } from 'react-router-dom';

const SignUp = () => {
  const { data, error, revalidate } = useSWR('/api/users', fetcher);

  const [email, onChangeEmail] = useInput(''); // useInput: 커스텀 훅
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput(''); // 이렇게 변수이름 안써도 줘도됨 (=문법적으로 가능)
  const [passwordCheck, , setPasswordCheck] = useInput(''); // 이렇게 변수이름 안써도 줘도됨 (=문법적으로 가능)
  const [mismatchError, setMismatchError] = useState(false); // mismatchError: `비밀번호`와 `비밀번호확인`이 다른지 여부 
  const [signUpError, setSignUpError] = useState(''); // 서버에서 보내주는 메시지를 프론트에서 보여주자 
  const [signUpSuccess, setSignUpSuccess] = useState(false); // 서버에서 보내주는 메시지를 프론트에서 보여주자

  // 비밀번호 입력란 바꿀때 
  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck); // e.target.value와 passwordCheck이 같지않으면, mismatchError는 True
    },
    [passwordCheck],
  );

  // 비밀번호확인 입력란 바꿀때 
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault(); // SPA에서 `제출`할때는 e.preventDefault(); 필수 
      if (!mismatchError && nickname) { // mismatchError가 없으면 
        console.log('서버로 회원가입하기');

        // then() 이나 catch()에서 state변경해주는게 있으면, 요청보내기 직전에 이렇게 초기화해주는게 좋음 
        // 이렇게 로딩단계에서 초기화해주지않으면, 요청을 연달아 날릴때 첫번째 상태가 두번째에 그대로 전이될 가능성 있음 
        setSignUpError('');
        setSignUpSuccess(false);

        // Promise문법 
        axios
          .post('/api/users', {
            email,
            nickname,
            password,
          })
          .then((response) => { // 성공 시
            console.log(response);
            setSignUpSuccess(true); // 서버에서 보내주는 메시지를 프론트에서 보여주자 
          })
          .catch((error) => { // 실패 시 
            console.log(error.response);
            setSignUpError(error.response.data); // 서버에서 보내주는 에러메시지를 프론트에서 보여주자 
          })
          .finally(() => {}); // 성공하든 실패하든 무조건 실행 
      }
    },
    [email, nickname, password, passwordCheck, mismatchError], // depth자리에는 이 함수에서 쓰이는 state들 다 넣어주어야됨 --> 그래야 업데이트 됨 
  );

  if (data === undefined) { // data가 false인 경우가 있기때문에, if(!data) {} 로 안쓰고 이렇게 쓴다
    return <div>로딩중...</div>;
  }

  if (data) { // 내정보가 있다면, 리다이렉트 
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
