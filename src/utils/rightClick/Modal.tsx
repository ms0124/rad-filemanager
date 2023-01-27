import React, { useState, useRef, useContext } from 'react';
import { Modal, ModalBody, ModalHeader, Input, Button } from 'reactstrap';
import classNames from 'classnames';
import { OperationTypes } from '../../config/types';
import { Context } from '../../store/index';
import { useCreateNewFolder } from '../../config/hooks';
import {
  useDeleteFileAndFolder,
  useRenameFileAndFolder,
} from '../../config/hooks';
interface IProps {
  title: string;
  isOpen: boolean;
  type: number;
  toggle: () => void;
  placeholder?: string;
  btnOkText: string;
  btnNoText: string;
  item?: { name: string; hash: string };
}

const Index: React.FC<IProps> = ({
  title,
  type,
  isOpen,
  toggle,
  placeholder,
  btnNoText,
  btnOkText,
  item
}) => {
  const { currentHash } = useContext(Context);

  const createNewFolder = useCreateNewFolder();
  const deleteFileAndFolder = useDeleteFileAndFolder(currentHash);
  const renameFileAndFolder = useRenameFileAndFolder(currentHash);

  const inputRef = useRef<HTMLInputElement>(null);

  const execute = () => {
    let name: string = inputRef.current?.value ? inputRef.current?.value : '';
    if (type === OperationTypes.Remove) name = ''; // inputRef.current?.value;
    switch (type) {
      case OperationTypes.NewFolder:
        createNewFolder.mutateAsync({ name, parentHash: currentHash });
        break;
      case OperationTypes.Remove:
        deleteFileAndFolder.mutateAsync({hash: item?.hash});
        break;
      case OperationTypes.Rename:
        renameFileAndFolder.mutateAsync({ hash: item?.hash, newName: name });
        break;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={true}
      className='modal-operation'
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {type === OperationTypes.Remove ? (
          ''
        ) : (
          <Input
            innerRef={inputRef}
            placeholder={placeholder}
            defaultValue={type === OperationTypes.Rename ? item?.name : ''}
            onDoubleClick={(e) => e.stopPropagation()}
          />
        )}
        <div
          className={classNames(
            'd-flex mt-4',
            {
              'justify-content-end': type === OperationTypes.NewFolder
            },
            { 'justify-content-center': type !== OperationTypes.NewFolder }
          )}
        >
          <Button onClick={toggle} className='ms-3' color='danger' outline>
            {btnNoText}
          </Button>
          <Button onClick={execute} color='primary'>
            {btnOkText}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Index;
