import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

// TypeScript에서는 Props에 대한 타입을 명시해주어야 에러 안뜸 (=리액트의 propTypes)
interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}
// Props로 넘겨받은것들을 매개변수로 명시 
const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>(); // 라우터 파라미터를 useParams()로 가져올 수 있다
                                                                                      // <Route path="/workspace/:workspace/channel/:channel ...
  const { data: userData, error, revalidate } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  // 채널 생성하자마자, 채널 리스트 다시 불러오기 (=revalidate)
  const { data: channelData, mutate, revalidate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault(); // 채널만들때 새로고침 안되도록 해줌 
      axios
        .post(
          `/api/workspaces/${workspace}/channels`, // useParams()로 가져온 workspace변수 
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          setShowCreateChannelModal(false);
          revalidateChannel(); // 채널 생성하자마자, 채널 리스트 다시 불러오기 
          setNewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
