import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface IresultGPTAPIValue
{
    gptResult:string;
}

function Result_DBI_Modal({gptResult}:IresultGPTAPIValue) {

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <>
      <Button color="danger" onClick={toggle}>
        검사가 완료 되었습니다. 해당 버튼을 클릭해주세요.
      </Button>
      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>

        <ModalBody>
          {gptResult}
        </ModalBody>
        
        <ModalFooter>

          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{' '}

        </ModalFooter>
      </Modal>
    </>
  );
}

export default Result_DBI_Modal;