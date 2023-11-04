import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useState, useRef, useContext } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  InputGroup,
  InputGroupText,
  Button,
  Spinner
} from 'reactstrap';
import classNames from 'classnames';
import { OperationTypes } from '../../config/types';
import { Context } from '../../store/index';
import { useCreateNewFolder } from '../../config/hooks';
import {
  useDeleteFileAndFolder,
  useRenameFileAndFolder
} from '../../config/hooks';
import { getBs } from '../../utils/index';
interface IProps {
  title: string;
  isOpen: boolean;
  type: number;
  toggle: () => void;
  placeholder?: string;
  btnOkText: string;
  btnNoText: string;
  item?: { name: string; hash: string; extension: string };
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
    const extension: string = item?.extension ? `.${item.extension}` : '';

    if (type === OperationTypes.Remove) name = ''; // inputRef.current?.value;
    switch (type) {
      case OperationTypes.NewFolder:
        createNewFolder
          .mutateAsync({ name, parentHash: currentHash })
          .finally(() => {
            if (isOpen) setTimeout(() => toggle(), 1500);
          });
        break;
      case OperationTypes.Remove:
        deleteFileAndFolder.mutateAsync({ hash: item?.hash }).finally(() => {
          if (isOpen) setTimeout(() => toggle(), 1500);
        });
        break;
      case OperationTypes.Rename:
        renameFileAndFolder
          .mutateAsync({ hash: item?.hash, newName: `${name}${extension}` })
          .finally(() => {
            if (isOpen) setTimeout(() => toggle(), 1500);
          });
        break;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      // centered={true}
      className={`${styles['modal-operation']}`}
      cssModule={getBs()}
      zIndex={99991}
    >
      <ModalHeader cssModule={getBs()}>{title}</ModalHeader>
      <ModalBody cssModule={getBs()}>
        {type === OperationTypes.Remove ? (
          ''
        ) : type === OperationTypes.Rename ? (
          <div className={styles['input-wrapper']} style={{paddingRight:item?.extension ? 0: '8px'}}>
            {item?.extension ? (
              <span className={styles['input-wrapper__icon']}>
                {`.${item.extension.toLocaleLowerCase()}`}
              </span>
            ) : (
              ''
            )}
            <input
              ref={inputRef}
              placeholder={placeholder}
              defaultValue={item?.name}
              onDoubleClick={(e) => e.stopPropagation()}
              className={styles['input-wrapper__input']}
            />
          </div>
        ) : (
          <Input
            innerRef={inputRef}
            placeholder={placeholder}
            defaultValue={type === OperationTypes.Rename ? item?.name : ''}
            onDoubleClick={(e) => e.stopPropagation()}
            cssModule={getBs()}
          />
        )}
        <div
          className={classNames(
            `${utilStyles['d-flex']}  ${utilStyles['mt-4']}`,
            {
              [`${utilStyles['justify-content-end']}`]:
                type === OperationTypes.NewFolder
            },
            {
              [`${utilStyles['justify-content-center']}`]:
                type !== OperationTypes.NewFolder
            }
          )}
        >
          <Button
            cssModule={getBs()}
            onClick={toggle}
            className={`${utilStyles['ms-3']} ${utilStyles['round-8']} ${styles['btn-danger']}`}
            color='danger'
            outline
          >
            {btnNoText}
          </Button>
          <Button
            cssModule={getBs()}
            onClick={execute}
            color='primary'
            className={`${utilStyles['round-8']} ${styles['btn-primary']}`}
          >
            {btnOkText}{' '}
            {deleteFileAndFolder.isLoading || renameFileAndFolder.isLoading ? (
              <Spinner cssModule={getBs()} size={'sm'} />
            ) : (
              ''
            )}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Index;
