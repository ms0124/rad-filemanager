import styles from './style.module.scss';
import DatePicker from 'persian-reactjs-date-picker';
import React, { useState, useContext } from 'react';
import copy from 'copy-to-clipboard';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Spinner
} from 'reactstrap';
import moment from 'moment-jalaali';
import { Context } from '../../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTimes,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons';
// import {  } from '@fortawesome/free-regular-svg-icons';

// hooks
import {
  useDetailShare,
  useAddShare,
  useDeleteShare,
  useAddPublic,
  useRemovePublic
} from '../../config/hooks';
import { getBs } from '../../utils/index';
import classNames from 'classnames';
import ListItem from './listItem';
import { IconCopy } from '../../utils/icons';
import { toast } from 'react-toastify';

interface IProps {
  hash: string;
  isOpen: boolean;
  toggle: () => void;
  isPublic: boolean;
}

const ShareFile: React.FC<IProps> = ({ isOpen, toggle, hash, isPublic }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAccessPublic, setIsAccessPublic] = useState<boolean>(
    isPublic ? true : false
  );
  // const { selectedItems, itemHash } = useContext(Context);
  const { data, isLoading, refetch } = useDetailShare(hash);
  const addShare = useAddShare();
  const deleteShare = useDeleteShare();

  const addPublic = useAddPublic();
  const removePublic = useRemovePublic();

  const accessHandler = () => {
    setIsAccessPublic((prevAccess) => !prevAccess);
  };

  const addShareHandller = (identity) => {
    const params = { expiration: '2024/04/01', level: 'VIEW' };
    addShare.mutateAsync({ hash, identity, params }).finally(() => {
      refetch();
    });
  };

  const copyHandler = () => {
    const isSuccess = copy('test');
    if (isSuccess) toast.success('لینک با موفقیت کپی شد.');
  };

  const confirmationHandler = () => {
    if (isPublic == isAccessPublic) {
      // access configuraiotn not changed
      toggle();
    } else {
      if (!isAccessPublic) {
        removePublic.mutateAsync({ hash }).then((res) => {
          const { hasError } = res;
          if (!hasError) {
            toast.success('دسترسی با موفقیت تغیر کرد.');
            toggle();
          }
        });
      } else if (isAccessPublic) {
        const params = { expiration: '2034/03/01' };
        addPublic.mutateAsync({ hash, params }).then((res) => {
          const { hasError } = res;
          if (!hasError) {
            toast.success('دسترسی با موفقیت تغیر کرد.');
            toggle();
          }
        });
      }
    }
  };

  return (
    <Modal
      cssModule={getBs()}
      isOpen={isOpen}
      toggle={toggle}
      size='lg'
      className={styles['sharefile-wrapper']}
    >
      <ModalHeader
        cssModule={getBs()}
        className={classNames(
          styles['sharefile-wrapper__header'],
          getBs()['border-bottom-0'],
          getBs()['d-flex']
        )}
      >
        <div
          className={classNames(
            getBs()['d-flex'],
            getBs()['justify-content-between'],
            getBs()['align-items-center']
          )}
        >
          <div>مدیریت اشتراک گذاری و دسترسی‌ها</div>
          <FontAwesomeIcon icon={faTimes} onClick={toggle} role='button' />
        </div>
      </ModalHeader>
      <ModalBody cssModule={getBs()}>
        <Row cssModule={getBs()}>
          <Col cssModule={getBs()} xs={12}>
            <div>افرادی که دسترسی دارند</div>
            <br />
          </Col>
        </Row>
        <Row cssModule={getBs()} className={classNames(getBs()['mb-3'])}>
          <Col cssModule={getBs()} xs={12}>
            <div className={styles['sharefile-wrapper__add']}>
              <Input
                cssModule={getBs()}
                placeholder='شماره موبایل، نام کاربری، ایمیل'
              />
              <Input
                cssModule={getBs()}
                placeholder='تاریخ انقضا اشتراک گذاری'
              />
              <Button
                cssModule={getBs()}
                tag={'a'}
                className={classNames(styles['sharefile-wrapper__button'])}
                onClick={() => addShareHandller('phoneNumber')}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          </Col>
        </Row>
        <Row cssModule={getBs()}>
          <Col cssModule={getBs()} xs={12} className={classNames()}>
            {isLoading ? (
              <div
                className={classNames(
                  getBs()['d-flex'],
                  getBs()['justify-content-center']
                )}
              >
                <Spinner cssModule={getBs()} color='primary' size={'lg'} />
              </div>
            ) : (
              <div
                className={classNames(getBs()['border'], getBs()['rounded'])}
              >
                <ListGroup
                  cssModule={getBs()}
                  className={classNames(
                    getBs()['pr-0'],
                    styles['list-wrapper']
                  )}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                    <ListGroupItem
                      cssModule={getBs()}
                      className={classNames(
                        getBs()['border-left-0'],
                        getBs()['border-right-0']
                      )}
                    >
                      <ListItem
                        name={'مسلم'}
                        img={undefined}
                        date={undefined}
                      />
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </div>
            )}
          </Col>
        </Row>
        <Row cssModule={getBs()}>
          <Col cssModule={getBs()} xs={12}>
            <Dropdown
              cssModule={getBs()}
              isOpen={dropdownOpen}
              className={classNames(getBs()['pt-3'])}
              role='button'
              toggle={() => setDropdownOpen((prev) => !prev)}
            >
              <DropdownToggle
                cssModule={getBs()}
                data-toggle='dropdown'
                tag={'span'}
              >
                {isAccessPublic ? 'دسترسی عمومی' : 'دسترسی محدود'}
                <FontAwesomeIcon icon={faCaretDown} />
              </DropdownToggle>
              <DropdownMenu cssModule={getBs()} right>
                <DropdownItem cssModule={getBs()} onClick={accessHandler}>
                  {!isAccessPublic ? 'دسترسی عمومی' : 'دسترسی محدود'}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div
              className={classNames(
                styles['sharefile-wrapper__guide'],
                getBs()['pt-2']
              )}
            >
              {isAccessPublic
                ? 'همه افرادی که لینک را دارند میتوانند به آن دسترسی پیدا کنند'
                : 'فقط افرادی که دسترسی دارند میتوانند با این پیوند آن را باز کنند'}
            </div>
          </Col>
          <Col
            cssModule={getBs()}
            xs={12}
            className={classNames(getBs()['mt-3'])}
          >
            <div
              className={classNames(
                getBs()['d-flex'],
                getBs()['justify-content-between']
              )}
            >
              <Button
                cssModule={getBs()}
                outline
                tag='a'
                className={styles['sharefile-wrapper__copy']}
                onClick={copyHandler}
              >
                <IconCopy />
                <span className={getBs()['mr-3']}>کپی لینک</span>
              </Button>
              <Button
                cssModule={getBs()}
                tag='a'
                className={classNames(
                  styles['sharefile-wrapper__confirm'],
                  styles['sharefile-wrapper__button']
                )}
                onClick={confirmationHandler}
              >
                <span className={classNames(getBs()['ml-2'], getBs()['mr-2'])}>
                  تایید
                </span>
              </Button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ShareFile;
