import styles from './style.module.scss';

import React, {
  useState,
  useEffect,
  useContext,
  forwardRef,
  useImperativeHandle
} from 'react';
import { Nav, NavItem } from 'reactstrap';
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { OperationTypes, TabTypes } from '../../config/types';
import Modal from './Modal';
import { Context } from '../../store/index';
import { useCopy, useCut, useCopyMulti, useCutMulti } from '../../config/hooks';
import CheckPermissions from '../../components/CheckPermissions';
import { getBs } from '../../utils/index';
import { IconFolderPlus, IconPaste } from '../icons';

interface IProps {
  query?: string;
  close?: () => void;
  ref?: any;
}

const App: React.FunctionComponent<IProps> = forwardRef(
  ({ query, close }, ref) => {
    const {
      setItemHash,
      itemHash,
      operationType: actionType,
      currentHash,
      currentTab,
      selectedItems,
      setSelectedItems
    } = useContext(Context);
    const [isOpen, setIsopen] = useState<boolean>(false);
    const [operationType, setOperationType] = useState<number>();

    const copy = useCopy(currentHash);
    const cut = useCut(currentHash);
    const copyMulti = useCopyMulti(currentHash);
    const cutMulti = useCutMulti(currentHash);

    const toggle = (type?: number) => {
      setIsopen(!isOpen);
      hideContextMenu();
      if (type) setOperationType(type);
    };

    const [isShown, setIsShown] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    let elementHtml: Element | null = null;

    const showContextMenu = (event: any) => {
      // Disable the default context menu
      event.preventDefault();
      // event.stopPropagation();
      // event?.nativeEvent?.stopImmediatePropagation();
      const clientWidth: number = elementHtml?.clientWidth
        ? elementHtml?.clientWidth
        : 0;
      setIsShown(false);
      const newPosition = {
        x:
          Math.abs(clientWidth - event.pageX) < 250
            ? event.pageX
            : event.pageX - 250,
        y: event.clientY
      };

      setPosition(newPosition);
      if (close) close();
      setIsShown(true);
    };

    const hideContextMenu = () => {
      setIsShown(false);
      if (close) close();
    };

    useImperativeHandle(ref, () => ({ hideContextMenu }));
    useEffect(() => {
      const elementHtml = document.querySelector(`${query}`);

      elementHtml?.addEventListener('contextmenu', showContextMenu, {
        capture: true
      });
      document.body?.addEventListener('click', hideContextMenu);

      return () => {
        elementHtml?.removeEventListener('contextmenu', showContextMenu, {
          capture: true
        });
        document.body?.removeEventListener('click', hideContextMenu);
      };
    }, []);

    const clickHandler = (type) => {
      switch (type) {
        case OperationTypes.NewFolder:
          toggle(OperationTypes.NewFolder);
          break;
        case OperationTypes.Paste:
          if (OperationTypes.Copy === actionType && selectedItems.length > 0)
            // multi copy
            copyMulti.mutateAsync({
              hashes: selectedItems.map((x) => x.hash),
              destFolderHash: currentHash
            });
          if (OperationTypes.Copy === actionType && selectedItems.length === 0)
            // one item copy
            copy.mutateAsync({ hash: itemHash, destFolderHash: currentHash });
          if (OperationTypes.Cut === actionType && selectedItems.length > 0)
            // multi cut
            cutMulti.mutateAsync({
              hashes: selectedItems.map((x) => x.hash),
              destFolderHash: currentHash
            });
          if (OperationTypes.Cut === actionType && selectedItems.length === 0)
            // one item cut
            cut.mutateAsync({ hash: itemHash, destFolderHash: currentHash });

          setItemHash('');
          setIsShown(false);
          break;
      }
    };

    return (
      <React.Fragment>
        {isOpen && OperationTypes.NewFolder == operationType ? (
          <Modal
            isOpen={isOpen}
            type={OperationTypes.NewFolder}
            title='ایجاد پوشه جدید'
            toggle={toggle}
            placeholder='نام پوشه جدید را وارد نمایید'
            btnNoText='انصراف'
            btnOkText='ایجاد'
          />
        ) : (
          ''
        )}
        {isShown && currentTab !== TabTypes.SearchList && (
          <CheckPermissions permissions={['folder_create', 'copy', 'cut']}>
            <div
              style={{ top: position.y, left: position.x }}
              className={styles['context-menu']}
            >
              <Nav className={styles['']} cssModule={getBs()} vertical>
                <CheckPermissions permissions={['folder_create']}>
                  <NavItem
                    cssModule={getBs()}
                    className={styles['context-menu__item']}
                    onClick={() => clickHandler(OperationTypes.NewFolder)}
                  >
                    <span className={styles['context-menu__icon']}>
                      <IconFolderPlus />
                    </span>
                    <span className={styles['context-menu__text']}>
                      ایجاد پوشه جدید
                    </span>
                  </NavItem>
                </CheckPermissions>
                {itemHash ||
                (Array.isArray(selectedItems) && selectedItems.length > 0) ? (
                  <CheckPermissions permissions={['copy', 'cut']}>
                    <NavItem
                      cssModule={getBs()}
                      onClick={() => clickHandler(OperationTypes.Paste)}
                      className={styles['context-menu__item']}
                    >
                      <span className={styles['context-menu__icon']}>
                        <IconPaste />
                      </span>
                      <span className={styles['context-menu__text']}>
                        جایگذاری
                      </span>
                    </NavItem>
                  </CheckPermissions>
                ) : (
                  ''
                )}
                <NavItem>
                  {/* <FontAwesomeIcon icon={faPaste} className='' /> */}
                </NavItem>
              </Nav>
            </div>
          </CheckPermissions>
        )}
      </React.Fragment>
    );
  }
);
export default App;
