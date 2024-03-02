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
  useRemovePublic,
  useOnClickOutside
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
  const [identity, setIdentity] = useState<string>('');
  // const [date, setDate] = useState(moment().format('YYYY/MM/DD'));
  // const [showPicker, setShowPicker] = useState(false);
  // const datePickerRef = useRef();
  // useOnClickOutside(datePickerRef, () => setShowPicker(false));

  const [isAccessPublic, setIsAccessPublic] = useState<boolean>(
    isPublic ? true : false
  );
  // const { selectedItems, itemHash } = useContext(Context);
  const { data: dataShare, isLoading, refetch }: any = useDetailShare(hash);
  const addShare = useAddShare();
  const deleteShare = useDeleteShare();

  const addPublic = useAddPublic();
  const removePublic = useRemovePublic();

  const accessHandler = () => {
    setIsAccessPublic((prevAccess) => !prevAccess);
  };
  const identityHandler = (event) => {
    const { value } = event.target;
    setIdentity(value);
  };

  const addShareHandller = () => {
    const params = { expiration: '2026/04/01', level: 'VIEW' };
    addShare.mutateAsync({ hash, identity, params }).then((res) => {
      const { hasError } = res;
      if (!hasError) refetch();
    });
  };

  const deleteShareHandler = (identity) => {
    deleteShare.mutateAsync({ hash, identity }).then((res) => {
      const { hasError } = res;
      if (!hasError) refetch();
    });
  };
  const copyHandler = () => {
    const isSuccess = copy('test');
    if (isSuccess) toast.success('لینک با موفقیت کپی شد.');
  };

  const confirmationHandler = () => {
    const { result } = dataShare;
    let hashShare: string = '';

    if (result && Array.isArray(result) && Array.isArray(result[0])) {
      const tmp = result[0][0] as any;
      hashShare = tmp?.hash;
    }

    if (isPublic == isAccessPublic) {
      // access configuraiotn not changed
      toggle();
    } else {
      if (!isAccessPublic) {
        removePublic.mutateAsync({ hash: hashShare }).then((res) => {
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

  // const handleSelectDate = (value) => {
  //   console.log(111, moment(value).format('jYYYY/jMM/jDD'));

  //   return () => setDate(value);
  // };

  return (
    <Modal
      cssModule={getBs()}
      isOpen={isOpen}
      toggle={toggle}
      size='lg'
      className={styles['sharefile-wrapper']}
      onClick={(event) => {
        event.stopPropagation();
      }}
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
                value={identity}
                onChange={identityHandler}
              />
              <div>
                <Input
                  cssModule={getBs()}
                  placeholder='تاریخ انقضا اشتراک گذاری'
                />
              </div>
              <Button
                cssModule={getBs()}
                tag={'a'}
                className={classNames(styles['sharefile-wrapper__button'])}
                onClick={addShareHandller}
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
              <>
                {dataShare?.result[0]?.length > 0 ? (
                  <div
                    className={classNames(
                      getBs()['border'],
                      getBs()['rounded']
                    )}
                  >
                    <ListGroup
                      cssModule={getBs()}
                      className={classNames(
                        getBs()['pr-0'],
                        styles['list-wrapper']
                      )}
                    >
                      {dataShare?.result[0]?.map((item, index) => (
                        <ListGroupItem
                          cssModule={getBs()}
                          className={classNames(
                            getBs()['border-left-0'],
                            getBs()['border-right-0']
                          )}
                        >
                          <ListItem
                            name={item?.person?.username}
                            img={item?.person?.avatar}
                            date={item?.expiration}
                            hash={item?.hash}
                            deleteShareHandler={deleteShareHandler}
                          />
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </div>
                ) : (
                  ''
                )}
              </>
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
